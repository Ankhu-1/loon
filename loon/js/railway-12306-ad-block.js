const headers = $request.headers || {};

function headerValue(name) {
  const target = name.toLowerCase();
  for (const key in headers) {
    if (key.toLowerCase() === target) return String(headers[key] || "");
  }
  return "";
}

const operationType = headerValue("operation-type");

if (/^com\.cars\.otsmobile\.newHomePage(?:\.initData|BussData)$/.test(operationType)) {
  $done({
    status: "HTTP/1.1 404 Not Found",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: "",
  });
} else {
  $done({});
}
