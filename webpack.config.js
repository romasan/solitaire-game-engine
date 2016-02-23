'use strict';

// const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
	entry: "./SolitaireEngine.main",
	output: {
		filename: "./js/SolitaireEngine.js",
		library: "SolitaireEngine"
	},

	watch: true,//NODE_ENV == 'development',

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: "cheap-inline-module-source-map",
	// devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

	plugins: [
		// new webpack.EnvironmentPlugin('NODE_ENV', 'USER')
		
		// new webpack.DefinePlugin({
		// 	NODE_ENV: JSON.stringify(NODE_ENV)
		// })
	],

	/*resolve: {
		modulesDirectories : ['node_modules'],
		extensions: ['', '.js']
	},

	resolveLoader: {
		modulesDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},*/

	/*module: {

		loaders: [{
			test: /\.js$/,
			// loader: 'babel?presets[]=es2015'
			loader: 'babel',
			query: {
				presets: ['es2015'],
				// optional: ['runtime'],
				plugins: ['transform-runtime']
			}
			// loader: 'babel-loader?optional[]=runtime'
			// loader: 'babel?optional[]=runtime'
			// loader: 'babel?presets[]=es2015&optional[]=runtime'
		}]

	}*/
};

// if(NODE_ENV == 'production') {

/*module.exports.plugins.push(
	new webpack.optimize.UglifyJsPlugin({
		warnings:     false,
		drop_console: true,
		unsafe:       true
	})
);*/

// }