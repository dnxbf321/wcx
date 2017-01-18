import koa from 'koa'
import staticServe from 'koa-static'
import colors from 'colors'
import leftPad from 'left-pad'
import path from 'path'
import { getConf } from '../util/config'

var projectRoot = process.cwd()

export default () => {
  var config = getConf()
  var app = koa()

  // serve pure static assets
  app.use(function*(next) {
    var isStaticFile = /\.(js|css|png|jpg|gif|ico|woff|ttf|svg|eot)/.test(path.extname(this.req.url))
    if (isStaticFile) {
      this.res.setHeader('Access-Control-Allow-Origin', '*')
    }
    yield next
  })
  app.use(staticServe(path.join(projectRoot, 'dist/')))

  var PORT = config['dev-port'] || 9000
  return new Promise((resolve, reject) => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('serve-client', 14)}]`), err)
        reject()
      } else {
        console.log(colors.bgGreen(`[task ${leftPad('serve-client', 14)}]`), 'static files on port: ' + PORT)
        resolve()
      }
    })
  })
}
