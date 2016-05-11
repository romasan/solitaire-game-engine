'use strict';

import defaults from 'defaults';

var shuffle = function(a) {
    for(var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {};
}

export default function(a) {

	var default_type = 'all';

	var default_shuffle = false;
	var max_iterations = 10;

	var type        = a && a.type       && typeof a.type       == 'string'                                  ? a.type       : default_type;
	var _deckCount  = a && a.deckCount  && typeof a.deckCount  == 'number'                                  ? a.deckCount  : 52;
	var _iterations = a && a.iterations && typeof a.iterations == 'number' && a.iterations < max_iterations ? a.iterations : 1;
	var _shuffle    = a && a.shuffle    && typeof a.shuffle    != 'undefuned'                               ? a.shuffle    : default_shuffle;

	var genType = function(_cardsColors, _cardsRanks) {
		var _deck = [];
		for(var c in _cardsColors) {
			for(var r in _cardsRanks) {
				_deck.push(_cardsColors[c] + _cardsRanks[r]);
			}
		}
		return _deck;
	}
	
	var _ranks = _deckCount == 36 ? defaults.card.ranks36 : defaults.card.ranks;
	if(a && a.ranks) {
		_ranks = []
		for(i in a.ranks) {
			if(defaults.card.rank.indexOf(a.ranks[i].toString()) >= 0) {
				_ranks.push(a.ranks[i].toString())
			}
		}
	}
	
	var genTypes = {
		all    : function() {
			return genType(defaults.card.suits, _ranks);
		},
		black  : function() {
			var _cardsSuits = defaults.card.colors.black;
			return genType(_cardsSuits, _ranks);
		},
		red    : function() {
			var _cardsSuits = defaults.card.colors.red;
			return genType(_cardsSuits, _ranks);
		},
		black_and_red  : function() {
			var _cardsSuits = [
				defaults.card.colors.red[(Math.random() * defaults.card.colors.red.length)|0], 
				defaults.card.colors.black[(Math.random() * defaults.card.colors.black.length)|0]
			];
			return genType(_cardsSuits, _ranks);
		},
		h_only : function() {
			var _cardsSuits = ['h'];
			return genType(_cardsSuits, _ranks);
		}, 
		d_only : function() {
			var _cardsSuits = ['d'];
			return genType(_cardsSuits, _ranks);
		}, 
		c_only : function() {
			var _cardsSuits = ['c'];
			return genType(_cardsSuits, _ranks);
		},
		s_only : function() {
			var _cardsSuits = ['s'];
			return genType(_cardsSuits, _ranks);
		},
		one_rank_only : function() {
			var _cardsSuits = [defaults.card.solors[(Math.random() * defaults.card.solors.length)|0]];
			return genType(_cardsSuits, _ranks);
		}
		
	}
	
	genTypes.hearts   = genTypes.h_only;
	genTypes.diamonds = genTypes.d_only;
	genTypes.clubs    = genTypes.c_only;
	genTypes.spades   = genTypes.s_only;
	
	var _deck = [];
	
	for(;_iterations > 0;_iterations -= 1) {
		_deck = _deck.concat(genTypes[type]());
	}

	if(_shuffle) {
		shuffle(_deck);
	}

	return _deck;

};
