'use strict';

import event from 'event';

import Deck  from 'deck';

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

			for(let i = 0; i < undoCount; i += 1) {
				data.undo();
			}

			event.dispatch('specialStep:done');
		}

		if(typeof callback == "function") {
			callback(undoCount > 0);
		}
	});
});