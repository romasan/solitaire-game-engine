'use strict';

import common   from 'common';
import defaults from 'defaults';

// import Deck     from 'deck';

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
	group : data => {

		if(!data.filter || !data.filterArgs) {
			return false;
		}

		let _decks = [];
		for(let _i in data.decks) {
			
			// let _parent = data.decks[_i].parent
			// if(data.filterArgs.indexOf(data.decks[_i].parent)) {
			if(
				(
					typeof data.filterArgs == "string"     &&
					data.decks[_i].parent  == data.filterArgs
				) ||
				(
			 		data.filterArgs.length                              &&
			 		data.filterArgs.indexOf(data.decks[_i].parent) >= 0
			 	)
			) {
				_decks.push(data.decks[_i]);
			}
		}
		
		data.decks = _decks;

		return _decks.length;
	},

	groups : data => winCheckRules.group(data),

	select : data => {// by Tag

		let _decks = [];

		for(let deck of data.decks) {
			// let maxDeckIndex = Group.getGroup(deck.parent).decksCount();
			if(deck.tags.indexOf(data.filterArgs) >= 0) {
				_decks.push(deck);
			}
		}

		data.decks = _decks;

		return _decks.length;
	},

	deck : data => {
		
		if(!data.filter || !data.filterArgs) {
			return false;
		}
		
		let _decks = [];

		for(let _i in data.decks) {
			if(
				typeof data.filterArgs == "string"                &&
				data.decks[_i].name == data.filterArgs            ||
				data.filterArgs.indexOf(data.decks[_i].name) >= 0
			) {
				_decks.push(data.decks[_i]);
			}
		}
				
		data.decks = _decks;
		return _decks.length;
	},
	
	decks : data => winCheckRules.deck(data),

	// Tag filters

	firstEmpty : data => {

		let _decks = [];
		
		for(let _i in data.decks) {
			if(data.decks[_i].tags.indexOf('last') >= 0) {
				_decks.push(data.decks[_i]);
			}
		}

		data.decks = _decks;

		return _decks.length;
	},

	// Internal use

	_asc_desk : data => {

		if(
			!data                            ||
			typeof data.asc_desk != 'number'
		) {
			return false;
		}

		let _correct = true;

		for(let deckIndex in data.decks) {

			if(!_correct) {
				return false;
			}

			let _cards = data.decks[deckIndex].cards;

			for(let cardIndex in _cards) {
				if(cardIndex > 0) {

					let down = common.validateCardName(_cards[(cardIndex | 0) - 1].name),
					      up = common.validateCardName(_cards[(cardIndex | 0)]    .name);

					let _cardsRankS = defaults.card.ranks;

					_correct = _correct && down && up && _cardsRankS.indexOf(down.rank) == (_cardsRankS.indexOf(up.rank) + data.asc_desk);
				}
			}

		}

		return _correct;
	},

	// Simple rules

	newerWin : data => {

		console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.")
		// throw new Error('Newer win');
		return false;
	},

	// все колоды пусты
	allEmpty : data => {

		let _correct = true;

		for(let _i in data.decks) {
			_correct = _correct && data.decks[_i].cards.length == 0;
		}

		return _correct;
	},

	empty : data => {
		winCheckRules.allEmpty(data);
	},

	// Combined rules (use like filter)

	// все карты в одной колоде
	allInOne : data => {

		let _emptyDecksCount = 0,
			_decksLength     = 0,
			_fillIndex       = 0;

		for(let i in data.decks) {
			if(data.decks[i].cards.length == 0) {
				_emptyDecksCount += 1;
			} else {
				_fillIndex = i;
			}
			_decksLength += 1;
		}

		let _correct = _emptyDecksCount == _decksLength - 1;

		if(data.filter) {
			data.decks = _correct ? [data.decks[_fillIndex]] : [];
		}

		return _correct
	},

	// step by step 1, 2, 3
	// во всех колодах карты по возрастанию
	allAscend : data => {

		data.asc_desk = -1;

		return winCheckRules._asc_desk(data);
	},

	// step by step 3, 2, 1
	// во всех колодах карты по убыванию
	allDescent : data => {

		data.asc_desk = 1;

		return winCheckRules._asc_desk(data);
	},

	topKing    : data => {

		for(let i in data.decks) {

			let deck = data.decks[i];

			let topCard = deck.getTopCard();

			let topCardRank = common.validateCardName(topCard.name).rank;
			console.log('topKing', deck.name, topCardRank, defaults.card.ranks[defaults.card.ranks.length - 1]);

			if(
				typeof topCardRank != "undefined"                                  &&
				topCardRank != defaults.card.ranks[defaults.card.ranks.length - 1]
			) {
				return false;
			}
		}

		return true;
	},

	topAce     : data => false,

	// Composite rules (input arguments)

	// комбинированное правило
	query : data => {
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

			for(let i in data.decks) {
				_decksClone[i] = data.decks[i];
			}

			let queryData = {
				// filters : data[next].filters,
				// rules   : data[next].rules,
				decks : _decksClone
			};

			// применяем фильтры, оставляем только интересующие колоды
			if(_correct && data.rulesArgs[next].filters) {

				queryData.filter = true;

				for(let i in data.rulesArgs[next].filters) {
					if(typeof data.rulesArgs[next].filters[i] == 'string' && winCheckRules[data.rulesArgs[next].filters[i]]) {

						queryData.filterArgs = null;
						_correct = _correct && winCheckRules[data.rulesArgs[next].filters[i]](queryData);
					} else {

						// if(typeof data.rulesArgs[next].filters[i] == 'object') {
						if (
							data.rulesArgs[next].filters[i]                                 &&
							data.rulesArgs[next].filters[i].toString() == "[object Object]"
						) {

							for(let filterName in data.rulesArgs[next].filters[i]) {
								// console.log('>>> filterName', filterName, typeof winCheckRules[filterName]);
								if(winCheckRules[filterName]) {
									queryData.filterArgs = data.rulesArgs[next].filters[i][filterName]
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

	lego : data => winCheckRules.query(data)
}

export default winCheckRules;