// Discord 消息翻译：通过 Loon 响应脚本给消息内容追加译文。
const DT_TARGET_MAP = {
  "简体中文": "zh-CN",
  "繁体中文": "zh-TW",
  "英文": "en",
  "日文": "ja",
  "韩文": "ko",
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  en: "en",
  ja: "ja",
  ko: "ko"
};

const DT_TARGET_NAME = {
  "zh-CN": "简体中文",
  "zh-TW": "繁体中文",
  en: "English",
  ja: "日本語",
  ko: "한국어"
};

function dtArguments() {
  try {
    if (typeof $argument === "undefined" || $argument == null) return {};
    if (typeof $argument === "object") return $argument;
    if (typeof $argument === "string" && $argument.trim()) return JSON.parse($argument);
  } catch (error) {}
  return {};
}

const DT_ARGS = dtArguments();

function dtRead(key, fallback) {
  if (Object.prototype.hasOwnProperty.call(DT_ARGS, key)) {
    const value = DT_ARGS[key];
    return value == null || value === "" ? fallback : value;
  }
  try {
    if (typeof $persistentStore === "undefined" || !$persistentStore.read) return fallback;
    const value = $persistentStore.read(key);
    return value == null || value === "" ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function dtBool(value, fallback) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const text = String(value == null ? "" : value).trim().toLowerCase();
  if (["true", "on", "1", "yes", "y", "开启", "开", "是"].includes(text)) return true;
  if (["false", "off", "0", "no", "n", "关闭", "关", "否"].includes(text)) return false;
  return fallback;
}

function dtNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value == null ? "" : value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function dtTarget(value) {
  const key = String(value == null ? "" : value).trim();
  return DT_TARGET_MAP[key] || DT_TARGET_MAP[key.toLowerCase()] || "zh-CN";
}

function dtProvider(value) {
  const text = String(value == null ? "" : value).trim().toLowerCase();
  if (text.includes("google")) return "google";
  return "deepseek";
}

function dtOptions() {
  const provider = dtProvider(dtRead("dt_provider", "DeepSeek API"));
  const model = String(dtRead("dt_deepseek_model", "deepseek-v4-flash") || "deepseek-v4-flash").trim();
  return {
    enabled: dtBool(dtRead("dt_enable", true), true),
    provider,
    deepseekApiKey: String(dtRead("dt_deepseek_api_key", "") || "").trim(),
    deepseekModel: model,
    target: dtTarget(dtRead("dt_target", "简体中文")),
    append: String(dtRead("dt_mode", "追加译文")) !== "替换原文",
    maxCount: dtNumber(dtRead("dt_max_count", "30"), 30, 1, 80),
    skipSameLang: dtBool(dtRead("dt_skip_same_lang", true), true),
    translateEmbeds: dtBool(dtRead("dt_translate_embeds", true), true),
    debug: dtBool(dtRead("dt_debug", false), false)
  };
}

function dtCloneHeaders(headers) {
  const next = {};
  const blocked = /^(content-length|content-encoding|transfer-encoding|etag)$/i;
  for (const key of Object.keys(headers || {})) {
    if (!blocked.test(key)) next[key] = headers[key];
  }
  next["Cache-Control"] = "no-store";
  return next;
}

function dtHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) + hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function dtCacheKey(namespace, text) {
  return "discord_translate_" + namespace.replace(/[^\w.-]/g, "_") + "_" + dtHash(text);
}

function dtCacheRead(namespace, text) {
  try {
    if (typeof $persistentStore === "undefined" || !$persistentStore.read) return "";
    return $persistentStore.read(dtCacheKey(namespace, text)) || "";
  } catch (error) {
    return "";
  }
}

function dtCacheWrite(namespace, text, translated) {
  try {
    if (typeof $persistentStore !== "undefined" && $persistentStore.write) {
      $persistentStore.write(translated, dtCacheKey(namespace, text));
    }
  } catch (error) {}
}

