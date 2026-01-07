// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 0 : 0,
    // js语句结尾必须使用分号
    'semi': ['off', 'always'],
    // 三等号
    'eqeqeq': 0,
    // 强制在注释中 // 或 /* 使用一致的空格
    'spaced-comment': 0,
    // 关键字后面使用一致的空格
    'keyword-spacing': 0,
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': 0,
    // 引号类型
    "quotes": [0, "single"],
    // 禁止出现未使用过的变量
    // 'no-unused-vars': 0,
    // 要求或禁止末尾逗号
    'comma-dangle': 0,
    // "semi": [2, "always"], // 强制语句分号结尾
    // "indent": [
    //   "error",
    //   2
    // ], // 强制缩进2 spaces
    "no-new": [0], // 不允许new一个实例后不赋值或不比较
    "camelcase": [0, {
      "properties": "never"
    }], // 关闭驼峰命名规则
    "no-cond-assign": 2, //条件语句的条件中不允许出现赋值运算符
  }
}
