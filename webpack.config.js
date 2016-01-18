var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './public/pages/main.js',
  output: {
    path: './public/dist',
    filename: 'index.js',
  },
  module: {
    preLoaders: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel"
      }
    ],
    loaders: [
      { 
        test: './public/js/',
        loader: 'babel' 
      }
    ]
  }
};