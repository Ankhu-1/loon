const url = $request.url || "";

function doneJson(value) {
  $done({ body: JSON.stringify(value) });
}

if (/discord\.com\/api\/v9\/promotions\?/.test(url)) {
  doneJson([]);
} else if (/discord\.com\/api\/v9\/users\/@me\/collectibles-marketing\?/.test(url)) {
  doneJson({ marketings: {} });
} else if (/discord\.com\/api\/v9\/quests\/decision\?/.test(url)) {
  doneJson({
    request_id: "",
    quest: null,
    creative: null,
    ad_identifiers: null,
    ad_context: null,
    response_ttl_seconds: 86400,
    metadata_sealed: null,
    traffic_metadata_raw: null,
    traffic_metadata_sealed: null,
  });
} else if (/discord\.com\/api\/v9\/quests\/get-decisions\?/.test(url)) {
  doneJson({
    request_id: "",
    decisions: [],
  });
} else {
  $done({});
}
