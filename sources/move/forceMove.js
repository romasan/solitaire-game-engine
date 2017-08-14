'use strict';

import event  from 'event' ;
import share  from 'share' ;
import common from 'common';

import Deck   from 'deck'  ;
import Tips   from 'tips'  ;

let _counter = 0;

let forceMove = ({from, to, deck, flip, callback, steps, save, addStep}) => { // {from, to, deck, <flip>, <callback>, <steps>, <save>, <addStep>}

	// console.log('forceMove', from, to);

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

	_counter += 1;

	let check = true;

	// let deckFromCards = deckFrom.cards;
	let deckFromCards = deckFrom.getCards();

	let details = "";

	for(let i in deckFromCards) {

		if(i >= deckFromCards.length - deck.length) {

			let _index = i - (deckFromCards.length | 0) + (deck.length | 0);

			if(
				deck[_index]                          &&
				deckFromCards[i].name != deck[_index]
			) {

				// console.warn('forceMove:check:false', deckFrom.name, deckTo.name, deckFromCards[i].name, deck[_index]);

				details = `check->false, _index: ${_index}, i: ${i}, ${deckFromCards[i].name} != ${deck[_index]}, deckFromCards: ${deckFromCards.map(e => e.name)}, deck: ${deck}`;

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

		let moveDeck = [];

		for(let i in cardsPop) {
			moveDeck.push({
				"card" : cardsPop[i]
			});
		}

		let moveDragDeckParams = {
			"moveDeck"    : moveDeck,
			"departure"   : deckFrom,
			"destination" : deckTo
		};

		let eventId = event.once('clearCallbacks', e => {
			if(typeof breakForceMove == "function") {
				breakForceMove();
			}
		});

		let forceMoveCallback = e => {

			// console.log('forceMove:callback');

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

			let moveEndData = {
				"from"     : deckFrom             ,
				"to"       : deckTo               ,
				"moveDeck" : moveDeck             ,
				"stepType" : share.get('stepType')
			};

			event.dispatch('moveEnd:force', moveEndData);

			if(typeof callback == 'function') {
				callback();
			}

			if(deckFrom.autoCheckFlip) {
				deckFrom.checkFlip();
				deckFrom.Redraw();
			}

			if(deckTo.autoCheckFlip) {
				deckTo.checkFlip();
				deckTo.Redraw();
			}
		};

		moveDragDeckParams.callback = forceMoveCallback;

		event.dispatch('moveDragDeck', moveDragDeckParams);
	} else {
		console.warn('forceMove:Ход невозможен', from, to, "Details:", details, _counter, {from, to, deck, flip, steps, save});
		event.dispatch('solitaire_log');
	}
};

event.listen('forceMove', forceMove);

export default forceMove;
