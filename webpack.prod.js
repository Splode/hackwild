const merge = require('webpack-merge')
const UgligyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new UgligyJSPlugin({
      sourceMap: true
    })
  ]
})
