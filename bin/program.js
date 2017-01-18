import program from 'commander'
import pkg from '../package.json'
import aliasEnv from '../script/util/alias-env'
import pkgUpdate from '../script/util/pkg-update'
import taskInit from '../script/task/init'
import taskWebpack from '../script/task/webpack'
import taskCopy from '../script/task/copy'
import taskPostcss from '../script/task/postcss'
import taskGeneratePages from '../script/task/generate-pages'
import taskServeClient from '../script/task/serve-client'
import watchTask from '../script/task/watch'
import taskClean from '../script/task/clean'
import taskUpload from '../script/task/upload'
import taskPack from '../script/task/pack'

pkgUpdate()

function keyMapTask(key) {
  switch (key) {
    case 'init':
      return taskInitcase
    case 'webpack':
      return taskWebpack
    case 'copy':
      return taskCopy
    case 'postcss':
      return taskPostcss
    case 'generate-pages':
      return taskGeneratePages
    case 'serve-client':
      return taskServeClient
    case 'clean':
      return taskClean
    case 'upload':
      return taskUpload
    case 'pack':
      return taskPack
    default:
  }
}

function runTasks(list) {
  let idx = 0
  let exec = () => {
    return keyMapTask(list[idx])()
      .then(() => {
        idx += 1
        if (idx < list.length) {
          exec()
        }
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
  exec()
}

program.version(pkg.version)

program
  .command('init')
  .action(() => {
    taskInit()
  })

program
  .command('build')
  .description('produce dist files')
  .option('--watch', 'watch fs tree, work automaticly')
  .option('--serve', 'serve static files')
  .action((options) => {
    process.env.NODE_ENV = aliasEnv(program['node_env'])
    if (options.watch) {
      watchTask()
    }
    var tasks = ['clean', 'copy', 'webpack', 'postcss', 'generate-pages']
    if (options.serve) {
      tasks.push('serve-client')
    }
    runTasks(tasks)
  })

program
  .command('upload')
  .description('upload dist files to remote server')
  .action(() => {
    taskUpload()
  })

program
  .command('clean')
  .description('remove all tmp folders')
  .action(() => {
    taskClean()
  })

program
  .command('pack')
  .description('pack dist files')
  .action(() => {
    taskPack()
  })

program
  .option('-t, --tasks <items>', 'list tasks to exec', (val) => {
    return val.split(',')
  })
  .option('-e, --node_env [env]', 'define NODE_ENV, a string should be "development", "dev", "experiment", "exp", "production" or "prod"')

program.parse(process.argv)

if (program.tasks) {
  process.env.NODE_ENV = aliasEnv(program['node_env'])
  runTasks(program.tasks)
}
