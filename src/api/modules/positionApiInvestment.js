// let serviceName = 'position-api-investment'
let serviceName = ""
const API = {
  // 查询组合持仓信息
  prodPositionQuery: serviceName + '/prodPosition/query',
  // 投资经理-下拉框数据
  getInvestmentManagerList: serviceName + '/positionVerification/getInvestmentManagerList',
  // 更新组合持仓产品字段值
  prodPositionUpdateFieldValue: serviceName + '/prodPosition/updateFieldValue',
  // 保存/修改头寸意向列
  prodPositionIntentionSave: serviceName + '/prodPositionIntention/save',
  // 查询组合持仓交易明细
  prodPositionDetailsQuery: serviceName + '/prodPositionDetails/query',
  // 查询单个回购策略
  prodPositionStrategyGet: serviceName + '/prodPositionStrategy/get',
  // 查询回购策略列表
  prodPositionStrategyList: serviceName + '/prodPositionStrategy/list',
  // 保存回购策略
  prodPositionStrategySave: serviceName + '/prodPositionStrategy/save',
  // 删除回购策略
  prodPositionStrategyRemove: serviceName + '/prodPositionStrategy/remove',
  // 下达回购意向
  prodPositionIntention: serviceName + '/prodPositionRepurchase/intention',
  // 试算意向
  prodPositionTrialCalcIntention: serviceName + '/prodPositionRepurchase/trialCalcIntention',
  // 搜索证券信息
  searchStock: serviceName + '/stockInfo/searchStock',
  // 查询投研头寸明细业务类别
  queryBusinType: serviceName + '/position/queryBusinType'
}
export default API

