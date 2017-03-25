const webpack = require('webpack')
const merge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
// const SWPrecachePlugin = require('sw-precache-webpack-plugin')

const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')
const packageSpec = require('../package.json');

const config = merge(base, {
  resolve: {
    alias: {
      // 'create-api': './create-api-client.js'
    }
  },
  node: {
    fs: 'empty' // allow importing 'fs' module in dev: https://github.com/request/request/issues/1529
  },
  plugins: [
    new webpack.DefinePlugin({
      '__VERSION__': `'${packageSpec.version}'`,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // generate output HTML
    new HTMLPlugin({
      template: 'src/index.template.html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        ignoreCustomComments: [/vue-ssr-outlet/] // don't strip the comment required for Vue server-side rendering <!-- vue-ssr-outlet -->
      }
    })
  ]
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      },
      sourceMap: true
    })
    // }),
    // // auto generate service worker
    // new SWPrecachePlugin({
    //   cacheId: 'vue-hn',
    //   filename: 'service-worker.js',
    //   dontCacheBustUrlsMatching: /./,
    //   staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    // })
  )
}

module.exports = config
