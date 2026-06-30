const body = $response.body || "";

try {
  const json = JSON.parse(body);
  json.code = typeof json.code === "number" ? json.code : 0;
  json.message = json.message || "OK";
  json.ttl = typeof json.ttl === "number" ? json.ttl : 1;
  json.data = json.data && typeof json.data === "object" ? json.data : {};
  json.data.pull_interval = 86400;
  json.data.forcibly = false;
  json.data.rule = "";
  json.data.list = [];
  $done({ body: JSON.stringify(json) });
} catch (_) {
  $done({});
}
