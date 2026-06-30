const body = $response.body || "";

try {
  const json = JSON.parse(body);
  json.server_time = json.server_time || Math.floor(Date.now() / 1000);
  json.backup_data = "{}";
  json.invalid_module_list = [];
  json.rm_id_list = [];
  json.rm_close_list = [];
  json.list = [];
  $done({ body: JSON.stringify(json) });
} catch (_) {
  $done({});
}
