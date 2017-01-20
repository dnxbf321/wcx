import extend from 'extend'
import postcssEasyImport from 'postcss-easy-import'
import precss from 'precss'
import postcssPxtorpx from 'postcss-pxtorpx'
import rucksackCss from 'rucksack-css'
import postcssAssets from 'postcss-assets'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcssRepoter from 'postcss-reporter'
import getPostcssConf from './postcss-conf'
import { getDevConf } from './config'

export default () => {
  var postcssConf = getPostcssConf()
  var config = getDevConf()
  var enableConfig = extend({
    'postcss-easy-import': true,
    'precss': true,
    'postcss-pxtorpx': true,
    'rucksack-css': true,
    'postcss-assets': true,
    'autoprefixer': true,
    'cssnano': process.env.NODE_ENV !== 'development'
  }, config['postcss'] || {})

  var plugins = []
  if (enableConfig['postcss-easy-import']) {
    plugins.push(postcssEasyImport(postcssConf['postcss-easy-import'] || {}))
  }
  if (enableConfig['precss']) {
    plugins.push(precss(postcssConf.precss || {}))
  }
  if (enableConfig['postcss-pxtorpx']) {
    plugins.push(postcssPxtorpx(postcssConf['postcss-pxtorpx'] || {}))
  }
  if (enableConfig['rucksack-css']) {
    plugins.push(rucksackCss(postcssConf['rucksack-css'] || {}))
  }
  if (enableConfig['postcss-assets']) {
    plugins.push(postcssAssets(postcssConf['postcss-assets'] || {}))
  }
  if (enableConfig['autoprefixer']) {
    plugins.push(autoprefixer(postcssConf.autoprefixer || {}))
  }
  if (enableConfig['cssnano']) {
    plugins.push(cssnano(postcssConf.cssnano || {}))
  }

  return plugins
}
