const url = $request.url || "";
let body = $response.body || "";

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

function blankAdValues(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;

  Object.keys(value).forEach((key) => {
    if (/^ad_/i.test(key) || /_ad_/i.test(key) || /ad_unit/i.test(key)) {
      value[key] = "";
    }
  });
}

function scrubScreenAds(value) {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach(scrubScreenAds);
    return;
  }

  Object.keys(value).forEach((key) => {
    const item = value[key];

    if (/^videos_vast/i.test(key)) {
      value[key] = "";
      return;
    }

    if (typeof item === "string" && /(?:pubads\.g\.doubleclick\.net\/gampad\/ads|gdfp_req=1|output=xml_vast)/i.test(item)) {
      value[key] = "";
      return;
    }

    scrubScreenAds(item);
  });
}

const json = safeJson(body);

if (!json) {
  $done({});
} else if (/endpoints\.investing\.com\/content-mobile\/v2\/banner\?/.test(url)) {
  doneJson([]);
} else if (/endpoints\.investing\.com\/mobile-settings\/v1\/ad-units-ids\?/.test(url)) {
  blankAdValues(json);
  doneJson(json);
} else if (/iappapi\.investing\.com\/get_screen\.php\?/.test(url)) {
  scrubScreenAds(json);
  doneJson(json);
} else if (/mv\.outbrain\.com\/Multivac\/api\/get\//.test(url)) {
  json.response = json.response && typeof json.response === "object" ? json.response : {};
  json.response.documents = json.response.documents && typeof json.response.documents === "object" ? json.response.documents : {};
  json.response.documents.total_count = 0;
  json.response.documents.count = 0;
  json.response.documents.doc = [];
  json.response.viewability_actions = {};
  doneJson(json);
} else {
  $done({});
}
