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

		if(data && data.actionData && data.actionData.query) {

			let _query = data.actionData.query;

			let _selectedDecks = [];

			if(_query.groups) {

				let _select = _query.select ? _query.select : 'all';

				for(let groupName of _query.groups) {

					let _group = Group.getByName(groupName);


					if(_select == 'first') {

						let _deck = _group.getDeckByIndex(1);

						if(_deck) {
							_selectedDecks.push(_decks[0]);
						}

					} else if(_select == 'last') {

						let _index = _group.decksCount;

						let _deck = _group.getDeckByIndex(_index);

						if(_deck) {

							let _index = _decks.length - 1;

							_selectedDecks.push(_decks[_index]);
						}
					} else if(_select == 'all') {
						
						let _decks = _group.getDecks();
						
						_selectedDecks.concat(_decks);
					}
				}

			}

			if(_query.decks) {

				for(let deckName of _query.decks) {

					let _deck = Deck.getByName(deckName);

					if(_deck) {
						_selectedDecks.push(_deck);
					}
				}
			}

			for(let deck of _selectedDecks) {
				deck.checkFull();
			}
		}

		console.log('deckAction:run', data);

		super.end();
	}
}

export default new checkFullAction();