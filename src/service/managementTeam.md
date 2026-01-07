## 接口列表

### 1.  - 查询产品/产品组主界面查询条件：产品组下拉框使用
**POST** `/pubCombi/queryProdAndProdGroup`
**参数：**
```js
let params = {
	name:'',//搜索关键字
	type: '1', //产品组类型
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
data		主体内容（数组）	java.lang.Array
data.rid	保存成功	主键	java.lang.String
data.type	1	类型[1：产品、2：管理组]	java.lang.String
data.name	产品组名称	名称	java.lang.String
data.isShow		是否是产品（0-否，1-是）	java.lang.Int
data.detail		明细集合（数组）	java.lang.Array
data.detail[].prid		主键 java.lang.String
data.detail[].oname	产品/管理组名称	产品/管理组名称	java.lang.String
data.detail[].oname	产品/管理组名称	产品/管理组名称	java.lang.String

### 2.  - 查询公共组合列表 -弹框中使用
**POST** `/pubCombi/findList`
**参数：**
```js
let params = {
	type: '1'//类型[1：产品、2：管理组]
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容（数组）	java.lang.Array
body[].rid	保存成功	主键	java.lang.String
body[].type	1	类型[1：产品、2：管理组]	java.lang.String
body[].name	产品组名称	名称	java.lang.String


### 3.  - 查询公共组合信息
**POST** `/pubCombi/get`
**参数：**
```js
let params = {
	rid: '', //主键
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object
body.rid	保存成功	主键	java.lang.String
body.type	1	类型[1：产品、2：管理组]	java.lang.String
body.name	产品组名称	名称	java.lang.String
body.detail		明细集合（数组）	java.lang.Array
body.detail[].ocode	产品/管理组编码	产品/管理组编码	java.lang.String
body.detail[].oname	产品/管理组名称	产品/管理组名称	java.lang.String





### 4.  - 删除公共组合
**POST** `/pubCombi/remove`
**参数：**
```js
let params = {
	rid: '', //主键
	code: '', //产品/管理组编号(数组可多选)（删除持仓时必传）
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	删除成功	响应消息	java.lang.String

### 5.  -  新增/修改公共组合
**POST** `/pubCombi/save`
**参数：**
```js
let params = {
	rid: '', //主键
	type: '', //类型[1：产品、2：管理组]
	name: '', //名称
	detail: '', //明细集合
	ocode: '', //产品/管理组编码
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	保存成功	响应消息	java.lang.String

### 6.  -  公共-查询当前登录用户的管理组模拟组合等权限
**POST** `/genesis/common/findUserAuth`
**参数：**
```js
let params = {
	type: '', //查询类型[group:管理组、portfolio:模拟组合、prod:产品、pool:债券池，支持多个,分隔]
	isAuth: '', //是否过滤权限[0否(不做权限过滤)、1是]
	searchString: '', //搜索字符串
};
```
**响应体说明：**
code	0	响应码[0成功/-1失败]	java.lang.String
message	success	响应消息	java.lang.String
body		主体内容	java.lang.Object
body.group		管理组集合	java.util.List
body.group.code		管理组编码	java.lang.String
body.group.value		管理组名称	java.lang.String
body.portfolio		模拟组合集合	java.util.List
body.portfolio.code		模拟组合编码	java.lang.String
body.portfolio.value		模拟组合名称	java.lang.String
body.prod		模拟组合集合	java.util.List
body.prod.code		产品代码	java.lang.String
body.prod.exp		产品编码	java.lang.String
body.prod.value		产品名称	java.lang.String
body.pool		债券集合	java.util.List
body.pool.code		债券池编码	java.lang.String
body.pool.value		债券池名称	java.lang.String
