'use strict';

const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "index",
  output: {
    path: "./frontend/js/",
    filename: "SolitaireEngine.js",
    library:  "SolitaireEngine"
  },
  watch: true,
  watchOptions: {
		aggregateTimeout: 100
	},
	devtool: "source-map",
  resolve: {
		modulesDirectories: [
			'./sources/'                  ,
			'./sources/common/'           ,
			'./sources/group/'            ,
			'./sources/group/generators/' ,
			'./sources/deck/'             ,
			'./sources/deck/actions/'     ,
			'./sources/tips/'             ,
			'./sources/history/'          ,
			'./sources/dom/'              ,
			'./sources/dom/render/'       ,
			'./sources/styles/'       
		],
		extensions: ['', '.js']
  },
  module: {
    loaders: [
	  {
        test:   /\.js$/,
        loader: 'babel',
		query: {
			presets: ['es2015']
		}
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css!')
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract('style', 'css!sass')
      // },
      {
        test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=../img/[name].[ext]'
      }
    ]
  },
  plugins: [
  	new ExtractTextPlugin("../css/SolitaireEngine.css", {
  		allChunks: true
  	}),
  	new webpack.optimize.UglifyJsPlugin({
			drop_console: true,
			unsafe:       true
		})
  ]
};

let fs = require('fs');
let _file = './package.json';
let _json = require(_file);
let _ver = _json.version.split('.');
_ver[_ver.length - 1] = (_ver[_ver.length - 1]|0) + 1;
_json.version = _ver.join('.');
fs.writeFile(_file, JSON.stringify(_json, null, 2));




