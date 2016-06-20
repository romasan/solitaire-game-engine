'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import Deck     from 'addDeck';
import Tips     from 'tips';
import bestTip  from 'bestTip';
import History  from 'history';
import winCheck from 'winCheck';
import Field    from 'field';

var Move = function(moveDeck, to, cursorMove) {
	
	console.log('MOVE');

	let _deck_destination = null,// to
		// находим стопку из которой взяли
		_deck_departure   = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent),// from
		_success          = true;
	
	let _field = Field();
	let _stepType = share.get('stepType');
  // выйти если не стандартный ход
	if(
		_stepType != defaults.stepType &&
		(
			_field.autoSteps             &&
			!_field.autoSteps[_stepType] ||
			!_field.autoSteps
		)
	) {
		console.log('MOVE STOP');

		let _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);

		event.dispatch('moveCardToHome', {
			moveDeck  : moveDeck,
			departure : _deck_departure
		});
		return;
	}

	if(
		!cursorMove.dbclick           &&
		cursorMove.distance === 0     &&
		share.get('moveDistance') > 0
	) {
		// кликнули один раз
		// чтобы сделать ход нужно переместить карту стопку (moveDistance != 0)
		return false;
	}

    _success = _success && to;// to - не пустой

    let _el = to && to.id && common.getElementById(to.id);// получаем карту/стопку

	// если положили на карту узнаём из какой она стопки
	if(_el) {
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
    if(_deck_destination && _deck_destination.getId() != _deck_departure.getId()) {
	    
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

					event.dispatch('moveDragDeck', {
						departure   : _deck_departure,
						destination : _deck_destination,
						moveDeck    : moveDeck,
						callback    : function() {

							event.dispatch('moveEnd', {
								from     : _deck_departure,
								to       : _deck_destination,
								moveDeck : moveDeck
							});
						}
					});

					History.add({'move' : {
						from : _deck_departure  .name,
						to   : _deck_destination.name,
						deck : Deck.deckCardNames(moveDeck)
					}});

					var _deck = _deck_departure.cards;
					if(_deck.length && _deck[_deck.length - 1].flip) {
						_deck[_deck.length - 1].flip = false;
						History.add({unflip : {
							deck : _deck_departure.name,
							card : {
								name  : _deck[_deck.length - 1].name,
								index : _deck.length - 1
							}
						}});
					}
					
					// записать ход (если он не составной)
					if(!_deck_destination.afterStep) {
						event.dispatch('makeStep', History.get());
					}
				
					winCheck.winCheck({show : true});
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
		
		// var _field = Field();
		if(
			_field.inputParams.doubleClick                   &&
		  cursorMove.dbclick                               ||
		  cursorMove.distance >= share.get('moveDistance')
		) {

    		var Tip = bestTip(moveDeck, cursorMove);
    		
    		if(Tip) {
    			Move(moveDeck, Tip.to.deck.domElement.el, cursorMove);
    			return;
    		} else {
    			event.dispatch('moveCardToHome', {
    				moveDeck  : moveDeck,
    				departure : _deck_departure
    			});
	    		// share.moveCardToHome();
    		}

		} else {
			event.dispatch('moveCardToHome', {
				moveDeck  : moveDeck,
				departure : _deck_departure
			});
		}

	}

	// if(_success) {
	// afterMove();
	Tips.checkTips();
 	// }
};

event.listen('Move', function(e) {

	Move(e.moveDeck, e.to, e.cursorMove);
});

// export default Move;