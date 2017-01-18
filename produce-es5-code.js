var path = require('path')
var fs = require('fs')
var glob = require('glob')
var ncp = require('ncp').ncp
var mkdirp = require('mkdirp')
var babel = require('babel-core')

function getFiles() {
  var files = [];
  ['.*', '*'].forEach(function(pattern) {
    var paths = glob.sync(pattern, {
      cwd: __dirname,
      ignore: ['node_modules', 'log', 'tmp', '.git', '.DS_Store']
    })
    files = files.concat(paths)
  })
  return files
}

function copyPath(fromPath) {
  return new Promise(function(resolve, reject) {
    ncp(fromPath, path.join('../wcx-es5', fromPath), function(err) {
      if (err) {
        console.log(err)
        reject()
      } else {
        console.log('copy: ' + fromPath)
        resolve()
      }
    })
  })
}

function copy(files) {
  var copyPromises = []
  files.forEach(function(file) {
    copyPromises.push(copyPath(file))
  })
  return Promise.all(copyPromises)
}

function babelJs() {
  var jses = glob.sync('**/*.js', {
    cwd: __dirname,
    ignore: ['node_modules/**/*', 'tmp']
  })
  jses.forEach(function(js) {
    babel.transformFile(js, function(err, result) {
      fs.writeFile(path.join(__dirname, '../wcx-es5', js), result.code, function(err) {
        if (err) {
          console.log(err)
        }
      })
    })
  })
}

mkdirp.sync(path.join(__dirname, '../wcx-es5'))
var files = getFiles()
copy(files).then(babelJs)
