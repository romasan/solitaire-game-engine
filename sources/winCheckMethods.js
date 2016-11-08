'use strict';

/*
 * Client-server application for planning biomechanical stimulation =)
 * version: 1.0
 * author: Romasan
 * date: 05.05.2016
 */

// import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

let wcm = {
	
	// Filters

	// возвращает колоды определённой группы/групп
	group : (a) => {

		if(!a.filter || !a.filterArgs) {
			return false;
		}

		let _decks = [];
		for(let _i in a.decks) {
			
			// let _parent = a.decks[_i].parent
			// if(a.filterArgs.indexOf(a.decks[_i].parent)) {
			if(
				(
					typeof a.filterArgs == "string"     &&
					a.decks[_i].parent  == a.filterArgs
				) ||
				(
			 		a.filterArgs.length                           &&
			 		a.filterArgs.indexOf(a.decks[_i].parent) >= 0
			 	)
			) {
				_decks.push(a.decks[_i]);
			}
		}
		
		a.decks = _decks;

		return _decks.length;
	},

	groups : (a) => {
		return wcm.group(a);
	},

	deck: (a) => {
		
		if(!a.filter || !a.filterArgs) {
			return false;
		}
		
		let _decks = [];

		for(let _i in a.decks) {
			if(
				typeof a.filterArgs == "string"             &&
				a.decks[_i].name == a.filterArgs            ||
				a.filterArgs.indexOf(a.decks[_i].name) >= 0
			) {
				_decks.push(a.decks[_i]);
			}
		}
				
		a.decks = _decks;
		return _decks.length;
	},
	
	decks: (a) => {
		return wcm.deck(a);
	},

	// Tag filters

	firstEmpty: (a) => {

		let _decks = [];
		
		for(let _i in a.decks) {
			if(a.decks[_i].tags.indexOf('last') >= 0) {
				_decks.push(a.decks[_i]);
			}
		}

		a.decks = _decks;

		return _decks.length;
	},

	// Internal use

	_asc_desk : (a) => {

		if(!a || typeof a.asc_desk != 'number') {
			return false;
		}

		let _correct = true;
		
		for(let d in a.decks) {

			if(!_correct) {
				return false;
			}
			
			let _cards = a.decks[d].cards;
			for(let c in _cards) {
				if(c > 0) {	
					let down = common.validateCardName(_cards[(c|0) - 1].name),
						  up   = common.validateCardName(_cards[(c|0)].name);
					let _cardsRankS = defaults.card.ranks;
					_correct = _correct && down && up && _cardsRankS.indexOf(down.rank) == (_cardsRankS.indexOf(up.rank) + a.asc_desk);
					
				}
			}

		}

		console.log('asc_desk', a.asc_desk, _correct);

		return _correct;
	},

	// Simple rules

	newerWin : () => {
		
		console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.")
		
		return false;
	},

	// все колоды пусты

	allEmpty : (a) => {

		let _correct = true;
		
		for(let _i in a.decks) {
			_correct = _correct && a.decks[_i].cards.length === 0;
		}
		
		return _correct;
	},
	
	empty: (a) => {
		wcm.allEmpty(a);
	},

	// Combined rules (use like filter)

	// все карты в одной колоде
	allInOne : (a) => {

		let _emptyDecksCount = 0,
			_decksLength     = 0,
			_fillIndex       = 0;
		
		for(let i in a.decks) {
			if(a.decks[i].cards.length === 0) {
				_emptyDecksCount += 1;
			} else {
				_fillIndex = i;
			}
			_decksLength += 1;
		}
		
		let _correct = _emptyDecksCount == _decksLength - 1;
		
		if(a.filter) {
			a.decks = _correct ? [a.decks[_fillIndex]] : [];
		}

		return _correct
	},

	// step by step 1, 2, 3
	// во всех колодах карты по возрастанию
	allAscend : (a) => {

		a.asc_desk = -1;
		
		return wcm._asc_desk(a);
	},
	
	// step by step 3, 2, 1
	// во всех колодах карты по убыванию
	allDescent : (a) => {
			
		a.asc_desk = 1;
		
		return wcm._asc_desk(a);
	},

	// Composite rules (input arguments)
	// комбинированное правило
		
	lego : (_a) => {
		
		if(!_a || !_a.rulesArgs) {
			return false;
		}
		
		let _correct = true;
		
		// apply filters
		for(let next in _a.rulesArgs) {

			let _decksClone = {};
			for(let i in _a.decks) {
				_decksClone[i] = _a.decks[i];
			}
			let a = {
				// filters : _a[next].filters,
				// rules   : _a[next].rules,
				decks   : _decksClone
			};

			// применяем фильтры, оставляем только интересующие колоды
			
			if(_correct && _a.rulesArgs[next].filters) {

				a.filter = true;

				for(let i in _a.rulesArgs[next].filters) {
					if(typeof _a.rulesArgs[next].filters[i] == 'string' && wcm[_a.rulesArgs[next].filters[i]]) {
						a.filterArgs = null;
						_correct = _correct && wcm[_a.rulesArgs[next].filters[i]](a);
					} else {
						// if(typeof _a.rulesArgs[next].filters[i] == 'object') {
						if (
							_a.rulesArgs[next].filters[i]                                 &&
							_a.rulesArgs[next].filters[i].toString() == "[object Object]"
						) {
							for(let filterName in _a.rulesArgs[next].filters[i]) {
								if(wcm[filterName]) {
									a.filterArgs = _a.rulesArgs[next].filters[i][filterName]
									_correct = _correct && wcm[filterName](a);
								} else {
									_correct = _correct && wcm.newerWin();
								}
							}
						} else {
							_correct = _correct && wcm.newerWin();
						}
						
			
					}
				}
				
				a.filter = false;
			}

			// применяем правила к оставшимся колодам

			if(_a.rulesArgs[next].rules) {
				
				for(let i in _a.rulesArgs[next].rules) {
					if(wcm[_a.rulesArgs[next].rules[i]]) {
						_correct = _correct && wcm[_a.rulesArgs[next].rules[i]](a);
					} else {
						_correct = _correct && wcm.newerWin();
					}
				}
			}
			
		}

		return _correct;
	}
}

export default wcm;