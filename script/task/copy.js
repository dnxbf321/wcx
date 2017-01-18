/**
 * 将 src 拷贝到 dist 目录
 * 排除 wxss、css、.wcx.js、.log、DS_Store 文件
 */

import path from 'path'
import colors from 'colors'
import leftPad from 'left-pad'
import { ncp } from 'ncp'

var projectRoot = process.cwd()
var srcRoot = path.join(projectRoot, 'src')

export default () => {
  return new Promise((resolve, reject) => {
    ncp(path.join(projectRoot, 'src'), path.join(projectRoot, 'dist'), {
      filter(name) {
        let basename = path.basename(name)
        return !/(\.wxss)|(\.css)|(\.js)|(\.log)|(ds_store)/i.test(basename)
      }
    }, (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('copy', 14)}]`), err)
        reject()
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('copy', 14)}]`), 'done')
        resolve()
      }
    })
  })
}

export function copyFile(file) {
  var filePath = path.relative(srcRoot, file)
  var toPath = path.join(projectRoot, 'dist', filePath)
  ncp(file, toPath, (err) => {
    if (err) {
      console.log(colors.bgRed(`[task ${leftPad('copy', 14)}]`), err)
    } else {
      console.log(colors.bgGreen(`[task ${leftPad('copy', 14)}]`), file, '=>', toPath)
    }
  })
}
