'use strict';

import defaults from 'defaults';
import common   from 'common';

import Deck      from 'deck';
import Tips      from 'tips';
import getBeside from 'getBeside';

let fr = {

	deckLength: (e)=>{
		
		return defaults.card.ranks.length <= a.deck.cards.length;
	},
	
	not: ()=>{
		
		return false;
	},

	noMoves: (a)=>{

		return !Tips.checkFrom(a.name);
	},

	_top: (a)=>{// filter

		let _card = e.getTopCard();
		return _card && common.validateCardName(_card).rank;
	},

	topAce: (e)=>{

		return fr._top() == '1';
	},

	topKing: (e)=>{

		return fr._top() == 'k';
	},

	_prev_next_desc_ask: (e, _type, _callback)=>{// filter

		let _check = true;
		let _prev = getBeside(a.to)[_type];
		let _topCard = e.getTopCard();

		for(;_prev && _check;) {
			
			let _deck = Deck.getDeck(_prev);
			_card = _deck.getTopCard();
			
			_check = _check && _card && _callback(common.validateCardName(_topCard).value, common.validateCardName(_card).value|0);
			
			_topCard = _card;
			_prev = getBeside(_deck)[_type];
		}

		return _check;
	},

	// prevDescOne: (e)=>{

	// 	let _check = true;
	// 	let _prev = getBeside(a.to).prev;
	// 	let _topCard = e.getTopCard();

	// 	for(;_prev && _check;) {
			
	// 		let _deck = Deck.Deck(_prev);
			
	// 		_card = _deck.getTopCard();
			
	// 		_check = _check && _card && common.validateCardName(_topCard).value == (common.validateCardName(_card).value|0) + 1;
			
	// 		_topCard = _card;

	// 		_prev = getBeside(_deck).prev;
	// 	}

	// 	return _check;
	// }

	prevDescOne: (e)=>{

		return fr._prev_next_desc_ask(e, 'prev', (u, d)=>{
			return u == (d|0) + 1;
		});
	},

	prevAscOne: (e)=>{

		return fr._prev_next_desc_ask(e, 'prev', (u, d)=>{
			return (u|0) + 1 == d;
		});
	},

	nextDescOne: (e)=>{

		return fr._prev_next_desc_ask(e, 'next', (u, d)=>{
			return u == (d|0) + 1;
		});
	},

	nextAscOne: (e)=>{

		return fr._prev_next_desc_ask(e, 'next', (u, d)=>{
			return (u|0) + 1 == d;
		});
	},

	prevDesc: ()=>{

		return fr._prev_next_desc_ask(e, 'prev', (u, d)=>{
			return u > d;
		});
	},
	prevAsc: ()=>{

		return fr._prev_next_desc_ask(e, 'prev', (u, d)=>{
			return u < d;
		});
	},
	nextDesc: ()=>{

		return fr._prev_next_desc_ask(e, 'next', (u, d)=>{
			return u > d;
		});
	},
	nextAsc: ()=>{

		return fr._prev_next_desc_ask(e, 'next', (u, d)=>{
			return u < d;
		});
	},
};

export default fr;