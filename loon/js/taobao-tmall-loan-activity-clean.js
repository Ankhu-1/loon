const url = $request.url || "";
const body = $response.body || "";

const strongKeyPattern =
  /(^|[_-])(ad|ads|ad_info|ad_list|ad_material|adverts?)([_-]|$)|advert|advertise|advertisement|splash|poplayer|popup|pop_up|floating|float|bubble|loan|credit|finance|borrow|huabei|jiebei|fenqi|installment|cashloan|marketing/i;
const softKeyPattern =
  /activity|campaign|promotion|promote|push|task|redpacket|coupon|benefit|benefits|guide|tips|notice|widget|material|scene/i;
const textPattern =
  /(loan|credit|finance|borrow|huabei|jiebei|fenqi|installment|cashloan|mybank|activity|campaign|promotion|promote|poplayer|popup|push|marketing|advert|redpacket|coupon|benefit|floating|bubble|\u8d37\u6b3e|\u501f\u94b1|\u82b1\u5457|\u501f\u5457|\u7f51\u5546\u8d37|\u5907\u7528\u91d1|\u4fe1\u7528\u8d37|\u5206\u671f|\u91d1\u878d|\u514d\u606f|\u6d3b\u52a8|\u4f1a\u573a|\u4fc3\u9500|\u63a8\u9001|\u5f39\u7a97|\u6d6e\u5c42|\u7ea2\u5305|\u7b7e\u5230|\u4efb\u52a1|\u7701\u94b1\u5361|\u6708\u5361)/i;
const financeTextPattern =
  /(loan|credit|finance|borrow|huabei|jiebei|fenqi|installment|cashloan|mybank|\u8d37\u6b3e|\u501f\u94b1|\u82b1\u5457|\u501f\u5457|\u7f51\u5546\u8d37|\u5907\u7528\u91d1|\u4fe1\u7528\u8d37|\u5206\u671f|\u91d1\u878d|\u514d\u606f|\u7701\u94b1\u5361|\u6708\u5361)/i;

function finishText(text) {
  $done({ body: text });
}

function finishJson(value, wrapper) {
  const payload = JSON.stringify(value);
  finishText(wrapper ? wrapper.prefix + payload + wrapper.suffix : payload);
}

function parsePayload(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return { value: JSON.parse(trimmed), wrapper: null };
  } catch (_) {}

  const match = trimmed.match(/^([\w$]+)\(([\s\S]*)\);?$/);
  if (!match) return null;

  try {
    return {
      value: JSON.parse(match[2]),
      wrapper: { prefix: match[1] + "(", suffix: trimmed.endsWith(";") ? ");" : ")" },
    };
  } catch (_) {
    return null;
  }
}

function briefText(value) {
  try {
    return JSON.stringify(value).slice(0, 5000);
  } catch (_) {
    return "";
  }
}

function isPromoText(value) {
  return textPattern.test(String(value || ""));
}

function normalizeKey(key) {
  return String(key || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function shouldDropKey(key, value) {
  const normalized = normalizeKey(key);
  if (strongKeyPattern.test(normalized)) return true;
  if (!softKeyPattern.test(normalized)) return false;
  return isPromoText(normalized) || isPromoText(briefText(value));
}

function shouldDropItem(value) {
  if (!value || typeof value !== "object") return isPromoText(value);
  const text = briefText(value);
  if (!isPromoText(text)) return false;
  if (financeTextPattern.test(text)) return true;

  if (Array.isArray(value)) return false;
  return Object.keys(value).some((key) => {
    const normalized = normalizeKey(key);
    return strongKeyPattern.test(normalized) || softKeyPattern.test(normalized);
  });
}

function clean(value, parentKey) {
  if (Array.isArray(value)) {
    const output = [];
    for (const item of value) {
      if (shouldDropItem(item)) continue;
      const cleaned = clean(item, parentKey);
      if (!shouldDropItem(cleaned)) output.push(cleaned);
    }
    return output;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const out = {};
  for (const key of Object.keys(value)) {
    if (shouldDropKey(key, value[key])) continue;
    const cleaned = clean(value[key], key);
    if (shouldDropKey(key, cleaned)) continue;
    out[key] = cleaned;
  }

  if (parentKey && shouldDropKey(parentKey, out)) {
    return Array.isArray(value) ? [] : {};
  }

  return out;
}

function neutralMtop(json) {
  const out = {};
  if (json && typeof json === "object") {
    if (json.api) out.api = json.api;
    if (json.v) out.v = json.v;
    out.ret = Array.isArray(json.ret) ? json.ret : ["SUCCESS::SUCCESS"];
  }
  out.data = {};
  return out;
}

const parsed = parsePayload(body);
if (!parsed) {
  $done({});
} else {
  let json = parsed.value;

  if (/mtop\.taobao\.multi\.advertisement\.get/i.test(url)) {
    json = neutralMtop(json);
  } else if (/poplayer\.template\.alibaba\.com/i.test(url)) {
    json = Array.isArray(json) ? [] : {};
  } else {
    json = clean(json, "");
  }

  finishJson(json, parsed.wrapper);
}
