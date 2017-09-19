'use strict'

import event        from '../common/event';
import share        from '../common/share';
import common       from '../common'      ;

import Field        from '../field'       ;
import history      from './'             ;
import redoAdvanced from './redoAdvanced' ;
import snapshot     from './snapshot'     ;

/*
 * stopRunHistory
 * startRunHistory
 * 
 * Events:
 *
 * addStep
 * saveSteps
 * doHistory
 * scanAttempts
 * appendLastStep
 * resetHistory
 * newGame
 * quickHistoryMove
 */

let stopRunHistory = e => {
	share.set('stopRunHistory', true);
};
event.listen('stopRunHistory', stopRunHistory);

let startRunHistory = e => {
	share.set('stopRunHistory', false);
};
event.listen('startRunHistory', startRunHistory);

let addStep = data => {
	
	if (data.step) {

		let stepId = history.add(data.step);

		if (typeof data.callback == "function") {
			data.callback(stepId);
		}
	} else {
		history.add(data);
	}
};
event.listen('addStep', addStep);

// save steps to client history
let saveSteps = e => {

	let data = history.get();

	// console.groupCollapsed('%c### saveSteps', 'font-weight: bold; color: green;');
	// console.log('%c' + JSON.stringify(data, true, 2), 'background: #cceacc;');
	// console.groupEnd();

	if (data.length) {
		event.dispatch('makeStep', data);
	} else {
		console.warn('Empty history to save.');
	}
};
event.listen('saveSteps', saveSteps);

let doHistory = e => {
	
	// if (share.get('noReplayHistory')) {
	// 	return;
	// }

	// console.groupCollapsed('DO HISTORY');
	console.log('%cDO HISTORY: STOP!', 'color: red;font-weight: bold;');
	return;

	share.set('inDoHistory', true);	

	// let _time = Date.now();

	// common.animationOff();
	if (!e || !e.data) {
		console.warn('doHistory data:', e);
	}

	// event.dispatch('stopRunHistory');
	common.animationOff();

	for (let i in e.data) {

		// share.set('noSave', true);
		event.dispatch('redo', e.data[i]);
		// share.set('noSave', false);

		if (
			!redoAdvanced.handle(e.data[i][0]) &&
			typeof e.callback == 'function'
		) {
			e.callback(e.data[i]);	
		}
	}

	common.animationDefault();

	event.dispatch('doHistory:end');

	setTimeout(Field.Redraw, 0);

	// let _decks = common.getElementsByType('deck');

	// console.log(((Date.now() - _time) / 1e3) + 's.');

	share.set('inDoHistory', false);			

	// console.groupEnd();
};
event.listen('doHistory', doHistory);

let scanAttempts = data => {

	// Field.clear();

	// console.groupCollapsed('scanAttempts');

	console.log('%cSCANATTEMPTS: STOP!', 'color: red; font-weight: bold;');
	return;

	// let _time = Date.now();

	event.dispatch('render:off');
	common.animationOff();
	share.set('noSave', true);	

	let stateDifferences = [];

	for (let attemptIndex in data.attempts) {

		let history = data.attempts[attemptIndex];

		// console.log('scanAttempts:attempts', attemptIndex, history);

		if (history) {

			let snap = snapshot.get();

			for (let i in history) {

				event.dispatch('redo', history[i]);

				redoAdvanced.handle(history[i][0]);
			}

			let snap2 = snapshot.get();

			stateDifferences.push(snapshot.diff(snap, snap2));

			if (
				attemptIndex < data.attempts.length - 1 &&
				typeof data.callback == "function"
			) {
				data.callback();
			}
		}
	}

	let summary = snapshot.summary(stateDifferences);

	event.dispatch('render:on');
	common.animationDefault();
	share.set('noSave', false);		

	if (typeof data.callback == "function") {
		data.callback();
	}

	snapshot.applyState(summary, {
		"flip" : "prevFlip"
	});

	// console.log(((Date.now() - _time) / 1e3) + 's.');

	// console.groupEnd();
};
event.listen('scanAttempts', scanAttempts);

let appendToLastStep = stepData => {
	
	event.dispatch('rewindHistory', data => {

		const {
			attemptId,
			history  ,
			redoSteps,
			undo     ,
			redo
		} = data;

		stopRunHistory();
		
		if(history.length == 0) {
			event.dispatch('addStep', stepData);
			return;
		}
		
		let lastStep = history[history.length - 1];

		lastStep.push(stepData);
		
		undo();
		
		event.dispatch('makeStep', lastStep);
		
		if (redoSteps.length > 1) {

			let _length = redoSteps.length - 1;

			for (let i = redoSteps.length - 2; i >= 0; i -= 1) {
				event.dispatch('makeStep', redoSteps[i]);
			}

			for(let i = 0; i < _length; i += 1) {
				undo();
			}
		}

		startRunHistory();
	})
};
event.listen('appendToLastStep', appendToLastStep);

let resetHistory = e => {
	history.reset();
};
event.listen('resetHistory', resetHistory);

let deleteHistory = steps => {
	history.delete(steps);
};
event.listen('deleteHistory', deleteHistory);

let newGame = e => {
	history.reset();
};
event.listen('newGame', newGame);

let quickHistoryMove = callback => {
	
	if (typeof callback) {

		common.animationOff();

		callback();

		common.animationOn();
	}
};
event.listen('quickHistoryMove', quickHistoryMove);