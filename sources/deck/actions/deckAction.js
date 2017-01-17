'use strict';

import event from 'event';

/*
 * run
 * end
 * break
 */
 
export default class deckAction {
	
	constructor() {}

	run() {}

	end() {
		// console.log('end action:', this._actionName);
		event.dispatch('stopSession');
	}

	break() {
		// TODO
	}
}