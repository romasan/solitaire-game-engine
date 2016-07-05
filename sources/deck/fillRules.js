'use strict';

import defaults from 'defaults';

import Deck      from 'addDeck';
import getBeside from 'getBeside';

let fr = {

	deckLength: (e)=>{
		
		return defaults.card.ranks.length <= a.deck.cards.length;
	},
	
	not: ()=>{
		
		return false;
	},

	// linePrevDesc: (a)=>{},
	
	// lineNextDesc: (a)=>{},
	
	// linePrevAsc: (a)=>{},
	
	// lineNextAsc: (a)=>{},
	
	// TODO
	// нужно вводить правила с параметрами
	// или унифицировать для разных генераторов
	prevDesc: (e)=>{

		let _check = true;
		let _prev = getBeside(a.to).prev;
		let _topCard = e.getTopCard();

		for(;_prev && _check;) {
			
			let _deck = Deck.Deck(_prev);
			
			_topCard = _deck.getTopCard();
			// _check = _check && _deck.fill;
			_prev = getBeside(_deck).prev;
		}
	}
	
	// lineAllNextDesc: (a)=>{},
	
	// lineAllPrevAsc: (a)=>{},
	
	// lineAllNextAsc: (a)=>{}
};

export default fr;