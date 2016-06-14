'use strict';

const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const dev = process.env.MODE == 'dev';

let config = {
  entry: "index",
  output: {
    path: "./frontend/js/",
    filename: "SolitaireEngine.js",
    library:  "SolitaireEngine"
  },
  watchOptions: {
		aggregateTimeout: 100
	},
  resolve: {
		modulesDirectories: [
			'./sources/'                            ,
			'./sources/common/'                     ,
      './sources/debug/'                      ,
      './sources/debug/games/'                ,
      './sources/debug/tests/'                ,
      './sources/deck/'                       ,
      './sources/deck/actions/'               ,
      './sources/deck/autosteps/'             ,
      './sources/dom/'                        ,
      './sources/dom/render/'                 ,
      './sources/group/'                      ,
      './sources/group/generators/'           ,
      './sources/group/generators/relations/' ,
      './sources/history/'                    ,
      './sources/preferences/'                ,
      './sources/styles/'                     ,
      './sources/tips/'                       
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
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract('css!')
      // },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test:   /\.(svg|png|jpg|jpeg|eot|ttf|woff|woff2)$/,
        loader: 'url=loader?limit=10000'
      }
      // {
      //   test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      //   loader: 'file?name=../img/[name].[ext]'
      // }
    ]
  },
  plugins: [
  	new ExtractTextPlugin("../css/SolitaireEngine.css", {
  		allChunks: true
  	}),
    new webpack.DefinePlugin({
      'dev': dev
    })
  ]
};

let _file = './package.json';
let _json = require(_file);

if(dev) {

  config.watch = true;
  config.devtool = "source-map";

  let fs = require('fs');
  let _ver = _json.version.split('.');
  _ver[_ver.length - 1] = (_ver[_ver.length - 1]|0) + 1;
  _json.version = _ver.join('.');
  fs.writeFile(_file, JSON.stringify(_json, null, 2));
} else {

  let preamble = `\
/* \n\
 * ${_json.description}\n\
 * author: ${_json.author} - <${_json.email}>\n\
 * Version: ${_json.version}\n\
 * Build date: ${new Date().toUTCString()}\n\
 * Portyanka version (v. 0.1) Oct. 2015\n\
 * Webpack version (v. 0.9.6) Feb. 24 2016\n\
 */\
`;
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        output: {
          preamble
        },
        compressor: {
          unsafe       : true,
          drop_console : true,
          warnings     : true
        }
    }));
};

module.exports = config;