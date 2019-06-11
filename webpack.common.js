const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-transform-runtime'
                            ]
                        },
                    },
                ],
      },
      {
        test: /\.css$/,
        // include: path.resolve(__dirname, 'src'),
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              // sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        include: path.resolve(__dirname, 'src'),
        loader: "file-loader",
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  resolve: {
    // symlinks: false,
    extensions: ['.map', '.less', '.css','.js', '.jsx'],
    modules:    [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    alias:      {
      '@assets':   path.resolve(__dirname, 'src/assets'),
      '@':   path.resolve(__dirname, 'src'),
    },
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.[hash].js'
  },
  optimization: {
    splitChunks: {
        chunks: 'all'
      }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'src/favicon.png'))
  ]
};
