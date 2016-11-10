'use strict';

import deckAction from 'deckAction';

const stepType = 'twindeckStepType';

class twindeckAction extends deckAction {

	constructor() {
		super();
	}

	// TODO переделать
	run(deck, data) {

		// !data.actionData.dispatch
		super.end();
	}

}

export default new twindeckAction();