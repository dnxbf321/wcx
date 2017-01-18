import path from 'path'
import glob from 'glob'

var srcRoot = path.join(process.cwd(), 'src')

var ret = {}
var entries = glob.sync(srcRoot + '/**/*.wcx.js', {
  cwd: srcRoot
})
entries.forEach((it) => {
  var filePath = path.relative(srcRoot, it)
  var entryName = filePath.slice(0, -7)
  entryName = entryName.replace(/\\/g, '/')
  ret[entryName] = './' + filePath
})

export default ret
