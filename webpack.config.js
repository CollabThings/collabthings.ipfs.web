var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const {
  VueLoaderPlugin
} = require('vue-loader')

const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  module: {
    rules: [
    {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'css': [
              'vue-style-loader',
              'css-loader'
            ]
          }
        }
      }    
    ]
  },
  output: {
    filename: 'main.min.js',
    path: __dirname + '/client/dist'
  },
  plugins: [
    new UnminifiedWebpackPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
            { from: './static' }
        ])
  ]
};

module.exports = config;

