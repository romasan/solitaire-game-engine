'use strict';

import event  from 'event' ;
import share  from 'share' ;
import common from 'common';

import Deck   from 'deck'  ;
import Tips   from 'tips'  ;

let forceMove = data => { // {from, to, deck, <flip>, <callback>}

	// console.log('forceMove:', data);

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

	// departure
	let deckFrom = typeof data.from == 'string'
		? Deck.getDeck(data.from)
		: data.from;

	// destination
	let deckTo   = typeof data.to   == 'string'
		? Deck.getDeck(data.to)
		: data.to;

	if(
		!deckFrom                ||
		 deckFrom.type != 'deck' ||
		!deckTo                  ||
		 deckTo  .type != 'deck'
	) {
		return;
	}

	let _check = true;

	// let deckFromCards = deckFrom.cards;
	let deckFromCards = deckFrom.getCards();

	for(let i in deckFromCards) {

		if(i >= deckFromCards.length - data.deck.length) {

			let _index = i - (deckFromCards.length | 0) + (data.deck.length | 0);

			if(
				data.deck[_index]                          &&
				deckFromCards[i].name != data.deck[_index]
			) {
				console.warn('forceMove:check:false', deckFrom.name, deckTo.name, deckFromCards[i].name, data.deck[_index]);
				_check = false;
			}
		}
	}

	if(_check) {

		let cardsPop = deckFrom.Pop(data.deck.length);
		// let cardsPop = deckFrom.getTopCards(data.deck.length);

		console.log(
			'### forceMove:pop',
			cardsPop ? cardsPop.map(e => e.name).join(',') : cardsPop,
			deckFrom.name,
			deckFrom.cards.map(e => e.name).join(','),
			data.deck.length
		);

		// перевернуть карты во время хода
		// if(typeof data.flip == "boolean") {

		// 	for(let i in cardsPop) {
		// 		cardsPop[i].flip = data.flip; // !cardsPop[i].flip;
		// 	}
		// }

		let deckToInvisibleCardsCount = deckTo.cardsCount({
			"visible" : false
		});

		deckTo.Push(cardsPop, deckToInvisibleCardsCount > 0);

		// let rand = Math.random();

		let _break = e => {
			// console.log('forceMove:BREAK' + rand + ' ' + deckFrom.name + ' ' + deckTo.name);
			let _cards = deckTo.Pop(data.deck.length);
			deckFrom.Push(_cards);
			// if(typeof data.flip == "boolean") {
			// 	for(let i in cardsPop) {
			// 		cardsPop[i].flip = !data.flip; // !cardsPop[i].flip;
			// 	}
			// }
			deckFrom.Redraw();
			deckTo.Redraw();
		}

		let cardsMove = [];

		for(let i in cardsPop) {
			cardsMove.push({
				"card" : cardsPop[i]
			});
		}

		let moveDragDeckParams = {
			"moveDeck"    : cardsMove,
			"departure"   : deckFrom ,
			"destination" : deckTo
		};

		let eventId = event.once('clearCallbacks', e => {
			if(typeof _break == "function") {
				_break();
			}
		}, 'forceMove:' + deckFrom.name + ':' + deckTo.name + ':' + cardsMove[0].card.name + ':' + cardsMove[0].card.id);

		if(typeof data.callback == 'function') {

			moveDragDeckParams.callback = e => {

				event.remove(eventId);

				_break = null;

				event.dispatch('forceMoveEnd');

				data.callback();

				// _next();
			}

			// moveDragDeckParams.debug = 'from:forceMove';
		} else {
			moveDragDeckParams.callback = e => {

				event.remove(eventId);

				_break = null;

				event.dispatch('forceMoveEnd');

				// _next();
			}
		}

		// let _next = e => {

		if(data.addStep) {

			event.dispatch('addStep', {
				"move" : {
					"from" : data.from,
					"to"   : data.to  ,
					"deck" : data.deck
				}
			});
		}

		if(
			deckFrom.autoUnflipTop                         &&
			deckFrom.cards.length > 0                      &&
			deckFrom.cards[deckFrom.cards.length - 1].flip
		) {
			console.log('unflip TopCard');
			deckFrom.unflipTopCard(data.addStep);
		}

		if(data.save) {
			event.dispatch('saveSteps');
		}
		// };

		event.dispatch('moveDragDeck', moveDragDeckParams);
	} else {
		console.warn('forceMove:Ход невозможен', data);
	}
};

event.listen('forceMove', data => {
	forceMove(data);
});

export default forceMove;