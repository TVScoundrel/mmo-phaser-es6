const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
var path = require('path')

var serverConfig = {
  target: 'node',
  entry: "./_server/index.js",
  watch: true,
  output: {
    path: path.resolve(__dirname, 'bin/server'),
    filename: 'index.js'
  }
}

var clientConfig = {
  target: 'web',
  entry: "./_client/index.js",
  watch: true,
  output: {
    path: path.resolve(__dirname, 'bin/client'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new HtmlWebpackPlugin({template: './_client/index.html'})
  ]
}

module.exports = [ clientConfig ];