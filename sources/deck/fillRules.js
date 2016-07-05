'use strict';

import defaults from 'defaults';

// import getBeside from 'getBeside';

let fr = {

	deckLength: (a)=> {
		
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
	prevDesc: (a)=>{

		// let _prev = a.deck.getRelationByName('beside', {type: 'prev', from: null});
		// let _check = true;

		// for(;_prev && _check;) {
			
		// 	let _beside = getBeside(a);
		// 	_prev = _beside.prev;
		// }
	}
	
	// lineAllNextDesc: (a)=>{},
	
	// lineAllPrevAsc: (a)=>{},
	
	// lineAllNextAsc: (a)=>{}
};

export default fr;