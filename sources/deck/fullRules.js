'use strict';

import defaults  from 'defaults';
import common    from 'common';

import Group     from 'group';
import Deck      from 'deck';
import Tips      from 'tips';
import getBeside from 'getBeside';

let fullRules = {

	// Internal use (filters)

	_top : (deck) => {

		let card = deck.getTopCard();
		
		return card && common.validateCardName(card);
	},

	_prev_next_desc_ask : (deck, type, callback) => {

		let _check = true;
		let _prev = getBeside(a.to)[type];
		let _topCard = deck.getTopCard();

		for(;_prev && _check;) {
			
			let _deck = Deck.getDeck(_prev);
			    _card = _deck.getTopCard();
			
			_check = _check && _card && callback(
				common.validateCardName(_topCard).value    ,
				common.validateCardName(_card)   .value | 0
			);
			
			_topCard = _card;
			_prev = getBeside(_deck)[type];
		}

		return _check;
	},

	_query : (deck, data) => {

		// query : {
		// 	all : {
		// 		groups : ["matGroup1", "matGroup2", "matGroup3", "matGroup4"],
		// 		excludeParent : true,
		// 		select : "first",
		// 	},
		// 	rules : ["topAce"]
		// }

		let groupName = deck.parent;
		let currentGroup = Group.getByName(groupName);

		// all | any
		if(data.all) {
			for(let i in data.all.groups) {
				let _group = Group.getByName(data.all.groups[i])
				if(data.all.excludeParent && data.all.groups[i] == groupName) {

				} else {
					if(data.all.select == "first") {
						// TODO select deck with index 1
					} else
					if(data.all.select == "second") {} else
					if(data.all.select == "last") {}
				}
			}
		}
		if(data.any) {}
		// groups
		// 	select: first | second | last | all
		// decks
		// rules
		for(let i in data.rules) {

		}
		return false;
	},

	// Rules

	deckLength : (deck) => {
		
		return defaults.card.ranks.length <= deck.cards.length;
	},
	
	not : () => {
		
		return false;
	},

	noMoves : (deck) => {

		return !Tips.checkFrom(deck.name);
	},

	topAce : (deck) => {

		return fullRules._top(deck).rank == defaults.card.ranks[0];
	},

	topKing : (deck) => {

		let lastIndex = defaults.card.ranks.length - 1

		return fullRules._top(deck).rank == defaults.card.ranks[lastIndex];
	},

	//  prevDescOne: (deck) => {

	// 	let _check = true;
	// 	let _prev = getBeside(a.to).prev;
	// 	let _topCard = deck.getTopCard();

	// 	for(;_prev && _check;) {
			
	// 		let _deck = Deck.Deck(_prev);
			
	// 		_card = _deck.getTopCard();
			
	// 		_check = _check && _card && common.validateCardName(_topCard).value == (common.validateCardName(_card).value|0) + 1;
			
	// 		_topCard = _card;

	// 		_prev = getBeside(_deck).prev;
	// 	}

	// 	return _check;
	// }

	prevDescOne : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return up == (down|0) + 1;
		});
	},

	prevAscOne : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return (up|0) + 1 == down;
		});
	},

	nextDescOne : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return up == (down|0) + 1;
		});
	},

	nextAscOne : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return (up|0) + 1 == down;
		});
	},

	prevDesc : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return up > down;
		});
	},

	prevAsc : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return up < down;
		});
	},

	nextDesc : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return up > down;
		});
	},

	nextAsc : (deck) => {

		return fullRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return up < down;
		});
	},
};

export default fullRules;