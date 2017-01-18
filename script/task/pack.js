import archiver from 'archiver'
import mkdirp from 'mkdirp'
import colors from 'colors'
import leftPad from 'left-pad'
import moment from 'moment'
import path from 'path'
import fs from 'fs'

var projectRoot = process.cwd()

function pack(zipName, patterns, ctx) {
  var pkg = require(path.join(projectRoot, 'package.json'))
  return new Promise((resolve, reject) => {
    patterns = [].concat(patterns)

    var zip = archiver.create('zip')
    var outputFilename = pkg.name + '-' + zipName + '_' + moment().format('YYYY-MM-DDTHH-mm-ss') + '.zip'
    var output = fs.createWriteStream(path.join(projectRoot, 'zip', outputFilename))
    output.on('close', () => {
      console.log(colors.bgGreen(`[task ${leftPad('pack', 14)}]`), outputFilename + ' has been finalized. ' + zip.pointer() + ' total bytes')
      resolve()
    })
    zip.on('error', (err) => {
      console.log(colors.bgRed(`[task ${leftPad('pack', 14)}]`), err)
      reject()
    })
    zip.pipe(output)
    patterns.forEach((pattern) => {
      zip.glob(pattern, {
        cwd: ctx,
        ignore: ['*.log*', 'node_modules', 'node_modules/**/*', 'zip', 'zip/**/*', 'log', 'log/**/*', 'tmp', 'tmp/**/*', '.git', '.git/**/*']
      })
    })
    zip.finalize()
  })
}

export default () => {
  mkdirp(path.join(projectRoot, 'zip'))
  return pack('static', '**/*', path.join(projectRoot, 'dist'))
}
