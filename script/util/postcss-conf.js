import extend from 'extend'
import path from 'path'
import { getDevConf } from './config'

var pluginList = [
  'postcss-easy-import',
  'precss',
  'postcss-pxtorpx',
  'rucksack-css',
  'postcss-assets',
  'autoprefixer',
  'cssnano'
]

export default () => {
  var config = getDevConf()
  var postcss = config['postcss'] || {}

  var usePlugins = pluginList.filter((pluginName) => {
    return postcss[pluginName] === undefined ? true : !!postcss[pluginName]
  })

  for (let name in postcss) {
    if (Object.prototype.toString.call(postcss[name]) !== '[object Object]') {
      postcss[name] = {}
    }
  }

  return {
    use: usePlugins,
    'postcss-easy-import': extend(true, {
      prefix: '_'
    }, postcss['postcss-easy-import']),
    precss: extend(true, {
      import: {
        disable: true
      }
    }, postcss['precss']),
    'postcss-pxtorpx': extend(true, {
      propWhiteList: []
    }, postcss['postcss-pxtorpx']),
    'rucksack-css': extend(true, {
      alias: false
    }, postcss['rucksack-css']),
    'postcss-assets': extend(true, {
      loadPaths: [path.join(process.cwd(), 'src')],
      basePath: 'src/',
      baseUrl: config.publicPath || '/',
      cachebuster: true
    }, postcss['postcss-assets']),
    autoprefixer: extend(true, {
      browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
    }, postcss['autoprefixer']),
    cssnano: extend(true, {
      safe: true,
      discardComments: {
        removeAll: true
      },
      filterPlugins: false
    }, postcss['cssnano'])
  }
}
