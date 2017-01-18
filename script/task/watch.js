import path from 'path'
import watch from 'node-watch'
import colors from 'colors'
import leftPad from 'left-pad'
import taskWebpack from './webpack'
import { webpackEntry } from './webpack'
import taskPostcss from './postcss'
import { compileCssFile } from './postcss'
import { copyFile } from './copy'
import taskGeneratePages from './generate-pages'

var projectRoot = process.cwd()
var srcRoot = path.join(projectRoot, 'src')

function getEntry(file) {
  var ret = {}
  var filePath = path.relative(srcRoot, file)
  var entryName = filePath.slice(0, -7)
  entryName = entryName.replace(/\\/g, '/')
  ret[entryName] = './' + filePath
  return ret
}

export default () => {
  var watcher = watch(path.join(projectRoot, 'src'))
  watcher.on('change', (file) => {
    let basename = path.basename(file)
    if (/\.wcx\.js/i.test(basename)) { // webpack single entry
      var entry = getEntry(file)
      webpackEntry(entry)
    } else if (/\.js/i.test(basename)) { // webpack
      taskWebpack()
    } else if (/\.wxss/i.test(basename)) { // postcss single file
      compileCssFile(file)
    } else if (/\.css/i.test(basename)) { // postcss
      taskPostcss()
    } else { // copy
      copyFile(file)
      if (/.wxml/i.test(basename)) { // generate pages
        taskGeneratePages()
      }
    }
  })
  watcher.on('error', (err) => {
    console.log(colors.bgRed(`[task ${leftPad('watch', 14)}]`), err)
  })
  console.log(colors.bgGreen(`[task ${leftPad('watch', 14)}]`), 'watching')
}