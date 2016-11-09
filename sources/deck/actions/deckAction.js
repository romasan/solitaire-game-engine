'use strict';

import event from 'event';

export default
class deckAction {
	
	constructor() {}

	run() {}

	end() {
		event.dispatch('stopSession');
	}
}