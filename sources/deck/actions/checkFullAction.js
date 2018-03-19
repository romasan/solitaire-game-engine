'use strict';

import {event}    from '../../common';

import Group      from '../../group' ;
import deckAction from './deckAction';

/**
 * Проверить заполнение определённых стопок
 */
class checkFullAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {
		
		const {
			eventData,
			actionData
		} = data;

		// if (
		// 	 eventData.to.name != deck.name &&
		// 	 actionData                     &&
		// 	!actionData.any
		// ) {
		// 	return false;
		// }

		if (
			actionData       &&
			actionData.query
		) {

			let _query = actionData.query;

			let _selectedDecks = [];

			if (_query.groups) {

				let _select = _query.select ? _query.select : 'all';

				for (let groupNameIndex in _query.groups) {

					let groupName = _query.groups[groupNameIndex];
					let _group = Group.getByName(groupName);

					if (_select == 'first') {

						let _deck = _group.getDeckByIndex(1);

						if (_deck) {
							_selectedDecks.push(_deck);
						}

					} else if (_select == 'last') {

						let _index = _group.decksCount;
						let _deck = _group.getDeckByIndex(_index);

						if (_deck) {

							let _index = _group.decksCount;
							let _deck = _group.getDeckByIndex(_index);

							_selectedDecks.push(_deck);
						}
					} else if (_select == 'all') {

						let _decks = _group.getDecks();

						_selectedDecks = _selectedDecks.concat(_decks);
					}
				}
			}

			if (_query.decks) {

				for (let deckNameIndex in _query.decks) {

					let deckName = _query.decks[deckNameIndex];
					let _deck = Deck.getByName(deckName);

					if (_deck) {
						_selectedDecks.push(_deck);
					}
				}
			}

			for (let deckIndex in _selectedDecks) {

				let deck = _selectedDecks[deckIndex];

				if (
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