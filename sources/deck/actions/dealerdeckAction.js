'use strict';

import event      from 'event'     ;
import share      from 'share'     ;
import defaults   from 'defaults'  ;
import common     from 'common'    ;

import forceMove  from 'forceMove' ;
import deckAction from 'deckAction';

const stepType = 'dealerdeckStepType';

class dealerdeckAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {// data.actionData, e

		// default data.actionData.onlyEmpty - false
		// default data.actionData.from      - deck.name
		// default data.actionData.stepType  - NULL

		// console.log('dealerdeckAction:', deck.name, data);

		if(
			typeof data.actionData.stepType == 'string'              &&
			       data.actionData.stepType != share.get('stepType')
		) {

			super.break();

			return;
		}

		// меняем тип хода
		share.set('stepType', stepType);

		let dealDeck = typeof data.actionData.from == 'string'
			? Deck.getDeck(data.actionData.from)
			: deck

		// смотрим остались ли карты
		if(dealDeck.cards.length == 0) {

			share.set('stepType', defaults.stepType);

			event.dispatch('actionBreak');
			event.dispatch('dealEnd');

			super.end();

			return;
		}

		// карты для раздачи
		let _decks = [];

		// to == toGroup ???
		if(data.actionData.toGroup && !data.actionData.to) {
			
			data.actionData.to = data.actionData.toGroup;
			
		};

		// есть куда раздать
		if(data.actionData.to) {

			// передали имя
			if(typeof data.actionData.to == 'string') {

				// ищем элементы с таким именем
				let _elements = common.getElementsByName(data.actionData.to);
				for(let i in _elements) {

					// это группа
					if(_elements[i].type == 'group') {

						// _decks = _decks.concat(Group.Group(data.actionData.to).decks);
						// let __decks = Group.Group(data.actionData.to).decks;

						// берём колоды из группы
						for(let deckIndex in _elements[i].decks) {
							_decks.push(_elements[i].decks[deckIndex]);
						}
					};

					// это колода, добавляем её в список
					if(_elements[i].type == 'deck') {
						_decks.push(_el);
					};

				}

			// передали массив
			} else {

				for(let i in data.actionData.to) {

					let _elements = common.getElementsByName(data.actionData.to[i]);

					for(let elIndex in _elements) {

						if(_elements[elIndex].type == 'group') {
							// _decks = _decks.concat(Group.Group(data.actionData.to[i]).decks);
							// let __decks = Group.Group(data.actionData.to[i]).decks;
							for(let deckIndex in _elements[elIndex].decks) {
								_decks.push(_elements[elIndex].decks[deckIndex]);
							}
						};

						if(_elements[elIndex].type == 'deck') {
							_decks.push(_elements[elIndex]);
						};
					}
				}
			}
		};

		// вкл/выкл анимации по умолчанию
		common.animationDefault();

		// флаг, что раздача удалась
		let _makeStep = false;

		// пробегаем колоды из списка
		for(let deckId in _decks) {

			// берём верхнюю карту
			let _card = dealDeck.getTopCard();

			// флаг что такой ход возможен
			let _canStep = data.actionData.onlyEmpty
				? _decks[deckId].cards.length == 0
				: true;

			if(_canStep && _card) {

				_makeStep = true;

				let _cardName = _card.name;

				let _callback = e => {
					event.dispatch('checkTips');
				};

				forceMove({
					"from"     : dealDeck.name      ,
					"to"       : _decks[deckId].name,
					"deck"     : [_cardName]        ,
					"flip"     : true               ,
					"callback" : _callback
				}, true);

				_decks[deckId].flipCheck();
				// _decks[deckId].Redraw();

				event.dispatch('dealEnd');

				event.dispatch('addStep', {
					'move' : {
						"from"     :       dealDeck.name,
						"to"       : _decks[deckId].name,
						"deck"     : [_cardName]        ,
						"flip"     : true               ,
						"stepType" : {
							"undo" : share.get('stepType'),
							"redo" : data.actionData.dispatch
								? share.get('stepType')
								: defaults.stepType
						},
						"context"  : 'dealerdeckAction'
					}
				});
			}
		}

		if(_makeStep) {
			// сохраняем если паздача удалась
			event.dispatch('saveSteps', 'DEALERDECKACTION');
		}

		if(data.actionData.dispatch) {

			console.log('dealerdeckAction:dispatch:', data.actionData.dispatch);
			event.dispatch(data.actionData.dispatch, !_makeStep);
		} else {

			super.end();
			// сохраняем если ничего не вызываем
			share.set('stepType', defaults.stepType);
		}
	}
}

export default new dealerdeckAction();