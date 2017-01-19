import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import getBaseConfig from './webpack-base-conf'

export default () => {
  var baseConfig = getBaseConfig()
  return merge(baseConfig, {
    cache: true,
    devtool: '#cheap-source-map',
    output: {
      publicPath: '/'
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  })
}
