var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './public/pages/main.js',
  output: {
    path: './public/dist',
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