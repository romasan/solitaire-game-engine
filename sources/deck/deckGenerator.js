'use strict';

import {defaults, event} from '../common';

import Card              from '../card'  ;

/**
 * Shuffle array
 * @param {*} deck 
 */
let shuffleArray = deck => {
	for (let j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
};

/**
 * Generation of an array of map names for certain colors and suits
 * @param {*} _cardsColors 
 * @param {*} _cardsRanks 
 */
let genType = (_cardsColors, _cardsRanks) => {

	let _deck = [];

	for (let cardColorIndex in _cardsColors) {

		let cardColor = _cardsColors[cardColorIndex];

		for (let cardRankIndex in _cardsRanks) {

			let cardRank = _cardsRanks[cardRankIndex];

			_deck.push(cardColor + cardRank);
		}
	}

	return _deck;
};

/**
 * Combinations of colors and suits
 */
let genTypes = {

	"all"    : ranks => genType(defaults.card.suits, ranks),

	"black"  : ranks => {

		let _cardsSuits = defaults.card.colors.black;

		return genType(_cardsSuits, ranks);
	},

	"red"    : ranks => {

		let _cardsSuits = defaults.card.colors.red;

		return genType(_cardsSuits, ranks);
	},

	"black_and_red" : ranks => {

		let _cardsSuits = [
			defaults.card.colors.red  [
				(Math.random() * defaults.card.colors.red  .length) | 0
			], 
			defaults.card.colors.black[
				(Math.random() * defaults.card.colors.black.length) | 0
			]
		];

		return genType(_cardsSuits, ranks);
	},

	"h_only" : ranks => {

		let _cardsSuits = ['h'];

		return genType(_cardsSuits, ranks);
	}, 

	"d_only" : ranks => {

		let _cardsSuits = ['d'];

		return genType(_cardsSuits, ranks);
	}, 
	
	"c_only" : ranks => {

		let _cardsSuits = ['c'];

		return genType(_cardsSuits, ranks);
	},

	"s_only" : ranks => {

		let _cardsSuits = ['s'];

		return genType(_cardsSuits, ranks);
	},

	"one_rank_only" : ranks => {

		let _cardsSuits = [
			defaults.card.solors[
				(Math.random() * defaults.card.solors.length) | 0
			]
		];

		return genType(_cardsSuits, ranks);
	},

	"hearts"        : ranks => genTypes.h_only(),

	"diamonds"      : ranks => genTypes.d_only(),

	"clubs"         : ranks => genTypes.c_only(),

	"spades"        : ranks => genTypes.s_only()
};

/**
 * @typedef {Object} generatorParameters
 * @property {?string} type
 * @property {?number} deckCount
 * @property {?number} iterations
 * @property {?boolean} shuffle
 * @property {?boolean} cardDescription
 * @property {?Array<string>} excludeCards
 */

/**
 * Generating an array of map names for specified parameters
 * @param {generatorParameters} data 
 */
let deckGenerator = data => {

	let default_type = 'all';

	let default_shuffle = false;

	let type            = data && typeof data.type            == 'string'                                       
		? data.type
		: default_type;

	let deckCount       = data && typeof data.deckCount       == 'number'                                       
		? data.deckCount
		: 52;

	let iterations      = data && typeof data.iterations      == 'number' // && data.iterations < max_iterations
		? data.iterations
		: 1;

	let shuffle         = data && typeof data.shuffle         != 'undefuned'                                    
		? data.shuffle
		: default_shuffle;

	let cardDescription = data && typeof data.cardDescription == 'boolean'                                      
		? data.cardDescription
		: false;

	let excludeCards = data && data.excludeCards;

	let _ranks = deckCount == 36
		? defaults.card.ranks36
		: defaults.card.ranks;

	if (data && data.ranks) {

		_ranks = [];

		for (i in data.ranks) {
			if ( defaults.card.rank.indexOf( data.ranks[i].toString() ) >= 0 ) {
				_ranks.push(data.ranks[i].toString());
			}
		}
	}

	let _deck = [];

	for (;iterations > 0;iterations -= 1) {
		_deck = _deck.concat(genTypes[type](_ranks));
	}

	if (shuffle) {
		shuffleArray(_deck);
	}

	if (excludeCards) {
		_deck = _deck.filter(e => excludeCards.indexOf(e) < 0);
	}

	if(cardDescription) {
		_deck = _deck.map(e => Card.validateCardName(e));
	}

	return _deck;
};

/**
 * deckGenerator - Listener
 */
event.listen('generateDeck', e => {

	if(typeof e.callback == "function") {
		e.callback( deckGenerator(e.data) );
	}
});

export default deckGenerator;
