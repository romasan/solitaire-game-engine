'use strict';

// common
import share         from './common/share'      ;
import event         from './common/event'      ;
import defaults      from './common/defaults'   ;

// init
import Move          from './move'              ;
import forceMove     from './move/forceMove'    ;
// import io            from './io'                ;
import styles        from './styles'            ;
import Inputs        from './io/inputs'         ;
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
import {Provider} from 'react-redux';
// import {Map} from 'immutable';

let preloadCallback = null,
    firstInit       = true;
	
exports.event     = event;
exports.options   = defaults;
exports.winCheck  = winCheck.hwinCheck;
exports.generator = deckGenerator;
exports.version   = version; // ? version.toString().split(9).slice(1).map(e => parseInt(e, 8)).join('.') : null;

exports.onload = callback => {
	preloadCallback = callback;
};

exports.onChangePreferences = callback => {
	// TODO
	share.set('changePreferencesCallback', callback);
};

exports.init = gameConfig => {
	
	console.groupCollapsed('gameConfig');
	console.log( JSON.stringify( gameConfig, true, 2 ) );	
	console.groupEnd();

	try {
		gameConfig = JSON.parse( JSON.stringify(gameConfig) );
	} catch (e) {
		console.warn('Game config is incorrect');
	}
	
	store.dispatch({
		"type" : actions.INIT_STATE,
		"data" : gameConfig
	});
	
	// console.groupCollapsed('state');
	// console.log( JSON.stringify( store.getState().toJS() , true, 2) );	
	// console.groupEnd();
	console.log( 'state#', store.getState().toJS() );

	// event.dispatch('gameInit', {
	// 	"firstInit" : firstInit
	// });

	// event.clearByTag(event.tags.inGame);
	// event.setTag    (event.tags.inGame);

	// Field.create(gameConfig);

	if (firstInit) {

		render(
			<Provider store={store}>
				<Field/>
			</Provider>,
			document.getElementById('map')
		);
	
		Inputs.init();

		firstInit = false;

		// if (typeof preloadCallback == 'function') {

		// 	let _data = share.get('gamePreferencesData');

		// 	preloadCallback(_data);
		// }

		// event.dispatch('firstInit');
	}

	// let changePreferencesCallback = share.get('changePreferencesCallback');

	// if (typeof changePreferencesCallback == 'function') {

	// 	let _data = share.get('gamePreferencesData');

	// 	changePreferencesCallback(_data, {
	// 		"stepType" : share.get('stepType')
	// 	});
	// }

	// event.dispatch('gameInited');

	// exports.Redraw = data => {
	// 	Field.Redraw(data);
	// }
};

if (dev) {
	console.log('Solitaire Engine v.', exports.version);
	let debug = require('./debug');
	exports.debug = debug.default;
}
