/**
 * Mock 数据文件
 * 用于模拟后端API返回的数据，供前端开发和测试使用
 */

/**
 * 产品组数据列表
 * @type {Array<Object>}
 * @property {String} label - 产品组显示名称
 * @property {String} value - 产品组值（用于筛选和查询）
 */
export const productGroups = [
  { label: '产品1号', value: 'product1' },
  { label: '产品2号', value: 'product2' },
  { label: '产品3号', value: 'product3' }
]

/**
 * 投资经理数据列表
 * @type {Array<Object>}
 * @property {String} label - 投资经理显示名称
 * @property {String} value - 投资经理值（用于筛选和查询）
 */
export const investmentManagers = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' }
]

/**
 * 银行间入款未交收表格数据
 * @type {Array<Object>}
 */
export const interbankData = [
  {
    id: 1, // 唯一标识
    fundCode: '000001', // 基金代码
    fundName: '鼎家91', // 基金简称
    reverseRepoDue: 100000, // 正回购到期（单位：元）
    currentDayReverseRepoDue: 100000, // 当日逆回购到期（单位：元）
    yesterdayPlus1SellBonds: 100000, // 昨日+1卖券/正回购首期（单位：元）
    currentDayBondInterest: 100000, // 当日债券兑息兑付（单位：元）
    primaryPayment: 15000000, // 一级缴款（单位：元）
    secondaryTrade: 12839273000, // 二级买卖（单位：元）
    fundSubscription: 10000000, // 基金申赎（单位：元）
    netSubscription: 500000000, // 净申赎（单位：元）
    fixedDepositDue: 0, // 定存到期（单位：元）
    riskProvision: 0, // 风险备付金（单位：元）
    other: 100000, // 其它（单位：元）
    // T+0头寸数据
    t0Position: {
      beginning: 30000000, // 日初（单位：元）
      calculation: 30000000, // 测算（单位：元）
      checkTable: 30000000 // 头寸核查表（单位：元）
    },
    // T+1头寸数据
    t1Position: {
      beginning: 30000000, // 日初（单位：元）
      calculation: 30000000, // 测算（单位：元）
      checkTable: 30000000 // 头寸核查表（单位：元）
    },
    repurchaseRestriction: '只能7D, xxxx', // 回购限制说明
    // 头寸意向数据（单位：亿元）
    positionIntention: {
      overnight: 15, // 隔夜意向金额
      sevenDay: 20, // 7天意向金额
      fourteenDay: 30 // 14天意向金额
    },
    unsettledIntention: '12300000/10', // 未成交意向（格式：金额/笔数）
    // 加权成本进度数据
    weightedCost: {
      inquiryProgress: '12300000/10', // 询价进度（格式：金额/笔数）
      frontendProgress: '12300000/10', // 前台进度（格式：金额/笔数）
      backendProgress: '12300000/10' // 后台进度（格式：金额/笔数）
    },
    reverseRepo: 100, // 正回购（单位：万元）
    repo: 200 // 逆回购（单位：万元）
  },
  {
    id: 2,
    fundCode: '000002',
    fundName: '创全2号',
    reverseRepoDue: 200000,
    currentDayReverseRepoDue: 200000,
    yesterdayPlus1SellBonds: 200000,
    currentDayBondInterest: 200000,
    primaryPayment: 100000,
    secondaryTrade: 100000,
    fundSubscription: 100000,
    netSubscription: 100000,
    fixedDepositDue: 100000,
    riskProvision: 100000,
    other: 100000,
    t0Position: {
      beginning: 30000000,
      calculation: 30000000,
      checkTable: 30000000
    },
    t1Position: {
      beginning: 30000000,
      calculation: 30000000,
      checkTable: 30000000
    },
    repurchaseRestriction: '只能隔夜', // 回购限制：只能进行隔夜回购
    positionIntention: {
      overnight: 10,
      sevenDay: 15,
      fourteenDay: 25
    },
    unsettledIntention: '10000000/8',
    weightedCost: {
      inquiryProgress: '10000000/8',
      frontendProgress: '10000000/8',
      backendProgress: '10000000/8'
    },
    reverseRepo: 80,
    repo: 150
  },
  {
    id: 3,
    fundCode: '000003',
    fundName: '创全3号',
    reverseRepoDue: 300000,
    currentDayReverseRepoDue: 300000,
    yesterdayPlus1SellBonds: 300000,
    currentDayBondInterest: 300000,
    primaryPayment: 30000000,
    secondaryTrade: 18000000000,
    fundSubscription: 300000,
    netSubscription: 300000,
    fixedDepositDue: 300000,
    riskProvision: 300000,
    other: 300000,
    t0Position: {
      beginning: 30000000,
      calculation: 30000000,
      checkTable: 30000000
    },
    t1Position: {
      beginning: 30000000,
      calculation: 30000000,
      checkTable: 30000000
    },
    repurchaseRestriction: '只能14D', // 回购限制：只能进行14天回购
    positionIntention: {
      overnight: 20,
      sevenDay: 25,
      fourteenDay: 35
    },
    unsettledIntention: '15000000/12',
    weightedCost: {
      inquiryProgress: '15000000/12',
      frontendProgress: '15000000/12',
      backendProgress: '15000000/12'
    },
    reverseRepo: 120,
    repo: 250
  },
  {
    id: 4,
    fundCode: '000004',
    fundName: '创全4号',
    reverseRepoDue: 400000,
    currentDayReverseRepoDue: 400000,
    yesterdayPlus1SellBonds: 400000,
    currentDayBondInterest: 400000,
    primaryPayment: 40000000,
    secondaryTrade: 20000000000,
    fundSubscription: 400000,
    netSubscription: 400000,
    fixedDepositDue: 400000,
    riskProvision: 400000,
    other: 400000,
    t0Position: {
      beginning: 30000000,
      calculation: 30000000,
      checkTable: 30000000
    },
    t1Position: {
      beginning: 30000000,
      calculation: 30000000,
      checkTable: 30000000
    },
    repurchaseRestriction: '无限制', // 回购限制：无限制，可进行任意期限回购
    positionIntention: {
      overnight: 12,
      sevenDay: 18,
      fourteenDay: 28
    },
    unsettledIntention: '11000000/9',
    weightedCost: {
      inquiryProgress: '11000000/9',
      frontendProgress: '11000000/9',
      backendProgress: '11000000/9'
    },
    reverseRepo: 90,
    repo: 180
  }
]

