const request = typeof $request === "undefined" ? { headers: {}, url: "", body: "" } : $request;
const headers = request.headers || {};
const url = request.url || "";

function headerValue(name) {
  const target = name.toLowerCase();
  for (const key in headers) {
    if (key.toLowerCase() === target) return String(headers[key] || "");
  }
  return "";
}

function parseRequestBody() {
  try {
    return JSON.parse(request.body || "{}");
  } catch (_) {
    return {};
  }
}

function finishRequestWithJson(body) {
  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    },
  });
}

if (/^https?:\/\/ad\.12306\.cn\/ad\/ser\/getAdList(?:\?|$)/i.test(url)) {
  const body = parseRequestBody();
  const placementNo = String(body.placementNo || "");
  const emptyAd = { code: "00", materialsList: [] };

  if (placementNo === "0007") {
    finishRequestWithJson(Object.assign({}, emptyAd, { advertParam: { skipTime: 0 } }));
  } else if (placementNo === "G0054") {
    finishRequestWithJson(emptyAd);
  } else {
    finishRequestWithJson(Object.assign({}, emptyAd, { message: "no ads" }));
  }
} else if (/^com\.cars\.otsmobile\.newHomePage(?:\.initData|BussData|Refresh)$/.test(headerValue("operation-type"))) {
  $done({
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: "",
  });
} else {
  $done({});
}
