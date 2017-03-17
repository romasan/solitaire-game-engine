'use strict';

import event from 'event';

event.listen('specialStep', card => {

	console.log('$$$', card);

	event.dispatch('rewindHistory', data => {

		console.log('###', data);

		let index = -1;

		for(let i = data.history.length -1; i > 0 && index < 0; i -= 1) {
			let step = data.history[i];
			console.log('###', card, i, step);
		}

		let undoCount = index >= 0 ? data.history.length - index - 1 : 0;

		for(let i = 0; i < undoCount; i += 1) {
			data.undo();
		}
	});
});