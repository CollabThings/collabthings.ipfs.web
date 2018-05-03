var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const {
  VueLoaderPlugin
} = require('vue-loader')

const config = {
  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  output: {
    filename: 'main.min.js',
    path: __dirname + '/client/dist'
  },
  plugins: [
    new UnminifiedWebpackPlugin(),
    new VueLoaderPlugin()
  ]
};

module.exports = config;
