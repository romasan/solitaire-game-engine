'use strict';

import event            from 'event';
import share            from 'share';
import defaults         from 'defaults';
import common           from 'common';

// import deckAction       from 'deckAction';
import lockActionCommon from 'lockActionCommon';

// class lockAction extend deckAction {}
export default (deck, data) => {

	if(data.eventData.to.name != deck.name) {
		return false;
	}

	lockActionCommon(data.actionData, 'lock', deck.name);
};