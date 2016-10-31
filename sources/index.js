'use strict';

// common
import share         from 'share';
import event         from 'event';
import defaults      from 'defaults';

// init
import Inputs        from 'inputs';
import Move          from 'move';
import forceMove     from 'forceMove';
import render        from 'render';
import Field         from 'field';
import common        from 'common';
import winCheck      from 'winCheck';
import History       from 'history';
import Tips          from 'tips';
import deckGenerator from 'deckGenerator';
import storage       from 'storage';

// styles DOM
import 'common.scss';
import 'default_theme.scss';
import 'alternative_theme.scss';

let preloadCallback = null,
    firstInit       = true;

exports.event     = event;
exports.options   = defaults;
exports.winCheck  = winCheck.hwinCheck;
exports.generator = deckGenerator;
exports.version   = version.toString().split(9).slice(1).map(e => parseInt(e, 8)).join('.');

exports.onload = (f) => {
	preloadCallback = f;
};

exports.onChangePreferences = (f) => {
	share.set('changePreferencesCallback', f);
};

// exports.getPreferences = () => {
// 	let _pref = storage.get('pref');
// };

exports.init = function(gameConfig) {

	event.dispatch('gameInit', {firstInit});

	
	event.clearByTag('new_game');
	event.setTag('new_game');

	Field.clear();
	Field.create(gameConfig);
	
	if(firstInit) {
		
		firstInit = false;
		
		if(typeof preloadCallback == "function") {
			let _data = share.get('gamePreferencesData');
			preloadCallback(_data);
		}

		let changePreferencesCallback = share.get('changePreferencesCallback');
		if(typeof changePreferencesCallback == "function") {
			let _data = share.get('gamePreferencesData');
			changePreferencesCallback(_data);
		}
	}

	event.dispatch('gameInited');

	exports.Redraw = function(data) {
		Field.Redraw(data);
	}
};

if(dev) {
	let debug = require('debug');
	exports.debug = debug.default;
}
