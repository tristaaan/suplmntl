var webpack = require('webpack');

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
    path: './dist/js',
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
      }
    ]
  }
};
