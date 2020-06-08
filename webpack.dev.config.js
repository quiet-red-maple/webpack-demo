
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 设置nodejs环境变量
process.env.NODE_ENV = 'development';

const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-preset-env')()
      ]
    }
  },
]

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'js/[name].js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader]
          },
          {
            test: /\.less$/,
            use: [
              ...commonCssLoader,
              // 将less编译成css文件
              'less-loader'
            ]
          },
          {
            test: /\.(jsx|js)$/,
            exclude: /node_modules/,
            use: [
              // 开启多进程打包。
              // 进程启动大概600ms,进程通信也有开销
              // 只有工作消耗时间比教长，才需要多进程打包
              // {
              //   loader: 'thread-loader',
              //   options: {
              //     workers: 2 // 进程2个
              //   }
              // }, 
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    "@babel/preset-react",
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3
                        },
                        targets: {
                          chrome: '60',
                          firefox: '60',
                          ie: '9',
                          safari: '10',
                          edge: '17'
                        }
                      }
                    ]
                  ],
                  cacheDirectory: true
                }
              }
            ],
          },
          {
            test: /\.(jpg|png|jpeg|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 12 * 1024,
              // 旧版本webpack 假如出现[object Module]片是commonjs
              // 问题url-loader默认使用了而es6模块化解析，而html-loder引入图
              // 解决关闭url-loader的es6模块化，使用commonjs解析
              // esModule: false
              // [hash:10]取图片的hash前10位
              // [ext]  取文件原来的扩展名
              name: '[hash:10].[ext]',
              outputPath: 'imgs'
            }
          },
          {

            test: /\.html$/,
            // 处理html文件中的img图片（负责引入img,从而能被url-loder进行处理）
            loader: 'html-loader',
          },
          // 打包其他资源（除了html/js/css资源以外的资源）
          {
            // 排除css/js/json/less/html资源
            exclude: /\.(css|js|json|less|html|png|jpeg|gif|jpg)$/,
            loader: 'file-loader',
            options: {
              name: '[hash:10].[ext]',
              outputPath: 'media'
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/index.[contenthash:10].css'
    }),
    new optimizeCssAssetsWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    new AddAssetHtmlWebpackPlugin([
      { filepath: resolve(__dirname, 'dll/dll.js') },
      // { filepath: resolve(__dirname, 'dll/antd.js') }
    ])
  ],

  // 解析模块规则
  resolve: {
    // 配置解析模块路径别名: 优点简写路径，缺点路径没有提示
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // 配置省略文件路径的后缀名
    extensions: ['.js', '.json', '.css', '.jsx'],
    // 告诉webpack 解析模块是去找哪个目录
    // modules: [
    //   resolve(__dirname, './node_modules'),
    //   'node_modules'
    // ]
  },

  devServer: {
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    port: 5000,
    open: true,
    hot: true,
    // 单页面路由时启用
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  devtool: 'eval-source-map',
  mode: 'development'
}