/**
 * 截取url所带参数
 *
 */
export const getQueryString = name => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };
  /**
 * 获取sessionStorage
 *
 */
export const getSStore = name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
  };
  export const clone = (obj) => {
    // Handle the 3 simple types, and null or undefined
    if (obj == null || typeof obj != "object") return obj;
    // Handle Date
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0; i < obj.length; ++i) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      var copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  };
  