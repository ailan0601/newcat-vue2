import {
    microServiceId
  } from "@/common/utils/env";
//   const commonService = process.env.NODE_ENV == "development" ? "http://10.190.220.34:9600" : "";
  const commonService =  "";
  
  const API = {
    cliUserAuthFindProdListRadio: "/authUser/findProduct", // 客户用户权限-根据用户编号和菜单编号获取产品列表
    cliUserAuthFindProdList: microServiceId + "/privilage/findProduct", // 获取产品列表
    findPagingProduct: microServiceId + "/privilage/findPagingProduct", // 获取分页产品列表
    authJsonLogin: "/auth/json/login", // 机构客户服务平台-自动登录
    depInfoFindSearch: "/depInfo/findSearch", // 用户部门信息
    userInfoFindSearch: "/userInfo/findSearch", // 用户基本信息
    cliInfoFindSearch: "/cliInfo/findSearch", // 客户信息
    productInfoFindSearch: "/productInfo/findSearch", // 产品信息
    userInfoCreateTempPwd: "/userInfo/createTempPwd", // 用户信息-生成一次性临时密码'
  
    // 上传文件插件
    sysFileDelete: "/sysFile/delete", // 删除文件
    findByCilIdAndBizClass: "/dsInfoFileLib/findByCilIdAndBizClass", // 获取客户证照库
    getAkConfig: microServiceId + "/akBalance/getAkConfig", // 获取配置信息
    conditionGet: commonService + "/queryCriteria/get", // 保存条件--查询
    conditionSaveOrUpdate: commonService + "/queryCriteria/saveOrUpdate", // 保存条件--新增
    conditionPageQuery: "/queryCriteria/pageQuery", // 保存条件--查询
    conditionDelete: "/queryCriteria/delete", // 保存条件--删除
  
    findByDictId: commonService + "/dictItem/findByDictId", // 字典查询 --单个
    findByDictIds: commonService + "/dictItem/findByDictIds", // 字典查询-创金=--多个
    productNameQry: commonService + "/pc-component-api/v1/common/sys/productQuery", // 查询产品名称接口 无分页（已废弃）
    productNameQryPage: commonService + "/pc-component-api/v1/common/sys/productPageQuery", // 查询产品名称接口 有分页（已废弃）
    stockCodeDeatails: commonService + "/tDicDetail/findStockDicList", // 数据字典-查找O32证券信息字典数据
    // 自定义列
    customColSave: commonService + "/customCol/save", // 自定义列-保存自定义列信息
    customColGet: commonService + "/customCol/get", // 自定义列-获取自定义列信息
    getSecurity: commonService + "/pc-component-api/v1/convertBond/bond/tsecuritiesQry", // 获取证券信息(已废弃)
  
    // 新公共接口替代 pc-component-api
    productNameQryNew: commonService + "/tradecommon-api/service/common/sys/productQuery", // 查询产品名称接口 无分页
    productNameQryPageNew: commonService + "/tradecommon-api/v1/common/sys/productPageQuery", // 查询产品名称接口 有分页
    optFlowNew: commonService + "/tradecommon-api/v1/auto/common/optFlow",  // 流程信息
    getCombiQryNew: commonService + "/tradecommon-api/v1/convertBond/bond/combiQry",  // 组合
    getSecurityNew: commonService + "/tradecommon-api/v1/convertBond/bond/tsecuritiesQry", // 获取证券信息
    attachmentUploadNew: "/tradecommon-api/v1/common/attachment/attachmentUpload", // 上传附件
    instructionAttachNew: "/tradecommon-api/v1/auto/common/instructionAttach", // 上传后获取文件
    attachmentDeleteNew: "/tradecommon-api/v1/common/attachment/attachmentDelete", // 删除附件
  };
  
  export default API;
  