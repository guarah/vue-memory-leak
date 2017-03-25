const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRPlugin = require('vue-ssr-webpack-plugin')

const base = require('./webpack.base.config')
const packageSpec = require('../package.json');

module.exports = merge(base, {
  target: 'node',
  devtool: '#source-map',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      // 'create-api': './create-api-server.js'
    }
  },
  externals: Object.keys(packageSpec.dependencies),
  plugins: [
    new webpack.DefinePlugin({
      '__VERSION__': `'${packageSpec.version}'`,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRPlugin()
  ]
})
