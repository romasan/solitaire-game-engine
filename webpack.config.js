'use strict';

const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var WebpackNotifierPlugin = require('webpack-notifier');

const gen = process.env.MODE == 'gen';
const dev = process.env.MODE == 'dev' || gen;

console.log('MODE:', process.env.MODE ? process.env.MODE : 'prod');

let _file = './package.json';
let _json = require(_file);

var config = {
	entry: "index",
	output: {
		path: "./frontend/js/",
		filename: "SolitaireEngine.js",
		library: "SolitaireEngine"
	},
	resolve: {
		modulesDirectories: [
			'./sources/'                           ,
			'./sources/autosteps/'                 ,
			'./sources/common/'                    ,
			'./sources/debug/'                     ,
			'./sources/debug/games/'               ,
			'./sources/debug/tests/'               ,
			'./sources/deck/'                      ,
			'./sources/deck/actions/'              ,
			'./sources/dom/'                       ,
			'./sources/dom/render/'                ,
			'./sources/group/'                     ,
			'./sources/group/generators/'          ,
			'./sources/group/generators/relations/',
			'./sources/history/'                   ,
			'./sources/preferences/'               ,
			'./sources/styles/'                    ,
			'./sources/tips/'                      
		],
		extensions: ['', '.js']
	},
	module: {
		loaders: [
		{
				test:	 /\.js$/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			},
			
			// {
			//	 test: /\.css$/,
			//	 loader: ExtractTextPlugin.extract('css!')
			// },
			
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css!sass')
			},
			
			{
				test:	 /\.(svg|png|jpg|jpeg|eot|ttf|woff|woff2)$/,
				loader: 'url=loader?limit=10000'
			},

			// {
			//	 test:	 /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
			//	 loader: 'file?name=../img/[name].[ext]'
			// }

			{
				test: /\.hamlc$/,
				loader: "hamlc-loader"
			}

			// {
			//	 test: /\.hamlc$/,
			//	 loader: "haml-loader"
			// }
		]
	},
	plugins: [
		
		new ExtractTextPlugin("../css/SolitaireEngine.css", {
			allChunks: true
		}),

		new webpack.DefinePlugin({
			dev
		}),

		new function() {
			this.apply = function(e) {
			  e.plugin('done', function() {
			    if(dev) {

	    			let fs = require('fs');
					let _ver = _json.version.split('.');
					_ver[_ver.length - 1] = (_ver[_ver.length - 1]|0) + 1;
					_json.version = _ver.join('.');
					fs.writeFile(_file, JSON.stringify(_json, null, 2));

			    }
			  });
			};
		},

		new WebpackNotifierPlugin({alwaysNotify: dev})
	]
};

if(dev) {

	if(gen) {
		// config.target = "node";
	} else {
		config.watch = true;
		config.watchOptions = {
			aggregateTimeout: 100
		};
		config.devtool = "source-map";

	}

} else {

	let preamble = `\
/*
 * ${_json.description}\n\
 *
 * Author            : ${_json.author} - <${_json.email}>
 * Version           : ${_json.version}
 * Build time        : ${new Date().toUTCString()}
 * Portyanka version : (v. 0.1.0) Oct 2015
 * Webpack version   : (v. 0.9.6) Feb 24 2016
 */`;
// * License           : ${_json.license}
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
				output: {
					preamble
				},
				compressor: {
					unsafe			 : true,
					drop_console : true,
					warnings		 : true
				}
		}));
};

module.exports = config;
