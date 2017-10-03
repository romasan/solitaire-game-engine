'use strict';

const webpack                 = require("webpack");
const path                    = require('path');
const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const LiveReloadPlugin        = require('webpack-livereload-plugin');
const WebpackNotifierPlugin   = require('webpack-notifier');

const dev = process.env.MODE == 'dev';

console.log('MODE:', process.env.MODE ? process.env.MODE : 'prod');

let _file = './package.json';
let _json = require(_file);

let _index = 1;

// let version = parseInt('9' + _json.version.split('.').map(e => parseInt(e).toString(8)).join(9));

// let directoryTree = require('directory-tree');
// let getTree = data => {

// 	let pathTree = [];
	
// 	data.children.forEach(child => {
// 		if(child.children) {
// 			pathTree.push('./' + child.path);
// 			pathTree = [...pathTree, ...getTree(child)];
// 		}
// 	})

// 	return pathTree;
// };
// let dirTree = ['./sources/', ...getTree( directoryTree('./sources/') )];

let config = {
	"entry": "./sources/index",
	"output": {
		"path"     : "./frontend/js/",
		"filename" : "SolitaireEngine.js",
		"library"  : "SolitaireEngine"
	},
	"module": {
		"loaders": [
			{
				"test"   :	 /\.js$/,
				"loader" : 'babel',
				"query"  : {
					"presets" : [
						'es2015',
						'react'
					]
				}
			},

			{
				"test"    : /\.scss$|\.css$/,
				"loader"  : ExtractTextPlugin.extract('style', 'css!sass')
			}

			// {
			// 	"test"   : /\.hamlc$/,
			// 	"loader" : "hamlc-loader"
			// }

			// {
			//	 test: /\.hamlc$/,
			//	 loader: "haml-loader"
			// }
		]
	},
	// "resolve": {
	// 	"alias" : {
	// 		immutable : "immutable/dist/immutable.min.js"
	// 	}
	// 	// "modulesDirectories" : dirTree,
	// 	"extensions" : ['.js', '.jsx']
	// },
	"plugins": [
		
		new ExtractTextPlugin("../css/SolitaireEngine.css", {
			"allChunks" : true
		}),

		new webpack.DefinePlugin({
			"dev"         : dev    ,
			"version"     : JSON.stringify(_json.version),
			"process.env" : {
				"NODE_ENV" : JSON.stringify('production')
			}
		}),

		// My plugin
		// new function() {
		function() {
			this.plugin('done', function() {
				if(dev) {

					let fs = require('fs');
					let _ver = _json.version.split('.');
					_ver[_ver.length - 1] = (_ver[_ver.length - 1]|0) + 1;
					_json.version = _ver.join('.');

					let _time = new Date().toUTCString();
					// _json.devBuildTime = _time;
					console.log('BUILD:', _json.version, _time, '#' + _index);
					_index += 1;

					fs.writeFile(_file, JSON.stringify(_json, null, 2));
				}
			});
		},

		new WebpackNotifierPlugin({
			"alwaysNotify" : dev
		})

		// new webpack.HotModuleReplacementPlugin()
	]
};

if(dev) {

	config.watch = true;
	config.watchOptions = {
		"aggregateTimeout": 100
	};

	config.devtool = "source-map";

	config.plugins.push(
		new LiveReloadPlugin({
			"appendScriptTag": true
		})			
	);
} else {

	config.devtool = "cheap-module-source-map";
	

	config.plugins.push(
		new OptimizeCssAssetsPlugin({
			"assetNameRegExp"     : "../css/SolitaireEngine.css$",
			"cssProcessor"        : require('cssnano'),
			"cssProcessorOptions" : {
				"discardComments" : {
					"removeAll" : true
				}
			},
			"canPrint"            : true
		})
	);

	let preamble = `\
/*
 * ${_json.description}\n\
 * Author     : ${_json.author} - <${_json.email}>
 * Version    : ${_json.version}
 * Build time : ${new Date().toUTCString()}
 */`;

 config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			"output": {
				"comments" : false   ,
				"preamble" : preamble
			},
			"compressor": {
				"unsafe"       : true ,
			//  "drop_console" : true ,
				"sequences"    : true ,
				"booleans"     : true ,
				"loops"        : true ,
				"unused"       : true ,
				"warnings"     : false
			}
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	"children" : true,
		// 	"async"    : true
		// })
		new webpack.optimize.DedupePlugin()
	);
};

module.exports = config;
