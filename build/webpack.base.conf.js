var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let CompressionPlugin = require("compression-webpack-plugin");
const SvgSpriteLoaderPlugin = require('svg-sprite-loader/plugin');  // 引入 svg-sprite-loader 插件

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js','.vue','.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('../node_modules/_quill-image-drop-module@1.0.3@quill-image-drop-module')
        ],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      // 使用 svg-sprite-loader 来处理 SVG 文件
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader', // 优先处理 SVG 文件
        options: {
          symbolId: 'icon-[name]' // 使用文件名作为 symbolId
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /.(js|html)$/,
      threshold: 10240, // 大于 10KB 的文件会被压缩
      minRatio: 0.8, // 如果压缩比低于 0.8，则不进行压缩
    }),
    new SvgSpriteLoaderPlugin({ // 启用 SVG sprite 插件
      plainSprite: true // 使用内联 sprite 的模式
    })
  ]
}
