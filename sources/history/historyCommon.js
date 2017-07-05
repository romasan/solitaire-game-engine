'use strict'

import event        from 'event'       ;
import common       from 'common'      ;

import history      from 'history'     ;
import redoAdvanced from 'redoAdvanced';

import share        from 'share'       ;

/*
 * Events:
 *
 * addStep
 * saveSteps
 * doHistory
 * resetHistory
 * newGame
 * quickHistoryMove
 */

event.listen('addStep', data => {

	if(data.step) {

		let stepId = history.add(data.step);

		if(typeof data.callback == "function") {
			data.callback(stepId);
		}
	} else {
		history.add(data);
	}
});

// save steps to client history
event.listen('saveSteps', e => {

	let data = history.get();

	// console.groupCollapsed('%c### saveSteps', 'font-weight: bold; color: green;');
	// console.log('%c' + JSON.stringify(data, true, 2), 'background: #cceacc;');
	// console.groupEnd();

	if(data.length) {
		event.dispatch('makeStep', data);
	} else {
		console.warn('Empty history to save.');
	}
});

event.listen('doHistory', e => {

	// console.groupCollapsed('DO HISTORY');
	// console.log('DO HISTORY', e);

	// common.animationOff();
	if(!e || !e.data) {
		console.warn('doHistory data:', e);
	}

	// event.dispatch('stopRunHistory');
	common.animationOff();

	// console.log('doHistory:start');
	for(let i in e.data) {

		event.dispatch('redo', e.data[i]);

		if(
			!redoAdvanced.handle(e.data[i][0]) &&
			typeof e.callback == 'function'
		) {
			e.callback(e.data[i]);	
		}
	}
	// console.log('doHistory:end');

	common.animationDefault();
	// event.dispatch('startRunHistory');

	// After doing history

	event.dispatch('doHistory:end');

	// let _decks = common.getElementsByType('deck');

	// for(let deckIndex in _decks) {}

	// console.groupEnd();
});

event.listen('resetHistory', e => {
	history.reset();
});

event.listen('deleteHistory', steps => {
	history.delete(steps);
});

event.listen('newGame', e => {
	history.reset();
});

event.listen('quickHistoryMove', callback => {

	if(typeof callback) {

		common.animationOff();

		callback();

		common.animationOn();
	}
})
