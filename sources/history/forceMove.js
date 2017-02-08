'use strict';

import event  from 'event' ;
import share  from 'share' ;
import common from 'common';

import Deck   from 'deck'  ;
import Tips   from 'tips'  ;

let forceMove = data => {// {from, to, deck, <flip>, <callback>}

	if(
		!data.from ||
		!data.to   ||
		!data.deck
	) {
		return;
	}

	if(!data.deck.length) {
		return;
	}

	let deckFrom = typeof data.from == 'string'
		? Deck.getDeck(data.from)
		: data.from;

	let deckTo   = typeof data.to   == 'string'
		? Deck.getDeck(data.to)
		: data.to;

	// console.log('forceMove:', deckFrom.name, '->', deckTo.name, data.deck.join());

	if(
		!deckFrom                ||
		 deckFrom.type != 'deck' ||
		!deckTo                  ||
		 deckTo  .type != 'deck'
	) {
		return;
	}

	console.log('forceMove:', data);

	let _check = true;

	let deckFromCards = deckFrom.cards;

	for(let i in deckFromCards) {

		if(i >= deckFromCards.length - data.deck.length) {

			let _id = i - (deckFromCards.length | 0) + (data.deck.length | 0);

			if(
				data.deck[_id]                          &&
				deckFromCards[i].name != data.deck[_id]
			) {
				_check = false;
			}
		}
	}

	if(_check) {

		let cardsPop = deckFrom.Pop(data.deck.length);

		// перевернуть карты во время хода
		if(data.flip) {
			for(let i in cardsPop) {
				cardsPop[i].flip = !cardsPop[i].flip;
			}
		}

		deckTo.Push(cardsPop);

		let cardsMove = [];

		for(let i in cardsPop) {
			cardsMove.push({
				card : cardsPop[i]
			});
		}

		let moveDragDeckParams = {
			"moveDeck"    : cardsMove,
			"departure"   : deckFrom ,
			"destination" : deckTo
		};

		if(typeof data.callback == 'function') {
			moveDragDeckParams.callback = e => {
				event.dispatch('forceMoveEnd');
				data.callback();
			}
			moveDragDeckParams.debug = 'from:forceMove';
		} else {
			moveDragDeckParams.callback = e => {
				event.dispatch('forceMoveEnd');
			}
		}
		// console.log('>>> forceMove:moveDragDeck >>>');
		event.dispatch('moveDragDeck', moveDragDeckParams);
	} else {
		console.warn('forceMove:Ход невозможен', data);
	}
};

event.listen('forceMove', data => {
	forceMove(data);
});

export default forceMove;