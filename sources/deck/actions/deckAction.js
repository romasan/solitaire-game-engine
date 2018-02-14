'use strict';

import {event} from '../../common';
 
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