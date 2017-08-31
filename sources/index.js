'use strict';

// common
import share         from './common/share'      ;
import event         from './common/event'      ;
import defaults      from './common/defaults'   ;

// init
import Move          from './move'              ;
import forceMove     from './move/forceMove'    ;
import io            from './io'                ;
import Field         from './field'             ;
import common        from './common'            ;
import winCheck      from './wincheck'          ;
import History       from './history'           ;
import Tips          from './tips'              ;
import genNextCards  from './tips/genNextCards' ;
import deckGenerator from './deck/deckGenerator';

import actions       from './actions'           ;
import store         from './store'             ;

import React from 'react';
import ReactDOM, {render} from 'react-dom';

let preloadCallback = null,
    firstInit       = true;
	
exports.event     = event;
exports.options   = defaults;
exports.winCheck  = winCheck.hwinCheck;
exports.generator = deckGenerator;
exports.version   = version ? version.toString().split(9).slice(1).map(e => parseInt(e, 8)).join('.') : null;

exports.onload = callback => {
	preloadCallback = callback;
};

exports.onChangePreferences = callback => {
	share.set('changePreferencesCallback', callback);
};

exports.init = gameConfig => {
	
	console.log('gameConfig', gameConfig);
	
	store.dispatch({
		type: actions.INIT_STATE,
		data: gameConfig
	});
	
	console.log( 'state', JSON.stringify( store.getState().app.toJS() , true, 2) );

	render(
		<Field/>,
		document.getElementById('map')
	);

	return;


	// event.dispatch('gameInit', {
	// 	"firstInit" : firstInit
	// });

	// event.clearByTag(event.tags.inGame);
	// event.setTag    (event.tags.inGame);

	// Field.create(gameConfig);
	store.dispatch(actions.INIT_STATE);	

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

	// exports.Redraw = data => {
	// 	Field.Redraw(data);
	// }
};

if (dev) {
	console.log('Solitaire Engine v.', exports.version);
	let debug = require('./debug');
	exports.debug = debug.default;
}
