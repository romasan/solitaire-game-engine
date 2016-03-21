'use strict';

import Deck from 'addDeck';
import Tips from 'Tips';

export default function(a) {

	if(!a.from || !a.to || !a.deck) {
		return;
	}

	if( typeof a.from != 'string' || typeof a.to != 'string') {
		return;
	}

	if(!a.deck.length) return;
	
	var _from = Deck.Deck(a.from);
	var _to   = Deck.Deck(a.to);

	if(!_from || !_to) {
		return;
	}
	
	var _check     = true;
	var _from_deck = _from.cards;
	
	for(var i in _from_deck) {
		
		if(i >= _from_deck.length - a.deck.length) {
			var _id = i - (_from_deck.length|0) + (a.deck.length|0);
			if(a.deck[_id] && _from_deck[i].name != a.deck[_id]) {
				console.log(i, _id, _from_deck, _from_deck[i].name, a.deck[_id])
				_check = false;
			}
		}
	}
	
	if(_check) {
		var _pop = _from.Pop(a.deck.length);
		_to.Push(_pop);
	} else {
		_warn(4);
	}

	_from.Redraw();
	_to  .Redraw();
	
	//for(var i = deck.length;i;i -= 1) {
	//	_to.push(_to.getCards)
	//}

	Tips.checkTips();

};