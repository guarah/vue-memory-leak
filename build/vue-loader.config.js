module.exports = {
  preserveWhitespace: false,
  postcss: [
    require('autoprefixer')({
      browsers: ['last 3 versions']
    })
  ],
  loaders: {
    scss: 'vue-style-loader!css-loader!sass-loader'
  },
  buble: {
    objectAssign: 'Object.assign', // I don't know why this needs to be here since it's already in webpack.base.config.js, but it won't accept spread operators if it's not
  }
}