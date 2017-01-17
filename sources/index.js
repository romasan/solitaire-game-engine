'use strict';

// common
import share         from 'share'        ;
import event         from 'event'        ;
import defaults      from 'defaults'     ;

// init
import Inputs        from 'inputs'       ;
import Move          from 'move'         ;
import forceMove     from 'forceMove'    ;
import render        from 'render'       ;
import Field         from 'field'        ;
import common        from 'common'       ;
import winCheck      from 'winCheck'     ;
import History       from 'history'      ;
import Tips          from 'tips'         ;
import deckGenerator from 'deckGenerator';

let preloadCallback = null,
    firstInit       = true;

exports.event     = event;
exports.options   = defaults;
exports.winCheck  = winCheck.hwinCheck;
exports.generator = deckGenerator;
exports.version   = version.toString().split(9).slice(1).map(e => parseInt(e, 8)).join('.');

exports.onload = callback => {
	preloadCallback = callback;
};

exports.onChangePreferences = callback => {
	share.set('changePreferencesCallback', callback);
};

// exports.getPreferences = () => {
// 	let _pref = storage.get('pref');
// };

exports.init = gameConfig => {

	event.dispatch('gameInit', {firstInit});

	event.clearByTag(event.tags.inGame);
	event.setTag    (event.tags.inGame);

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

	exports.Redraw = data => {
		Field.Redraw(data);
	}
};

if(dev) {
	let debug = require('debug');
	exports.debug = debug.default;
}