/**
 * 头寸意向表格数据
 * @type {Array<Object>}
 * @property {Number} id - 唯一标识
 * @property {Number} overnight - 隔夜意向金额（单位：亿元）
 * @property {Number} sevenDay - 7天意向金额（单位：亿元）
 * @property {Number} fourteenDay - 14天意向金额（单位：亿元）
 * @property {String} unsettledIntention - 未成交意向（格式：金额/笔数）
 * @property {String} inquiryProgress - 询价进度（格式：金额/笔数）
 * @property {String} frontendProgress - 前台进度（格式：金额/笔数）
 * @property {String} backendProgress - 后台进度（格式：金额/笔数）
 * @property {Number} reverseRepo - 正回购（单位：万元）
 * @property {Number} repo - 逆回购（单位：万元）
 */
export const positionIntentionData = [
  {
    id: 1,
    overnight: 15,
    sevenDay: 20,
    fourteenDay: 30,
    unsettledIntention: '12300000/10',
    inquiryProgress: '12300000/10',
    frontendProgress: '12300000/10',
    backendProgress: '12300000/10',
    reverseRepo: 100,
    repo: 200
  },
  {
    id: 2,
    overnight: 10,
    sevenDay: 15,
    fourteenDay: 25,
    unsettledIntention: '10000000/8',
    inquiryProgress: '10000000/8',
    frontendProgress: '10000000/8',
    backendProgress: '10000000/8',
    reverseRepo: 80,
    repo: 150
  },
  {
    id: 3,
    overnight: 20,
    sevenDay: 25,
    fourteenDay: 35,
    unsettledIntention: '15000000/12',
    inquiryProgress: '15000000/12',
    frontendProgress: '15000000/12',
    backendProgress: '15000000/12',
    reverseRepo: 120,
    repo: 250
  },
  {
    id: 4,
    overnight: 12,
    sevenDay: 18,
    fourteenDay: 28,
    unsettledIntention: '11000000/9',
    inquiryProgress: '11000000/9',
    frontendProgress: '11000000/9',
    backendProgress: '11000000/9',
    reverseRepo: 90,
    repo: 180
  }
]

/**
 * 策略配置数据列表
 * @type {Array<Object>}
 * @property {String} label - 策略显示名称
 * @property {String} value - 策略值（用于选择和配置）
 */
export const strategyList = [
  { label: '策略1', value: 'strategy1' },
  { label: '策略2', value: 'strategy2' },
  { label: '策略3', value: 'strategy3' }
]

/**
 * 二级买卖明细数据
 * @type {Array<Object>}
 * @property {String} securityCode - 证券代码
 * @property {String} securityName - 证券名称
 * @property {String} businessCategory - 业务类别（买入/卖出）
 * @property {Number} transactionAmount - 交易金额（单位：元）
 */
export const secondaryTradeDetails = [
  {
    securityCode: '000001',
    securityName: '证券A',
    businessCategory: '买入', // 业务类别：买入
    transactionAmount: 1000000
  },
  {
    securityCode: '000002',
    securityName: '证券B',
    businessCategory: '卖出',
    transactionAmount: 2000000
  },
  {
    securityCode: '000003',
    securityName: '证券C',
    businessCategory: '买入',
    transactionAmount: 1500000
  }
]

/**
 * 明细弹窗数据
 * @type {Object}
 * @property {Array} overnight - 隔夜明细数据列表
 * @property {Array} sevenDay - 7天明细数据列表
 * @property {Array} fourteenDay - 14天明细数据列表
 * @property {Number} id - 明细唯一标识
 * @property {Number} amount - 金额（单位：元）
 * @property {Number} count - 笔数
 * @property {String} date - 日期（格式：YYYY-MM-DD）
 */
export const detailData = {
  overnight: [ // 隔夜明细数据
    { id: 1, amount: 5000000, count: 5, date: '2024-01-01' },
    { id: 2, amount: 3000000, count: 3, date: '2024-01-02' },
    { id: 3, amount: 7000000, count: 7, date: '2024-01-03' }
  ],
  sevenDay: [ // 7天明细数据
    { id: 1, amount: 8000000, count: 8, date: '2024-01-01' },
    { id: 2, amount: 6000000, count: 6, date: '2024-01-02' },
    { id: 3, amount: 6000000, count: 6, date: '2024-01-03' }
  ],
  fourteenDay: [ // 14天明细数据
    { id: 1, amount: 10000000, count: 10, date: '2024-01-01' },
    { id: 2, amount: 10000000, count: 10, date: '2024-01-02' },
    { id: 3, amount: 10000000, count: 10, date: '2024-01-03' }
  ]
}

