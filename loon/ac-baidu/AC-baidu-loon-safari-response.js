// AC百度搜索优化：适用于 Loon + Safari 的轻量注入脚本。
const AC_LOON_TARGET_RE = /^https?:\/\/((ipv6|www1?|m|xueshu)\.baidu\.com|www\.so\.com|([^/]+\.)?bing\.com|encrypted\.google\.[^/]+|([^/]+\.)?google[^/]*|([^/]+\.)?duckduckgo\.com|([^/]+\.)?dogedoge\.com|([^/]+\.)?90dao\.com|([^/]+\.)?tujidu\.com)\//i;
const AC_LOON_EXCLUDE_RE = /^https?:\/\/(([^/]+\.)?zhidao\.baidu\.com\/|www\.baidu\.com\/img\/|lens\.google\.com\/|([^/]+\.)?google[^/]*\/sorry)/i;
const AC_LAYOUT_MAP = {
  "双列": "two",
  "单列居中": "center",
  "居中": "center",
  "单列靠左": "left",
  "靠左": "left",
  "三列": "three",
  "四列": "four",
  "关闭布局": "off",
  "关闭": "off",
  two: "two",
  center: "center",
  left: "left",
  three: "three",
  four: "four",
  off: "off"
};

const AC_PAGE_SCRIPT_TEMPLATE = `<script data-ac-baidu-loon-lite>
(() => {
  "use strict";
  if (window.__AC_BAIDU_LOON_LITE__) return;
  window.__AC_BAIDU_LOON_LITE__ = true;
  const options = __AC_LOON_OPTIONS__;
  const layout = options.layout || "two";
  const blockedKey = "ac-loon-blocked-hosts";

  const on = (value, fallback = false) => {
    if (value === true || value === "true" || value === "on" || value === "1") return true;
    if (value === false || value === "false" || value === "off" || value === "0") return false;
    return fallback;
  };

  function addStyle() {
    const css = [];
    css.push(":root{--ac-loon-blue:#0b57d0;}");
    css.push(".ac-loon-count{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:18px!important;height:18px!important;margin-right:6px!important;border-radius:999px!important;background:var(--ac-loon-blue)!important;color:#fff!important;font:12px/1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif!important;vertical-align:1px!important;}");
    css.push(".ac-loon-block-btn{float:right!important;margin:0 0 6px 8px!important;border:1px solid rgba(11,87,208,.35)!important;border-radius:5px!important;background:#fff!important;color:var(--ac-loon-blue)!important;font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif!important;padding:2px 6px!important;}");
    css.push(".ac-loon-block-btn:active{background:#e8f0fe!important;}");
    css.push(".ac-loon-blocked-result{opacity:.45!important;filter:grayscale(.4)!important;}");
    css.push(".ac-loon-autopage-tip{text-align:center!important;margin:14px auto!important;color:#666!important;font:13px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif!important;}");
    css.push("html body.ac-loon-layout-left #content_left,html body.ac-loon-layout-left #rso,html body.ac-loon-layout-left #b_results{max-width:900px!important;margin-left:0!important;margin-right:auto!important;}");
    css.push("html body.ac-loon-layout-center #content_left,html body.ac-loon-layout-center #rso,html body.ac-loon-layout-center #b_results{max-width:900px!important;margin-left:auto!important;margin-right:auto!important;}");
    css.push("html body.ac-loon-layout-two #content_left,html body.ac-loon-layout-two #rso,html body.ac-loon-layout-two #b_results,html body.ac-loon-layout-three #content_left,html body.ac-loon-layout-three #rso,html body.ac-loon-layout-three #b_results,html body.ac-loon-layout-four #content_left,html body.ac-loon-layout-four #rso,html body.ac-loon-layout-four #b_results{display:grid!important;gap:12px!important;align-items:start!important;width:min(1480px,calc(100vw - 16px))!important;max-width:none!important;margin-left:auto!important;margin-right:auto!important;}");
    css.push("html body.ac-loon-layout-two #content_left,html body.ac-loon-layout-two #rso,html body.ac-loon-layout-two #b_results{grid-template-columns:repeat(2,minmax(0,1fr))!important;}");
    css.push("html body.ac-loon-layout-three #content_left,html body.ac-loon-layout-three #rso,html body.ac-loon-layout-three #b_results{grid-template-columns:repeat(3,minmax(0,1fr))!important;}");
    css.push("html body.ac-loon-layout-four #content_left,html body.ac-loon-layout-four #rso,html body.ac-loon-layout-four #b_results{grid-template-columns:repeat(4,minmax(0,1fr))!important;}");
    css.push("html body[class*='ac-loon-layout-'] #content_left>.c-container,html body[class*='ac-loon-layout-'] #rso>.MjjYud,html body[class*='ac-loon-layout-'] #rso>.g,html body[class*='ac-loon-layout-'] #rso>.Ww4FFb,html body[class*='ac-loon-layout-'] #b_results>li{box-sizing:border-box!important;width:auto!important;max-width:100%!important;min-width:0!important;margin:0 0 12px 0!important;}");
    css.push("html body.ac-loon-layout-off #content_left,html body.ac-loon-layout-off #rso,html body.ac-loon-layout-off #b_results{display:revert!important;}");
    if (!on(options.right, true)) {
      css.push("#content_right,#rhs,#rhs_block,#rhscol,#b_context,#b_dynRail,#knowledge-finance-wholepage__entity-summary,#kp-wp-tab-overview{display:none!important;}");
    }
    if (on(options.underline, true)) {
      css.push("a,a:visited{text-decoration:none!important;}a:hover{text-decoration:underline!important;}");
    }
    if (on(options.ads, true)) {
      css.push("#bottomads,#tads,#tadsb,#taw,#rhs_block .ads-ad,#center_col .ads-ad,#content_right [data-tuiguang],#content_right .ec-tuiguang,#content_right .ec_tuiguang_pplink,#content_left [data-tuiguang],#content_left .ec-tuiguang,#content_left .ec_tuiguang_pplink,#content_left .result-op[srcid='3001'],#content_left .c-container[tpl*='adv'],#content_left .ec_wise_ad,#content_left .ec_ad_results,#so_kw-ad,#m-spread-left,#m-spread-bottom,#b_results .b_ad,#b_results li.b_ad,#b_results .ad_fls,div[aria-label='Ads'],div[aria-label='广告'],div[data-text-ad]{display:none!important;visibility:hidden!important;max-height:0!important;overflow:hidden!important;}");
      css.push("#b_results>li:has(.ad_fls),#rso>div:has(div[aria-label='Ads']),#rso>div:has(div[data-text-ad]){display:none!important;}");
    }
    if (on(options.dark, false)) {
      css.push("html,body{background:#101214!important;color:#e8eaed!important;}#container,#main,#wrapper,#center_col,#content_left,#rso,#b_results{background:transparent!important;color:#e8eaed!important;}#content_left>.c-container,#rso>.MjjYud,#rso>.g,#rso>.Ww4FFb,#b_results>li{background:#1b1f24!important;color:#e8eaed!important;border-color:#30363d!important;box-shadow:none!important;}a,a:visited,#content_left a,#rso a,#b_results a{color:#8ab4f8!important;}em,.c-abstract,.VwiC3b,.b_caption,p,span{color:#c9d1d9!important;}input,textarea{background:#20242a!important;color:#e8eaed!important;border-color:#30363d!important;}");
    }
    if (options.customCss) {
      css.push(String(options.customCss));
    }
    const style = document.createElement("style");
    style.id = "ac-baidu-loon-lite-style";
    style.textContent = css.join("\\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function hostNameFromUrl(url) {
    try {
      return new URL(url, location.href).hostname.replace(/^www\\./, "");
    } catch (error) {
      return "";
    }
  }

  function resultCards(root = document) {
    const selectors = [
      "#content_left>.c-container",
      "#rso>.MjjYud",
      "#rso>.g",
      "#rso>.Ww4FFb",
      "#b_results>li.b_algo",
      "#b_results>li",
      ".result"
    ];
    const seen = new Set();
    return selectors.flatMap((selector) => Array.from(root.querySelectorAll(selector))).filter((node) => {
      if (!node || seen.has(node)) return false;
      seen.add(node);
      return true;
    });
  }

  function addFavicons() {
    if (!on(options.favicon, true)) return;
    const links = document.querySelectorAll("#content_left h3 a,#rso h3 a,#b_results h2 a,.result h3 a");
    links.forEach((link) => {
      const title = link.closest("h3,h2") || link;
      if (!title || title.dataset.acLoonFavicon) return;
      const host = hostNameFromUrl(link.href);
      if (!host) return;
      title.dataset.acLoonFavicon = "1";
      const img = document.createElement("img");
      img.src = "https://favicon.yandex.net/favicon/v2/" + encodeURIComponent(host) + "?size=32";
      img.width = 16;
      img.height = 16;
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.style.cssText = "width:16px;height:16px;margin-right:5px;vertical-align:-2px;border-radius:2px;";
      title.insertBefore(img, title.firstChild);
    });
  }

  function cleanRedirects() {
    if (!on(options.redirect, true)) return;
    document.querySelectorAll("a[href]").forEach((link) => {
      if (link.dataset.acLoonRedirect) return;
      link.dataset.acLoonRedirect = "1";
      let url;
      try {
        url = new URL(link.href, location.href);
      } catch (error) {
        return;
      }
      const maybeDirect = url.searchParams.get("url") || url.searchParams.get("u") || url.searchParams.get("target") || url.searchParams.get("to");
      if (maybeDirect && /^https?:\\/\\//i.test(maybeDirect)) {
        link.href = maybeDirect;
      }
      const mu = link.getAttribute("data-mdurl") || link.getAttribute("data-url") || link.getAttribute("mu");
      if (mu && /^https?:\\/\\//i.test(mu)) {
        link.href = mu;
      }
    });
  }

  function removeAdsByText() {
    if (!on(options.ads, true)) return;
    const markerRe = /^(广告|推广|赞助|Ad|Ads|Sponsored|スポンサー)$/i;
    const containers = "li,.c-container,.MjjYud,.Ww4FFb,.g,.b_algo,.result,.res-list";
    document.querySelectorAll("span,a,div").forEach((node) => {
      const text = (node.textContent || "").trim();
      if (!text || text.length > 16 || !markerRe.test(text)) return;
      const box = node.closest(containers);
      if (box && !box.dataset.acLoonKeep) {
        box.remove();
      }
    });
  }

  function applyLayoutClass() {
    document.body.classList.remove("ac-loon-layout-left", "ac-loon-layout-center", "ac-loon-layout-two", "ac-loon-layout-three", "ac-loon-layout-four", "ac-loon-layout-off");
    document.body.classList.add("ac-loon-layout-" + layout);
  }

  function addCounters() {
    if (!on(options.counter, false)) return;
    resultCards().forEach((box, index) => {
      if (box.querySelector(".ac-loon-count")) return;
      const title = box.querySelector("h3,h2") || box.firstElementChild;
      if (!title) return;
      const badge = document.createElement("span");
      badge.className = "ac-loon-count";
      badge.textContent = String(index + 1);
      title.insertBefore(badge, title.firstChild);
    });
  }

  function blockedHosts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(blockedKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveBlockedHosts(hosts) {
    try {
      localStorage.setItem(blockedKey, JSON.stringify(Array.from(new Set(hosts)).sort()));
    } catch (error) {}
  }

  function addBlockButtons() {
    const showButton = on(options.blockButton, false);
    const hideBlocked = on(options.hideBlocked, true);
    const hosts = blockedHosts();
    resultCards().forEach((box) => {
      const link = box.querySelector("a[href]");
      const host = link ? hostNameFromUrl(link.href) : "";
      if (!host) return;
      if (hosts.includes(host)) {
        if (hideBlocked) {
          box.remove();
          return;
        }
        box.classList.add("ac-loon-blocked-result");
      }
      if (!showButton || box.querySelector(".ac-loon-block-btn")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ac-loon-block-btn";
      button.textContent = hosts.includes(host) ? "已拦截" : "拦截";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const nextHosts = blockedHosts();
        if (!nextHosts.includes(host)) nextHosts.push(host);
        saveBlockedHosts(nextHosts);
        if (hideBlocked) {
          box.remove();
        } else {
          box.classList.add("ac-loon-blocked-result");
          button.textContent = "已拦截";
        }
      });
      box.insertBefore(button, box.firstChild);
    });
  }

  function showDebug() {
    if (!on(options.debug, false)) return;
    const badge = document.createElement("div");
    badge.textContent = "AC 已注入：" + location.hostname + " / " + layout;
    badge.style.cssText = "position:fixed;z-index:2147483647;left:8px;bottom:8px;background:#0b57d0;color:#fff;font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;padding:6px 8px;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.25);";
    document.documentElement.appendChild(badge);
    setTimeout(() => badge.remove(), 8000);
  }

  let autoPageLoading = false;
  let autoPageCount = 0;
  let nextPageUrl = "";

  function findNextLink(root = document) {
    const selectors = ["a#pnnext", "a.sb_pagN", "a[rel='next']", "#page a.n", "#page a[href*='pn=']", "a[aria-label*='Next']", "a[aria-label*='下一']"];
    const links = selectors.flatMap((selector) => Array.from(root.querySelectorAll(selector)));
    return links.find((link) => /下一|Next|›|>/i.test((link.textContent || "") + " " + (link.getAttribute("aria-label") || ""))) || links[links.length - 1] || null;
  }

  function primaryContainer(root = document) {
    return root.querySelector("#content_left") || root.querySelector("#rso") || root.querySelector("#b_results");
  }

  function importNextPage(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const current = primaryContainer(document);
    const next = primaryContainer(doc);
    if (!current || !next) return false;
    const nodes = Array.from(next.children).filter((node) => {
      const id = node.id || "";
      if (/page|foot|rs|nav/i.test(id)) return false;
      return node.matches(".c-container,.MjjYud,.g,.Ww4FFb,li,.b_algo,.result") || node.querySelector("h3 a,h2 a");
    });
    if (!nodes.length) return false;
    nodes.forEach((node) => current.appendChild(document.importNode(node, true)));
    const nextLink = findNextLink(doc);
    nextPageUrl = nextLink ? new URL(nextLink.href, location.href).href : "";
    autoPageCount += 1;
    return true;
  }

  async function maybeLoadNextPage() {
    if (!on(options.autopage, false) || autoPageLoading || autoPageCount >= 5) return;
    if (!nextPageUrl) {
      const nextLink = findNextLink();
      nextPageUrl = nextLink ? new URL(nextLink.href, location.href).href : "";
    }
    if (!nextPageUrl) return;
    const remaining = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
    if (remaining > 800) return;
    autoPageLoading = true;
    const tip = document.createElement("div");
    tip.className = "ac-loon-autopage-tip";
    tip.textContent = "正在加载下一页...";
    (primaryContainer() || document.body).appendChild(tip);
    try {
      const response = await fetch(nextPageUrl, { credentials: "include" });
      const html = await response.text();
      if (importNextPage(html)) run();
    } catch (error) {
      nextPageUrl = "";
    } finally {
      tip.remove();
      autoPageLoading = false;
    }
  }

  let runTimer = 0;
  let autoPageTimer = 0;
  function run() {
    if (!document.body) return;
    applyLayoutClass();
    cleanRedirects();
    removeAdsByText();
    addFavicons();
    addCounters();
    addBlockButtons();
  }

  addStyle();
  showDebug();
  const start = () => {
    run();
    if (on(options.autopage, false)) {
      window.addEventListener("scroll", () => {
        clearTimeout(autoPageTimer);
        autoPageTimer = setTimeout(maybeLoadNextPage, 160);
      }, { passive: true });
    }
    const observer = new MutationObserver(() => {
      clearTimeout(runTimer);
      runTimer = setTimeout(run, 120);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setInterval(run, 1500);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
</script>`;

