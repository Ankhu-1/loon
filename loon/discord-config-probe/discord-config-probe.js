// Discord 配置探测：只记录实验/设置接口中的关键词命中，不修改返回内容。
function dpArguments() {
  try {
    if (typeof $argument === "undefined" || $argument == null) return {};
    if (typeof $argument === "object") return $argument;
    if (typeof $argument === "string" && $argument.trim()) return JSON.parse($argument);
  } catch (error) {}
  return {};
}

const DP_ARGS = dpArguments();

function dpRead(key, fallback) {
  if (Object.prototype.hasOwnProperty.call(DP_ARGS, key)) {
    const value = DP_ARGS[key];
    return value == null || value === "" ? fallback : value;
  }
  return fallback;
}

function dpBool(value, fallback) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const text = String(value == null ? "" : value).trim().toLowerCase();
  if (["true", "on", "1", "yes", "y", "开启", "开", "是"].includes(text)) return true;
  if (["false", "off", "0", "no", "n", "关闭", "关", "否"].includes(text)) return false;
  return fallback;
}

function dpNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value == null ? "" : value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function dpOptions() {
  const keywords = String(dpRead("dp_keywords", "bubble,chat,message,layout,mobile,visual,refresh,wallpaper,experiment,tabs"))
    .split(/[,\n，]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return {
    enabled: dpBool(dpRead("dp_enable", true), true),
    keywords,
    notifyHits: dpBool(dpRead("dp_notify_hits", true), true),
    logAll: dpBool(dpRead("dp_log_all", false), false),
    maxHits: dpNumber(dpRead("dp_max_hits", "12"), 12, 1, 40)
  };
}

function dpEndpoint(url) {
  try {
    return new URL(url).pathname.replace(/^\/api\/v\d+\//, "");
  } catch (error) {
    return String(url || "");
  }
}

function dpIsProbablyBinary(body) {
  if (!body) return false;
  const sample = String(body).slice(0, 1200);
  let suspicious = 0;
  for (let i = 0; i < sample.length; i += 1) {
    const code = sample.charCodeAt(i);
    if ((code > 0 && code < 9) || (code > 13 && code < 32)) suspicious += 1;
  }
  return suspicious > 8;
}

function dpCompact(value) {
  return String(value == null ? "" : value)
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7e\u4e00-\u9fff，。！？：；、（）《》【】]/g, "")
    .trim();
}

function dpSafeJsonParse(body) {
  try {
    return JSON.parse(body);
  } catch (error) {
    return null;
  }
}

function dpMatches(text, keywords) {
  const lower = String(text || "").toLowerCase();
  return keywords.filter((keyword) => lower.includes(keyword));
}

function dpSummaryFromObject(value) {
  if (!value || typeof value !== "object") return "";
  const source = value.data && typeof value.data === "object" ? value.data : value;
  const fields = [];
  ["id", "name", "label", "hash", "kind", "type"].forEach((key) => {
    if (source[key] != null) fields.push(key + "=" + source[key]);
  });
  if (Array.isArray(source.config_keys)) fields.push("config_keys=" + source.config_keys.join("|"));
  if (Array.isArray(source.buckets)) fields.push("buckets=" + source.buckets.join("|"));
  if (Array.isArray(source.description)) fields.push("desc=" + source.description.join(" / "));
  return dpCompact(fields.join(" ; "));
}

function dpWalk(value, path, options, hits, seen) {
  if (hits.length >= options.maxHits) return;
  if (value == null) return;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = String(value);
    const matched = dpMatches(path + " " + text, options.keywords);
    if (matched.length) hits.push({ path, matched, text: dpCompact(text).slice(0, 240) });
    return;
  }
  if (typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);

  const summary = dpSummaryFromObject(value);
  const matched = dpMatches(path + " " + summary + " " + JSON.stringify(value).slice(0, 1200), options.keywords);
  if (matched.length && summary) {
    hits.push({ path, matched, text: summary.slice(0, 420) });
    if (hits.length >= options.maxHits) return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length && hits.length < options.maxHits; i += 1) {
      dpWalk(value[i], path + "[" + i + "]", options, hits, seen);
    }
    return;
  }
  const keys = Object.keys(value);
  for (const key of keys) {
    if (hits.length >= options.maxHits) return;
    dpWalk(value[key], path ? path + "." + key : key, options, hits, seen);
  }
}

function dpFindHits(body, options) {
  const json = dpSafeJsonParse(body);
  const hits = [];
  if (json) {
    dpWalk(json, "$", options, hits, new Set());
    return { kind: "json", hits };
  }
  const text = dpCompact(String(body || ""));
  const matched = dpMatches(text, options.keywords);
  if (matched.length) {
    hits.push({ path: "$text", matched, text: text.slice(0, 500) });
  }
  return { kind: dpIsProbablyBinary(body) ? "binary/proto" : "text", hits };
}

function dpLog(endpoint, kind, hits, options) {
  const title = "[Discord配置探测] " + endpoint + " kind=" + kind + " hits=" + hits.length;
  console.log(title);
  hits.forEach((hit, index) => {
    console.log("[Discord配置探测] #" + (index + 1) + " " + hit.path + " keys=" + hit.matched.join("|") + " :: " + hit.text);
  });
  if (options.notifyHits && hits.length && typeof $notification !== "undefined") {
    const body = hits.slice(0, 3).map((hit) => hit.matched.join("|") + ": " + hit.text.slice(0, 70)).join("\n");
    $notification.post("Discord配置探测", endpoint + " 命中 " + hits.length + " 条", body);
  }
}

try {
  const options = dpOptions();
  if (!options.enabled) {
    $done({});
  } else {
    const body = $response && typeof $response.body === "string" ? $response.body : "";
    const endpoint = dpEndpoint($request && $request.url || "");
    const result = dpFindHits(body, options);
    if (result.hits.length || options.logAll) {
      dpLog(endpoint, result.kind, result.hits, options);
    }
    $done({});
  }
} catch (error) {
  console.log("[Discord配置探测] 处理失败: " + (error && error.message || error));
  $done({});
}
