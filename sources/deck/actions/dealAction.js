'use strict';

import event      from '../../common/event'   ;
import share      from '../../common/share'   ;
import defaults   from '../../common/defaults';
import common     from '../../common'         ;

import forceMove  from '../../move/forceMove' ;
import deckAction from './deckAction'         ;
import History    from '../../history'        ;

const stepType = 'dealStepType';

/*
 * run
 * end
 */ 

class dealAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) { // Deck, {actionData, eventData, eventName}

		// console.groupCollapsed('dealAction:run');
		// console.log(JSON.stringify(data, true, 2));
		// console.groupEnd();

		let save = typeof data.eventData.save == "boolean" ? data.eventData.save : true;

		// default data.actionData.onlyEmpty - false
		// default data.actionData.from      - deck.name
		// default data.actionData.stepType  - NULL

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
			: deck;

		// смотрим остались ли карты
		if(dealDeck.cards.length == 0) {

			let _stepType = share.get('stepType');

			if(_stepType != defaults.stepType) {

				share.set('stepType', defaults.stepType);

				event.dispatch('addStep', {
					"setStepType" : defaults.stepType
				});
			}

			event.dispatch('actionBreak');

			this.end();

			let history = History.get(false);

			// есть ли что либо на запись в историю
			if(history.length > 0) {

				// console.log('dealAction:nomoves:save');

				event.dispatch('saveSteps');
			}

			return;
		}

		// to == toGroup ???
		if(data.actionData.toGroup && !data.actionData.to) {
			
			data.actionData.to = data.actionData.toGroup;
			
		};

		// стопки для раздачи
		let _decks = [];

		// есть куда раздавать
		if(data.actionData.to) {

			// выбираем стопки для раздачи

			// передали имя стопки/группы
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

			// передали массив имён стопок/групп
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

		let moveDecks = _decks.filter(e => e.cards.length == 0);
		let _iterations = moveDecks.length;

		// for(let deckId in _decks) {
		for(let deckId in moveDecks) {

			// флаг что такой ход возможен
			let _canStep = data.actionData.onlyEmpty
				? moveDecks[deckId].cards.length == 0
				: true;

			if(
				_canStep &&
				dealDeck.cards.length > 0
			) {

				let _steps = [];

				// берём верхнюю карту
				let _card = dealDeck.getTopCard();

				_makeStep = true;

				let _cardName = _card.name;

				let cardIndex = dealDeck.cards.length;

				// #1

				if(!dealDeck.autoCheckFlip) {
					event.dispatch('addStep', {
						"step" : {
							"unflip" : {
								"deckName"  : dealDeck.name,
								"cardName"  : _cardName    ,
								"cardIndex" : cardIndex - 1
							}
						},
						"callback" : stepId => {
							_steps.push(stepId)
						}
					});
				}

				// dealDeck.Redraw();

				event.dispatch('addStep', {
					"step" : {	
						"move" : {
							"from"     : dealDeck         .name,
							"to"       : moveDecks[deckId].name,
							"deck"     : [_cardName]           ,
							// "flip"     : true               ,
							"stepType" : {
								"undo" : share.get('stepType'),
								"redo" : data.actionData.dispatch
									? share.get('stepType')
									: defaults.stepType
							},
							"context"  : 'dealAction'
						}
					},
					"callback" : stepId => {
						_steps.push(stepId)
					}
				});

				let _callback = e => {

					_iterations -= 1;

					// console.log('dealAction:run:_callback', _iterations);

					if(_iterations == 0) {
						// _after();
						// let _after = e => {
							
						// #2

						if(_makeStep && save) { // && hasNextSteps
							// сохраняем если раздача удалась
							event.dispatch('saveSteps');
						}

						if(data.actionData.dispatch) {

							event.dispatch(data.actionData.dispatch, !_makeStep);
						} else {

							this.end();
							// сохраняем если ничего не вызываем
							share.set('stepType', defaults.stepType);
						}

						// TODO if "autoCheckFlip" param for deck
						// if(dealDeck.autoCheckFlip) {
						// 	dealDeck.checkFlip();
						// 	dealDeck.Redraw();
						// }

						event.dispatch('dealEnd');
						// };
					}

					event.dispatch('checkTips');
				};

				// event.once('clearCallbacks', e => {
				// 	_callback = e => {};
				// });

				let forceMoveData = {
					"from"     : dealDeck.name      ,
					"to"       : moveDecks[deckId].name,
					"deck"     : [_cardName]        ,
					// "flip"     : false              ,
					"callback" : _callback          ,
					"steps"    : _steps               // массив с Id ходов приготовленных на запись в историю
				};

				if(!dealDeck.autoCheckFlip) {
					forceMoveData.flip = false;
				}

				forceMove(forceMoveData, true);

				// moveDecks[deckId].checkFlip();
				// _decks[deckId].Redraw();

				// #1
			}
		}

		// #2
	}

	end() {

		event.dispatch('dealEnd');

		super.end();
	}
}

export default new dealAction();
