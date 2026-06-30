const body = $response.body || "";

try {
  const json = JSON.parse(body);
  const datas =
    json &&
    json.data &&
    json.data.app_conf_init &&
    json.data.app_conf_init.datas;

  if (datas && typeof datas === "object") {
    datas.splash_screen_source = "0";
    if (Array.isArray(datas.flashpic)) datas.flashpic = [];
  }

  $done({ body: JSON.stringify(json) });
} catch (_) {
  $done({});
}
