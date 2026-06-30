const body = $response && $response.body ? $response.body : "";

function setPath(root, path, value) {
  let target = root;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (!target || typeof target !== "object" || !(key in target)) return;
    target = target[key];
  }
  if (target && typeof target === "object") {
    target[path[path.length - 1]] = value;
  }
}

function disableXView(config) {
  const xview = config && config.JDXView;
  if (!xview || typeof xview !== "object") return;

  setPath(config, ["JDXView", "15310-preDownload", "value"], false);
  setPath(config, ["JDXView", "XVOpenTTTUpgrade", "value"], "false");
  setPath(config, ["JDXView", "XVOpenTTTUpgrade", "TTTXView2Aids"], "");
  setPath(config, ["JDXView", "XVCloseTTTUpgrade", "value"], "true");
  setPath(config, ["JDXView", "XVOpenHookFilterSW", "value"], false);
  setPath(config, ["JDXView", "TejiaTabTip", "config", "disable"], true);
}

function patchBasicConfig(data) {
  setPath(data, ["JDAdsCore", "adDegradationConfig", "degraded"], "1");

  setPath(data, ["JDAD", "chainOptimization", "enable"], "0");
  setPath(data, ["JDAD", "customsOptimization", "enable"], "0");
  setPath(data, ["JDAD", "linkOptimization", "abTest"], "");
  setPath(data, ["JDAD", "netConfig", "serverUrl"], "");
  setPath(data, ["JDAD", "netConfig", "timeout"], "1");

  setPath(data, ["JDImageGif", "JDImageColdStart", "enable"], "0");
  setPath(data, ["JDImageGif", "JDImageLaunchMta", "enable"], "0");
  setPath(data, ["JDStartupOpti", "Optim2026Switch", "enable"], 0);
  setPath(data, ["JDBPushServiceModule", "ReportLiveAdData", "enableReport"], 0);

  setPath(data, ["JDUniformRecommend", "uniformRecommendAccurateADExpo", "uniformRecommendAccurateADExpo"], 0);
  setPath(data, ["JDUniformRecommend", "uniformRecommendADExpoQueue", "uniformRecommendADExpoQueue"], 0);

  disableXView(data);
}

function patchStrategy(data) {
  if (!data || typeof data !== "object") return;
  if (data.startupConfig && typeof data.startupConfig === "object") {
    data.startupConfig.enable = 0;
    data.startupConfig.frequency = 86400;
  }
  if (data.refresh && typeof data.refresh === "object") {
    data.refresh.enable = 0;
    data.refresh.frequency = 86400;
  }
}

try {
  const obj = JSON.parse(body);
  if (obj && obj.data && typeof obj.data === "object") {
    patchBasicConfig(obj.data);
    patchStrategy(obj.data);
  }
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  $done({ body });
}
