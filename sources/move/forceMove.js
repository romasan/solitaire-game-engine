'use strict';

import event  from 'event' ;
import share  from 'share' ;
import common from 'common';

import Deck   from 'deck'  ;
import Tips   from 'tips'  ;

let forceMove = ({from, to, deck, flip, callback, steps, save, addStep}) => { // {from, to, deck, <flip>, <callback>, <steps>, <save>, <addStep>}

	// console.log('forceMove');

	if(
		!from ||
		!to   ||
		!deck
	) {
		return;
	}

	if(!deck.length) {
		return;
	}

	// departure (from)
	let deckFrom = typeof from == 'string'
		? Deck.getDeck(from)
		: from;

	// destination (to)
	let deckTo   = typeof to   == 'string'
		? Deck.getDeck(to)
		: to;

	if(
		!deckFrom                ||
		 deckFrom.type != 'deck' ||
		!deckTo                  ||
		 deckTo  .type != 'deck'
	) {
		return;
	}

	let check = true;

	// let deckFromCards = deckFrom.cards;
	let deckFromCards = deckFrom.getCards();

	for(let i in deckFromCards) {

		if(i >= deckFromCards.length - deck.length) {

			let _index = i - (deckFromCards.length | 0) + (deck.length | 0);

			if(
				deck[_index]                          &&
				deckFromCards[i].name != deck[_index]
			) {

				// console.warn('forceMove:check:false', deckFrom.name, deckTo.name, deckFromCards[i].name, deck[_index]);

				check = false;
			}
		}
	}

	if(check) {

		let cardsPop = deckFrom.Pop(deck.length);

		// перевернуть карты во время хода
		if(typeof flip == "boolean") {
			for(let i in cardsPop) {
				cardsPop[i].flip = flip; // !cardsPop[i].flip;
			}
		}

		let deckToInvisibleCardsCount = deckTo.cardsCount({
			"visible" : false
		});

		deckTo.Push(cardsPop, deckToInvisibleCardsCount > 0);

		let breakForceMove = e => {

			if(share.get('inHistoryMove')) {
				return;
			}

			let _cards = deckTo.Pop(deck.length);

			if(cardsPop) {

				deckFrom.Push(_cards);

				if(typeof flip == "boolean") {
					for(let i in cardsPop) {
						cardsPop[i].flip = !flip;
					}
				}

				deckFrom.Redraw();
				deckTo  .Redraw();

				if(steps && steps.length) {

					// TODO History.clearByContext('deal'); ?
					event.dispatch('deleteHistory', steps);
				}
			}
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
			if(typeof breakForceMove == "function") {
				breakForceMove();
			}
		});

		let forceMoveCallback = e => {

			if(addStep) {

				event.dispatch('addStep', {
					"move" : {
						"from" : from,
						"to"   : to  ,
						"deck" : deck
					}
				});
			}

			event.remove(eventId);

			breakForceMove = null;

			if(
				deckFrom.autoUnflipTop                         &&
				deckFrom.cards.length > 0                      &&
				deckFrom.cards[deckFrom.cards.length - 1].flip
			) {

				// console.log('unflip TopCard');

				deckFrom.unflipTopCard(addStep);
			}

			if(save) {
				event.dispatch('saveSteps');
			}

			event.dispatch('forceMoveEnd');

			if(typeof callback == 'function') {
				callback();
			}

		};

		moveDragDeckParams.callback = forceMoveCallback;

		event.dispatch('moveDragDeck', moveDragDeckParams);
	} else {
		console.warn('forceMove:Ход невозможен', from, to);
	}
};

event.listen('forceMove', forceMove);

export default forceMove;
