const url = $request.url || "";
let body = $response.body || "";

function finish(value) {
  $done({ body: JSON.stringify(value) });
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

const json = safeJson(body);

if (!json) {
  $done({});
} else if (/app\.bilibili\.com\/x\/v2\/splash\/brand\/list/.test(url)) {
  json.code = typeof json.code === "number" ? json.code : 0;
  json.message = json.message || "OK";
  json.ttl = typeof json.ttl === "number" ? json.ttl : 1;
  json.data = json.data && typeof json.data === "object" ? json.data : {};
  json.data.pull_interval = 86400;
  json.data.forcibly = false;
  json.data.rule = "";
  json.data.list = [];
  finish(json);
} else if (/m5\.amap\.com\/ws\/shield\/dsp\/app\/startup\/init/.test(url)) {
  const datas =
    json &&
    json.data &&
    json.data.app_conf_init &&
    json.data.app_conf_init.datas;

  if (datas && typeof datas === "object") {
    datas.splash_screen_source = "0";
    if (Array.isArray(datas.flashpic)) datas.flashpic = [];
  }

  finish(json);
} else if (/api\.pinduoduo\.com\/api\/aquarius\/hungary\/global\/app_popup/.test(url)) {
  json.server_time = json.server_time || Math.floor(Date.now() / 1000);
  json.backup_data = "{}";
  json.invalid_module_list = [];
  json.rm_id_list = [];
  json.rm_close_list = [];
  json.list = [];
  finish(json);
} else {
  $done({});
}
