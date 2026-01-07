import {
    getSStore,
    getQueryString
  } from "@/common/utils/utils";
  // axios 和 ElementUI 已在 index.html 中通过 CDN 全局引入
  const axios = window.axios;
  const Message = window.ELEMENT.Message;
  
  // 获取url中指定的参数
  const getUrlParam = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; // 返回参数值
  };
  
  // let baseURL = "";
  // if (process.env.NODE_ENV == "development") {
  //   let local = localStorage.getItem("local");
  //   baseURL = urlSetting["34"];
  //   if (local && urlSetting[local]) {
  //     baseURL = urlSetting[local];
  //   }
  // }
  
  // 创建一个axios请求
  const serviceHttp = axios.create({
    // baseURL: baseURL || getUrlParam("host"), // getSStore('host'),
    baseURL: process.env.NODE_ENV == "development" ? "http://localhost:8090" : getUrlParam("host"), // 开发环境使用 proxy 请求 其他环境获取host
    timeout: 60000,
    emulateJSON: true,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  });
  
  // 请求时的拦截
  axios.interceptors.request.use(config => {
    console.log("config :", config);
    // loading
    return config;
  
  }, error => {
    return Promise.reject(error);
  });
  
  // 响应时拦截
  axios.interceptors.response.use(response => {
    return response;
  }, error => {
    return Promise.resolve(error.response);
  });
  
  // 链式处理第一步，判断http状态码是否正常，和拦截器一样，请求正常则返回响应，请求异常则返回错误，最后返回结果给checkCode()。
  const checkStatus = (response) => {
    if (response.status === 404) {
        Message({
        type: "error",
        message: "服务器找不到请求的页面"
      });
    } else if (response.status === 500) {
        Message({
        type: "error",
        message: "服务器内部错误"
      });
    }
  
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
      return response;
      // 如果不需要除了data之外的数据，可以直接 return response.data
    }
  };
  
  // 链式处理第二步，处理上一步的结果，分别处理网络异常，以及后端返回的异常。
  const checkCode = (url, res) => {
    let data = res.data;
    // eslint-disable-next-line no-unused-vars
    let code = data.code;
    return data;
  };
  
  const http = {
    post: (url, params, conntentType, serviceType) => {
      if (conntentType == "application/json") {
        serviceHttp.defaults.headers["Content-Type"] = "application/json; charset=UTF-8";
      } else {
        serviceHttp.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
      }
      let urlArr = ["/user/json/authLogin", "/auth/json/login"];
      if (!urlArr.includes(url)) {
        params["sysToken"] = getSStore("token") || getQueryString("token");
        // params['sysToken'] = "6741445F9AABFAFB993F63092688139E9B9435683E34EBF08A46DE6D7A3981860AFDFC31846681859674064CE9693C595712790CD531BF90DD0465E194077743";
      };
      let newUrl = url;
      if (serviceType == "positionApiNoinvest") {
        let serviceName = getSStore("positionService");
        console.log("serviceName >>>", serviceName);
        if (serviceName == "position-api-noinvest") {
          newUrl = url.replace("position-api/", "position-api-noinvest/");
          // console.log("newUrl 111:::", newUrl);
        } else if (serviceName == "position-api") {
          newUrl = url.includes("position-api-noinvest") ? url.replace("position-api-noinvest/", "position-api/") : url;
          // console.log("newUrl 222:::", newUrl);
        }
      }
  
      return new Promise((resolve, reject) => {
        serviceHttp({
          method: "post",
          url: newUrl,
          // url: url,
          // data: conntentType == "application/json" ? JSON.stringify(params) : Qs.stringify(params)
          data: conntentType == "application/json" ? params : JSON.stringify(params)
        }).then(
          (response) => {
            return checkStatus(response);
          }
        ).then(
          (res) => {
            resolve(checkCode(newUrl, res));
            // resolve(checkCode(url, res));
          }
        ).catch(() => {
          reject();
        });
      });
    },
    async postCT(url, params, conntentType, serviceType) {
      if (conntentType == "application/json") {
        serviceHttp.defaults.headers["Content-Type"] = "application/json; charset=UTF-8";
      } else {
        serviceHttp.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
      }
      let urlArr = ["/user/json/authLogin", "/auth/json/login"];
      if (!urlArr.includes(url)) {
        params["sysToken"] = getSStore("token") || getQueryString("token");
        // params['sysToken'] = "6741445F9AABFAFB993F63092688139E9B9435683E34EBF08A46DE6D7A3981860AFDFC31846681859674064CE9693C595712790CD531BF90DD0465E194077743";
      };
      let newUrl = url;
      if (serviceType == "positionApiNoinvest") {
        let serviceName = getSStore("positionService");
        console.log("serviceName >>>", serviceName);
        if (serviceName == "position-api-noinvest") {
          newUrl = url.replace("position-api/", "position-api-noinvest/");
          // console.log("newUrl 111:::", newUrl);
        } else if (serviceName == "position-api") {
          newUrl = url.includes("position-api-noinvest") ? url.replace("position-api-noinvest/", "position-api/") : url;
          // console.log("newUrl 222:::", newUrl);
        }
      }
  
      return new Promise((resolve, reject) => {
        serviceHttp({
          method: "post",
          url: newUrl,
          // url: url,
          // data: conntentType == "application/json" ? JSON.stringify(params) : Qs.stringify(params)
          data: conntentType == "application/json" ? params : JSON.stringify(params)
        }).then(
          (response) => {
            return checkStatus(response);
          }
        ).then(
          (res) => {
            resolve(checkCode(newUrl, res));
            // resolve(checkCode(url, res));
          }
        ).catch(() => {
          reject();
        });
      });
    },
   // postJson: (url, params) => {
  //   console.log(params, "params");
  //   return http.post(url, params, "application/json");
  // },
  open: (url, params) => {
    let urlArr = ["/user/json/authLogin", "/auth/json/login"];
    if (!urlArr.includes(url)) {
      params["sysToken"] = getSStore("token");
      // params['sysToken'] = "6741445F9AABFAFB993F63092688139E9B9435683E34EBF08A46DE6D7A3981860AFDFC31846681859674064CE9693C595712790CD531BF90DD0465E194077743";
    };

    window.open(getUrlParam("host") + url + "?sysToken=" + params["sysToken"]);
  },
  // download: (url, params, param) => {
  download: (url, params, method = "_blank") => {
    // let urlArr = ["/user/json/authLogin", "/auth/json/login" ];
    // if (!urlArr.includes(url)) {
    //   params["sysToken"] = getSStore("token");
    //   // params['sysToken'] = "6741445F9AABFAFB993F63092688139E9B9435683E34EBF08A46DE6D7A3981860AFDFC31846681859674064CE9693C595712790CD531BF90DD0465E194077743";
    // };
    // window.open(getUrlParam("host") + url + "?sysToken=" + params["sysToken"] + param);
    if (params) {
      // window.open(`http://10.201.210.33:7001${url}?sysToken=${getSStore("token") || getQueryString("token")}${params}`, method);
      window.open(`${getUrlParam("host")}${url}?sysToken=${getSStore("token") || getQueryString("token")}${params}`, method);
    } else {
      window.open(`${getUrlParam("host")}${url}?sysToken=${getSStore("token") || getQueryString("token")}`, method);
    }
  },
  get: (url, params, conntentType, serviceType) => {
    if (conntentType == "application/json") {
      serviceHttp.defaults.headers["Content-Type"] =
        "application/json; charset=UTF-8";
    } else {
      serviceHttp.defaults.headers["Content-Type"] =
        "application/x-www-form-urlencoded; charset=UTF-8";
    }
    let newUrl = url;
    if (serviceType == "positionApiNoinvest") {
      let serviceName = getSStore("positionService");
      console.log("serviceName >>>", serviceName);
      if (serviceName == "position-api-noinvest") {
        newUrl = url.replace("position-api/", "position-api-noinvest/");
        // console.log("newUrl 111:::", newUrl);
      } else if (serviceName == "position-api") {
        newUrl = url.includes("position-api-noinvest") ? url.replace("position-api-noinvest/", "position-api/") : url;
        // console.log("newUrl 222:::", newUrl);
      }
    }
    if (params) {
      params["sysToken"] = getSStore("token") || params.sysToken;
    }

    return new Promise((resolve, reject) => {
      serviceHttp({
        method: "get",
        url: newUrl,
        params: params,
        paramsSerializer(params) {
          return JSON.stringify(params, {
            arrayFormat: "brackets"
          });
        }
      })
        .then(response => {
          return checkStatus(response);
        })
        .then(res => {
          resolve(checkCode(url, res));
        })
        .catch(() => {
          Message({
            type: "error",
            message: "系统错误，请联系系统管理员！"
          });
          reject();
        });
    });
  }
};

export default http;