/**
 * 处理 wxss 样式表文件
 */

import glob from 'glob'
import mkdirp from 'mkdirp'
import colors from 'colors'
import leftPad from 'left-pad'
import postcss from 'postcss'
import path from 'path'
import fs from 'fs'
import getPostcssPlugins from '../util/postcss-plugins'

var projectRoot = process.cwd()
var srcRoot = path.join(projectRoot, 'src')

/**
 * css 文件编译
 * @param  {string} file 文件绝对路径
 * @return {promise}
 */
export function compileCssFile(file) {
  var postcssPlugins = getPostcssPlugins()
  var relativePath = path.relative(srcRoot, file)
  var fromPath = file
  var toPath = path.join(projectRoot, 'dist', relativePath)
  var source = fs.readFileSync(fromPath)
  return new Promise((resolve, reject) => {
    postcss(postcssPlugins)
      .process(source.toString(), {
        from: fromPath,
        to: toPath,
        map: {
          inline: false
        }
      })
      .then((result) => {
        mkdirp.sync(path.dirname(result.opts.to))
        fs.writeFileSync(result.opts.to, result.css)
        console.log(colors.bgBlue(`[postcss ${leftPad('output', 11)}]`), fromPath, '=>', toPath)
        resolve()
      })
      .catch((err) => {
        console.log(colors.bgRed(`[task ${leftPad('postcss', 14)}]`), err)
        reject()
      })
  })
}

export default () => {
  var csses = glob.sync('**/[!_]*.wxss', {
    nodir: true,
    cwd: path.join(projectRoot, 'src')
  })
  var compileCssFilePromises = []
  csses.forEach((it, idx) => {
    var compile = compileCssFile(path.join(projectRoot, 'src', it))
    compileCssFilePromises.push(compile)
  })
  return Promise.all(compileCssFilePromises)
}
