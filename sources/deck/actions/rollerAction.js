'use strict';

// import event      from 'event'     ;
// import share      from 'share'     ;
// import common     from 'common'    ;
// import defaults   from 'defaults'  ;

import deckAction from 'deckAction';

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		super.end();
	}
}

export default new rollerAction();