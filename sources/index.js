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

/*
 * Exports:
 *
 * event
 * options
 * winCheck
 * generator
 * version
 * onload
 * onChangePreferences
 * init
 * Redraw
 * debug
 */

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

exports.init = gameConfig => {

	event.dispatch('gameInit', {
		"firstInit" : firstInit
	});

	event.clearByTag(event.tags.inGame);
	event.setTag    (event.tags.inGame);

	Field.clear();
	Field.create(gameConfig);

	if(firstInit) {

		firstInit = false;

		if(typeof preloadCallback == 'function') {
			let _data = share.get('gamePreferencesData');
			preloadCallback(_data);
		}

	}

	let changePreferencesCallback = share.get('changePreferencesCallback');

	if(typeof changePreferencesCallback == 'function') {
		let _data = share.get('gamePreferencesData');
		changePreferencesCallback(_data, {
			"stepType" : share.get('stepType')
		});
	}

	event.dispatch('gameInited');

	exports.Redraw = data => {
		Field.Redraw(data);
	}
};

if(dev) {
	console.log('Solitaire Engine v.', exports.version);
	let debug = require('debug');
	exports.debug = debug.default;
}
