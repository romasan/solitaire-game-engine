'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'SolitaireCommon';

import Deck     from 'addDeck';
import Tips     from 'Tips';
import bestTip  from 'bestTip';
import History  from 'SolitaireHistory';
import winCheck from 'winCheck';

var Move = function(moveDeck, to, cursorMove) {
	
	var _deck_destination = null,// to
    	_deck_departure   = null;// from
    var _success = true;

    _success = _success && to;

    var _el = to && to.id && common.getElementById(to.id);

	if(_el) {

		if(_el.type == 'card') {
    		_deck_destination = common.getElementById(_el.parent)
    	} else if(_el.type == 'deck') {
    		_deck_destination = _el;
    	}
    }

    _success = _success && _deck_destination;
	
	_deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);
    _success = _success && _deck_departure;

    if(_deck_destination && _deck_destination.getId() != _deck_departure.getId()) {
	    
    	var _put = _deck_destination.Put(moveDeck);
	    _success = _success && _put;
    	
    	if(_put && _deck_departure) {
    		
    		var _pop = _deck_departure.Pop(moveDeck.length);
		    _success = _success && _pop;
    		
    		if(_pop) {
    			
    			// положили в колоду
    			// без анимации, просто перерисовка обеих колод
    			_deck_destination.Push(_pop);

				event.dispatch('moveDragDeck', {
					departure   : _deck_departure,
					destination : _deck_destination,
					moveDeck    : moveDeck
				});

				History.add({'move' : {
					from : _deck_departure  .name,
					to   : _deck_destination.name,
					deck : Deck.deckCardNames(moveDeck)
				}});

				var _deck = _deck_departure.cards;
				if(_deck.length && _deck[_deck.length - 1].flip == true) {
					_deck[_deck.length - 1].flip = false;
					share.oneStepWay.unflip = {
						deck : _deck_departure.name,
						card : {
							name  : _deck[_deck.length - 1].name,
							index : _deck.length - 1
						}
					}
				}

				event.dispatch('makeStep', share.oneStepWay);
				
				winCheck.winCheck({show : true});

    		}
    	}
    } else {
    	_success = false;
    }

	// если не кдалось положить карты, вернуть обратно
	if(!_success && _deck_departure) {

		if(cursorMove.distance >= share.get('moveDistance')) {

    		var Tip = bestTip(moveDeck, cursorMove);
    		
    		if(Tip) {
    			Move(moveDeck, Tip.to.deck.domElement, cursorMove);
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

	// console.log('_success', _success);

	// if(_success) {

		// afterMove();
    	Tips.checkTips();
    // }

};

export default Move;