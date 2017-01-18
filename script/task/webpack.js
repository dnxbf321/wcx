/**
 * 处理 *.wcx.js 结尾的文件
 */

import webpack from 'webpack'
import colors from 'colors'
import leftPad from 'left-pad'
import getProdConf from '../webpack-conf/webpack-prod-conf'
import getDevConf from '../webpack-conf/webpack-dev-conf'
import merge from 'webpack-merge'

export default () => {
  return new Promise((resolve, reject) => {
    var wpConfig = process.env.NODE_ENV === 'development' ? getDevConf() : getProdConf()
    var compiler = webpack(wpConfig)
    compiler.run((err, stats) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('webpack', 14)}]`), err)
        reject()
      } else {
        console.log(colors.bgGreen(`[webpack ${leftPad('output', 11)}]`), stats.toString('normal'))
        resolve()
      }
    })
  })
}

export function webpackEntry(entry) {
  var wpConfig = merge(getDevConf(), {
    entry: entry
  })
  var compiler = webpack(wpConfig)
  compiler.run((err, stats) => {
    if (err) {
      console.log(colors.bgRed(`[task ${leftPad('webpack', 14)}]`), err)
    } else {
      console.log(colors.bgGreen(`[webpack ${leftPad('output', 11)}]`), stats.toString('normal'))
    }
  })
}
