'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';
import common    from 'common';

import forceMove from 'forceMove';

let stepType = 'dealerdeckStepType';

export default function(data) {// data.actionData, e

// default data.actionData.onlyEmpty - false
// default data.actionData.from      - this.name
// default data.actionData.stepType  - NULL
	console.log('dealerDeckAction', this, data);

	if(
		typeof data.actionData.stepType == "string" &&
		data.actionData.stepType != share.get('stepType')
	) {
		return;
	}

	// listen click
	// click is for me (default)
	// if(this.name != data.actionData.name) { return; };
	
	// if(
	// 	!data.eventData ||
	// 	this.name != data.eventData.to.name
	// ) {
	// 	return;
	// };

	// console.log('dealerDeckAction', this, data);

	if(
		!data.eventData.to                  &&
		this.name != data.eventData.to.name
	) {
		return;
	};
	
	// меняем тип хода
	share.set('stepType', stepType);

	let dealDeck = typeof data.actionData.from == "string"
		? Deck.Deck(data.actionData.from)
		: this
	
	// смотрим остались ли карты
	if(dealDeck.cards.length == 0) {

		share.set('stepType', defaults.stepType);

		event.dispatch('actionBreak');
		
		return;
	}

	// карты для раздачи
	var _decks = [];

	// to == toGroup ???
	if(data.actionData.toGroup && !data.actionData.to) {
		
		data.actionData.to = data.actionData.toGroup;
		
		// _decks = _decks.concat(Group.Group(e.toGroup).decks);
		
		// var __decks = Group.Group(data.actionData.toGroup).decks;
		// for(var deckIndex in __decks) {
		// 	_decks.push(__decks[deckIndex]);
		// }
	};

	// есть куда раздать
	if(data.actionData.to) {

		// передали имя
		if(typeof data.actionData.to == "string") {
			
			// ищем элементы с таким именем
			var _elements = common.getElementsByName(data.actionData.to);
			for(var i in _elements) {

				// это группа
				if(_elements[i].type == "group") {
					
					// _decks = _decks.concat(Group.Group(data.actionData.to).decks);
					// var __decks = Group.Group(data.actionData.to).decks;
					
					// берём колоды из группы
					for(var deckIndex in _elements[i].decks) {
						_decks.push(_elements[i].decks[deckIndex]);
					}
				};

				// это колода, добавляем её в список
				if(_elements[i].type == "deck") {
					_decks.push(_el);
				};

			}

		// передали массив
		} else {
			
			for(var i in data.actionData.to) {
				
				var _elements = common.getElementsByName(data.actionData.to[i]);
				
				for(var elIndex in _elements) {

					if(_elements[elIndex].type == "group") {
						// _decks = _decks.concat(Group.Group(data.actionData.to[i]).decks);
						// var __decks = Group.Group(data.actionData.to[i]).decks;
						for(var deckIndex in _elements[elIndex].decks) {
							_decks.push(_elements[elIndex].decks[deckIndex]);
						}
					};

					if(_elements[elIndex].type == "deck") {
						_decks.push(_elements[elIndex]);
					};

				}

			}
		}
	};
	
	// вкл/выкл анимации по умолчанию
	common.animationDefault();

	// флаг, что раздача удалась
	var _makeStep = false;

	// пробегаем колоды из списка
	for(var deckId in _decks) {
		
		// берём верхнюю карту
		var _card = dealDeck.getTopCard();

		// флаг что такой ход возможен
		var _canStep = data.actionData.onlyEmpty
			? _decks[deckId].cards.length == 0
			: true;
		
		if(_canStep && _card) {

			_makeStep = true;

			var _cardName = _card.name;
			
			let _callback = ()=>{
				event.dispatch('checkTips');
			};

			forceMove({
				from : dealDeck.name,
				to   : _decks[deckId].name,
				deck : [_cardName],
				flip : true,
				callback: _callback
			}, true);
			
			_decks[deckId].flipCheck();
			// _decks[deckId].Redraw();

			event.dispatch('addStep', {
				'move' : {
					from : dealDeck.name,
					to   : _decks[deckId].name,
					deck : [_cardName],
					flip : true,
					stepType : share.get('stepType')
				}
			});

		};

	};
	
	if(_makeStep) {

		// сохраняем если паздача удалась
		event.dispatch('saveSteps');
		// event.dispatch('checkTips');
		// if(History.count()) {
		// 	event.dispatch('makeStep', History.get());
		// }

	};

	if(data.actionData.dispatch) {

		event.dispatch(data.actionData.dispatch, !_makeStep);
	} else {
		// сохраняем если ничего не вызываем

		share.set('stepType', defaults.stepType);
	}

}