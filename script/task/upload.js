import scp from 'scp2'
import glob from 'glob'
import extend from 'extend'
import colors from 'colors'
import leftPad from 'left-pad'
import fs from 'fs'
import path from 'path'
import { getDevConf } from '../util/config'

var distRoot = path.join(process.cwd(), 'dist')

export default () => {
  var config = getDevConf()
  var remotePath = config.ftp.remotePath
  var options = {
    port: 22,
    host: config.ftp.host,
    username: config.ftp.username,
    password: config.ftp.password
  }
  var client = new scp.Client(options)
  return new Promise((resolve, reject) => {
    client.mkdir(remotePath, () => {
      scp.scp(distRoot, extend(options, {
        path: remotePath
      }), (err) => {
        if (err) {
          console.log(colors.bgRed(`[task ${leftPad('upload', 14)}]`), err)
          reject()
        } else {
          console.log(colors.bgCyan.bold(`[task ${leftPad('upload', 14)}]`), distRoot + ' => ' + remotePath)
          resolve()
        }
        client.close()
      })
    })
  })
}
