'use strict';

import event from '../../common/event';

/*
 * run
 * end
 * break
 */
 
export default class deckAction {

	constructor() {}

	run() {}

	end() {
		event.dispatch('stopSession');
	}

	break() {
		// TODO
	}
}