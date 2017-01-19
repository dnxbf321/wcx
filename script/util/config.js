import extend from 'extend'
import path from 'path'
import fs from 'fs'
import wcxConf from '../../wcx.json'

var projectRoot = process.cwd()
var projectConf = {}

try {
  projectConf = fs.readFileSync('wcx.json', {
    encoding: 'utf8'
  })
  projectConf = JSON.parse(projectConf.toString())
} catch ( e ) {
  console.log('[wcx          warn] wcx.json not found, all is default')
}

var config = extend(true, {}, wcxConf, projectConf)
var defaultConfig = config['default'];

export function getConf() {
  var envConfig = extend(true, {}, defaultConfig, config[process.env.NODE_ENV] || {}, {
    'process.env.NODE_ENV': process.env.NODE_ENV,
    version: Date.now()
  })
  return envConfig
}

export function getDevConf() {
  var devConf = extend(true, {}, getConf(), {
    ftp: config['ftp'],
    'serve-client-port': config['serve-client-port'],
    postcss: config['postcss'],
    webpack: config['webpack'] || {}
  })
  return devConf
}
