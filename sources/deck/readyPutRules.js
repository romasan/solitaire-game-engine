'use strict';

import common    from 'common'   ;
import defaults  from 'defaults' ;

import Deck      from 'deck'     ;
import getBeside from 'getBeside';

/*

Relations filters:

 * linePrev
 * lineNext

Internal use:

 * _down_up_cards
 * _down_up_rank_num

Rules:

 * striped
 * firstAce
 * firstKing
 * notForEmpty
 * onlyEmpty
 * oneRank
 * oneSuit
 * any
 * not
 * ascendDeck
 * descendDeck
 * oneRankDeck
 * ascend
 * descent
 * descentOne
 * ascendOne
 * ascdescOne
 * sum14
 * around
 
 */

let readyPutRules = {

	// Relations filters

	"linePrev" : deck => {

		let prev = getBeside(deck.to).prev;

		if(prev) {

			deck.link = prev.to;

			return true;
		}

		return false;
	},

	"lineNext" : deck => {

		let next = getBeside(deck.to).next;

		if(next) {

			deck.link = next.to;

			return true;
		}

		return false;
	},

	// Internal use

	"_down_up_cards" : deck => {

		if(deck.cards.length == 0) {
			return false;
		}

		let down = common.validateCardName(deck.cards[deck.cards.length - 1].name);
		let up   = common.validateCardName(deck.putDeck[0].card.name);

		if(!down || !up) {
			return false;
		}

		return {
			"up"   : up  ,
			"down" : down
		}
	},

	"_down_up_rank_num" : deck => {

		let du = readyPutRules._down_up_cards(deck);

		return du ? {
			"down" : defaults.card.ranks.indexOf(du.down.rank),
			"up"   : defaults.card.ranks.indexOf(du.up.rank)
		} : false;
	},

	"_isFirst": (deck, _name) => {

		if(deck.cards.length == 0) {

			let _validate = null;

			return (
				(_validate = common.validateCardName(deck.putDeck[0].card.name)) &&
				_validate.rank == _name
			);
		}

		return true;
	},

	// Rules

	"striped" : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let color_A   = common.validateCardName(deck.cards[deck.cards.length - 1].name).color,
			color_B   = null,
			_validate = null;

		if(_validate = common.validateCardName(deck.putDeck[0].card.name)) {
			color_B = _validate.color;
		}

		return color_A != color_B;
	},

	"firstAce"     : deck => readyPutRules._isFirst(deck, defaults.card.ranks[0]),

	"firstKing"    : deck => readyPutRules._isFirst(deck, defaults.card.ranks[defaults.card.ranks.length - 1]),

	"notForEmpty"  : deck => deck.cards.length > 0,

	"onlyEmpty"    : deck => deck.cards.length == 0,

	"oneRank"      : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(deck);

		return du && du.up.rank == du.down.rank;
	},

	"oneSuit"      : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(deck);

		return du && du.up.suit == du.down.suit;
	},

	"any" : deck => true,

	"not" : deck => false,

	"ascendDeck" : deck => {//ascend deck by step

		if(deck.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in deck.putDeck) {

			if(i > 0) {

				let down = defaults.card.ranks.indexOf(
					common.validateCardName(deck.putDeck[i - 1].card.name).rank
				),
				    up   = defaults.card.ranks.indexOf(
					common.validateCardName(deck.putDeck[i].card.name).rank
				);

				ruleCorrect = ruleCorrect && 1 + down == up;
			};
		};

		return ruleCorrect;
	},

	"descendDeck" : deck => {//ascend deck by step

		if(deck.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in deck.putDeck) {

			if(i > 0) {

				let down = defaults.card.ranks.indexOf(
					common.validateCardName(deck.putDeck[i - 1].card.name).rank
				),
				    up   = defaults.card.ranks.indexOf(
					common.validateCardName(deck.putDeck[i].card.name).rank
				);

				ruleCorrect = ruleCorrect && down == 1 + up;
			};
		};

		return ruleCorrect;
	},

	"oneRankDeck" : deck => {

		if(deck.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in deck.putDeck) {

			if(i > 0) {

				let down = common.validateCardName(deck.putDeck[i - 1].card.name).suit,
				    up   = common.validateCardName(deck.putDeck[i].card.name).suit

				ruleCorrect = ruleCorrect && down == up;
			}
		};

		return ruleCorrect;
	},

	"ascend" : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(deck);

		return da && da.down < da.up;
	},

	"descent" : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(deck);

		return da && da.down > da.up;
	},

	"descentOne" : deck => {// one step

		if(deck.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(deck);

		return da && da.down == 1 + da.up;
	},

	"ascendOne" : deck => {// one step

		if(deck.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(deck);

		return da && 1 + da.down == da.up;
	},

	"ascdescOne" : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(deck);

		return da && Math.abs(da.down - da.up) == 1;
	},

	"sum14" : deck => {

		if(deck.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(deck);
		let _sum = du.down.value + du.up.value;

		return _sum == 14;
	},

	// TODO rules with params ??? or atom rules
	// query ?

	"around" : deck => {// {from, putDeck, cards}

		if(deck.cards.length == 0) {
			return true;
		}

		let _around = deck.from.deck.getRelationsByName('around', {from: null});
		let _parent = Deck.getDeckById(deck.cards[0].parent);

		for(let i in _around) {

			if(_around[i].to == _parent.name) {
				return true;
			}
		}

		return false;
	}
};

export default readyPutRules;