const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const vueConfig = require('./vue-loader.config')



module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? '#hidden-source-map' : '#cheap-module-eval-source-map',
  entry: {
    app: './src/entry-client.js',
    vendor: Object.keys(require('../package.json').dependencies)
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    exprContextCritical: false, // prevent this warning: "Critical dependency: the request of a dependency is an expression"
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules/,
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  plugins: process.env.NODE_ENV === 'production' ? [] : [new FriendlyErrorsPlugin()]
}
