'use strict';

import common   from 'SolitaireCommon';
import defaults from 'defaults';

var rpr = {
			
	// Internal use
	_downupcards : function(a) {

		if(a.cards.length == 0) return false;
		
		var down = common.validateCardName(a.cards[a.cards.length  - 1].name);
		var up   = common.validateCardName(a.putDeck[0].card.name);
		if(!down || !up) return false;
		return {
			up   : up,
			down : down
		}
	},

	_downupranknum : function(a) {

		var du = rpr._downupcards(a);
		return du ? {
			down : defaults.card.ranks.indexOf(du.down.rank),
			up   : defaults.card.ranks.indexOf(du.up.rank)
		} : false;
	},

	_isFirst : function(a, _name) {
		if(a.cards.length == 0) {
			var _validate = null;
			return (
				(_validate = common.validateCardName(a.putDeck[0].card.name))
			 && _validate.rank == _name
			);
		}
	 	return true;
	},

	// Rules

	striped : function(a) {
		if(a.cards.length == 0) return true;

		var color_A = common.validateCardName(a.cards[a.cards.length - 1].name).color,
			color_B = null;

		var _validate = null;
		if(_validate = common.validateCardName(a.putDeck[0].card.name)) {
			color_B = _validate.color;
		}
		
		return color_A != color_B;
	},

	firstAce : function(a) {			
		return rpr._isFirst(a, "1");
	},

	firstKing : function(a) {
		return rpr._isFirst(a, "k");
	},

	notForEmpty : function(a) {
		return a.cards.length;
	},

	oneRank : function(a) {

		if(a.cards.length == 0) return true;
		var du = rpr._downupcards(a);
		return du && du.up.rank == du.down.rank;
	},
	
	oneSuit : function(a) {
		if(a.cards.length == 0) return true;
		var du = rpr._downupcards(a);
		return du && du.up.suit == du.down.suit;
	},

	any : function(a) {
		return true;
	},

	not : function(a) {
		return false;
	},

	ascendDeck : function(a) {//ascend deck by step
		
		if(a.putDeck.length == 1) return true;
		
		var ruleCorrect = true;
		for(var i in a.putDeck) {
			if(i > 0) {
				var down = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i - 1].card.name).rank
					),
					up   = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i].card.name).rank
					);
				
				ruleCorrect = ruleCorrect && 1 + down == up;
			}
		}
		return ruleCorrect;
	},

	descendDeck : function(a) {//ascend deck by step
		
		if(a.putDeck.length == 1) return true;
		
		var ruleCorrect = true;
		for(var i in a.putDeck) {
			if(i > 0) {
				var down = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i - 1].card.name).rank
					),
					up   = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i].card.name).rank
					);
				
				ruleCorrect = ruleCorrect && down == 1 + up;
			}
		}
		return ruleCorrect;
	},
	
	oneRankDeck : function(a) {
		
		if(a.putDeck.length == 1) return true;
		
		var ruleCorrect = true;
		for(var i in a.putDeck) {
			if(i > 0) {
				var down = common.validateCardName(a.putDeck[i - 1].card.name).suit,
					up   = common.validateCardName(a.putDeck[i].card.name).suit
				
				ruleCorrect = ruleCorrect && down == up;
			}
		}
		return ruleCorrect;
	},

	ascend : function(a) {
		
		if(a.cards.length == 0) return true;

		var da = rpr._downupranknum(a);
		return da && da.down < da.up;
	},

	descent : function(a) {
		
		if(a.cards.length == 0) return true;

		var da = rpr._downupranknum(a);
		return da && da.down > da.up;
	},

	descentOne : function(a) {// one step
		
		if(a.cards.length == 0) return true;

		var da = rpr._downupranknum(a);
		return da && da.down == 1 + da.up;
	},

	ascendOne : function(a) {// one step
		
		if(a.cards.length == 0) return true;

		var da = rpr._downupranknum(a);
		return da && 1 + da.down == da.up;
	},

	ascdescOne : function(a) {
		
		if(a.cards.length == 0) return true;

		var da = rpr._downupranknum(a);
		return da && Math.abs(da.down - da.up) == 1;
	},

	summ14     : function(a) {

		if(a.cards.length == 0) return true;

		var du = rpr._downupcards(a);
		return du.down.value + du.up.value == 14;
	}

};

export default rpr;