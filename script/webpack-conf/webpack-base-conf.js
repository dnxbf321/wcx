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
    output: {
      filename: '[name].js?[hash]',
      chunkFilename: '[name].js?[chunkhash]',
      path: path.join(projectRoot, 'dist'),
      publicPath: path.join(config.publicPath, '/').replace(/\\/g, '/').replace(/\:\/([^\/])/i, '://$1')
    },
    resolve: {
      extensions: ['', '.js'],
      root: [path.join(projectRoot, 'node_modules')],
      fallback: [path.join(cliRoot, 'node_modules')]
    },
    resolveLoader: {
      root: [path.join(cliRoot, 'node_modules')],
      fallback: [path.join(projectRoot, 'node_modules')]
    },
    module: {
      preLoaders: [{
        test: /\.js$/,
        loader: 'eslint',
        include: srcRoot,
        exclude: /node_modules/
      }],
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: babelrc
      }, {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: '[path][name].[ext]?[hash]'
        }
      }]
    },
    eslint: {
      configFile: path.join(projectRoot, '.eslintrc.js'),
      formatter: require('eslint-friendly-formatter')
    },
    babel: babelrc,
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new webpack.optimize.OccurenceOrderPlugin(),
      new progressBarWebpackPlugin({
        format: colors.bgCyan(`[webpack ${leftPad('build', 11)}]`) + '[:bar] ' + colors.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
      })
    ]
  }
  return baseConf
}
