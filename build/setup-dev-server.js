const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

module.exports = function setupDevServer(app, callback) {
  let bundle;
  let template;

  // modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })
  app.use(devMiddleware)
  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem
    const filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      template = fs.readFileSync(filePath, 'utf-8');
      bundle && callback(bundle, template);
    }
  })

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (error, stats) => {
    if (error) throw error
    stats = stats.toJson()
    stats.errors.forEach(error => console.error(error))
    stats.warnings.forEach(error => console.warn(error))

    // read bundle generated by vue-ssr-webpack-plugin
    const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-bundle.json');
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'));
    template && callback(bundle, template);
  })
}