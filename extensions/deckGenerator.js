'use strict';

module.exports = function(main, share) {
	
	var shuffle = function(a) {

		// console.log('SHUFFLE:', a, typeof a);
    
	    for(var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {}
	    /*var y = 0, x = 1;
	    for(i in a) {
	        if(x > 13) {
	            x = 1;
	            y += 1;
	        }
	        a[i].y = y;
	        a[i].x = x;
	        x += 1
	    }*/
	    return a;
	}

	main.deckGenerator = function(a) {

		var default_type = 'all';

		var default_shuffle = false;
		var max_iterations = 10;

		var type        = a && a.type       && typeof a.type       == 'string'                                  ? a.type       : default_type;
		var _iterations = a && a.iterations && typeof a.iterations == 'number' && a.iterations < max_iterations ? a.iterations : 1;
		var _shuffle    = a && a.shuffle    && typeof a.shuffle    == 'boolean'                                 ? a.shuffle    : default_shuffle;

		var genType = function(_cardsColors, _cardsRanks) {
			var _deck = [];
			for(var c in _cardsColors) {
				for(var r in _cardsRanks) {
					_deck.push(_cardsColors[c] + _cardsRanks[r]);
				}
			}
			return _deck;
		}
		var _ranks = share.cardsRankS;
		if(a && a.ranks) {
			_ranks = []
			for(i in a.ranks) {
				if(share.cardsRankS.indexOf(a.ranks[i].toString()) >= 0) {
					_ranks.push(a.ranks[i].toString())
				}
			}
		}
		
		var genTypes = {
			all    : function() {
				return genType(share.cardsSuits, _ranks);
			},
			black  : function() {
				var _cardsSuits = share.cardColors.black;
				return genType(_cardsSuits, _ranks);
			},
			red    : function() {
				var _cardsSuits = share.cardColors.red;
				return genType(_cardsSuits, _ranks);
			},
			black_and_red  : function() {
				var _cardsSuits = [
					share.cardColors.red[(Math.random() * share.cardColors.red.length)|0], 
					share.cardColors.black[(Math.random() * share.cardColors.black.length)|0]
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
				var _cardsSuits = [share.cardsColors[(Math.random() * share.cardsColors.length)|0]];
				return genType(_cardsSuits, _ranks);
			}
		}
		
		var _deck = [];
		
		for(;_iterations > 0;_iterations -= 1) {
			_deck = _deck.concat(genTypes[type]());
		}

		if(_shuffle) {
			_deck = shuffle(_deck);
		}

		return _deck;

	}.bind(main);

};