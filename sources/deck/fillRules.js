'use strict';

import defaults  from 'defaults';
import common    from 'common';

import Deck      from 'deck';
import Tips      from 'tips';
import getBeside from 'getBeside';

let fillRules = {

	// Internal use (filters)

	_top : (deck) => {

		let card = deck.getTopCard();
		
		return card && common.validateCardName(card).rank;
	},

	_prev_next_desc_ask : (deck, type, callback) => {

		let _check = true;
		let _prev = getBeside(a.to)[type];
		let _topCard = deck.getTopCard();

		for(;_prev && _check;) {
			
			let _deck = Deck.getDeck(_prev);
			    _card = _deck.getTopCard();
			
			_check = _check && _card && callback(common.validateCardName(_topCard).value, common.validateCardName(_card).value|0);
			
			_topCard = _card;
			_prev = getBeside(_deck)[type];
		}

		return _check;
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

		return fillRules._top(deck) == defaults.card.ranks[0];
	},

	topKing : (deck) => {

		return fillRules._top(deck) == defaults.card.ranks[defaults.card.ranks.length - 1];
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

		return fillRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return up == (down|0) + 1;
		});
	},

	prevAscOne : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return (up|0) + 1 == down;
		});
	},

	nextDescOne : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return up == (down|0) + 1;
		});
	},

	nextAscOne : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return (up|0) + 1 == down;
		});
	},

	prevDesc : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return up > down;
		});
	},

	prevAsc : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'prev', (up, down) => {
			return up < down;
		});
	},

	nextDesc : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return up > down;
		});
	},

	nextAsc : (deck) => {

		return fillRules._prev_next_desc_ask(deck, 'next', (up, down) => {
			return up < down;
		});
	},
};

export default fillRules;