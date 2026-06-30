const url = $request.url || "";
const body = $response.body || "";

const dropKeyPattern =
  /(^|[_-])(ad|ads|banner|popup|pop|float|bubble|coupon|vip|task|activity|promote|promotion|marketing|redpacket|benefit|alimama|dsp|material)([_-]|$)|advert|splash|poplayer|main_page_promote|scene_recommend/i;
const dropTextPattern =
  /(ad|ads|advert|splash|alimama|dsp|promotion|promote|marketing|popup|poplayer|float|bubble|coupon|vip|task|redpacket|benefit|\u5e7f\u544a|\u5f00\u5c4f|\u63a8\u5e7f|\u8425\u9500|\u5f39\u7a97|\u6d6e\u5c42|\u4f1a\u5458|\u4f18\u60e0\u5238|\u7ea2\u5305|\u4efb\u52a1|\u6d3b\u52a8|\u963f\u91cc\u5988\u5988)/i;

function doneJson(value) {
  $done({ body: JSON.stringify(value) });
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function normalizeKey(key) {
  return String(key || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function textOf(value) {
  try {
    return JSON.stringify(value).slice(0, 3000);
  } catch (_) {
    return "";
  }
}

function shouldDropKey(key, value) {
  const normalized = normalizeKey(key);
  if (dropKeyPattern.test(normalized)) return true;
  if (!dropTextPattern.test(normalized)) return false;
  return dropTextPattern.test(textOf(value));
}

function shouldDropItem(item) {
  if (!item || typeof item !== "object") return false;
  const text = textOf(item);
  if (!dropTextPattern.test(text)) return false;
  return Object.keys(item).some((key) => dropKeyPattern.test(normalizeKey(key)));
}

function clean(value, parentKey) {
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      if (shouldDropItem(item)) continue;
      const cleaned = clean(item, parentKey);
      if (!shouldDropItem(cleaned)) out.push(cleaned);
    }
    return out;
  }

  if (!value || typeof value !== "object") return value;

  const out = {};
  for (const key of Object.keys(value)) {
    if (shouldDropKey(key, value[key])) continue;
    const cleaned = clean(value[key], key);
    if (shouldDropKey(key, cleaned)) continue;
    out[key] = cleaned;
  }

  if (parentKey && shouldDropKey(parentKey, out)) return {};
  return out;
}

function emptyLike(json) {
  if (!json || typeof json !== "object") {
    return { code: 1, data: {} };
  }

  const out = {};
  if ("code" in json) out.code = json.code;
  if ("status" in json) out.status = json.status;
  if ("info" in json) out.info = json.info;
  if ("message" in json) out.message = json.message;
  if ("msg" in json) out.msg = json.msg;
  out.data = {};
  return out;
}

function clearCommonLists(json) {
  return clean(json, "");
}

const json = parseJson(body);
if (!json) {
  $done({});
} else if (/\/ws\/shield\/dsp\/app\/startup\/init/.test(url)) {
  const datas =
    json &&
    json.data &&
    json.data.app_conf_init &&
    json.data.app_conf_init.datas;

  if (datas && typeof datas === "object") {
    datas.splash_screen_source = "0";
    if (Array.isArray(datas.flashpic)) datas.flashpic = [];
    if (Array.isArray(datas.splash_screen)) datas.splash_screen = [];
    if (Array.isArray(datas.splashScreen)) datas.splashScreen = [];
    delete datas.ad;
    delete datas.ads;
    delete datas.advertise;
    delete datas.advertisement;
  }

  doneJson(json);
} else if (/\/ws\/promote\/main-page\/assets/.test(url)) {
  doneJson(emptyLike(json));
} else if (/\/ws\/faas\/amap-navigation\/task-platform\/get-tasks/.test(url)) {
  doneJson(emptyLike(json));
} else if (/\/ws\/(?:ccoupon\/amap\/preload|vip\/jointly-channel)/.test(url)) {
  doneJson(emptyLike(json));
} else if (/\/ws\/(?:message\/notice\/list|msgbox\/pull_mp)/.test(url)) {
  doneJson(emptyLike(json));
} else {
  doneJson(clearCommonLists(json));
}
