/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = "";
let routerMode = "history";
let microServiceId = "/position-api";
let urlSetting = {
  34: "http://10.190.220.34:9600",
  53: "http://10.201.210.53:7001",
  78: "http://10.201.210.78:7001",
  // Nginx代理
  27: "http://10.201.210.27:7001",
  // Nginx代理
  "000": "http://127.0.0.1:8080",
  // 网关
  // 本地联调
  30: "http://10.201.210.30:8090",
  // 本地联调 -- 岳静
  51: "http://10.201.210.51:8090",
  // 本地联调 -- 黄习海
  80: "http://10.201.210.80:9600",
  // 本地联调 -- 许德明
  65: "http://10.201.210.65:8090",
  // 本地联调
  96: "http://10.201.210.96:8091",
  // 本地联调
  102: "http://10.201.210.102:8090",
  // 本地联调
  33: "http://10.201.210.33:7001"
};

if (process.env.NODE_ENV == "development") {
  // microServiceId = "/position-api";
  let local = localStorage.getItem("local");
  microServiceId = !local ? microServiceId : "";
} else if (process.env.NODE_ENV == "production") {

  // baseUrl = 'http://cangdu.org:8001';
}

export {
  baseUrl,
  routerMode,
  microServiceId,
  urlSetting
};