function acCloneHeaders(headers) {
  const next = {};
  const blocked = /^(content-security-policy|content-security-policy-report-only|content-length|content-encoding|transfer-encoding|etag|x-frame-options)$/i;
  for (const key of Object.keys(headers || {})) {
    if (!blocked.test(key)) next[key] = headers[key];
  }
  next["Cache-Control"] = "no-store";
  return next;
}

function acArguments() {
  try {
    if (typeof $argument === "undefined" || $argument == null) return {};
    if (typeof $argument === "object") return $argument;
    if (typeof $argument === "string" && $argument.trim()) return JSON.parse($argument);
  } catch (error) {}
  return {};
}

const AC_ARGUMENTS = acArguments();

function acReadSetting(key, fallback) {
  if (Object.prototype.hasOwnProperty.call(AC_ARGUMENTS, key)) {
    const value = AC_ARGUMENTS[key];
    return value == null || value === "" ? fallback : value;
  }
  try {
    if (typeof $persistentStore === "undefined" || !$persistentStore.read) return fallback;
    const value = $persistentStore.read(key);
    return value == null || value === "" ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function acBool(value, fallback) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const text = String(value == null ? "" : value).trim().toLowerCase();
  if (["true", "on", "1", "yes", "y", "开启", "开", "是"].includes(text)) return true;
  if (["false", "off", "0", "no", "n", "关闭", "关", "否"].includes(text)) return false;
  return fallback;
}

function acLayout(value) {
  const key = String(value == null ? "" : value).trim();
  return AC_LAYOUT_MAP[key] || "two";
}

function acReadOptions() {
  return {
    layout: acLayout(acReadSetting("ac_layout", "双列")),
    ads: acBool(acReadSetting("ac_ads", true), true),
    redirect: acBool(acReadSetting("ac_redirect", true), true),
    favicon: acBool(acReadSetting("ac_favicon", true), true),
    right: acBool(acReadSetting("ac_right", true), true),
    counter: acBool(acReadSetting("ac_counter", false), false),
    underline: acBool(acReadSetting("ac_underline", true), true),
    dark: acBool(acReadSetting("ac_dark", false), false),
    blockButton: acBool(acReadSetting("ac_block_button", false), false),
    hideBlocked: acBool(acReadSetting("ac_hide_blocked", true), true),
    autopage: acBool(acReadSetting("ac_autopage", false), false),
    customCss: String(acReadSetting("ac_custom_css", "") || ""),
    debug: acBool(acReadSetting("ac_debug", false), false)
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
    if (options.debug && typeof $notification !== "undefined") {
      $notification.post("AC百度搜索优化", "已匹配", url);
    }
    $done({ status: $response.status, headers: acCloneHeaders(headers), body: acInjectHtml(body, options) });
  }
} catch (error) {
  console.log("[AC百度搜索优化] 注入失败: " + (error && error.message || error));
  $done({});
}
