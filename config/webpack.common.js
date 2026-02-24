const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const paths = require('./paths');

module.exports = {
  entry: [paths.src + '/index.js'],

  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: './',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Loading Styling',
      favicon: paths.src + '/images/favicon.png',
      template: paths.src + '/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/loading.html',
      filename: 'loading.html',
      inject: false,
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\/messages\/unread/,
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 10,
          },
        },
      ],
    }),
  ],

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'] },
      {
        test: /\.(scss|css)$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
            },
          },
        ],
      },
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
      { test: /\.(woff(2)?|eot|ttf|otf|svg)$/i, type: 'asset/inline' },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
    },
  },
};
