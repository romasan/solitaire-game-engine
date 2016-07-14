'use strict';

// common
import share      from 'share';
import event      from 'event';
import defaults   from 'defaults';

// init
import Inputs     from 'inputs';
import Move       from 'move';
import forceMove  from 'forceMove';
import domManager from 'domManager';
import Field      from 'field';
import common     from 'common';
import winCheck   from 'winCheck';
import History    from 'history';

// import debug   from 'debug';

// var debug = null;
// if(dev) {
// 	debug = require('debug');
// }

// styles DOM
import 'common.scss';
import 'default_theme.scss';
import 'alternative_theme.scss';

exports.event    = event;
exports.options  = defaults;
exports.winCheck = winCheck.hwinCheck;

var firstInit = true;

exports.init = function(gameConfig) {

	event.dispatch('gameInit', {firstInit});

	if(firstInit) {
		firstInit = false;
	}

	var _field = Field(gameConfig);

	event.dispatch('gameInited');

	exports.Redraw = function(data) {
		_field.Redraw(data);
	}
};

// dev <-- process.env.MODE == 'dev'
if(dev) {
	var debug = require('debug');
	exports.debug = debug.default;
}
