'use strict';

import common, {event, defaults} from '../common';

import Tips from './';

const MIN_DRAG_DISTANCE = defaults.card.width / 3;

let showFlipCardOnMove = data => { // {to : deckClass, toCard: cardClass}

	// console.warn('show flip card on move');

	const {to, toCard} = data;

	if (!toCard || !toCard.parent) {
		return;
	}

	let deck = common.getElementById(toCard.parent);

	if (
		!deck               ||
		!deck.autoUnflipTop
	) {
		return;
	}

	if (deck.showPrefFlipCard == false) {
		return;
	}

	let cardIndex = deck.getCardIndexById(data.toCard.id);
	let moveDeckCount = deck.cards.length - cardIndex;

	let prevCard = deck.cards.length > moveDeckCount
		? deck.cards[deck.cards.length - moveDeckCount - 1]
		: null;

	if (
		!prevCard      ||
		!prevCard.flip
	) {
		return;
	}

	let tips = Tips.getTips();

	let inTips = false;

	for (let i in tips) {

		let fromDeck = common.getElementById(tips[i].from.card.parent);
		if (
			fromDeck                   && 
			fromDeck.name == deck.name
		) {
			inTips = true;
		}
	}

	if (!inTips) {
		return;
	}

	event.dispatch('unflipCard', prevCard);
};


// event.listen('click:unflipCard', showFlipCardOnMove);

event.listen('dragDeck', data => {

	if (
		data                              &&
		data.card                         &&
		data.deck                         &&
		data.distance                     &&
		data.distance > MIN_DRAG_DISTANCE
	) {
		showFlipCardOnMove({
			"toCard" : data.card,
			"toDeck" : data.deck
		});
	}
});
