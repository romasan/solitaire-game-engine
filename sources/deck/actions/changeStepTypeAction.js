'use strict';

import event      from 'event';
import share      from 'share';
import defaults   from 'defaults';
import common     from 'common';

import deckAction from 'deckAction';

class changeStepTypeAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		if(typeof data.actionData.to != "string") {
			return;
		} else {
			share.set('stepType', data.actionData.to);
		}

	}

}

export default new changeStepTypeAction();