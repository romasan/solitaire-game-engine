'use strict';

// import event      from 'event';
// import share      from 'share';
// import defaults   from 'defaults';
// import common     from 'common';

import Group      from 'group';
import deckAction from 'deckAction';

class checkFullAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		if(data && data.query) {

			let _selectedDecks = [];

			if(data.query.groups) {

				for(let groupName of data.query.groups) {

					let _group = Group.getByName(groupName);

					let _decks = _group.getDecks();
				}

				if(data.query.select) {}
			}

			if(data.query.decks) {}
		}

		console.log('deckAction:run', data);

		super.end();
	}
}

export default new checkFullAction();