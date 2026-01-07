import http from './../api/http';
// let serviceName='httpBondPool'
// let credit='credit'

let serviceName=''
let credit=''
/**
 * 查询产品组--主界面查询条件：产品组下拉框使用
 * @param {Object} data - 请求参数 { name: '搜索关键字', type: '1' }
 */
export const productGroupList = (data) => {
  const url = serviceName+'/pubCombi/queryProdAndProdGroup'
  return http.postCT(url, data)
}

/**
 * 保存产品/管理组组合
 * @param {Object} data - 请求参数
 */
export const pubCombiSave = (data) => {
  const url = serviceName+'/pubCombi/save'
  return http.postCT(url, data)
}

/**
 * 查询产品/管理组列表--弹框中使用
 * @param {Object} data - 请求参数
 */
export const pubCombiFindList = (data) => {
  const url = serviceName+'/pubCombi/findList'
  return http.postCT(url, data)
}

/**
 * 获取产品/管理组详情
 * @param {Object} data - 请求参数
 */
export const pubCombiGet = (data) => {
  const url = serviceName+'/pubCombi/get'
  return http.postCT(url, data)
}

/**
 * 删除产品/管理组
 * @param {Object} data - 请求参数
 */
export const pubCombiRemove = (data) => {
  const url = serviceName+'/pubCombi/remove'
  return http.postCT(url, data)
}

/**
 * 查询用户权限（产品/管理组选项）
 * @param {Object} data - 请求参数 { type: '', isAuth: '', searchString: '' }
 * type: 查询类型[group:管理组、portfolio:模拟组合、prod:产品、pool:债券池，支持多个,分隔]
 * isAuth: 是否过滤权限[0否(不做权限过滤)、1是]
 * searchString: 搜索字符串
 */
export const genesisCommonFindUserAuth = (data) => {
  const url = credit+'/genesis/common/findUserAuth'
  return http.postCT(url, data)
}