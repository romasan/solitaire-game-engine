'use strict';

import event  from '../common/event';
import common from '../common'      ;

import Deck   from '../deck'        ;

let revokeLength = null;

// Спецход
event.listen('specialStep', ({card, callback}) => {

	let cardName = card.name;

	event.dispatch('rewindHistory', data => {

		let index = -1;

		for(
			let i  = data.history.length - 1;
			    i >= 0                      ; // && index <= 0;
			    i -= 1
		) {

			let step = data.history[i];

			for(let atomIndex in step) {

				let atom = step[atomIndex];

				if(
					atom.move                     &&
					// atom.move.to   == deckName &&
					atom.move.deck[0] == cardName
				) {
					index = i;
				}
			}
		}

		let undoCount = index >= 0 ? data.history.length - index : 0;

		if(undoCount > 0) {

			revokeLength = data.redoSteps.length;

			common.animationOff();

			for(let i = 0; i < undoCount; i += 1) {
				data.undo();
			}

			common.animationOn();

			event.dispatch('specialStep:done');
		}

		if(typeof callback == "function") {
			callback(undoCount > 0);
		}
	});
});

// Отмена спецхода
event.listen('revokeSpecialStep', ({callback}) => {

	if(typeof callback == "function") {

		common.animationOff();

		callback();

		common.animationOn();
	} else {

		console.log('revokeSpecialStep TYPE 2');

		event.dispatch('rewindHistory', data => {

			console.log('rewindHistory', data.redoSteps.length - revokeLength, data.redoSteps.length, revokeLength);

			for(let i = data.redoSteps.length - revokeLength; i > 0; i -= 1) {
				console.log('>>> redo');
				data.redo();
			}
		});

		revokeLength = 0;
	}
});

event.listen('checkToCancelRevokeSpecialStep', callback => {
	if(typeof callback == "function") {
		callback(revokeLength);
	}
});