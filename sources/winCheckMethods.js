'use strict';

/*
 * Client-server application for planning biomechanical stimulation =)
 * version: 1.0.0
 * author: Romasan
 * date: 05.05.2016
 */

// import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

let winCheckMethods = {
	
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
			 		data.filterArgs.length                           &&
			 		data.filterArgs.indexOf(data.decks[_i].parent) >= 0
			 	)
			) {
				_decks.push(data.decks[_i]);
			}
		}
		
		data.decks = _decks;

		return _decks.length;
	},

	groups : data => winCheckMethods.group(data),

	deck : data => {
		
		if(!data.filter || !data.filterArgs) {
			return false;
		}
		
		let _decks = [];

		for(let _i in data.decks) {
			if(
				typeof data.filterArgs == "string"             &&
				data.decks[_i].name == data.filterArgs            ||
				data.filterArgs.indexOf(data.decks[_i].name) >= 0
			) {
				_decks.push(data.decks[_i]);
			}
		}
				
		data.decks = _decks;
		return _decks.length;
	},
	
	decks : data => winCheckMethods.deck(data),

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
		
		for(let d in data.decks) {

			if(!_correct) {
				return false;
			}
			
			let _cards = data.decks[d].cards;
			for(let c in _cards) {
				if(c > 0) {	
					let down = common.validateCardName(_cards[(c|0) - 1].name),
						  up   = common.validateCardName(_cards[(c|0)].name);
					let _cardsRankS = defaults.card.ranks;
					_correct = _correct && down && up && _cardsRankS.indexOf(down.rank) == (_cardsRankS.indexOf(up.rank) + data.asc_desk);
					
				}
			}

		}

		console.log('asc_desk', data.asc_desk, _correct);

		return _correct;
	},

	// Simple rules

	newerWin : data => {
		
		console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.")
		
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
		winCheckMethods.allEmpty(data);
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
		
		return winCheckMethods._asc_desk(data);
	},
	
	// step by step 3, 2, 1
	// во всех колодах карты по убыванию
	allDescent : data => {
			
		data.asc_desk = 1;
		
		return winCheckMethods._asc_desk(data);
	},

	// Composite rules (input arguments)
	// комбинированное правило
		
	query : queryData => {

		console.log('winCheck query');

		if(
			!queryData           ||
			!queryData.rulesArgs
		) {
			return false;
		}

		let _correct = true;
		
		// apply filters
		for(let next in queryData.rulesArgs) {

			let _decksClone = {};

			for(let i in queryData.decks) {
				_decksClone[i] = queryData.decks[i];
			}

			let data = {
				// filters : queryData[next].filters,
				// rules   : queryData[next].rules,
				decks : _decksClone
			};

			// применяем фильтры, оставляем только интересующие колоды
			if(_correct && queryData.rulesArgs[next].filters) {

				data.filter = true;

				for(let i in queryData.rulesArgs[next].filters) {
					if(typeof queryData.rulesArgs[next].filters[i] == 'string' && winCheckMethods[queryData.rulesArgs[next].filters[i]]) {

						data.filterArgs = null;
						_correct = _correct && winCheckMethods[queryData.rulesArgs[next].filters[i]](data);
					} else {

						// if(typeof queryData.rulesArgs[next].filters[i] == 'object') {
						if (
							queryData.rulesArgs[next].filters[i]                                 &&
							queryData.rulesArgs[next].filters[i].toString() == "[object Object]"
						) {

							for(let filterName in queryData.rulesArgs[next].filters[i]) {
								if(winCheckMethods[filterName]) {
									data.filterArgs = queryData.rulesArgs[next].filters[i][filterName]
									_correct = _correct && winCheckMethods[filterName](data);
								} else {
									_correct = _correct && winCheckMethods.newerWin();
								}
							}
						} else {
							_correct = _correct && winCheckMethods.newerWin();
						}
					}
				}

				data.filter = false;
			}

			// применяем правила к оставшимся колодам
			if(queryData.rulesArgs[next].rules) {

				for(let i in queryData.rulesArgs[next].rules) {
					if(winCheckMethods[queryData.rulesArgs[next].rules[i]]) {
						_correct = _correct && winCheckMethods[queryData.rulesArgs[next].rules[i]](data);
					} else {
						_correct = _correct && winCheckMethods.newerWin();
					}
				}
			}

		}

		return _correct;
	},

	lego : data => winCheckMethods.query(data)
}

export default winCheckMethods;