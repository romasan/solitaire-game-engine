'use strict';

import defaults from 'defaults';

let shuffle = (a) => {
	for(let j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {};
}

export default function(a) {

	let default_type = 'all';

	let default_shuffle = false;
	let max_iterations = 10;

	let type        = a && a.type       && typeof a.type       == 'string'                                  ? a.type       : default_type;
	let _deckCount  = a && a.deckCount  && typeof a.deckCount  == 'number'                                  ? a.deckCount  : 52;
	let _iterations = a && a.iterations && typeof a.iterations == 'number' && a.iterations < max_iterations ? a.iterations : 1;
	let _shuffle    = a && a.shuffle    && typeof a.shuffle    != 'undefuned'                               ? a.shuffle    : default_shuffle;

	let genType = function(_cardsColors, _cardsRanks) {
		
		let _deck = [];
		
		for(let c in _cardsColors) {
			for(let r in _cardsRanks) {
				_deck.push(_cardsColors[c] + _cardsRanks[r]);
			}
		}
		
		return _deck;
	}

	let _ranks = _deckCount == 36 ? defaults.card.ranks36 : defaults.card.ranks;
	
	if(a && a.ranks) {
		_ranks = []
		for(i in a.ranks) {
			if(defaults.card.rank.indexOf(a.ranks[i].toString()) >= 0) {
				_ranks.push(a.ranks[i].toString())
			}
		}
	}

	let genTypes = {
		
		all    : () => {
			return genType(defaults.card.suits, _ranks);
		},
		
		black  : () => {
			let _cardsSuits = defaults.card.colors.black;
			return genType(_cardsSuits, _ranks);
		},
		
		red    : () => {
			let _cardsSuits = defaults.card.colors.red;
			return genType(_cardsSuits, _ranks);
		},
		
		black_and_red  : () => {
			let _cardsSuits = [
				defaults.card.colors.red[(Math.random() * defaults.card.colors.red.length)|0], 
				defaults.card.colors.black[(Math.random() * defaults.card.colors.black.length)|0]
			];
			return genType(_cardsSuits, _ranks);
		},
		
		h_only : () => {
			let _cardsSuits = ['h'];
			return genType(_cardsSuits, _ranks);
		}, 
		
		d_only : () => {
			let _cardsSuits = ['d'];
			return genType(_cardsSuits, _ranks);
		}, 
		
		c_only : () => {
			let _cardsSuits = ['c'];
			return genType(_cardsSuits, _ranks);
		},
		
		s_only : () => {
			let _cardsSuits = ['s'];
			return genType(_cardsSuits, _ranks);
		},
		
		one_rank_only : () => {
			let _cardsSuits = [defaults.card.solors[(Math.random() * defaults.card.solors.length)|0]];
			return genType(_cardsSuits, _ranks);
		}
	}

	genTypes.hearts   = genTypes.h_only;
	genTypes.diamonds = genTypes.d_only;
	genTypes.clubs    = genTypes.c_only;
	genTypes.spades   = genTypes.s_only;
	
	let _deck = [];

	for(;_iterations > 0;_iterations -= 1) {
		_deck = _deck.concat(genTypes[type]());
	}

	if(_shuffle) {
		shuffle(_deck);
	}

	return _deck;

};
