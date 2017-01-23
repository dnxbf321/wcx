import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import getBaseConfig from './webpack-base-conf'
import { getCustomConfig } from './webpack-base-conf'
import { getDevConf } from '../util/config'

export default () => {
  var config = getDevConf()
  var customConfig = getCustomConfig()
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
        output: {
          comments: false
        }
      })
    ]
      .concat(config.webpack.banner ?
        new webpack.BannerPlugin({
          banner: config.webpack.banner + ' | built at ' + new Date(config.version),
          entryOnly: true
        }) : [])
  }, customConfig)
}