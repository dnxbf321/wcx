import path from 'path'
import colors from 'colors'
import leftPad from 'left-pad'
import webpack from 'webpack'
import progressBarWebpackPlugin from 'progress-bar-webpack-plugin'
import getDefinition from './webpack-definition'
import entry from './webpack-entry'
import { getDevConf } from '../util/config'
import babelrc from '../util/babelrc'

// 项目根目录
var projectRoot = process.cwd()
// wcx 根目录
var cliRoot = path.join(__dirname, '../../')
var srcRoot = path.join(projectRoot, 'src')

export default () => {
  var config = getDevConf()
  var definition = getDefinition()
  var baseConf = {
    context: srcRoot,
    entry: entry,
    watch: false,
    target: 'web',
    output: {
      filename: '[name].js?[hash]',
      chunkFilename: '[name].js?[chunkhash]',
      path: path.join(projectRoot, 'dist'),
      publicPath: path.join(config.publicPath, '/').replace(/\\/g, '/').replace(/\:\/([^\/])/i, '://$1')
    },
    resolve: {
      modules: [
        path.join(projectRoot, 'node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        path.join(cliRoot, 'node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [srcRoot],
          exclude: /node_modules/,
          use: [{
            loader: 'eslint-loader',
            options: {
              configFile: path.join(projectRoot, '.eslintrc.js'),
              formatter: require('eslint-friendly-formatter')
            }
          }],
          enforce: 'pre'
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: babelrc
          }]
        }, {
          test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 1,
              name: '[path][name].[ext]?[hash]'
            }
          }]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new progressBarWebpackPlugin({
        format: colors.bgCyan(`[webpack ${leftPad('build', 11)}]`) + '[:bar] ' + colors.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
      })
    ]
  }
  return baseConf
}
