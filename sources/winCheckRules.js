'use strict';

import common   from 'common'  ;
import defaults from 'defaults';

/*

Filters:

 * group
 * groups
 * deck
 * decks

Tag filters:

 * firstEmpty

Internal use:

 * _asc_desk

Simple rules:

 * newerWin
 * allEmpty
 * empty
 * allInOne
 * allAscend
 * allDescent

Conposite rules:

 * query
 * lego

 */

let winCheckRules = {

	// Filters

	// возвращает колоды определённой группы/групп
	"group" : data => { // string | Array of string

		if(!data.filter || !data.filterArgs) {
			return false;
		}

		let decksLength = 0;
		let decks = {};

		for(let deckName in data.decks) {

			if(
				(
					typeof data.filterArgs       == 'string'        &&
					data.decks[deckName].parent  == data.filterArgs
				) ||
				(
					data.filterArgs.length                                    &&
					data.filterArgs.indexOf(data.decks[deckName].parent) >= 0
				)
			) {
				decksLength += 1;
				decks[deckName] = data.decks[deckName];
			}
		}

		data.decks = decks;

		return decksLength;
	},

	"groups" : data => winCheckRules.group(data),

	// by Tag
	"select" : data => { // string

		if(!data.filter || !data.filterArgs) {
			return false;
		}

		let decksLength = 0;
		let decks = {};

		for(let deckName in data.decks) {
			if(data.decks[deckName].tags.indexOf(data.filterArgs) >= 0) {
				decksLength += 1;
				decks[deckName] = deck;
			}
		}

		data.decks = decks;

		return decksLength;
	},

	"deck" : data => {

		if(!data.filter || !data.filterArgs) {
			return false;
		}

		let decksLength = 0;
		let decks = {};

		for(let deckName in data.decks) {
			if(
				typeof data.filterArgs    == 'string'                   &&
				data.decks[deckName].name == data.filterArgs            ||
				data.filterArgs.indexOf(data.decks[deckName].name) >= 0
			) {
				decksLength += 1;
				decks[deckName] = data.decks[deckName];
			}
		}

		data.decks = decks;

		return decksLength;
	},

	"decks" : data => winCheckRules.deck(data),

	// Tag filters

	"firstEmpty" : data => {

		let decks = {};
		let decksLength = 0;

		for(let deckName in data.decks) {
			if(data.decks[deckName].tags.indexOf('last') >= 0) {
				decksLength += 1
				decks[deckName] = data.decks[deckName];
			}
		}

		data.decks = decks;

		return decksLength;
	},

	// Internal use

	"_asc_desk" : data => {

		if(
			!data                            ||
			typeof data.asc_desk != 'number'
		) {
			return false;
		}

		let correct = true;

		for(let deckName in data.decks) {

			if(!correct) {
				return false;
			}

			let cards = data.decks[deckName].cards;

			for(let cardIndex in cards) {
				if(cardIndex > 0) {

					let down = common.validateCardName(cards[(cardIndex | 0) - 1].name),
					      up = common.validateCardName(cards[(cardIndex | 0)]    .name);

					let cardsRankS = defaults.card.ranks;

					correct = correct && down && up && cardsRankS.indexOf(down.rank) == (cardsRankS.indexOf(up.rank) + data.asc_desk);
				}
			}

		}

		return correct;
	},

	// Simple rules

	"newerWin" : data => {

		console.warn('You use "newerWin" rule for checking Win. Maybe arguments in "winCheck.rule" have incorrect rule name.');
		// throw new Error('Newer win');
		return false;
	},

	// все колоды пусты
	"allEmpty" : data => {

		let correct = true;

		for(let deckName in data.decks) {
			correct = correct && data.decks[deckName].cards.length == 0;
		}

		return correct;
	},

	"empty" : data => winCheckRules.allEmpty(data),

	// Combined rules (use like filter)

	// все карты в одной колоде
	"allInOne" : data => {

		let emptyDecksCount = 0,
			decksLength     = 0,
			fillIndex       = 0;

		for(let deckName in data.decks) {
			if(data.decks[deckName].cards.length == 0) {
				emptyDecksCount += 1;
			} else {
				fillIndex = deckName;
			}
			decksLength += 1;
		}

		let correct = emptyDecksCount == decksLength - 1;

		if(data.filter && correct) {
			let decks = {};
			decks[deckName] = data.decks[deckName];
			data.decks = decks;
		}

		return correct;
	},

	// step by step 1, 2, 3
	// во всех колодах карты по возрастанию
	"allAscend" : data => {

		data.asc_desk = -1;

		return winCheckRules._asc_desk(data);
	},

	// step by step 3, 2, 1
	// во всех колодах карты по убыванию
	"allDescent" : data => {

		data.asc_desk = 1;

		return winCheckRules._asc_desk(data);
	},

	"topKing"    : data => {

		for(let deckName in data.decks) {

			let deck = data.decks[deckName];

			let topCard = deck.getTopCard();

			let topCardRank = common.validateCardName(topCard.name).rank;

			if(
				typeof topCardRank != 'undefined'                                  &&
				topCardRank != defaults.card.ranks[defaults.card.ranks.length - 1]
			) {
				return false;
			}
		}

		return true;
	},

	"topAce"     : data => {

		for(let deckName in data.decks) {

			let deck = data.decks[deckName];

			let topCard = deck.getTopCard();

			let topCardRank = common.validateCardName(topCard.name).rank;

			if(
				typeof topCardRank != 'undefined'                                  &&
				topCardRank != defaults.card.ranks[0]
			) {
				return false;
			}
		}

		return true;
	},

	// Composite rules (input arguments)

	// комбинированное правило
	"query" : data => {
		// {
		// 	decks[],  - all visible decks
		// 	rulesArgs
		// }

		if(
			!data           ||
			!data.rulesArgs
		) {
			return false;
		}

		let _correct = true;

		// apply filters
		for(let next in data.rulesArgs) {

			let _decksClone = {};

			// TODO 
			for(let deckName in data.decks) {
				_decksClone[deckName] = data.decks[deckName];
			}

			let queryData = {
				// filters : data[next].filters,
				// rules   : data[next].rules,
				decks : _decksClone
			};

			// применяем фильтры, оставляем только интересующие колоды
			if(_correct && data.rulesArgs[next].filters) {

				queryData.filter = true;

				// пробегаемся по фильтрам
				for(let i in data.rulesArgs[next].filters) {

					// фильтр - строковый параметр
					if(
						typeof data.rulesArgs[next].filters[i] == 'string' &&
						winCheckRules[data.rulesArgs[next].filters[i]]
					) {

						queryData.filterArgs = null;
						_correct = _correct && winCheckRules[data.rulesArgs[next].filters[i]](queryData);
					} else {

						// фильтр - обьект
						if (
							data.rulesArgs[next].filters[i]                                 &&
							data.rulesArgs[next].filters[i].toString() == '[object Object]'
						) {

							for(let filterName in data.rulesArgs[next].filters[i]) {

								if(winCheckRules[filterName]) {

									queryData.filterArgs = data.rulesArgs[next].filters[i][filterName];

									_correct = _correct && winCheckRules[filterName](queryData);
								} else {
									_correct = _correct && winCheckRules.newerWin();
								}
							}
						} else {
							_correct = _correct && winCheckRules.newerWin();
						}
					}
				}

				queryData.filter = false;
			}

			// применяем правила к оставшимся колодам
			if(data.rulesArgs[next].rules) {

				for(let i in data.rulesArgs[next].rules) {
					if(winCheckRules[data.rulesArgs[next].rules[i]]) {
						_correct = _correct && winCheckRules[data.rulesArgs[next].rules[i]](queryData);
					} else {
						_correct = _correct && winCheckRules.newerWin();
					}
				}
			}

		}

		return _correct;
	},

	"lego" : data => winCheckRules.query(data)
}

export default winCheckRules;