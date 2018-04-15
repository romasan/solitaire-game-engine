'use strict';

// common
import {share, event, defaults} from './common';

import './common/imports';

import Field       from './field'   ;
import winCheck    from './wincheck';
import {generator} from './deck'    ;

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
exports.on        = (...e) => event.on   (...e);
exports.once      = (...e) => event.once (...e);
exports.emit      = (...e) => event.emit (...e);
exports.options   = defaults;
exports.winCheck  = winCheck.hwinCheck;
exports.generator = generator;
exports.version   = version
	? version
		.toString()
		.split(9)
		.slice(1)
		.map(
			e => parseInt(e, 8)
		)
		.join('.')
	: null;

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

	// Field.clear();
	Field.create(gameConfig);

	if (firstInit) {

		firstInit = false;

		if (typeof preloadCallback == 'function') {

			let _data = share.get('gamePreferencesData');

			preloadCallback(_data);
		}

		event.dispatch('firstInit');
	}

	let changePreferencesCallback = share.get('changePreferencesCallback');

	if (typeof changePreferencesCallback == 'function') {

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

if (dev) {
	console.log('Solitaire Engine v.', exports.version);
	let debug = require('./debug');
	exports.debug = debug.default;
}
