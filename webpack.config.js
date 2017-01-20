/* eslint-disable */
var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './app/index.js',
  output: {
    path: './dist',
    filename: 'index.js',
  },
  module: {
    preLoaders: [{
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
    }],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015&presets[]=react']
      },
    ]
  }
};