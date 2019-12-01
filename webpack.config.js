const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
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
        loader: ['eslint-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};
