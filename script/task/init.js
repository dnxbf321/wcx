import path from 'path'
import clone from 'git-clone'
import colors from 'colors'
import leftPad from 'left-pad'
import glob from 'glob'
import rimraf from 'rimraf'

export default () => {
  var found = glob.sync('@(*|.*)')

  if (found.length) {
    console.log(colors.bgRed(`[task ${leftPad('init', 14)}]`), 'this folder is not empty')
  } else {
    console.log(colors.bgGreen(`[task ${leftPad('init', 14)}]`), 'wait seconds to download the template')
    clone('https://github.com/dnxbf321/wcx-template.git', process.cwd(), (err) => {
      if (err) {
        console.log(colors.bgRed(`[task ${leftPad('init', 14)}]`), err)
      } else {
        rimraf.sync(path.join(process.cwd(), '.git'))
        console.log(colors.bgGreen(`[task ${leftPad('init', 14)}]`), 'done')
      }
    })
  }
}
