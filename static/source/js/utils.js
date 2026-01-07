/**
 * 字符去左空格
 */
String.prototype.LTrim = function () {
  return this.repalce(/^\s*/, '');
};


/**
 * 字符去右空格
 */
String.prototype.RTrim = function () {
  return this.repalce(/(\s*$)/g, '');
};


/**
 * 字符去右空格
 */
String.prototype.LRTrim = function () {
  return this.replace(/^\s*|\s*$/g, '');
};

/**
 * 数据类型
 * @param {*} o 
 */
function valueType(o) {
  return ({}).toString.call(o)
}

/**
 * 对数据进行去除左右多余空格
 * @param {*} object 
 */
function checkSpace(object) {
  if (!object) {
    return object;
  }
  if (valueType(object) == '[object String]') {
    return object.LRTrim();
  }
  var res = {};
  for (var key in object) {
    var value = object[key];
    if (value) {
      if (
        valueType(value) == '[object String]'
      ) {
        value = value.LRTrim();
      }
      res[key] = value;
    } else if (!!Number(value)) {
      res[key] = value;
    }
  }
  return res;
}

/**
 * 获取用户权限(缓存在window中的值)
 * @param {*} key 
 */
function getLocalMenu(key) {
  return (window && window.menu && window.menu[key]) || null;
}

/* **************************************************** */
// 正则方法
var isNumberInt = /(^[0-9]\d*$)/; // 整数
var isNumberAuto = /(^[\-0-9][0-9]*(\.[0-9]+)?)$/; // 正负数
var isNumberIn5 = /^\d+(\.\d{0,5})?$/; // 五位小数校验

/**
 * 是否数字[包含负数]
 * @param {*} v 
 */
function isNumbers(v) {
  return (Number(v) != 0 && !Number(v));
}

/**
 * 是否小数位数大于5位
 * @param {*} v 
 */
function isNumPointer(v) {
  v = Number(v).toString();
  let split = v.split('.');
  if (split && split[1] && split[1].length > 5) {
    return true;
  }
  return false;
}

/**
 * 是否输入小数点
 * @param {*} v 
 */
function isPointer(v) {
  v = Number(v).toString();
  let split = v.split('.');
  if (split && split[1]) {
    return true;
  }
  return false;
}

/**
 * 是否负数
 * @param {*} v 
 */
function isLoss(v) {
  return (Number(v) != 0 && !Number(v)) || Number(v) < 0;
}

/* **************************************************** */

/**
 * 数组去重
 * @param {*} list    数组
 * @param {*} keyName 去重字段
 */
function uinqueArr(list, keyName) {
  var res = {};
  var arr = [];
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var key = r[keyName];
    if (!res[key]) {
      res[key] = true;
      arr.push(r);
    }
  }
  res = null;
  return arr;
}
