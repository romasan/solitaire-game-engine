'use strict';

import common, {event, share, defaults} from '../common';

import Deck    from '../deck'        ;
import Card    from '../card'        ;
import Tips    from '../tips'        ;
import bestTip from '../tips/bestTip';
import Field   from '../field'       ;

import './autoMoveToHome';

/**
 * @typedef {Object} moveData
 * @property {{card:Card}[]} moveDeck
 * @property {string} to
 * @property {*} cursorMove
 */

/**
 * Move cards from one deck to another
 * @param {moveData} data 
 */
let Move = data => {

	const {
		moveDeck,
		to,
		cursorMove
	} = data;

	// console.log("Move", data);

	let _deck_departure   = moveDeck[0].card.parent                        &&
	                        common.getElementById(moveDeck[0].card.parent)   , // стопка из которой взяли
	    _deck_destination = null                                             , // в которую положили
	    _success          = true                                             ; // флаг возможности хода

	let _stepType = share.get('stepType');

	if (
		!cursorMove.dbclick           &&
		 cursorMove.distance    === 0 &&
		share.get('moveDistance') > 0 &&
		_stepType == defaults.stepType
	) {
		// кликнули один раз
		// чтобы сделать ход нужно переместить карту стопку (moveDistance != 0)
		return false;
	}

	// выйти если не стандартный ход
	if (
		_stepType != defaults.stepType  &&
		(
			 Field.autoSteps            &&
			!Field.autoSteps[_stepType] ||
			!Field.autoSteps
		)
	) {

		let _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);

		event.dispatch('moveCardBack', {
			"moveDeck"  : moveDeck             ,
			"departure" : _deck_departure      ,
			"stepType"  : share.get('stepType')
		});

		return;
	}

	event.dispatch('startSession', {
		"type" : 'move'
	});

	_success = _success && to; // to - не пустой

	// if (
	// 	typeof to != "string"         ||
	// 	       to.indexOf('deck') < 0
	// ) {
	// 	console.warn('data TO is incorrect', to);
	// }

	let _el = null;

	if (_success) {
		_el = common.getElementById(to); // получаем карту/стопку
	}

	_success = _success && _el;

	// если положили на карту узнаём из какой она стопки
	if (_success) {
		if (_el.type == 'card') {
			_deck_destination = common.getElementById(_el.parent);
		} else if (_el.type == 'deck') {
			_deck_destination = _el;
		}
	}

	_success = _success && _deck_destination;

	// _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);
	_success = _success && _deck_departure;

	_success = _success && _deck_destination.id != _deck_departure.id;

	// смотрим не одна и та же ли эта стопка
	if (_success) {

		// узнаём можно ли положить карты на папку назначения
		let _put = _deck_destination.Put(moveDeck);
		_success = _success && _put;

		if (_put) {

			// если можно положить карты берём их из исходной стопки
			let _pop = _deck_departure.Pop(moveDeck.length);
			_success = _success && _pop;

			if (_pop) {

				// ложим карты в колоду назначения
				_deck_destination.Push(_pop, false);

				// режим анимации по умолчанию
				// common.animationDefault();

				let _checkMoveEnd = false;

				for (let _actionName in _deck_destination.actions) {
					if (_deck_destination.actions[_actionName].event == 'moveEnd') {
						_checkMoveEnd = true;
					}
				}

				let issetMoves = null;

				let _callback = e => {

					// TODO add card index ?
					event.dispatch('addStep', {
						"move" : {
							"from"     : _deck_departure  .name      ,
							"to"       : _deck_destination.name      ,
							"deck"     : Deck.deckCardNames(moveDeck),
							"stepType" : {
								"undo" : _stepType,
								"redo" : _stepType
							},
							"context"  : "move"
						}
					});

					if (
						// !event.has('moveEnd', {
						!event.has('actionEvent:moveEnd:' + _deck_destination.name, {
							tag: event.tags.inGame
						}) ||
						share.get('autoStep:stepType') == share.get('stepType')
					) {
						event.dispatch('stopSession');
					}

					Tips.checkTips();

					if (
						_deck_departure.autoUnflipTop                                &&
						_deck_departure.cards.length > 0                             &&
						_deck_departure.cards[_deck_departure.cards.length - 1].flip
					) {
						_deck_departure.unflipTopCard(true);
					}

					let moveEndData = {
						"from"     : _deck_departure      ,
						"to"       : _deck_destination    ,
						"moveDeck" : moveDeck             ,
						"stepType" : share.get('stepType')
					};

					event.dispatch('moveEnd:beforeSave', moveEndData); // used in autoMoveToHome

					let _tips = Tips.getTips();

					if (
						_deck_destination.save         ||
						_tips.length > 0               &&
						_stepType != defaults.stepType
					) {
						event.dispatch('saveSteps', 'MOVE');
					}

					event.dispatch('moveEnd:' + share.get('stepType'));

					event.dispatch('moveEnd', moveEndData);

					event.dispatch('winCheck', {
						"show" : true
					});

					if (_deck_departure.autoCheckFlip) {
						_deck_departure.checkFlip();
						_deck_departure.Redraw();
					}

					if (_deck_destination.autoCheckFlip) {
						_deck_destination.checkFlip();
						_deck_destination.Redraw();
					}
				};

				event.dispatch('moveDragDeck', {
					"departure"   : _deck_departure  ,
					"destination" : _deck_destination,
					"moveDeck"    : moveDeck         ,
					"callback"    : _callback
				});
			}
		}
	}

	// если не удалось положить карты, вернуть обратно
	// или положить на лучшее возможное место
	if (!_success && _deck_departure) {

		// console.log("Move (!_success)", data, '>>>', debug_counter, '<<<', data.to);		

		// достаточно ли перетащили (если клика не достаточно и не двойной клик)
		if (
			Field.inputParams.doubleClick                    &&
			cursorMove.dbclick                               ||
			cursorMove.distance >= share.get('moveDistance')
		) {

			let Tip = bestTip(moveDeck, cursorMove);

			// console.log('Лучший ход:', Tip);

			if (Tip) {

				Move({
					"moveDeck"   : moveDeck      ,
					"to"         : Tip.to.deck.id, 
					"cursorMove" : cursorMove
				});

				return;
			} else {

				event.dispatch('moveCardBack', {
					"moveDeck"  : moveDeck       ,
					"departure" : _deck_departure
				});
				// ^ callback
				event.dispatch('stopSession');
			}

		} else {

			event.dispatch('moveCardBack', {
				"moveDeck"  : moveDeck       ,
				"departure" : _deck_departure
			});

			event.dispatch('stopSession');
		}
	}
};


/**
 * move - Listener
 */
event.listen('move', Move);