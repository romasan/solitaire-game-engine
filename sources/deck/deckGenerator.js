'use strict';

import defaults from 'defaults';

let shuffle = deck => {
	for(let j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x) {};
};

let genType = (_cardsColors, _cardsRanks) => {

	let _deck = [];

	for(let cardColor of _cardsColors) {
		for(let cardRank of _cardsRanks) {
			_deck.push(cardColor + cardRank);
		}
	}

	return _deck;
};

let genTypes = {

	all    : (_ranks) => genType(defaults.card.suits, _ranks),

	black  : (_ranks) => {

		let _cardsSuits = defaults.card.colors.black;

		return genType(_cardsSuits, _ranks);
	},

	red    : (_ranks) => {

		let _cardsSuits = defaults.card.colors.red;

		return genType(_cardsSuits, _ranks);
	},

	black_and_red  : (_ranks) => {

		let _cardsSuits = [
			defaults.card.colors.red[(Math.random() * defaults.card.colors.red.length)|0], 
			defaults.card.colors.black[(Math.random() * defaults.card.colors.black.length)|0]
		];

		return genType(_cardsSuits, _ranks);
	},

	h_only : (_ranks) => {

		let _cardsSuits = ['h'];

		return genType(_cardsSuits, _ranks);
	}, 

	d_only : (_ranks) => {

		let _cardsSuits = ['d'];

		return genType(_cardsSuits, _ranks);
	}, 
	
	c_only : (_ranks) => {

		let _cardsSuits = ['c'];

		return genType(_cardsSuits, _ranks);
	},

	s_only : (_ranks) => {

		let _cardsSuits = ['s'];

		return genType(_cardsSuits, _ranks);
	},

	one_rank_only : (_ranks) => {

		let _cardsSuits = [defaults.card.solors[(Math.random() * defaults.card.solors.length)|0]];

		return genType(_cardsSuits, _ranks);
	},

	hearts        : (_ranks) => genTypes.h_only(),

	diamonds      : (_ranks) => genTypes.d_only(),

	clubs         : (_ranks) => genTypes.c_only(),

	spades        : (_ranks) => genTypes.s_only()
};

export default data => {

	let default_type = 'all';

	let default_shuffle = false;
	let max_iterations = 10;

	let type        = data && data.type       && typeof data.type       == 'string'                                     ? data.type       : default_type;
	let _deckCount  = data && data.deckCount  && typeof data.deckCount  == 'number'                                     ? data.deckCount  : 52;
	let _iterations = data && data.iterations && typeof data.iterations == 'number' && data.iterations < max_iterations ? data.iterations : 1;
	let _shuffle    = data && data.shuffle    && typeof data.shuffle    != 'undefuned'                                  ? data.shuffle    : default_shuffle;

	let _ranks = _deckCount == 36
		? defaults.card.ranks36
		: defaults.card.ranks;

	if(data && data.ranks) {

		_ranks = []

		for(i in data.ranks) {
			if(defaults.card.rank.includes(data.ranks[i].toString())) {
				_ranks.push(data.ranks[i].toString())
			}
		}
	}

	let _deck = [];

	for(;_iterations > 0;_iterations -= 1) {
		_deck = _deck.concat(genTypes[type](_ranks));
	}

	if(_shuffle) {
		shuffle(_deck);
	}

	return _deck;
};
