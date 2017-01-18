/**
 * 清理 dist、zip 目录
 */

import rimraf from 'rimraf'
import colors from 'colors'
import leftPad from 'left-pad'
import path from 'path'

var projectRoot = process.cwd()

export default () => {
  rimraf.sync(path.join(projectRoot, 'dist'))
  rimraf.sync(path.join(projectRoot, 'zip'))
  console.log(colors.bgGreen(`[task ${leftPad('clean', 14)}]`), 'done')
  return Promise.resolve()
}
