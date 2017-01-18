import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import getBaseConfig from './webpack-base-conf'
import { getDevConf } from '../util/config'

export default () => {
  var config = getDevConf()
  return merge(getBaseConfig(), {
    stats: {
      children: false
    },
    cache: false,
    devtool: false,
    output: {
      filename: '[name].js?[chunkhash]'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    ]
      .concat(config.webpack.banner ?
        new webpack.BannerPlugin(config.webpack.banner + ' | built at ' + new Date(config.version), {
          entryOnly: true
        }) : [])
  })
}