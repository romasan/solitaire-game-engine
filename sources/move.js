'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import Deck     from 'deck';
import Tips     from 'tips';
import bestTip  from 'bestTip';
import winCheck from 'winCheck';
import Field    from 'field';

var Move = function(moveDeck, to, cursorMove) {

	event.dispatch('startSession', {type: 'move'});

	common.animationDefault();

	let _deck_departure   = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent),// стопка из которой взяли
	    _deck_destination = null,                                                                     // в которую положили
	    _success          = true;

	let _stepType = share.get('stepType');

	if(
		!cursorMove.dbclick           &&
		cursorMove.distance === 0     &&
		share.get('moveDistance') > 0 &&
		_stepType == defaults.stepType
	) {
		// кликнули один раз
		// чтобы сделать ход нужно переместить карту стопку (moveDistance != 0)
		return false;
	}

	// выйти если не стандартный ход
	if(
		_stepType != defaults.stepType &&
		(
			Field.autoSteps             &&
			!Field.autoSteps[_stepType] ||
			!Field.autoSteps
		)
	) {

		let _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);

		event.dispatch('moveCardToHome', {
			moveDeck  : moveDeck             ,
			departure : _deck_departure      ,
			stepType  : share.get('stepType')
		});
		return;
	}

	_success = _success && to;// to - не пустой

	let _el = null;

	if(_success) {
		_el = common.getElementById(to);// получаем карту/стопку
	}

	_success = _success && _el;

	// если положили на карту узнаём из какой она стопки
	if(_success) {
		if(_el.type == 'card') {
			_deck_destination = common.getElementById(_el.parent)
		} else if(_el.type == 'deck') {
			_deck_destination = _el;
		}
	}

	_success = _success && _deck_destination;

	// _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);
		_success = _success && _deck_departure;

		// смотрим не одна и та же ли эта стопка
		if(_deck_destination && _deck_destination.id != _deck_departure.id) {

			// узнаём можно ли положить карты на папку назначения
			var _put = _deck_destination.Put(moveDeck);
			_success = _success && _put;
			if(_put) {// } && _deck_departure) {

				// если можно положить карты берём их из исходной стопки
				var _pop = _deck_departure.Pop(moveDeck.length);
				_success = _success && _pop;

				if(_pop) {
					
					// ложим карты в колоду назначения
					_deck_destination.Push(_pop);

					// режим анимации по умолчанию
					common.animationDefault();

					let _stepType = share.get('stepType');

					let _checkMoveEnd = false;
					
					for(let _actionName in _deck_destination.actions) {
						if(_deck_destination.actions[_actionName].event == "moveEnd") {
							_checkMoveEnd = true;
						}
					}

					event.dispatch('addStep', {
						'move' : {
							from     : _deck_departure  .name      ,
							to       : _deck_destination.name      ,
							deck     : Deck.deckCardNames(moveDeck),
							stepType : {
								undo: _stepType,
								redo: _checkMoveEnd ? "specialStepType" : _stepType
							},
							context  : "move"
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

							event.dispatch('moveEnd:' + share.get('stepType'));
							event.dispatch('moveEnd', {
								from     : _deck_departure      ,
								to       : _deck_destination    ,
								moveDeck : moveDeck             ,
								stepType : share.get('stepType'),
								before   : (e) => {
									if(e && typeof e.stepType == "string") {
										event.dispatch('addStep', {
											'redo': {
												'stepType': e.stepType
											}
										})
									}
								}
							});

							Tips.checkTips();

							winCheck.winCheck({show : true});
						}
					});
				}
			}
		} else {
			// карту отпустили на той же стопке
			// + минимальное неоходимое расстояние для автохода не пройдено
			_success = false;
		}

	// если не кдалось положить карты, вернуть обратно
	// или положить на лучшее возможное место
	if(!_success && _deck_departure) {

		// достаточно ли перетащили (если клика не достаточно и не двойной клик)
		if(
			Field.inputParams.doubleClick                    &&
			cursorMove.dbclick                               ||
			cursorMove.distance >= share.get('moveDistance')
		) {
				var Tip = bestTip(moveDeck, cursorMove);

				if(Tip) {
					Move(moveDeck, Tip.to.deck.id, cursorMove);
					return;
				} else {
					event.dispatch('moveCardToHome', {
						moveDeck  : moveDeck       ,
						departure : _deck_departure
					});
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
