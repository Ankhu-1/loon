const url = $request.url || "";
let body = $response.body || "";

function done(value) {
  $done({ body: JSON.stringify(value) });
}

try {
  const json = JSON.parse(body);

  if (/edith\.xiaohongshu\.com\/api\/sns\/v2\/system_service\/splash_config/.test(url)) {
    json.code = typeof json.code === "number" ? json.code : 0;
    json.success = json.success !== false;
    json.data = json.data && typeof json.data === "object" ? json.data : {};
    json.data.bidding_ads = [];
    json.data.ads_groups = [];
    json.data.per_day_max_show = 0;
    json.data.min_interval = 86400000;
    json.data.hot_interval = 86400000;
    done(json);
  } else if (/edith\.xiaohongshu\.com\/api\/sns\/v2\/system_service\/splash_(?:online_decision|async_optimization)/.test(url)) {
    json.code = typeof json.code === "number" ? json.code : 0;
    json.success = json.success !== false;
    json.data = json.data && typeof json.data === "object" ? json.data : {};
    json.data.ads_id = "-1";
    json.data.track_id = "";
    json.data.track_url = "";
    done(json);
  } else {
    $done({});
  }
} catch (_) {
  $done({});
}
