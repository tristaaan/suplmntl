var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './app/index.js',
  output: {
    path: './dist',
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015&presets[]=react']
      },
    ]
  }
};