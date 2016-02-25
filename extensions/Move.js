'use strict';

export default function(main, share) {
	
	main.Move = function(moveDeck, to, cursorMove) {
		
		var _deck_destination = null,// to
	    	_deck_departure   = null;// from
	    var _success = true;

	    _success = _success && to;

	    var _el = to && to.id && this.getElementById(to.id);

    	if(_el) {
    
    		if(_el.type == 'card') {
	    		_deck_destination = this.getElementById(_el.parent)
	    	} else if(_el.type == 'deck') {
	    		_deck_destination = _el;
	    	}
	    }

	    _success = _success && _deck_destination;
    	
    	_deck_departure = moveDeck[0].card.parent && this.getElementById(moveDeck[0].card.parent);
    	// console.log('DROP:', _dop.id, _deck_destination);
	    _success = _success && _deck_departure;

	    if(_deck_destination && _deck_destination.getId() != _deck_departure.getId()) {
		    
	    	var _put = _deck_destination.Put(moveDeck);
		    _success = _success && _put;
	    	
	    	if(_put && _deck_departure) {
	    		
	    		var _pop = _deck_departure.Pop(moveDeck.length);
	    		
	    		// console.log('MOVE', _deck_departure, _deck_departure.Pop, moveDeck.length);

			    _success = _success && _pop;
	    		
	    		if(_pop) {
	    			

	    			// положили в колоду
	    			// без анимации, просто перерисовка обеих колод

	    			_deck_destination.Push(_pop);

					main.event.dispatch('moveDragDeck', {
						departure   : _deck_departure,
						destination : _deck_destination,
						moveDeck    : moveDeck
					});

	    			// _deck_departure  .Redraw();
	    			// _deck_destination.Redraw();
					
					share.oneStepWay.move = {
						from : _deck_departure  .name,
						to   : _deck_destination.name,
						deck : share.deckCardNames(moveDeck)
					};

					var _deck = _deck_departure.getCards();
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

					this.event.dispatch('makeStep', share.oneStepWay);
					
					// saveStep();
					
					// afterStep();
					
					this.winCheck({show : true});

	    		}
	    	}
	    	// A Pop()
	    	// B Push()
	    	// A, B Redraw()
	    } else {
	    	_success = false;
	    }

		// если не кдалось положить карты, вернуть обратно
    	
    	if(!_success && _deck_departure) {

    		if(cursorMove.distance >= share.moveDistance) {

	    		var Tip = share.bestTip(moveDeck, cursorMove);
	    		
	    		if(Tip) {
	    			this.Move(moveDeck, Tip.to.deck.domElement, cursorMove);
	    		} else {
	    			main.event.dispatch('moveCardToHome', {
	    				moveDeck  : moveDeck,
	    				departure : _deck_departure
	    			});
		    		// share.moveCardToHome();
	    		}

    		} else {
    			main.event.dispatch('moveCardToHome', {
    				moveDeck  : moveDeck,
    				departure : _deck_departure
    			});
	    		// share.moveCardToHome(moveDeck, _deck_departure);
    		}

    	}

    	if(_success) {

    		// afterMove();
	    	share.checkTips();
	    }

	}.bind(main);

};
