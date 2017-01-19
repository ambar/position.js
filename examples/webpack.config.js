const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolvePath = path.resolve.bind(null, __dirname)
const context = resolvePath('.')

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    template: 'index.html',
  }),
]

const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `'production'`,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compressor: {warnings: false},
      output: {comments: false},
    })
  )
}

module.exports = {
  context,
  plugins,
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      './index',
    ],
  },
  output: {
    path: resolvePath('dist'),
    publicPath: isProduction ? '/position.js/' : '/',
    filename: isProduction ? '[name].[hash].js' : '[name].js',
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          context,
          resolvePath('../src'),
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]-[hash:base64:4]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
}