function dtPlainText(text) {
  return String(text || "")
    .replace(/<a?:\w+:\d+>/g, "")
    .replace(/<[@#&!]?\d+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .trim();
}

function dtLooksSameLanguage(text, target) {
  const clean = dtPlainText(text);
  if (!clean) return true;
  const cjk = (clean.match(/[\u4e00-\u9fff]/g) || []).length;
  const kana = (clean.match(/[\u3040-\u30ff]/g) || []).length;
  const hangul = (clean.match(/[\uac00-\ud7af]/g) || []).length;
  const letters = (clean.match(/[A-Za-z]/g) || []).length;
  const total = clean.replace(/\s/g, "").length || 1;
  if (target === "zh-CN" || target === "zh-TW") return cjk / total > 0.25;
  if (target === "ja") return (kana + cjk) / total > 0.35;
  if (target === "ko") return hangul / total > 0.25;
  if (target === "en") return letters / total > 0.65 && cjk + kana + hangul === 0;
  return false;
}

function dtShouldTranslate(text, options) {
  const raw = String(text || "").trim();
  const clean = dtPlainText(raw);
  if (!raw || !clean) return false;
  if (raw.includes("译文:") || raw.includes("Translation:")) return false;
  if (clean.length < 2) return false;
  if (/^[\d\s.,:;!?()[\]{}'"@#*_~|/\\+-]+$/.test(clean)) return false;
  if (options.skipSameLang && dtLooksSameLanguage(raw, options.target)) return false;
  return true;
}

function dtApplyText(original, translated, options) {
  if (!translated || translated.trim() === original.trim()) return original;
  if (!options.append) return translated;
  const label = options.target === "en" ? "Translation" : "译文";
  return original + "\n\n> " + label + ": " + translated;
}

function dtTranslateByGoogle(text, target) {
  const namespace = "google:" + target;
  const cached = dtCacheRead(namespace, text);
  if (cached) return Promise.resolve(cached);
  const clipped = String(text).slice(0, 1800);
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
    encodeURIComponent(target) + "&dt=t&q=" + encodeURIComponent(clipped);
  return new Promise((resolve) => {
    try {
      $httpClient.get({
        url,
        headers: {
          Accept: "application/json,text/plain,*/*",
          "User-Agent": "Mozilla/5.0"
        }
      }, (error, response, body) => {
        if (error || !body) {
          resolve("");
          return;
        }
        try {
          const json = JSON.parse(body);
          const translated = Array.isArray(json[0]) ? json[0].map((part) => part && part[0] || "").join("").trim() : "";
          if (translated) dtCacheWrite(namespace, text, translated);
          resolve(translated);
        } catch (parseError) {
          resolve("");
        }
      });
    } catch (error) {
      resolve("");
    }
  });
}

function dtTranslateByDeepSeek(text, options) {
  if (!options.deepseekApiKey) return Promise.resolve("");
  const namespace = "deepseek:" + options.deepseekModel + ":" + options.target;
  const cached = dtCacheRead(namespace, text);
  if (cached) return Promise.resolve(cached);
  const targetName = DT_TARGET_NAME[options.target] || options.target;
  const clipped = String(text).slice(0, 4000);
  const payload = {
    model: options.deepseekModel || "deepseek-v4-flash",
    messages: [
      {
        role: "system",
        content: [
          "You are a translation engine.",
          "Translate the user's Discord message into " + targetName + ".",
          "Preserve Markdown, URLs, emojis, mentions such as <@123>, channel references, and code blocks.",
          "Return only the translated text. Do not explain."
        ].join(" ")
      },
      { role: "user", content: clipped }
    ],
    stream: false,
    thinking: { type: "disabled" },
    temperature: 0.2
  };
  return new Promise((resolve) => {
    try {
      $httpClient.post({
        url: "https://api.deepseek.com/chat/completions",
        headers: {
          Authorization: "Bearer " + options.deepseekApiKey,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      }, (error, response, body) => {
        if (error || !body) {
          resolve("");
          return;
        }
        try {
          const json = JSON.parse(body);
          const translated = json && json.choices && json.choices[0] &&
            json.choices[0].message && String(json.choices[0].message.content || "").trim();
          if (translated) dtCacheWrite(namespace, text, translated);
          resolve(translated || "");
        } catch (parseError) {
          resolve("");
        }
      });
    } catch (error) {
      resolve("");
    }
  });
}

function dtTranslate(text, options) {
  if (options.provider === "google") return dtTranslateByGoogle(text, options.target);
  return dtTranslateByDeepSeek(text, options);
}

function dtIsMessage(value) {
  return value && typeof value === "object" &&
    typeof value.content === "string" &&
    (value.author || value.channel_id || value.id);
}

function dtCollectMessages(value, output, seen) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => dtCollectMessages(item, output, seen));
    return;
  }
  if (dtIsMessage(value) && !seen.has(value)) {
    seen.add(value);
    output.push(value);
  }
  const keys = ["messages", "message", "referenced_message", "message_snapshots", "results"];
  keys.forEach((key) => {
    if (value[key]) dtCollectMessages(value[key], output, seen);
  });
}

function dtCollectJobs(json, options) {
  const messages = [];
  dtCollectMessages(json, messages, new Set());
  const jobs = [];
  for (const message of messages) {
    if (jobs.length >= options.maxCount) break;
    if (dtShouldTranslate(message.content, options)) {
      jobs.push({ owner: message, key: "content", text: message.content });
    }
    if (!options.translateEmbeds || !Array.isArray(message.embeds)) continue;
    for (const embed of message.embeds) {
      if (jobs.length >= options.maxCount) break;
      if (embed && dtShouldTranslate(embed.title, options)) {
        jobs.push({ owner: embed, key: "title", text: embed.title });
      }
      if (jobs.length >= options.maxCount) break;
      if (embed && dtShouldTranslate(embed.description, options)) {
        jobs.push({ owner: embed, key: "description", text: embed.description });
      }
    }
  }
  return jobs;
}

function dtRunLimited(jobs, limit, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    while (index < jobs.length) {
      const current = jobs[index];
      index += 1;
      await worker(current);
    }
  });
  return Promise.all(runners);
}

