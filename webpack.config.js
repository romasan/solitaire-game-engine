'use strict';

// const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path    = require('path');

module.exports = {
	entry: "index",
	// context: './src/',
	output: {
		// filename: "./js/SolitaireEngine.min.js",
		filename: "./build/SolitaireEngine.js",
		library:  "SolitaireEngine"
	},

	watch: true,//NODE_ENV == 'development',

	watchOptions: {
		aggregateTimeout: 100
	},

	// devtool: "cheap-inline-module-source-map",
	devtool: "source-map",
	// devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

	plugins: [],
		// new webpack.EnvironmentPlugin('NODE_ENV', 'USER')
		
		// new webpack.DefinePlugin({
		// 	NODE_ENV: JSON.stringify(NODE_ENV)
		// })
	// ],

	resolve: {
		// root : [
		// 	path.resolve('./extensions'),
		// 	path.resolve('./extensions/common')
		// ],
		modulesDirectories: [
			// /.*/,

			// './*/'  ,
			// './src/*/'  ,
			// './src/*/*/',
			// './src/*/*/*/',

			'./src/'                  ,
			'./src/common/'           ,
			'./src/group/'            ,
			'./src/group/generators/' ,
			'./src/deck/'             ,
			'./src/deck/actions/'     ,
			'./src/tips/'             ,
			'./src/history/'
		],
		extensions: ['', '.js']
	},

	/*
	resolveLoader: {
		modulesDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},*/

	module: {

		loaders: [{
			test: /\.js$/,
			// loader: 'babel?presets[]=es2015'
			loader: 'babel',
			query: {
				presets: ['es2015']//,
				// optional: ['runtime'],
				// plugins: [
					// "transform-runtime"//,
					//'transform-object-assign'
				// ]
			}
			// loader: 'babel-loader?optional[]=runtime'
			// loader: 'babel?optional[]=runtime'
			// loader: 'babel?presets[]=es2015&optional[]=runtime'
		}]

	}
};

// if(NODE_ENV == 'production') {

module.exports.plugins.push(
	new webpack.optimize.UglifyJsPlugin({
		// warnings:     false,
		drop_console: true,
		unsafe:       true
	})
);

// }
