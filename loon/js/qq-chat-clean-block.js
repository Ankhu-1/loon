const url = $request.url || "";
const body = $response.body || "";

function doneJson(value) {
  $done({ body: JSON.stringify(value) });
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function clearQzoneAds(json) {
  json.retcode = typeof json.retcode === "number" ? json.retcode : 0;
  json.message = "";
  json.error = json.error && typeof json.error === "object" ? json.error : {};
  json.error.code = 0;
  json.error.message = "";

  json.data = json.data && typeof json.data === "object" ? json.data : {};
  json.data.code = 0;
  json.data.errmsg = "";
  json.data.extInfo = "";
  json.data.mapPosTran = {};
  json.data.redBuziCallbackErrPaths = [];
  json.data.mapAds = json.data.mapAds && typeof json.data.mapAds === "object" ? json.data.mapAds : {};

  Object.keys(json.data.mapAds).forEach((pos) => {
    const adSlot = json.data.mapAds[pos] && typeof json.data.mapAds[pos] === "object" ? json.data.mapAds[pos] : {};
    adSlot.lst = [];
    adSlot.nextQueryTs = 0;
    adSlot.extInfo = "";
    adSlot.ctlInfo = "";
    json.data.mapAds[pos] = adSlot;
  });

  return json;
}

function clearVisitorDecoration(json) {
  json.ret = typeof json.ret === "number" ? json.ret : 0;
  json.msg = "";
  json.data = {
    iCode: 0,
    mapBatchUserItems: {},
    strErrMsg: "",
  };
  return json;
}

const json = safeJson(body);

if (!json) {
  $done({});
} else if (/h5\.qzone\.qq\.com\/http2rpc\/gotrpc\/TianShu\.Access\/GetAds\?/.test(url)) {
  doneJson(clearQzoneAds(json));
} else if (/h5\.qzone\.qq\.com\/webapp\/json\/qzoneVisitorMaterial\/getVisitorDecoration\?/.test(url)) {
  doneJson(clearVisitorDecoration(json));
} else {
  $done({});
}
