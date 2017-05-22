import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import postcssModules from 'postcss-modules'
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import fs from 'fs'

const babelrc = JSON.parse(fs.readFileSync('./.babelrc'))
const cssExportMap = {}

export default {
  entry: 'src/carousel.js',
  dest: 'lib/bundle.min.js',
  format: 'umd',
  moduleName: 'react-pure-carousel',
  plugins: [
    postcss({
      extensions: ['.css'],
      plugins: [
        postcssModules({
          getJSON (id, exportTokens) {
            cssExportMap[id] = exportTokens
          }
        }),
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false }),
        cssnano()
      ],
      getExport (id) {
        return cssExportMap[id]
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['react', 'es2015-rollup'],
      plugins: babelrc.plugins,
      babelrc: false
    }),
    resolve({
      jsnext: true,
      main: true,
      preferBuiltins: false,
      browser: true
    }),
    uglify()
  ],
  external: [
    'react'
  ],
  globals: {
    react: 'React'
  }
}
