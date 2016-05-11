'use strict';

/*
 * Client-server application for planning biomechanical stimulation
 * version: 1.0
 * author: Romasan
 * date: 05.05.2016
 */

// import share    from 'share';
import common   from 'SolitaireCommon';
import defaults from 'defaults';

var wcm = {
	// Filters

	// возвращает колоды определённой группы/групп
	group : function(a) {

		// console.log("winCheck:group", a);

		if(!a.filter || !a.filterArgs) { return false; }

		var _decks = [];
		for(var _i in a.decks) {
			
			// console.log('group filter:', _i, a.decks[_i].parent, a.filterArgs);
			// var _parent = a.decks[_i].parent
			// if(a.filterArgs.indexOf(a.decks[_i].parent)) {
			if(
				(
					typeof a.filterArgs == "string" 
				 && a.decks[_i].parent  == a.filterArgs
				)
			 || (
			 		a.filterArgs.length
			 	 && a.filterArgs.indexOf(a.decks[_i].parent) >= 0
			 	)
			) {
				_decks.push(a.decks[_i]);
			}
		}
		
		a.decks = _decks;
		return _decks.length;

	},

	groups : function(a) {
		return wcm.group(a);
	},

	// groups : function() {},

	// Internal use

	_asc_desk : function(a) {

		if(!a || a.asc_desk == null || typeof a.asc_desk != 'number') return false;

		var _correct = true;
		
		for(var d in a.decks) {

			// console.log('_asc_desk', a.asc_desk ? 'asc' : 'desk', a.asc_desk, d, a.decks[d], _correct, a.decks[d].cards);
			if(!_correct) return false;
			
			var _cards = a.decks[d].cards;
			// console.log('cards:', _cards);
			for(var c in _cards) {
				if(c > 0) {	
					var down = common.validateCardName(_cards[(c|0) - 1].name),
						up   = common.validateCardName(_cards[(c|0)].name);
					// console.log('_asc_desk', down, up, a.asc_desk);	
					var _cardsRankS = defaults.card.ranks;
					_correct = _correct && down && up && _cardsRankS.indexOf(down.rank) == (_cardsRankS.indexOf(up.rank) + a.asc_desk);
					
				}
			}

		}
		return _correct;
	},

	// Simple rules

	newerWin : function() {
		console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.")
		return false;
	},

	// все колоды пусты

	allEmpty : function(a) {

		var _correct = true;
		for(var _i in a.decks) {
			_correct = _correct && a.decks[_i].cards.length == 0;
		}
		return _correct;
	},

	// Combined rules (use like filter)

	// все карты в одной колоде
	allInOne : function(a) {

		// console.log('check Win, rule/filter - allInOne:', a);

		var _emptyDecksCount = 0,
			_decksLength     = 0,
			_fillIndex       = 0;
		for(var i in a.decks) {
			if(a.decks[i].cards.length == 0) {
				_emptyDecksCount += 1;
			} else {
				_fillIndex = i;
			}
			_decksLength += 1;
		}
		// console.log('allinone', a, _emptyDecksCount, _decksLength);
		var _correct = _emptyDecksCount == _decksLength - 1;
		if(a.filter) {
			a.decks = _correct ? [a.decks[_fillIndex]] : [];
		}
		return _correct
	},

	// step by step 1, 2, 3
	// во всех колодах карты по возрастанию
	allAscend : function(a) {

		// console.log('check Win, rule - allAscending:', a);
		a.asc_desk = -1;
		return wcm._asc_desk(a);
	},
	
	// step by step 3, 2, 1
	// во всех колодах карты по убыванию
	allDescent : function(a) {
			
		a.asc_desk = 1;
		return wcm._asc_desk(a);
	},

	// Composite rules (input arguments)
	// комбинированное правило
		
	lego : function(_a) {
		
		// console.log('LEGO', _a);//a.rulesArgs.filters, a.rulesArgs.rules)
		
		if(!_a || !_a.rulesArgs) return false;
		
		var _correct = true;
		
		// apply filters
		for(var next in _a.rulesArgs) {

			var _decksClone = {};
			for(var i in _a.decks) {
				_decksClone[i] = _a.decks[i];
			}
			var a = {
				// filters : _a[next].filters,
				// rules   : _a[next].rules,
				decks   : _decksClone
			};

			// применяем фильтры, оставляем только интересующие колоды
			
			if(_correct && _a.rulesArgs[next].filters) {

				a.filter = true;

				for(var i in _a.rulesArgs[next].filters) {
					if(typeof _a.rulesArgs[next].filters[i] == 'string' && wcm[_a.rulesArgs[next].filters[i]]) {
						a.filterArgs = null;
						_correct = _correct && wcm[_a.rulesArgs[next].filters[i]](a);
					} else {
						// if(typeof _a.rulesArgs[next].filters[i] == 'object') {
						if (_a.rulesArgs[next].filters[i]
						 && _a.rulesArgs[next].filters[i].toString() == "[object Object]"
						) {
							for(var filterName in _a.rulesArgs[next].filters[i]) {
								if(wcm[filterName]) {
									a.filterArgs = _a.rulesArgs[next].filters[i][filterName]
									_correct = _correct && wcm[filterName](a);
								} else {
									_correct = _correct && wcm['newerWin']();
								}
							}
						} else {
							_correct = _correct && wcm['newerWin']();
						}
						
			
					}
				}
				
				a.filter = false;
			}

			// применяем правила к оставшимся колодам

			if(_a.rulesArgs[next].rules) {
				
				for(var i in _a.rulesArgs[next].rules) {
					if(wcm[_a.rulesArgs[next].rules[i]]) {
						_correct = _correct && wcm[_a.rulesArgs[next].rules[i]](a);
					} else {
						console.log('#2')
						_correct = _correct && wcm['newerWin']();
					}
				}
			}
			
		}

		return _correct;
	}
};

export default wcm;