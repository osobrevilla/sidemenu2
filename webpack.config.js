"use strict";
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: "./src/js/sidemenu.js",
  output: {
    filename: "sidemenu.js",
    path: path.resolve(__dirname, "dist"),
    library: "SMSideMenu",
    libraryTarget: "umd",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader"
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      inject: "head",
      template: "./index.html"
    })
  ],
  devServer: {
    hot: true,
    open: true,
    contentBase: path.join(__dirname, "dist")
  }
};

switch (process.env.NODE_ENV) {
  case "development":
    config.devtool = "inline-source-map";
    config.plugins = config.plugins.concat([
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]);
    break;
  default:
    break;
}

module.exports = config;
