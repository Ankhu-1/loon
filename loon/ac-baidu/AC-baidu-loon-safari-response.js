// AC百度搜索优化：适用于 Loon + Safari 的轻量注入脚本。
const AC_LOON_TARGET_RE = /^https?:\/\/((ipv6|www1?|m|xueshu)\.baidu\.com|www\.so\.com|([^/]+\.)?bing\.com|encrypted\.google\.[^/]+|([^/]+\.)?google[^/]*|([^/]+\.)?duckduckgo\.com|([^/]+\.)?dogedoge\.com|([^/]+\.)?90dao\.com|([^/]+\.)?tujidu\.com)\//i;
const AC_LOON_EXCLUDE_RE = /^https?:\/\/(([^/]+\.)?zhidao\.baidu\.com\/|www\.baidu\.com\/img\/|lens\.google\.com\/|([^/]+\.)?google[^/]*\/sorry)/i;
const AC_PAGE_SCRIPT_TEMPLATE = "<script data-ac-baidu-loon-lite>\n(() => {\n  \"use strict\";\n  if (window.__AC_BAIDU_LOON_LITE__) return;\n  window.__AC_BAIDU_LOON_LITE__ = true;\n  const options = __AC_LOON_OPTIONS__;\n  const isOn = (value, fallback) => value === \"on\" ? true : value === \"off\" ? false : fallback;\n  const layout = options.layout || \"two\";\n\n  function addStyle() {\n    const css = [];\n    css.push(\"html body.ac-loon-layout-left #content_left,html body.ac-loon-layout-left #rso,html body.ac-loon-layout-left #b_results{max-width:900px!important;margin-left:0!important;margin-right:auto!important;}\");\n    css.push(\"html body.ac-loon-layout-center #content_left,html body.ac-loon-layout-center #rso,html body.ac-loon-layout-center #b_results{max-width:900px!important;margin-left:auto!important;margin-right:auto!important;}\");\n    css.push(\"html body.ac-loon-layout-two #content_left,html body.ac-loon-layout-two #rso,html body.ac-loon-layout-two #b_results,html body.ac-loon-layout-three #content_left,html body.ac-loon-layout-three #rso,html body.ac-loon-layout-three #b_results,html body.ac-loon-layout-four #content_left,html body.ac-loon-layout-four #rso,html body.ac-loon-layout-four #b_results{display:grid!important;gap:12px!important;align-items:start!important;width:min(1480px,calc(100vw - 16px))!important;max-width:none!important;margin-left:auto!important;margin-right:auto!important;}\");\n    css.push(\"html body.ac-loon-layout-two #content_left,html body.ac-loon-layout-two #rso,html body.ac-loon-layout-two #b_results{grid-template-columns:repeat(2,minmax(0,1fr))!important;}\");\n    css.push(\"html body.ac-loon-layout-three #content_left,html body.ac-loon-layout-three #rso,html body.ac-loon-layout-three #b_results{grid-template-columns:repeat(3,minmax(0,1fr))!important;}\");\n    css.push(\"html body.ac-loon-layout-four #content_left,html body.ac-loon-layout-four #rso,html body.ac-loon-layout-four #b_results{grid-template-columns:repeat(4,minmax(0,1fr))!important;}\");\n    css.push(\"html body[class*='ac-loon-layout-'] #content_left>.c-container,html body[class*='ac-loon-layout-'] #rso>.MjjYud,html body[class*='ac-loon-layout-'] #rso>.g,html body[class*='ac-loon-layout-'] #rso>.Ww4FFb,html body[class*='ac-loon-layout-'] #b_results>li{box-sizing:border-box!important;width:auto!important;max-width:100%!important;min-width:0!important;margin:0 0 12px 0!important;}\");\n    css.push(\"html body.ac-loon-layout-off #content_left,html body.ac-loon-layout-off #rso,html body.ac-loon-layout-off #b_results{display:revert!important;}\");\n    if (isOn(options.ads, true)) {\n      css.push(\"#bottomads,#tads,#tadsb,#taw,#rhs_block .ads-ad,#center_col .ads-ad,#content_right [data-tuiguang],#content_right .ec-tuiguang,#content_right .ec_tuiguang_pplink,#content_left [data-tuiguang],#content_left .ec-tuiguang,#content_left .ec_tuiguang_pplink,#content_left .result-op[srcid='3001'],#content_left .c-container[tpl*='adv'],#content_left .ec_wise_ad,#content_left .ec_ad_results,#so_kw-ad,#m-spread-left,#m-spread-bottom,#b_results .b_ad,#b_results li.b_ad,#b_results .ad_fls,div[aria-label='Ads'],div[aria-label='\u5e7f\u544a'],div[data-text-ad]{display:none!important;visibility:hidden!important;max-height:0!important;overflow:hidden!important;}\");\n      css.push(\"#b_results>li:has(.ad_fls),#rso>div:has(div[aria-label='Ads']),#rso>div:has(div[data-text-ad]){display:none!important;}\");\n    }\n    const style = document.createElement(\"style\");\n    style.id = \"ac-baidu-loon-lite-style\";\n    style.textContent = css.join(\"\\n\");\n    (document.head || document.documentElement).appendChild(style);\n  }\n\n  function hostNameFromUrl(url) {\n    try {\n      return new URL(url, location.href).hostname.replace(/^www\\./, \"\");\n    } catch (error) {\n      return \"\";\n    }\n  }\n\n  function addFavicons() {\n    if (!isOn(options.favicon, true)) return;\n    const links = document.querySelectorAll(\"#content_left h3 a,#rso h3 a,#b_results h2 a,.result h3 a\");\n    links.forEach((link) => {\n      const title = link.closest(\"h3,h2\") || link;\n      if (!title || title.dataset.acLoonFavicon) return;\n      const host = hostNameFromUrl(link.href);\n      if (!host) return;\n      title.dataset.acLoonFavicon = \"1\";\n      const img = document.createElement(\"img\");\n      img.src = \"https://favicon.yandex.net/favicon/v2/\" + encodeURIComponent(host) + \"?size=32\";\n      img.width = 16;\n      img.height = 16;\n      img.loading = \"lazy\";\n      img.referrerPolicy = \"no-referrer\";\n      img.style.cssText = \"width:16px;height:16px;margin-right:5px;vertical-align:-2px;border-radius:2px;\";\n      title.insertBefore(img, title.firstChild);\n    });\n  }\n\n  function cleanRedirects() {\n    if (!isOn(options.redirect, true)) return;\n    document.querySelectorAll(\"a[href]\").forEach((link) => {\n      if (link.dataset.acLoonRedirect) return;\n      link.dataset.acLoonRedirect = \"1\";\n      let url;\n      try {\n        url = new URL(link.href, location.href);\n      } catch (error) {\n        return;\n      }\n      const maybeDirect = url.searchParams.get(\"url\") || url.searchParams.get(\"u\") || url.searchParams.get(\"target\") || url.searchParams.get(\"to\");\n      if (maybeDirect && /^https?:\\/\\//i.test(maybeDirect)) {\n        link.href = maybeDirect;\n      }\n      const mu = link.getAttribute(\"data-mdurl\") || link.getAttribute(\"data-url\") || link.getAttribute(\"mu\");\n      if (mu && /^https?:\\/\\//i.test(mu)) {\n        link.href = mu;\n      }\n    });\n  }\n\n  function removeAdsByText() {\n    if (!isOn(options.ads, true)) return;\n    const markerRe = /^(\u5e7f\u544a|\u63a8\u5e7f|\u8d5e\u52a9|Ad|Ads|Sponsored|\u30b9\u30dd\u30f3\u30b5\u30fc)$/i;\n    const containers = \"li,.c-container,.MjjYud,.Ww4FFb,.g,.b_algo,.result,.res-list\";\n    document.querySelectorAll(\"span,a,div\").forEach((node) => {\n      const text = (node.textContent || \"\").trim();\n      if (!text || text.length > 16 || !markerRe.test(text)) return;\n      const box = node.closest(containers);\n      if (box && !box.dataset.acLoonKeep) {\n        box.remove();\n      }\n    });\n  }\n\n  function applyLayoutClass() {\n    document.body.classList.remove(\"ac-loon-layout-left\", \"ac-loon-layout-center\", \"ac-loon-layout-two\", \"ac-loon-layout-three\", \"ac-loon-layout-four\", \"ac-loon-layout-off\");\n    document.body.classList.add(\"ac-loon-layout-\" + layout);\n  }\n\n  function showDebug() {\n    if (!isOn(options.debug, false)) return;\n    const badge = document.createElement(\"div\");\n    badge.textContent = \"AC 已注入：\" + location.hostname + \" / \" + layout;\n    badge.style.cssText = \"position:fixed;z-index:2147483647;left:8px;bottom:8px;background:#0b57d0;color:#fff;font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;padding:6px 8px;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.25);\";\n    document.documentElement.appendChild(badge);\n    setTimeout(() => badge.remove(), 8000);\n  }\n\n  let timer = 0;\n  function run() {\n    if (!document.body) return;\n    applyLayoutClass();\n    cleanRedirects();\n    removeAdsByText();\n    addFavicons();\n  }\n\n  addStyle();\n  showDebug();\n  const start = () => {\n    run();\n    const observer = new MutationObserver(() => {\n      clearTimeout(timer);\n      timer = setTimeout(run, 120);\n    });\n    observer.observe(document.documentElement, { childList: true, subtree: true });\n    setInterval(run, 1500);\n  };\n  if (document.readyState === \"loading\") {\n    document.addEventListener(\"DOMContentLoaded\", start, { once: true });\n  } else {\n    start();\n  }\n})();\n</script>";

