'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import Deck     from 'addDeck';
import Tips     from 'tips';
import bestTip  from 'bestTip';
import winCheck from 'winCheck';
import Field    from 'field';

var Move = function(moveDeck, to, cursorMove) {// 

	common.animationDefault();

	let _deck_departure   = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent), // исходная стопка
	    _deck_destination = null,                                                                      // стопка назначения
	    _success          = true;                                                                      // ход возможен

	let _stepType = share.get('stepType');

	if(
		!cursorMove.dbclick           && // одиночный клик
		cursorMove.distance === 0     && // курсор не перемещён
		share.get('moveDistance') > 0 && // перетаскивание больше одного пикселя
		_stepType == defaults.stepType   // тип хода по умолчанию
	) {
		// кликнули один раз
		// чтобы сделать ход нужно переместить карту стопку (moveDistance != 0)
		return false;
	}

	// выйти если не стандартный ход
	if(
		_stepType != defaults.stepType &&  //  1) тип хода не по умолчанию
		(
			Field.autoSteps             && //  2) есть автоходы
			!Field.autoSteps[_stepType] || // 3а) нет автохода для текушего типа хода
			!Field.autoSteps               // 3б) нет автоходов
		)
	) {
		
		// возвращаем карты откуда взяли
		event.dispatch('moveCardToHome', {
			moveDeck  : moveDeck             ,
			departure : _deck_departure      ,
			stepType  : share.get('stepType')
		});

		return;
	}

	_success = _success && to;// to - не пустой

	let _el = to && to.id && common.getElementById(to.id);// получаем карту/стопку

	// стопка назначения
	// если положили на карту узнаём из какой она стопки
	if(_el) {
		if(_el.type == 'card') {
			_deck_destination = common.getElementById(_el.parent)
		} else if(_el.type == 'deck') {
			_deck_destination = _el;
		}
	}

	// существует исходная стопка (из которой собираемся взять)
	_success = _success && _deck_departure;

	// существует стопка назначения (в которую собираемся положить)
	_success = _success && _deck_destination;

	// смотрим не одна и та же ли эта стопка
	if(
		_success                                             &&
		_deck_destination.getId() != _deck_departure.getId()
	) {

		// узнаём можно ли положить карты на в стопку назначения
		var _put = _deck_destination.Put(moveDeck);
		_success = _success && _put;

		if(_success) {// можно положить карты в стопку назначения

			// берём карты из исходной стопки
			var _pop = _deck_departure.Pop(moveDeck.length);
			_success = _success && _pop;

			if(_success) {
				
				// ложим карты в колоду назначения
				_deck_destination.Push(_pop);

				// устанавливаем режим анимации по умолчанию
				// TODO вынести из логики
				common.animationDefault();

				let _stepType     = share.get('stepType'),
				    _prevStepType = share.get('prevStepType');

				// if(
				// 	_stepType == 'default'     &&
				// 	_deck_destination.longStep
				// ) {
				// 	// ???
				// } else {

				event.dispatch('addStep', {
					'move' : {
						from         : _deck_departure  .name      ,
						to           : _deck_destination.name      ,
						deck         : Deck.deckCardNames(moveDeck),
						stepType     : _stepType                   ,
						prevStepType : _prevStepType
					}
				})
				
				if(_deck_destination.save) {
					event.dispatch('saveSteps');
				}

				event.dispatch('moveDragDeck', {
					
					departure   : _deck_departure  ,
					destination : _deck_destination,
					moveDeck    : moveDeck         ,
					
					callback    : () => {

						event.dispatch(`moveEnd:${share.get('stepType')}`);
						event.dispatch('moveEnd', {
							from     : _deck_departure      ,
							to       : _deck_destination    ,
							moveDeck : moveDeck             ,
							stepType : share.get('stepType')
						});

						Tips.checkTips();

						winCheck.winCheck({show : true});
					}
				});

				// }

			}
		}
	} else {
		// карту отпустили на той же стопке
		// + минимальное неоходимое расстояние для автохода не пройдено
		_success = false;
	}

	// если не удалось положить карты, вернуть обратно
	// или положить на лучшее возможное место
	if(!_success) {

		// достаточно ли перетащили (если клика не достаточно и не двойной клик)
		if(
			Field.inputParams.doubleClick                    &&
			cursorMove.dbclick                               ||
			cursorMove.distance >= share.get('moveDistance')
		) {
			var Tip = bestTip(moveDeck, cursorMove);

			if(Tip) {
				Move(moveDeck, Tip.to.deck.domElement.el, cursorMove);
				return;
			} else {
				event.dispatch('moveCardToHome', {
					moveDeck  : moveDeck       ,
					departure : _deck_departure
				});
				// share.moveCardToHome();
			}

		} else {
			event.dispatch('moveCardToHome', {
				moveDeck  : moveDeck       ,
				departure : _deck_departure
			});
		}

	}
};

event.listen('Move', function(e) {
	Move(e.moveDeck, e.to, e.cursorMove);
});
