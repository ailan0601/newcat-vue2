# 项目说明文档

## 一、项目概述

基于图片描述，实现一个头寸规划管理系统，包含台账管理、头寸规划等功能模块。

## 二、技术栈

- **Vue 2**（Options API 模式）
- **Element UI**（组件库）
- **SCSS**（样式语言）
- **Mock 数据**（使用 axios 模拟接口）

## 三、项目架构

### 3.1 环境要求

- **Node.js**: >= 4.0.0
- **npm**: >= 3.0.0

### 3.2 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd toucun

# 安装依赖
npm install
```

### 3.3 启动

```bash
# 开发环境启动（支持热更新）
npm run dev

# 或者
npm start
```

启动成功后，浏览器访问：`http://localhost:8080`（具体端口以实际启动信息为准）

### 3.4 构建

```bash
# 构建生产环境版本
npm run build
```

构建完成后，生产文件会输出到 `dist` 目录。

### 3.5 代码检查

```bash
# 运行 ESLint 代码检查
npm run lint
```

### 3.6 项目基础结构

- `package.json` - 配置项目依赖（Vue 2、Element UI、SCSS 等）
- `build/` - 构建配置文件目录
- `public/index.html` - 项目入口 HTML 文件
- `src/main.js` - Vue 实例初始化，引入 Element UI

### 3.7 目录结构

```
src/
├── views/                         # 页面组件目录
│   └── position-planning/        # 头寸规划界面组件文件夹
│       ├── PositionPlanning.vue  # 头寸规划主页面
│       ├── Layout.vue            # 主布局组件
│       ├── FilterSection.vue     # 顶部筛选区域组件
│       ├── InterbankTable.vue    # 银行间入款未交收表格
│       ├── PositionIntentionTable.vue  # 头寸意向表格
│       ├── StrategyConfigPanel.vue     # 策略配置面板
│       ├── SecondaryTradePanel.vue     # 查询表格明细面板
│       ├── RepurchaseRestrictionPanel.vue  # 回购限制面板
│       └── IntentionPreviewDialog.vue      # 意向预览弹窗
├── api/                           # API 接口
│   └── modules/                   # 模块接口集合
├── utils/                         # 工具函数
└── styles/                        # 全局样式
    └── index.scss                 # 全局样式文件
```

### 3.8 框架基础数据

- 用户id获取方式：`userId = window.sessionStorage.getItem("unionId") || ""`

## 四、开发规范

### 4.1 代码规范

1. 严格遵循 **Vue 2 Options API** 模式
2. 组件命名使用**驼峰命名法**（JavaScript）
3. 样式类名使用**短横杠命名法**（SCSS）
4. 代码需符合 **ESLint + Prettier** 格式化规范
5. 组件保持**高内聚、低耦合**

### 4.2 样式规范

- Vue 组件使用局部 CSS：`<style lang="scss" scoped></style>`
- 公共使用的 CSS 要单独放在 `styles` 文件夹里
- 命名规则：
  - 使用类选择器，放弃 ID 选择器
  - 使用单个字母+"-"为前缀（如：`m-help`）
  - 命名应简约而不失语义

### 4.3 HTML 规范

1. 结构顺序和视觉顺序基本保持一致
2. 结构、表现、行为三者分离，避免内联
3. 保持良好的简洁的树形结构
4. 一个标签上引用的类名不要过多，越少越好

### 4.4 JavaScript 规范

- 避免 `this.$parent`
- 谨慎使用 `this.$refs`
- 无需将 `this` 赋值给 `component` 变量
- 调试信息 `console.log()`、`debugger` 使用完及时删除
- 处理数据请尽量处理速度
- 代码编译无报错，无警告
- 处理复杂逻辑、方法名、业务字段变量需要写注释，项目注释率不得低于20%
- 在判断条件类似这种 number 和 string，例如：0 或者"0"，由于不能确定后端接口返回的数据类型是数字还是字符串，在写 js 数据判断时尽量不要采用"==="，请使用"=="

### 4.5 浏览器兼容性