function dtFinish(payload) {
  $done(payload);
}

try {
  const options = dtOptions();
  const body = $response && typeof $response.body === "string" ? $response.body : "";
  if (!options.enabled || !body) {
    dtFinish({});
  } else if (options.provider === "deepseek" && !options.deepseekApiKey) {
    if (options.debug && typeof $notification !== "undefined") {
      $notification.post("Discord消息翻译", "缺少 DeepSeek API Key", "请在插件设置里本地填写 dt_deepseek_api_key");
    }
    dtFinish({});
  } else {
    const json = JSON.parse(body);
    const jobs = dtCollectJobs(json, options);
    if (!jobs.length) {
      dtFinish({});
    } else {
      dtRunLimited(jobs, 3, async (job) => {
        const translated = await dtTranslate(job.text, options);
        if (translated) job.owner[job.key] = dtApplyText(job.text, translated, options);
      }).then(() => {
        if (options.debug && typeof $notification !== "undefined") {
          const providerName = options.provider === "deepseek" ? "DeepSeek" : "Google";
          $notification.post("Discord消息翻译", providerName + " 已处理 " + jobs.length + " 条内容", $request && $request.url || "");
        }
        dtFinish({
          status: $response.status,
          headers: dtCloneHeaders(($response && $response.headers) || {}),
          body: JSON.stringify(json)
        });
      }).catch((error) => {
        console.log("[Discord消息翻译] 翻译失败: " + (error && error.message || error));
        dtFinish({});
      });
    }
  }
} catch (error) {
  console.log("[Discord消息翻译] 处理失败: " + (error && error.message || error));
  dtFinish({});
}
