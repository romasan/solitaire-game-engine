'use strict';

import event      from 'event'     ;

import Group      from 'group'     ;
import deckAction from 'deckAction';

class checkFullAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(
			data.eventData.to.name != deck.name &&
			!data.actionData.any
		) {
			return false;
		}

		if(data && data.actionData && data.actionData.query) {

			let _query = data.actionData.query;

			let _selectedDecks = [];

			if(_query.groups) {

				let _select = _query.select ? _query.select : 'all';

				for(let groupNameIndex in _query.groups) {

					let groupName = _query.groups[groupNameIndex];

					let _group = Group.getByName(groupName);

					if(_select == 'first') {

						let _deck = _group.getDeckByIndex(1);

						if(_deck) {
							_selectedDecks.push(_deck);
						}

					} else if(_select == 'last') {

						let _index = _group.decksCount;

						let _deck = _group.getDeckByIndex(_index);

						if(_deck) {

							let _index = _group.decksCount;

							let _deck = _group.getDeckByIndex(_index);

							_selectedDecks.push(_deck);
						}
					} else if(_select == 'all') {

						let _decks = _group.getDecks();

						_selectedDecks = _selectedDecks.concat(_decks);
					}
				}
			}

			if(_query.decks) {

				for(let deckNameIndex in _query.decks) {

					let deckName = _query.decks[deckNameIndex];

					let _deck = Deck.getByName(deckName);

					if(_deck) {
						_selectedDecks.push(_deck);
					}
				}
			}
			for(let deckIndex in _selectedDecks) {

				let deck = _selectedDecks[deckIndex];

				if(
					deck.checkFull()
				) {
					deck.Redraw();
				}
			}
		}

		event.dispatch('saveSteps', 'CHECKFULLACTION');

		super.end();
	}
}

export default new checkFullAction();