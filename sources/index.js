'use strict';

// common
import share      from 'share';
import event      from 'event';
import defaults   from 'defaults';

// init
import Inputs        from 'inputs';
import Move          from 'move';
import forceMove     from 'forceMove';
import domManager    from 'domManager';
import Field         from 'field';
import common        from 'common';
import winCheck      from 'winCheck';
import History       from 'history';
import Tips          from 'tips';
import deckGenerator from 'deckGenerator';

// import debug   from 'debug';

// var debug = null;
// if(dev) {
// 	debug = require('debug');
// }

// styles DOM
import 'common.scss';
import 'default_theme.scss';
import 'alternative_theme.scss';

exports.event     = event;
exports.options   = defaults;
exports.winCheck  = winCheck.hwinCheck;
exports.generator = deckGenerator;

var firstInit = true;

exports.init = function(gameConfig) {

	// event.log();

	event.dispatch('gameInit', {firstInit});

	if(firstInit) {
		firstInit = false;
	}
	
	event.clearByTag('new_game');
	event.setTag('new_game');

	// console.log('***************************');

	Field.clear();
	Field.create(gameConfig);

	event.dispatch('gameInited');

	exports.Redraw = function(data) {
		Field.Redraw(data);
	}
};

// dev <-- process.env.MODE == 'dev'
if(dev) {
	var debug = require('debug');
	exports.debug = debug.default;
}
