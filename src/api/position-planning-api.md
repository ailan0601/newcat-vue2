# src/api/position-planning-api.md

## 接口基础
- 微服务名serviceName:position-api-investment
- 基础URL: 微服务名+API接口地址
- 数据格式: JSON


## 接口列表

### 1.  查询组合持仓信息、试算意向、风控试算
**POST** `/prodPosition/query`

**参数：**
```js
let params = {
	productCodes: [], //产品代码组合（试算意向、风控试算表格选择的产品）
	singleStrategy: '', //单选策略（隔夜、7D、14D）（用于试算意向、风控试算）
	investManager: [], //投资经理（试算意向、风控试算不要传）
	priorityType:'',//策略优先级（0:产品限制优先，1：当日策略优先）（用于试算意向、风控试算）
	strategyList: [], //策略方案（用于试算意向、风控试算）
	intentionState: '', //意向状态（0:意向未下达，1：意向已经下达）（试算意向、风控试算不要传）
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object
tradeDate		日期	java.lang.String
fundCode		产品代码	java.lang.String
fundId		产品ID	java.lang.String
fundName		产品名称	java.lang.String
zhgExpire		正回购到期	java.math.BigDecimal
nhgExpire		当日逆回购到期	java.math.BigDecimal
t0YhjMm         当日T0买卖   java.math.BigDecimal
lastT1Mq		昨日+1卖券	java.math.BigDecimal
zhgFirst		正回购首期	java.math.BigDecimal
bondDxDf		银行间债券兑付兑息	java.math.BigDecimal
firstContribution		一级缴款	java.math.BigDecimal
secondaryTrading		当日场内担保买卖	java.math.BigDecimal
fundApplyRedeem		基金申赎	java.math.BigDecimal
netSubscription		净申购	java.math.BigDecimal
dcdq		定存到期	java.math.BigDecimal
fxbfj		风险备付金	java.math.BigDecimal
other		其他	java.math.BigDecimal
t0BeginAvailable		T+0日初头寸	java.math.BigDecimal
t0PositionCalc		T+0头寸测算	java.math.BigDecimal
t0PositionUsable		头寸核查T+0头寸	java.math.BigDecimal
t1BeginAvailable		T+1日初头寸	java.math.BigDecimal
t1PositionCalc		T+1头寸测算	java.math.BigDecimal
t1PositionUsable		头寸核查T+1头寸	java.math.BigDecimal
untradedIntentAmount		未成交意向金额	java.math.BigDecimal
untradedIntentCount		未成交意向笔数	java.lang.Integer
inquiryProgressAmount		询价进度金额	java.math.BigDecimal
inquiryProgressCount		询价进度笔数	java.lang.Integer
frontDeskProgressAmount		前台进度金额	java.math.BigDecimal
frontDeskProgressCount		前台进度笔数	java.lang.Integer
backDeskProgressAmount		后台进度金额	java.math.BigDecimal
backDeskProgressCount		后台进度笔数	java.lang.Integer
pledgeRepo		正回购	java.math.BigDecimal
reverseRepo		逆回购	java.math.BigDecimal
repurchaseRestrictionType		回购限制类型	java.lang.String
repurchaseRestriction		回购限制	java.lang.String
repurchaseRestrictionContent		回购限制表格显示内容	java.lang.String
combiId		产品组合ID	java.math.BigDecimal
combiName		产品组合名称	java.math.BigDecimal
overOpinions		隔夜(亿)	java.math.BigDecimal
overOpinionsState		隔夜状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinions7d		7D(亿)	java.math.BigDecimal
opinions7dState		7D状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinions14d		14D(亿)	java.math.BigDecimal
opinions14dState		14D状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinionsCd1Title		自定义天数标题1	java.lang.String
opinionsCd1Value		自定义天数值1	java.math.BigDecimal
opinionsCd1State		自定义天数1状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinionsCd2Title		自定义天数标题2	java.lang.String
opinionsCd2Value		自定义天数值2	java.math.BigDecimal
opinionsCd2State		自定义天数2状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinionsCd3Title		自定义天数标题3	java.lang.String
opinionsCd3Value		自定义天数值3	java.math.BigDecimal
opinionsCd3State		自定义天数3状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinionsCd4Title		自定义天数标题4	java.lang.String
opinionsCd4Value		自定义天数值4	java.math.BigDecimal
opinionsCd4State		自定义天数4状态（0：无，1：已下达意向，2：下达意向后被修改）	java.lang.Integer
opinionsCd5Title		自定义天数标题5	java.lang.String
opinionsCd5Value		自定义天数值5	java.math.BigDecimal
opinionsCd5State		自定义天数状态（0：无，1：已下达意向，2：下达意向后被修改）5	java.lang.Integer
isIssued		是否下达（0：未下达，1：下达）	java.lang.String

### 1.1 投资经理-下拉框数据
**微服务名称** 
**POST** `/positionVerification/getInvestmentManagerList`
**接口说明**
-更新表格数据：当日场内担保买卖、回购限制、头寸意向新增表格列数据（按单元格填写数据请求）
**参数：**
```js
let params = {}
```
**响应体说明：**
code		响应码[0成功/-1失败]	java.lang.String
message		响应消息	java.lang.String
body		主体内容	java.lang.Object
body.total		总记录数	java.lang.Integer
body.rows		数据集合(rows: ["全部", "无", "孙悦", "马超"])	java.util.List

### 2.  更新组合持仓产品字段值
**POST** `/prodPosition/updateFieldValue`
**接口说明**
-更新表格数据：当日场内担保买卖、回购限制、组合名称
**参数：**
```js
let params = {
	fundCode: '', //产品代码
	fieldCode: '', //要修改的字段
	fieldValue: '', //要修改字段的值(和details字段二选一)
	details: [
		{
			positionCode: '', //头寸代码
			securityCode: '', //证券代码
			securityName: '', //证券名称
			businType: '', //业务类别
			businTypeName: '', //业务类别名称
			occurBal: '', //交易金额（元）
			price: '', //价格
			insStatus:''//是否交收
		},
	...
	], //要修改的明细集合(和字段值二选一)
	
};
```
**响应体说明：**
 code	0	响应码[0成功/-1失败]	java.lang.String
 message	success	响应消息	java.lang.String
 body		主体内容	java.lang.Object

### 2.1 保存/修改头寸意向列
**POST** `/prodPositionIntention/save`
**接口说明**
-更新表格数据：头寸意向新增表格列数据（按单元格填写数据请求）
**参数：**
```js
let params = {
	productCode: '', //产品代码
	title: '', //表头列
	val: '', //对应列的值
};
```
**响应体说明：**
 code	0	响应码[0成功/-1失败]	java.lang.String
 message	success	响应消息	java.lang.String
 body		主体内容	java.lang.Object

### 3.  查询组合持仓交易明细--点击表格数据（涉及列：正回购到期、当日逆回购到期、昨日+1卖券/正回购首期、当日债券兑息兑付、一级缴款、当日场内担保买卖、基金申赎、净申赎、定存到期、风险备付金、其它）查询明细-弹出框显示
**POST** `/prodPositionDetails/query`

**参数：**
```js
let params = {
	positionCode: '', //表格列的字段
	fundCode: '', //产品代码
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.util.List
fundCode		产品代码	java.lang.String
positionCode		头寸代码	java.lang.String
securityCode		证券代码	java.lang.String
securityName		证券名称	java.lang.String
businType		业务类别	java.lang.String
businTypeName		业务类别名称	java.lang.String
occurBal		交易金额（元）	java.lang.String
price		价格	java.lang.String
insStatus 是否交收(1-未交收，2-已交收)
dealstateText  询价/前台/后台成交状态详情展示


### 4.  查询单个回购策略
**POST** `/prodPositionStrategy/get`

**参数：**
```js
let params = {
	rid: '', //主键ID(不传时为新增，否则为修改)
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	com.position.server.model.po.ProdPositionStrategy
rid		主键ID	java.lang.String
name		策略名称	java.lang.String
productCode		产品代码	java.lang.String
reserveCash		预留现金（万）	java.math.BigDecimal
overnightRatio		隔夜比例（%）	java.math.BigDecimal
everyDay7		隔17天（&）	java.math.BigDecimal
everyDay14		隔14天（%）	java.math.BigDecimal
isDefault		是否默认（0：是，1：否）	java.lang.Integer

### 5.  查询回购策略列表
**POST** `/prodPositionStrategy/list`

**参数：**
```js
let params = {
	name: '', //策略名称
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.util.List
rid		主键ID	java.lang.String
name		策略名称	java.lang.String
productCode		产品代码	java.lang.String
reserveCash		预留现金（万）	java.math.BigDecimal
overnightRatio		隔夜比例（%）	java.math.BigDecimal
everyDay7		隔17天（&）	java.math.BigDecimal
everyDay14		隔14天（%）	java.math.BigDecimal
isDefault		是否默认（0：是，1：否）	java.lang.Integer


### 6.  保存回购策略
**POST** `/prodPositionStrategy/save`

**参数：**
```js
let params = {
	rid: '', //主键ID(不传时为新增，否则为修改)
	name: '', //策略名称
	productCode: '', //产品代码
	reserveCash: '', //预留现金（万）
	overnightRatio: '', //隔夜比例（%）
	everyDay7: '', //隔17天（&amp;）
	everyDay14: '', //隔14天（%）
	isDefault: '', //是否默认（0：是，1：否）
};
```
**响应体说明：**
 code	0	响应码[0成功/-1失败]	java.lang.String
 message	success	响应消息	java.lang.String
 body		主体内容	java.lang.Object


### 7.  删除回购策略
**POST** `/prodPositionStrategy/remove`

**参数：**
```js
let params = {
	rid: '', //主键ID
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object

### 8. 下达回购意向
**POST** `/prodPositionRepurchase/intention`

**参数：**
```js
let params = {
	productCode: '', //产品代码--表格中勾选的基金产品代码
	singleStrategy: '', //单选策略
	strategyList: [], //策略方案-多选
	priorityType:'',//策略优先级（0:产品限制优先，1：当日策略优先）
	ignoreAmtCheck: '', //是否忽略质押券类型金额校验(默认：0=不忽略,1=忽略，如果出发提示用户确认后传1忽略)
	concentrateDue: '', //集中到期(0=不忽略,1=忽略，如果出发提示用户确认后传1忽略)
};
```

**响应体说明：**
code	6002:集中到期提示、2：质押券类型金额提示、1002:系统错误、0：成功	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object

**返回逻辑说明:**
- 假设code==2 提示框：message-回购天数【1】天，回购金额【1000.000】亿元，质押券类型【利率】可用不足
点击【继续】将入参ignoreAmtCheck=1
- 假设code==6002 提示框：message-回购天数【1】天，回购金额【100】亿元，质押券类型【信用债】该产品集中到
期，有流动性风险，请确认是否继续
点击【继续】将入参concentrateDuek=1


### 9.  试算意向
**POST** `/prodPositionRepurchase/trialCalcIntention`

**参数：**
```js
let params = {
	productCode: '', //产品代码
	singleStrategy: '', //单选策略
	strategyList: '', //策略方案
	priorityType: '', //优先类型（0:产品优先，1：当日优先）
};
```

**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object

### 10.  搜索证券信息
**POST** `/stockInfo/searchStock`

**参数：**
```js
let params = {
	securityName: '', //证券名称/代码
};
```

**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object
securityCode		证券代码	java.lang.String
securityName		证券名称	java.lang.String
marketNo		市场编号	java.lang.String

### 11.  查询投研头寸明细业务类别--查明细弹框中业务类型
**GET** `/position/queryBusinType`

**参数：**
```js
let params = {
	positionCode: '', //头寸代码
};
```

**响应体说明：**
code	0	响应码[0成功、-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object
body.businType		业务类别	java.lang.String
body.businTypeName		业务类别名称	java.lang.String

