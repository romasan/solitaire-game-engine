'use strict';

module.exports = function(main, share) {
	
	var wcm = share.winCheckMethods = {
			
		// Filters

		// возвращает колоды определённой группы/групп
		group : function(a) {
			if(!a.filter) return false;
			var _decks = [];
			for(var _i in a.decks) {
				
				// console.log('group filter:', _i, a.decks[_i].parent(), a.filterArgs);
				// var _parent = a.decks[_i].parent()
				// if(a.filterArgs.indexOf(a.decks[_i].parent())) {
				if(
					(
						typeof a.filterArgs  == "string" 
					 && a.decks[_i].parent() == a.filterArgs
					)
				 || a.filterArgs.indexOf(a.decks[_i].parent()) >= 0
				) {
					_decks.push(a.decks[_i]);
				}
			}
			a.decks = _decks;
			return _decks.length;
		},

		// Internal use

		_asc_desk : function(a) {

			if(!a || a.asc_desk == null || typeof a.asc_desk != 'number') return false;

			var _correct = true;
			
			for(var d in a.decks) {

				// console.log('_asc_desk', a.asc_desk ? 'asc' : 'desk', a.asc_desk, d, a.decks[d], _correct, a.decks[d].getCards());
				if(_correct == false) return false;
				
				var _cards = a.decks[d].getCards();
				// console.log('cards:', _cards);
				for(var c in _cards) {
					if(c > 0) {	
						var down = share.validateCardName(_cards[(c|0) - 1].name),
							up   = share.validateCardName(_cards[(c|0)].name);
						// console.log('_asc_desk', down, up, a.asc_desk);	
						_correct = _correct && down && up && share.cardsRankS.indexOf(down.rank) == (share.cardsRankS.indexOf(up.rank) + a.asc_desk);
						
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
				_correct = _correct && a.decks[_i].getCards().length == 0;
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
				if(a.decks[i].getCards().length == 0) {
					_emptyDecksCount += 1;
				} else {
					fillIndex = i;
				}
				_decksLength += 1;
			}
			// console.log('allinone', a, _emptyDecksCount, _decksLength);
			var _correct = _emptyDecksCount == _decksLength - 1;
			if(a.filter) a.decks = _correct ? [a.decks[fillIndex]] : [];
			return _correct

				/*? a.rulesArgs 
					? _oneDeck 
					: true 
				: false;*/
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
				
			// console.log('check Win, rule - allDescent:', a);
			a.asc_desk = 1;
			return wcm._asc_desk(a);
		},


		// Composite rules (input arguments)
		// комбинированное правило
		lego : function(_a) {
			
			// console.log(a.rulesArgs.filters, a.rulesArgs.rules)
			
			if(!_a || !_a.rulesArgs) return false;
			
			var _correct = true;
			
			// apply filters
			for(var next in _a.rulesArgs) {
			// console.log('check Win, LEGO RULE:', _a.rulesArgs[next]);

				var _decksClone = {};
				for(var i in _a.decks) _decksClone[i] = _a.decks[i];
				var a = {
					// filters : _a[next].filters,
					// rules   : _a[next].rules,
					decks   : _decksClone
				};

				// применяем фильтры, оставляем только интересующие колоды
				
				if(_correct && _a.rulesArgs[next].filters) {

					a.filter = true;
					

					for(var i in _a.rulesArgs[next].filters) {
						// console.log('LEGO FILTER', i, _a.rulesArgs[next].filters[i])

						if(typeof _a.rulesArgs[next].filters[i] == 'string' && wcm[_a.rulesArgs[next].filters[i]]) {

							// alert((function(a){var _c = 0;for(var _i in a){_c += 1;};return _c;})(a.decks));
							// console.log('apply filter', _a.rulesArgs[next].filters[i], 'start', a);
							
							_correct = _correct && wcm[_a.rulesArgs[next].filters[i]](a);
							// wcm[a.rulesArgs.filters[i]](a);
							
							// console.log('apply filter', a.rulesArgs.filters, 'result:', a);
						} else {
							if(typeof _a.rulesArgs[next].filters[i] == 'object') {

								// console.log('filters:', _a.rulesArgs[next].filters[i]);
								for(var filterName in _a.rulesArgs[next].filters[i]) {
									// var filterName = _a.rulesArgs[next].filters[i][filterIndex];
									// console.log('apply filter', filterName);
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
						// console.log('apply rule', _a.rulesArgs[next].rules[i])
						if(wcm[_a.rulesArgs[next].rules[i]]) {
							_correct = _correct && wcm[_a.rulesArgs[next].rules[i]](a);
						} else {
							console.log('#2')
							_correct = _correct && wcm['newerWin']();
						}
					}
				}

				// console.log('rules:', _correct ? 'success' : 'fail');
			}

			return _correct;
		}
	}

	main.winCheck = function(a) {
		if(!a) a = {};
		if(typeof a.show == 'undefined') a.show = false;
		// console.log('winCheck', a);
		return share.winCheck(a);
		// return winCheck({noCallback : true});
	}.bind(main);

	share.winCheck = function(params) {

		// var _decks = main.getDecks();
		
		if(typeof share.winCheckMethod == 'function') {
			if(share.winCheckMethod({
				decks : main.getDecks({visible : true})
			})) {
				EventManager.dispatch('win', params);
				// if(params && params.noCallback == true) return true;
				// a.winCheck.callback();
				return true;
			}
		} else {
			
			var rulesCorrect = true;
			var _hasMetods = false;
			for(var i in share.winCheckMethod) {
				_hasMetods = true;
				if(share.winCheckMethods[i]) {
 					
 					rulesCorrect = rulesCorrect && share.winCheckMethods[i]({
 						decks     : main.getDecks({visible : true}), 
 						rulesArgs : share.winCheckMethod[i]
 					});

				} else {
					if(typeof share.winCheckMethod[i] == 'function') {
						rulesCorrect = rulesCorrect && share.winCheckMethod[i]({
							decks : main.getDecks({visible : true})
						});
					} else {
						rulesCorrect = rulesCorrect && share.winCheckMethods['newerWin']();
					}
				}
			}
			if(!_hasMetods) {
				rulesCorrect = rulesCorrect && share.winCheckMethods['newerWin']();
			}

			if(rulesCorrect) {
				if(params && params.noCallback == true) return true;
				main.event.dispatch('win', params);
				// a.winCheck.callback();
				return true;
			}

			return false;
			// return rulesCorrect;
		}
	}

};