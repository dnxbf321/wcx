import path from 'path'
import glob from 'glob'
import fs from 'fs'
import colors from 'colors'
import leftPad from 'left-pad'

var projectRoot = process.cwd()

export default () => {
  var pkg = fs.readFileSync('package.json', {
    encoding: 'utf8'
  })
  pkg = JSON.parse(pkg.toString())

  var app = fs.readFileSync('src/app.json', {
    encoding: 'utf8'
  })
  app = JSON.parse(app.toString())

  var wxmls = glob.sync('**/*.wxml', {
    nodir: true,
    cwd: path.join(projectRoot, 'src')
  })
  var pages = wxmls.map((wxml) => {
    return wxml.replace('.wxml', '')
  })
  // 将指定的入口页面作为 pages 第一项
  if (pkg.main) {
    pages.unshift(pkg.main)
    var rIdx = pages.lastIndexOf(pkg.main)
    if (rIdx > 0) {
      pages.splice(rIdx, 1)
    }
  }
  app.pages = pages
  fs.writeFileSync(path.join(projectRoot, 'dist/app.json'), JSON.stringify(app))
  console.log(colors.bgGreen(`[task ${leftPad('generate-pages', 14)}]`), 'done')
  return Promise.resolve()
}
