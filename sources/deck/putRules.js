'use strict';

import {defaults} from '../common'                              ;

import Deck       from './'                                     ;
import getBeside  from '../group/generators/relations/getBeside';

let readyPutRules = {

	// Relations filters

	"linePrev": data => {

		let prev = getBeside(data.to).prev;

		if (prev) {

			data.link = prev.to;

			return true;
		}

		return false;
	},

	"lineNext": data => {

		let next = getBeside(data.to).next;

		if (next) {

			data.link = next.to;

			return true;
		}

		return false;
	},

	// Internal use

	"_down_up_cards": data => {

		if (data.cards.length == 0) {
			return false;
		}

		let down = data.cards           && data.cards[data.cards.length - 1];
		let up   = data.putDeck         &&
		           data.putDeck[0]      &&
		           data.putDeck[0].card;

		if (!down || !up) {
			return false;
		}

		return {
			"up"   : up  ,
			"down" : down
		}
	},

	"_down_up_rank_num": data => {

		let du = readyPutRules._down_up_cards(data);

		return du ? {
			"down" : defaults.card.ranks.indexOf(du.down.rank),
			"up"   : defaults.card.ranks.indexOf(du.up.rank)
		} : false;
	},

	"_isFirst": (data, _name) => {

		if (data.cards.length == 0) {

			let _validate = null;

			return (
				data.putDeck[0].card               &&
				data.putDeck[0].card.rank == _name
			);
		}

		return true;
	},

	// Rules

	/**
	 * Карты можно класть друг на друга только чередуя цвета,
	 * черную на красную, и на оборот.
	 */
	"striped": data => {

		if (data.cards.length == 0) {
			return true;
		}

		let color_A   = data.cards[data.cards.length - 1].color,
			color_B   = null,
			_validate = null;

		if (data.putDeck[0].card) {
			color_B = data.putDeck[0].card.color;
		}

		return color_A != color_B;
	},

	/**
	 * Можно класть только карту того же цвета, что предыдущая
	 */
	"oneColor" : data => {

		if (data.cards.length == 0) {
			return true;
		}

		let color_A   = data.cards[data.cards.length - 1].color,
			color_B   = null,
			_validate = null;

		if (data.putDeck[0].card) {
			color_B = data.putDeck[0].card.color;
		}

		return color_A == color_B;
	},

	/**
	 * На пустую стопку можно положить только туз
	 */
	"firstAce": data => readyPutRules._isFirst(data, defaults.card.ranks[0]),

	/**
	 * На пустую стопку можно положить только короля
	 */
	"firstKing": data => readyPutRules._isFirst(data, defaults.card.ranks[defaults.card.ranks.length - 1]),

	/**
	 * На пустую стопку нельзя класть карты
	 */
	"notForEmpty": data => data.cards.length > 0,

	/**
	 * Можно класть карты только если стопка пуста
	 */
	"onlyEmpty": data => data.cards.length == 0,

	/**
	 * Можно класть только карты одного достоинства
	 */
	"oneRank": data => {

		if (data.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(data);

		return du && du.up.rank == du.down.rank;
	},

	/**
	 * Можно класть только карты одной масти
	 */
	"oneSuit": data => {

		if (data.cards.length == 0) {
			return true;
		}

		let du = readyPutRules._down_up_cards(data);

		return du && du.up.suit == du.down.suit;
	},

	/**
	 * Можно класть любые карты
	 */
	"any": data => true,

	/**
	 * Нельзя класть карты
	 */
	"not": data => false,

	/**
	 * Можно класть стопку карт в которой каждая следующая выше достоинством
	 */
	"ascendDeck": data => { //ascend data by step

		if (data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for (let i in data.putDeck) {

			if (i > 0) {

				let down = defaults.card.ranks.indexOf(
					data.putDeck[i - 1].card.rank
				),
				    up   = defaults.card.ranks.indexOf(
					data.putDeck[i].card.rank
				);

				ruleCorrect = ruleCorrect && 1 + down == up;
			};
		};

		return ruleCorrect;
	},

	/**
	 * @alias ascendDeck
	 */
	"ascentDeck": data => readyPutRules.ascendDeck(data), // обратная совместимость

	/**
	 * Можно класть стопку карт в которой каждая следующая ниже достоинством
	 */
	"descendDeck": data => { //ascend data by step

		if (data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for (let i in data.putDeck) {

			if (i > 0) {

				let down = defaults.card.ranks.indexOf(
					data.putDeck[i - 1].card.rank
				),
				    up   = defaults.card.ranks.indexOf(
					data.putDeck[i].card.rank
				);

				ruleCorrect = ruleCorrect && down == 1 + up;
			};
		};

		return ruleCorrect;
	},

	/**
	 * @alias descendDeck
	 */
	"descentDeck": data => readyPutRules.descendDeck(data),

	/**
	 * Можно класть стопку карт в которой все карты одного достоинства
	 */
	"oneRankDeck": data => {

		if (data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for (let i in data.putDeck) {

			if (i > 0) {

				let down = data.putDeck[i - 1].card.rank,
				    up   = data.putDeck[i].card.rank

				ruleCorrect = ruleCorrect && down == up;
			}
		};

		return ruleCorrect;
	},

	/**
	 * Можно класть стопку карт в которой все карты одной масти
	 */
	"oneSuitDeck": data => {

		if (data.putDeck.length == 1) {
			return true;
		}

		let ruleCorrect = true;

		for (let i in data.putDeck) {

			if (i > 0) {

				let down = data.putDeck[i - 1].card.suit,
				    up   = data.putDeck[i].card.suit

				ruleCorrect = ruleCorrect && down == up;
			}
		};

		return ruleCorrect;
	},

	/**
	 * Можно класть карту выше достоинством
	 */
	"ascend": data => {

		if (data.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(data);

		return da && da.down < da.up;
	},

	/**
	 * @alias ascend
	 */
	"ascent": data => readyPutRules.ascend(data),

	/**
	 * Можно класть карту ниже достоинством
	 */
	"descend": data => {

		if (data.cards.length == 0) {
			return true;
		}

		let da = readyPutRules._down_up_rank_num(data);

		return da && da.down > da.up;
	},

	/**
	 * @alias descend
	 */
	"descent": data => readyPutRules.descend(data),

	/**
	 * Можно класть карту на единицу ниже достоинством
	 */
	"ascendOne": data => readyPutRules.ascendNum(data, 1),
	
	/**
	 * @alias ascendOne
	 */
	"ascentOne": data => readyPutRules.ascendOne(data),

	/**
	 * Можно класть карту на N выше достоинством, например "ascendNum:2"
	 */
	"ascendNum": (data, prop) => {

		if (data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let da = readyPutRules._down_up_rank_num(data);

		return da && num + da.down == da.up;
	},

	/**
	 * @alias ascendNum
	 */
	"ascentNum": (data, prop) => readyPutRules.ascendNum(data, prop),

	/**
	 * Можно класть карту на единицу ниже достоинством
	 */
	"descendOne": data => readyPutRules.descentNum(data, 1),

	/**
	 * @alias descendOne
	 */
	"descentOne": data => readyPutRules.descendOne(data),

	/**
	 * Можно класть карту на N ниже достоинством, например "descendNum:2"
	 */
	"descendNum": (data, prop) => {

		if (data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let da = readyPutRules._down_up_rank_num(data);

		return da && da.down == num + da.up;
	},

	/**
	 * @alias descendNum
	 */
	"descentNum": (data, prop) => readyPutRules.descendNum(data, prop),

	/**
	 * Можно класть карту на единицу ниже или выше достоинством
	 */
	"ascdescOne": data => readyPutRules.ascdescNum(data, 1),

	/**
	 * Можно класть карту на N ниже или выше достоинством, например "ascdescNum:2"
	 */
	"ascdescNum": (data, prop) => {

		if (data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let da = readyPutRules._down_up_rank_num(data);

		return da && Math.abs(da.down - da.up) == num;
	},

	"ascendNumLoop": (data, prop) => {

		if (data.cards.length == 0) {
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

	/**
	 * @alias ascendNumLoop
	 */
	"ascentNumLoop": (data, prop) => readyPutRules.ascendNumLoop(data, prop),

	"descendNumLoop": (data, prop) => {
		
		if (data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let du = readyPutRules._down_up_cards(data);

		return du && (
			du.down.value - num < 1
				? du.down.value - num + defaults.card.ranks.length == du.up.value
				: du.down.value - num                              == du.up.value
		);
	},

	/**
	 * @alias descendNumLoop
	 */
	"descentNumLoop": (data, prop) => readyPutRules.descendNumLoop(data, prop),

	/**
	 * Можно класть карту дающую с верхней в сумме N, например "sum:10"
	 */
	"sum": (data, prop) => {

		if (data.cards.length == 0) {
			return true;
		}

		let num = (prop | 0) > 0 ? (prop | 0) : 1;

		let du = readyPutRules._down_up_cards(data);
		let _sum = du.down.value + du.up.value;

		return _sum == num;
	},

	/**
	 * Можно класть карту дающую с верхней в сумме 14
	 */
	"sum14": data => readyPutRules.sum(data, 14),

	"_byRelation": (data, relation) => { // {from, putDeck, cards}, relation name

		if (data.cards.length == 0) {
			return true;
		}

		let _relations = data.from.deck.getRelationsByName(relation, {
			"from": null
		});

		let _parent = Deck.getDeckById(data.cards[0].parent);

		for (let i in _relations) {

			if (_relations[i].to == _parent.name) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Можно класть карту из стопку с которой есть связь типа around
	 */
	"around": data => readyPutRules._byRelation(data, 'around'),

	/**
	 * Можно класть карту из стопку с которой есть связь типа beside
	 */
	"beside": data => readyPutRules._byRelation(data, 'beside'),

	/**
	 * Можно класть карты только из стопки принадлежащей другой группе
	 */
	"notOneGroup": (data, prop) => {

		let _result = data.from.deck.parent != data.to.parent;

		if (prop == "excludeEmpty") {

			let down = data && data.cards && data.cards[data.cards.length - 1];

			if (!down) {
				_result = true;
			}
		}

		return _result;
	},

	/**
	 * Можно класть карты только из стопки той же группы, что и текущая стопка
	 */
	"oneGroup": data => {
		return data.from.deck.parent == data.to.parent;
	}
};

export default readyPutRules;