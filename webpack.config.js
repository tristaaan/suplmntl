var webpack = require('webpack');
var path = require('path');

function nodeEnv() {
  if (process.env.NODE_ENV) {
    return '\'' + process.env.NODE_ENV + '\'';
  }
  return '\'development\'';
}

var definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': nodeEnv(),
});

module.exports = {
  plugins: [definePlugin],
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
