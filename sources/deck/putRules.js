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
 * _isFirst

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
 * oneSuitDeck
 * ascend | ascent
 * descend | descent
 * ascendOne | ascentOne
 * ascendNum | ascentNum
 * descendOne | descentOne
 * descendNum | descentNum
 * ascdescOne
 * ascdescNum
 * ascendNumLoop | ascentNumLoop
 * sum
 * sum14
 * around
 
 */

let readyPutRules = {

	// Relations filters

	"linePrev" : data => {

		let prev = getBeside(data.to).prev;

		if(prev) {

			data.link = prev.to;

			return true;
		}

		return false;
	},

	"lineNext" : data => {

		let next = getBeside(data.to).next;

		if(next) {

			data.link = next.to;

			return true;
		}

		return false;
	},

	// Internal use

	"_down_up_cards" : data => {

		if(data.cards.length == 0) {
			return false;
		}

		let down = data.cards           && data.cards[data.cards.length - 1]; // common.validateCardName(data.cards[data.cards.length - 1].name);
		let up   = data.putDeck         &&
		           data.putDeck[0]      &&
		           data.putDeck[0].card;                                      // common.validateCardName(data.putDeck[0].card.name);

		if(!down || !up) {
			return false;
		}

		return {
			"up"   : up  ,
			"down" : down
		}
	},

	"_down_up_rank_num" : data => {

		let du = readyPutRules._down_up_cards(data);

		return du ? {
			"down" : defaults.card.ranks.indexOf(du.down.rank),
			"up"   : defaults.card.ranks.indexOf(du.up.rank)
		} : false;
	},

	"_isFirst": (data, _name) => {

		if(data.cards.length == 0) {

			let _validate = null;

			return (
				(_validate = common.validateCardName(data.putDeck[0].card.name)) &&
				_validate.rank == _name
			);
		}

		return true;
	},

	// Rules

	"striped" : data => {

		if(data.cards.length == 0) {
			return true;
		}

		let color_A   = common.validateCardName(data.cards[data.cards.length - 1].name).color,
			color_B   = null,
			_validate = null;

		if(_validate = common.validateCardName(data.putDeck[0].card.name)) {
			color_B = _validate.color;
		}

		return color_A != color_B;
	},

	"firstAce"     : data => readyPutRules._isFirst(data, defaults.card.ranks[0]),

	"firstKing"    : data => readyPutRules._isFirst(data, defaults.card.ranks[defaults.card.ranks.length - 1]),

	"notForEmpty"  : data => data.cards.length > 0,

	"onlyEmpty"    : data => data.cards.length == 0,

	"oneRank"      : data => {

		if(data.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(data);

		return du && du.up.rank == du.down.rank;
	},

	"oneSuit"      : data => {

		if(data.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(data);

		return du && du.up.suit == du.down.suit;
	},

	"any" : data => true,

	"not" : data => false,

	"ascendDeck" : data => { //ascend data by step

		if(data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in data.putDeck) {

			if(i > 0) {

				let down = defaults.card.ranks.indexOf(
					common.validateCardName(data.putDeck[i - 1].card.name).rank
				),
				    up   = defaults.card.ranks.indexOf(
					common.validateCardName(data.putDeck[i].card.name).rank
				);

				ruleCorrect = ruleCorrect && 1 + down == up;
			};
		};

		return ruleCorrect;
	},
	"ascentDeck" : data => readyPutRules.ascendDeck(data), // обратная совместимость

	"descendDeck" : data => { //ascend data by step

		if(data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in data.putDeck) {

			if(i > 0) {

				let down = defaults.card.ranks.indexOf(
					common.validateCardName(data.putDeck[i - 1].card.name).rank
				),
				    up   = defaults.card.ranks.indexOf(
					common.validateCardName(data.putDeck[i].card.name).rank
				);

				ruleCorrect = ruleCorrect && down == 1 + up;
			};
		};

		return ruleCorrect;
	},
	"descentDeck" : data => readyPutRules.descendDeck(data),

	"oneRankDeck" : data => {

		if(data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in data.putDeck) {

			if(i > 0) {

				let down = common.validateCardName(data.putDeck[i - 1].card.name).rank,
				    up   = common.validateCardName(data.putDeck[i].card.name).rank

				ruleCorrect = ruleCorrect && down == up;
			}
		};

		return ruleCorrect;
	},

	"oneSuitDeck" : data => {

		if(data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for(let i in data.putDeck) {

			if(i > 0) {

				let down = common.validateCardName(data.putDeck[i - 1].card.name).suit,
				    up   = common.validateCardName(data.putDeck[i].card.name).suit

				ruleCorrect = ruleCorrect && down == up;
			}
		};

		return ruleCorrect;
	},

	"ascend" : data => {

		if(data.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(data);

		return da && da.down < da.up;
	},
	"ascent" : data => readyPutRules.ascend(data),

	"descend" : data => {

		if(data.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(data);

		return da && da.down > da.up;
	},
	"descent" : data => readyPutRules.descend(data),

	"ascendOne" : data => { // one step
		return readyPutRules.ascendNum(data, 1);
	},
	"ascentOne" : data => readyPutRules.ascendOne(data),

	"ascendNum" : (data, prop) => {

		if(data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let da = readyPutRules._down_up_rank_num(data);

		return da && num + da.down == da.up;
	},
	"ascentNum" : (data, prop) => readyPutRules.ascendNum(data, prop),

	"descendOne" : data => { // one step
		return readyPutRules.descentNum(data, 1);
	},
	"descentOne" : data => readyPutRules.descendOne(data),

	"descendNum" : (data, prop) => {

		if(data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let da = readyPutRules._down_up_rank_num(data);

		return da && da.down == num + da.up;
	},
	"descentNum" : (data, prop) => readyPutRules.descendNum(data, prop),

	"ascdescOne" : data => {
		return readyPutRules.ascdescNum(data, 1);
	},

	"ascdescNum" : (data, prop) => {

		if(data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let da = readyPutRules._down_up_rank_num(data);

		return da && Math.abs(da.down - da.up) == num;
	},

	"ascendNumLoop" : (data, prop) => {

		if(data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let du = readyPutRules._down_up_cards(data);

		return du && (
			du.down.value + num > defaults.card.ranks.length
				? du.down.value + num - defaults.card.ranks.length == du.up.value
				: du.down.value + num                              == du.up.value
		);
	},
	"ascentNumLoop" : (data, prop) => readyPutRules.ascendNumLoop(data, prop),

	"descendNumLoop" : (data, prop) => {
		// TODO
		return false;
	},
	"descentNumLoop" : (data, prop) => readyPutRules.descendNumLoop(data, prop),

	"sum" : (data, prop) => {

		if(data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let du = readyPutRules._down_up_cards(data);
		let _sum = du.down.value + du.up.value;

		return _sum == num;
	},

	"sum14" : data => {
		return readyPutRules.sum(data, 14);
	},

	// TODO rules with params ??? or atom rules
	// "sum" : (data, prop) => {} // rulename:prop -> sum:14

	// query ?

	"around" : data => { // {from, putDeck, cards}

		if(data.cards.length == 0) {
			return true;
		}

		let _around = data.from.deck.getRelationsByName('around', {
			"from": null
		});

		let _parent = Deck.getDeckById(data.cards[0].parent);

		for(let i in _around) {

			if(_around[i].to == _parent.name) {
				return true;
			}
		}

		return false;
	},

	"notOneGroup" : (data, prop) => {

		let _result = data.from.deck.parent != data.to.parent;

		if(prop == "excludeEmpty") {

			let down = data && data.cards && data.cards[data.cards.length - 1];

			if(!down) {
				_result = true;
			}
		}

		return _result;
	}
};

export default readyPutRules;