// 单独打包大依赖文件
// 先运行 webpack --config webpack.dll.js

const { resolve } = require('path');
const webpack = require('webpack');

const vendor = [
  "react",
  "react-dom",
  "react-router-dom",
];

module.exports = {
  entry: {
    dll: vendor
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: 'development'
}