目前 PC 端仅需支持：
- Chrome 浏览器 64 版本以上
- 360 急速浏览器（急速模式）
- 360 安全浏览器（急速模式）
- 搜狗浏览器（急速模式）

### 4.6 UI 样式规范

#### 页面布局与主要间距
- 模块界面与导航菜单栏的边距为 10px
- 标题边距 10px，上下内容模块间距为 10px

#### 字体样式
- 大标题字体：加粗、微软雅黑、#333、16px
- 小标题字体：加粗、微软雅黑、#333、14px
- 正文字体（不包含按钮）：微软雅黑、#333、12px
- 文本域组件字体设置微软雅黑

#### 按钮样式
- 按钮采用小型按钮，设置 `size='mini'`
- 模块菜单上方表单查询按钮为 elementUI 关于 button 的 `type="primary"` 样式
- 清空、重置等其他按钮采用默认按钮样式
- 表格上方的操作按钮采用 plain 模式，设置对应操作的 icon 彩色图标

#### 分页样式
- 分页需要有显示总数、调整每页显示条数的功能，不需要直接前往的功能

#### 查询表单样式
- 各个表单组件大小采用 `size="mini"`
- 上下两行要对齐
- 上下行间距为 10px
- 所有的查询条件都需要有清除内容的功能，必填项除外

#### 标签页 tab 样式
- 上方导航菜单采用默认样式
- 界面内容的采用卡片样式，`type="border-card"`

#### 表格样式
- 界面表格的列的对齐方式：文本类型靠左对齐，数值类型靠右对齐
- 去掉表格 `el-table` 的 `border` 属性
- 表格表头高度 40px，行高 32px，表格行子项行高 28px
- 界面表格的列的长度：要根据业务文字的长度，估计一个长度
- 表格如果有导出按钮，放在表格右上方
- 表格列中较大的数值要进行千分符格式化
- 表格操作列按钮如果三个以下采用 icon 图标加文字的形式，三个以上采用 icon 图标，鼠标悬停显示文字

#### 弹框样式
- `el-dialog__header`：标题栏高度 40px，标题加背景色 #f2f2f2
- `el-dialog__footer`：弹框按钮采用 mini 大小，按钮居中，其中蓝色按钮在左边，取消或者关闭按钮在右边，间隔 10px
- 内容边距 10px

#### echarts 图样式
- 根据实际需求设置

## 五、API 接口请求说明

### 5.1 接口请求规范

- 接口请求请根据 `src/api/modules`，创建【模块名】.js 文件，书写 api 接口集合
- 例如：`positionApiInvestment.js`

```javascript
let serviceName = "position-api-investment"
const API = {
  prodPositionStrategyRemove: serviceName + '/prodPositionStrategy/remove', // 删除回购策略
}
export default API
```

- 并根据模块名 XXX.md 接口文档和请求接口封装：`http.js`，处理接口请求
- 例如：

```javascript
let url = this.API.positionApiInvestment.prodPositionStrategyRemove
let param = {...}
await this.http.post(url, param, "application/json")
```

### 5.2 业务规则

- 在金融行业，`null`、`undefined` 是代表没有数据，应该转换成 `""`，而不是 `"0"`，0 会让用户误以为数值是 0

## 六、开发流程

### 6.1 样式与交互优化

- 全局样式（`src/styles/index.scss`）
- 表格样式优化
- 配置面板样式
- 响应式布局
- 加载状态提示
- 错误提示
- 成功提示
- 表单验证
- 数据格式化（金额、百分比等）

### 6.2 测试与优化

- 功能测试
- 兼容性测试（浏览器兼容性测试、数据边界处理）
- 性能优化（表格虚拟滚动（如数据量大）、防抖节流处理）

## 七、开发优先级

### 高优先级
- 主布局组件
- 数据表格组件
- Mock 数据服务
- 查询功能

### 中优先级
- 配置面板组件
- 试算意向功能
- 意向下达功能

### 低优先级
- 样式优化
- 性能优化
- 边界处理

## 八、模块开发

各模块的具体需求文档请参考对应的 `plan.md` 文件：
- 头寸规划模块：`src/views/position-planning/plan.md`

