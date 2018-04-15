'use strict';

import common, {event, share} from '../common';

import Deck                   from '../deck'  ;
import Tips                   from '../tips'  ;
import Card                   from '../card'  ;

/**
 * @typedef {Object} forceMoveData
 * @property {string|Deck} from
 * @property {string|Deck} to
 * @property {string[]} deck
 * @property {?boolean} flip
 * @property {?function} callback
 * @property {?*[]} steps
 * @property {?boolean} save
 * @property {?boolean} addStep
 */

 /**
  * Make move from history
  * @param {forceMoveData} data
  */
let forceMove = data => {

	const {
		from       ,
		to         ,
		deck       ,
		flip       ,
		callback   ,
		steps      ,
		save       ,
		addStep    ,
		waitActions
	} = data;

	if (
		!from ||
		!to   ||
		!deck
	) {
		return;
	}
	
	if (!deck.length) {
		return;
	}
	
	// console.log('forceMove', from, to, deck);
	// event.dispatch('solitaire_log', '%cforceMove:start|color: green');

	// departure (from)
	/**
	 * @type {Deck}
	 */
	let deckFrom = typeof from == 'string'
		? Deck.getDeck(from)
		: from;

	// destination (to)
	/**
	 * @type {Deck}
	 */
	let deckTo = typeof to == 'string'
		? Deck.getDeck(to)
		: to;

	if (
		!deckFrom                ||
		 deckFrom.type != 'deck' ||
		!deckTo                  ||
		 deckTo  .type != 'deck'
	) {
		return;
	}

	let check = true;

	// let deckFromCards = deckFrom.cards;	
	/**
	 * @type {Card[]}
	 */
	let deckFromCards = deckFrom.getCards();

	for (let i in deckFromCards) {

		if (i >= deckFromCards.length - deck.length) {

			let _index = i - (deckFromCards.length | 0) + (deck.length | 0);

			if (
				deck[_index]                          &&
				deckFromCards[i].name != deck[_index]
			) {
				check = false;
			}
		}
	}

	if (check) {

		let cardsPop = deckFrom.Pop(deck.length);

		// перевернуть карты во время хода
		if (typeof flip == "boolean") {
			for (let i in cardsPop) {
				cardsPop[i].flip = flip; // !cardsPop[i].flip;
			}
		}

		let deckToInvisibleCardsCount = deckTo.cardsCount({
			"visible" : false
		});

		deckTo.Push(cardsPop, deckToInvisibleCardsCount > 0);

		let breakForceMove = e => {

			if (share.get('inHistoryMove')) {
				return;
			}

			let _cards = deckTo.Pop(deck.length);

			if (cardsPop) {

				deckFrom.Push(_cards);

				if (typeof flip == "boolean") {
					for (let i in cardsPop) {
						cardsPop[i].flip = !flip;
					}
				}

				deckFrom.Redraw();
				deckTo  .Redraw();

				if (steps && steps.length) {

					// TODO History.clearByContext('deal'); ?
					event.dispatch('deleteHistory', steps);
				}
			}
		}

		let moveDeck = [];

		for (let i in cardsPop) {
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
			if (typeof breakForceMove == "function") {
				breakForceMove();
			}
		});

		let forceMoveCallback = e => {

			// console.log('forceMove:callback');

			if (addStep) {

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

			if (
				deckFrom.autoUnflipTop                         &&
				deckFrom.cards.length > 0                      &&
				deckFrom.cards[deckFrom.cards.length - 1].flip
			) {

				// console.log('unflip TopCard');

				deckFrom.unflipTopCard(addStep);
			}

			if (
				event.has('actionEvent:moveEnd:' + deckFrom.name)
			) {

			}

			if (save && !waitActions) {
				event.dispatch('saveSteps');
			}

			event.dispatch('forceMoveEnd');

			let moveEndData = {
				"from"        : deckFrom             ,
				"to"          : deckTo               ,
				"moveDeck"    : moveDeck             ,
				"stepType"    : share.get('stepType'),
				"waitActions" : waitActions
			};

			event.dispatch('moveEnd:force', moveEndData);

			if (typeof callback == 'function') {
				callback();
			}

			if (deckFrom.autoCheckFlip) {
				deckFrom.checkFlip();
				deckFrom.Redraw();
			}

			if (deckTo.autoCheckFlip) {
				deckTo.checkFlip();
				deckTo.Redraw();
			}
		};

		moveDragDeckParams.callback = forceMoveCallback;

		event.dispatch('moveDragDeck', moveDragDeckParams);
	} else {
		console.warn('forceMove:Ход невозможен', from, to);
	}

	// event.dispatch('solitaire_log', '%cforceMove:done|color: orange');
};

event.listen('forceMove', forceMove);

export default forceMove;
