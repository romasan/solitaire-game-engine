'use strict';

import common   from 'common';
import defaults from 'defaults';

import Deck from 'addDeck';

var rpr = {
			
	// Internal use

	_downupcards: (a)=>{

		if(a.cards.length == 0) return false;
		
		let down = common.validateCardName(a.cards[a.cards.length  - 1].name);
		let up   = common.validateCardName(a.putDeck[0].card.name);
		
		if(!down || !up) return false;
		
		return {
			up   : up,
			down : down
		}
	},

	_downupranknum: (a)=>{

		let du = rpr._downupcards(a);
		
		return du ? {
			down : defaults.card.ranks.indexOf(du.down.rank),
			up   : defaults.card.ranks.indexOf(du.up.rank)
		} : false;
	},

	_isFirst: (a, _name)=>{
		
		if(a.cards.length == 0) {
		
			let _validate = null;
			
			return (
				(_validate = common.validateCardName(a.putDeck[0].card.name))
			 && _validate.rank == _name
			);
		}
	 	
	 	return true;
	},

	// Rules

	striped: (a)=>{
		
		if(a.cards.length == 0) return true;

		let color_A   = common.validateCardName(a.cards[a.cards.length - 1].name).color,
			color_B   = null,
			_validate = null;
		
		if(_validate = common.validateCardName(a.putDeck[0].card.name)) {
			color_B = _validate.color;
		}
		
		return color_A != color_B;
	},

	firstAce: (a)=>{			
		
		// let _rank = defaults.card.ranks[0];
		
		return rpr._isFirst(a, "1");
	},

	firstKing: (a)=>{
		
		// let _rank = defaults.card.ranks[defaults.card.ranks.length - 1];

		return rpr._isFirst(a, "k");
	},

	notForEmpty: (a)=>{
		
		return a.cards.length;
	},

	oneRank: (a)=>{

		if(a.cards.length == 0) return true;
		
		let du = rpr._downupcards(a);
		
		return du && du.up.rank == du.down.rank;
	},
	
	oneSuit: (a)=>{
		
		if(a.cards.length == 0) return true;
		
		let du = rpr._downupcards(a);
		
		return du && du.up.suit == du.down.suit;
	},

	any: (a)=>{
		
		return true;
	},

	not: (a)=>{
		
		return false;
	},

	ascendDeck: (a)=>{//ascend deck by step
		
		if(a.putDeck.length == 1) return true;
		
		let ruleCorrect = true;
		
		for(let i in a.putDeck) {

			if(i > 0) {

				let down = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i - 1].card.name).rank
					),
					up   = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i].card.name).rank
					);
				
				ruleCorrect = ruleCorrect && 1 + down == up;
			};
		};
		
		return ruleCorrect;
	},

	descendDeck: (a)=>{//ascend deck by step
		
		if(a.putDeck.length == 1) return true;
		
		let ruleCorrect = true;
		
		for(let i in a.putDeck) {
			
			if(i > 0) {

				let down = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i - 1].card.name).rank
					),
					up   = defaults.card.ranks.indexOf(
						common.validateCardName(a.putDeck[i].card.name).rank
					);
				
				ruleCorrect = ruleCorrect && down == 1 + up;
			};
		};

		return ruleCorrect;
	},
	
	oneRankDeck: (a)=>{
		
		if(a.putDeck.length == 1) return true;
		
		let ruleCorrect = true;

		for(let i in a.putDeck) {

			if(i > 0) {

				let down = common.validateCardName(a.putDeck[i - 1].card.name).suit,
					up   = common.validateCardName(a.putDeck[i].card.name).suit
				
				ruleCorrect = ruleCorrect && down == up;
			}
		};

		return ruleCorrect;
	},

	ascend: (a)=>{
		
		if(a.cards.length == 0) return true;

		let da = rpr._downupranknum(a);

		return da && da.down < da.up;
	},

	descent: (a)=>{
		
		if(a.cards.length == 0) return true;

		let da = rpr._downupranknum(a);

		return da && da.down > da.up;
	},

	descentOne: (a)=>{// one step
		
		if(a.cards.length == 0) return true;

		let da = rpr._downupranknum(a);

		return da && da.down == 1 + da.up;
	},

	ascendOne: (a)=>{// one step
		
		if(a.cards.length == 0) return true;

		let da = rpr._downupranknum(a);

		return da && 1 + da.down == da.up;
	},

	ascdescOne: (a)=>{
		
		if(a.cards.length == 0) return true;

		let da = rpr._downupranknum(a);

		return da && Math.abs(da.down - da.up) == 1;
	},

	sum14: (a)=>{

		if(a.cards.length == 0) return true;

		let du = rpr._downupcards(a);
		let _sum = du.down.value + du.up.value;

		return _sum == 14;
	},

	// TODO rules with params ??? or atom rules

	around: (a)=>{// {from, putDeck, cards}

		if(a.cards.length == 0) return true;

		let _around = a.from.deck.getRelationsByName('around', {from: null});
		let _parent = Deck.getDeckById(a.cards[0].parent);
		
		for(let i in _around) {

			if(_around[i].to == _parent.name) {
				return true;
			}
		}

		return false;		
	}

};

export default rpr;