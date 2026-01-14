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

- **Node.js**: 12.8.0
- **npm**: 10.8.1

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