function acCloneHeaders(headers) {
  const next = {};
  const blocked = /^(content-security-policy|content-security-policy-report-only|content-length|content-encoding|transfer-encoding|etag|x-frame-options)$/i;
  for (const key of Object.keys(headers || {})) {
    if (!blocked.test(key)) next[key] = headers[key];
  }
  next["Cache-Control"] = "no-store";
  return next;
}

function acReadSetting(key, fallback) {
  try {
    if (typeof $persistentStore === "undefined" || !$persistentStore.read) return fallback;
    const value = $persistentStore.read(key);
    return value == null || value === "" ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function acReadOptions() {
  return {
    layout: acReadSetting("ac_layout", "two"),
    ads: acReadSetting("ac_ads", "on"),
    redirect: acReadSetting("ac_redirect", "on"),
    favicon: acReadSetting("ac_favicon", "on"),
    autopage: acReadSetting("ac_autopage", "on"),
    counter: acReadSetting("ac_counter", "off"),
    right: acReadSetting("ac_right", "off"),
    debug: acReadSetting("ac_debug", "off")
  };
}

function acIsHtml(headers, body) {
  const contentType = Object.entries(headers || {}).find(([key]) => key.toLowerCase() === "content-type")?.[1] || "";
  return /text\/html|application\/xhtml\+xml/i.test(String(contentType)) ||
    /^\s*<!doctype html/i.test(body || "") ||
    /^\s*<html[\s>]/i.test(body || "");
}

function acPageScript(options) {
  return AC_PAGE_SCRIPT_TEMPLATE.replace("__AC_LOON_OPTIONS__", JSON.stringify(options).replace(/</g, "\\u003c"));
}

function acInjectHtml(html, options) {
  const script = acPageScript(options);
  if (/<head\b[^>]*>/i.test(html)) {
    return html.replace(/<head\b[^>]*>/i, (match) => match + script);
  }
  if (/<html\b[^>]*>/i.test(html)) {
    return html.replace(/<html\b[^>]*>/i, (match) => match + script);
  }
  return script + html;
}

try {
  const url = $request && $request.url || "";
  const body = $response && typeof $response.body === "string" ? $response.body : "";
  const headers = ($response && $response.headers) || {};
  const options = acReadOptions();
  if (!AC_LOON_TARGET_RE.test(url) || AC_LOON_EXCLUDE_RE.test(url) || !body || !acIsHtml(headers, body) || body.includes("data-ac-baidu-loon-lite")) {
    $done({});
  } else {
    if (options.debug === "on" && typeof $notification !== "undefined") {
      $notification.post("AC百度搜索优化", "已匹配", url);
    }
    $done({ status: $response.status, headers: acCloneHeaders(headers), body: acInjectHtml(body, options) });
  }
} catch (error) {
  console.log("[AC Loon Lite] injection failed: " + (error && error.message || error));
  $done({});
}
