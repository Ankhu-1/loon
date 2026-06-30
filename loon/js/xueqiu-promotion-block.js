const body = $response.body || "";

function doneJson(value) {
  $done({ body: JSON.stringify(value) });
}

function neutralizeEntry(data, key, replacement) {
  if (!data || typeof data !== "object" || !data[key]) return;

  if (data[key] && typeof data[key] === "object" && !Array.isArray(data[key])) {
    data[key].content = replacement;
  } else {
    data[key] = {
      content: replacement,
      timestamp: "0",
      update_type: 1,
    };
  }
}

try {
  const json = JSON.parse(body);
  json.data = json.data && typeof json.data === "object" ? json.data : {};

  neutralizeEntry(json.data, "paper_account_ad", {
    items: [],
    start_time: "",
    end_time: "",
    interval_day: 0,
    update_time: "",
    name: "",
  });

  neutralizeEntry(json.data, "trade_open_account_promotion_url", {});
  neutralizeEntry(json.data, "community_ad_download_msg", { ad_download_list: [] });
  neutralizeEntry(json.data, "homepage_big_pic_advertise", { showBigPic: 0 });
  neutralizeEntry(json.data, "stock_page_etf_ad", { data: [] });

  doneJson(json);
} catch (_) {
  $done({});
}
