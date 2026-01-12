
 ## 接口列表

### 1.  更新查询条件-新增保存和删除
**POST** `queryCriteria/saveOrUpdate`

**参数：**
```js
let params = {
	businessType: "100",//默认"100"
    code: "",//模块名（路由name）与用户id(userId= window.sessionStorage.getItem("unionId") || "") 拼接
    json: "",//查询条件转json字符串形式给后端
    name: "",//模块名-中文 比如："头寸规划"
    type: "os"//
};
```
**响应体说明：**
 code	0	响应码[0成功/-1失败]	java.lang.String
 message	success	响应消息	java.lang.String
 body		主体内容	java.lang.Object

### 2.  获取保存的查询条件
**POST** `/queryCriteria/get`

**参数：**
```js
let params = {
    code: "",//模块名（路由name）与用户id(userId= window.sessionStorage.getItem("unionId") || "") 拼接
    type: "os"//
};
```
**响应体说明：**
 code	0	响应码[0成功/-1失败]	java.lang.String
 message	success	响应消息	java.lang.String
 body		主体内容	java.lang.Object
 body.businessType java.lang.String
 body.code java.lang.String
 body.json java.lang.String
 body.name java.lang.String


### 3.  根据产品查询组合
**GET** `/tradecommon-api/v1/convertBond/bond/combiQry`

**参数：**
```js
let params = {
   page:1,
   rows:999,
   productId:""//产品id:fundId
};
```
**响应体说明：**
 res 主体内容 java.lang.Object
 res.combiCode   java.lang.String //组合code
 res.combiName   java.lang.String //组合名称
 res.combiId   java.lang.String  //组合Id


### 4.  查询字典数据
**POST** `/dictItem/findByDictIds`

**参数：**
```js
let params = {
    type: "$os",
    dictIds: "HG_SECURITY_TYPE_CONFIG,HG_DOWN_PLEDGE_BOND_TYPE,POSITION_BOND_TYPE"//查询的字典code
};
```
**响应体说明：**
 code	0	响应码[0成功/-1失败]	java.lang.String
 message	success	响应消息	java.lang.String
 body		主体内容	java.lang.Object
body.HG_SECURITY_TYPE_CONFIG[].value java.lang.String  //值
body.HG_SECURITY_TYPE_CONFIG[].name java.lang.String  //名称
body.HG_DOWN_PLEDGE_BOND_TYPE[].value java.lang.String  //值
body.HG_DOWN_PLEDGE_BOND_TYPE[].name java.lang.String  //名称
body.POSITION_BOND_TYPE[].value java.lang.String  //值
body.POSITION_BOND_TYPE[].name java.lang.String  //名称
