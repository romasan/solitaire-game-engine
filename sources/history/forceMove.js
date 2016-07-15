'use strict';

import event  from 'event';
import share  from 'share';
import common from 'common';

import Deck from 'addDeck';
import Tips from 'tips';

let forceMove = function(a) {

	console.log('forceMove', a);

	if(!a.from || !a.to || !a.deck) {
		return;
	}

	if(!a.deck.length) return;
	
	let _from = typeof a.from == "string"
		? Deck.Deck(a.from)
		: a.from;

	let _to   = typeof a.to   == "string"
		? Deck.Deck(a.to)
		: a.to;

	if(!_from || !_to || _from.type != "deck" || _to.type != "deck") {
		return;
	}

	let _check     = true;
	let _from_deck = _from.cards;

	for(let i in _from_deck) {
		
		if(i >= _from_deck.length - a.deck.length) {
			
			let _id = i - (_from_deck.length|0) + (a.deck.length|0);
			
			if(a.deck[_id] && _from_deck[i].name != a.deck[_id]) {
				_check = false;
			}
		}
	}

	if(_check) {

		let _pop = _from.Pop(a.deck.length);

		// перевернуть карты во время хода
		if(a.flip) {
			for(let i in _pop) {
				_pop[i].flip = !_pop[i].flip;
			}
		}

		_to.Push(_pop);
		
		let __pop = [];
		for(let i in _pop) {
			__pop.push({
				card : _pop[i]
			});
		}

		let moveDragDeckParams = {
			departure   : _from,
			destination : _to,
			moveDeck    : __pop
		};
		
		if(typeof a.callback == "function") {
			moveDragDeckParams.callback = a.callback;
		}
		
		event.dispatch('moveDragDeck', moveDragDeckParams);
	} else {
		// _warn(4);
		console.warn("forceMove:Ход невозможен", a);
	}
};

event.listen('forceMove', (e)=>{
	forceMove(e);
});

export default forceMove;