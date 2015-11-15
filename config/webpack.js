'use strict'

const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LessPluginCleanCSS = require('less-plugin-clean-css')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require('./gulp')

const ROOT_FOLDER = path.resolve(__dirname, '..')
const SRC_FOLDER = path.join(ROOT_FOLDER, 'client')
const DIST_FOLDER = path.join(ROOT_FOLDER, 'dist')

const vendors = [
  'babel-polyfill',
  'history',
  'react',
  'react-addons-linked-state-mixin',
  'react-dom',
  'react-router',
  'react-mixin',
  'redux',
  'redux-thunk',
  'redux-router',
  'isomorphic-fetch',
  'immutable',
  'react-bootstrap'
]

const entry = {
  app: [path.join(SRC_FOLDER, 'app/index.js')],
  vendors: vendors
}

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Scrumban',
    template: path.join(SRC_FOLDER, 'index.html')
  }),
  new webpack.NoErrorsPlugin(),

  // env
  new webpack.DefinePlugin({
    'process.env': {
      'API_URL': process.env.API_URL ? '"' + process.env.API_URL + '"' : undefined
    }
  }),

  // Vendors
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: config.isProduction ? 'script/vendors.[chunkhash].js' : 'script/vendors.js',
    minChunks: Infinity
  }),
  new ExtractTextPlugin(config.isProduction ? 'style/[name].[chunkhash].css' : 'style/[name].css')
]

if (config.isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true
  }))
}

const webpackConfig = {
  devtool: 'source-map',
  entry: entry,
  output: {
    publicPath: '/', // This is used for generated urls
    path: DIST_FOLDER,
    filename: config.isProduction ? 'script/[name].[chunkhash].js' : 'script/[name].js',
    chunkFilename: config.isProduction ? 'script/[name].[chunkhash].js' : undefined
  },
  plugins: plugins,
  resolveLoader: {
    'fallback': path.join(ROOT_FOLDER, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url-loader?limit=30000&name=/fonts/[name]-[hash].[ext]'
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: SRC_FOLDER
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less-loader?sourceMap'),
        lessPlugins: [
          new LessPluginCleanCSS({
            advanced: true
          })
        ]
      }
    ]
  }
}

module.exports = webpackConfig
