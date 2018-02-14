'use strict';

import common, {event, defaults} from '../common';

console.log('#1', common);
console.log('#2', event);
console.log('#3', defaults);

import Tips from './';

let usedCardId = null;

let showFlipCardOnMove = data => { // {to : deckClass, toCard: cardClass}

	console.warn('show flip card on move');

	const {to, toCard} = data;

	if (!toCard || !toCard.parent) {
		return;
	}

	// console.log('showFlipCardOnMove:', data);

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

	// console.log('showFlipCardOnMove:', data, deck.name, deck.showPrefFlipCard);

	// let moveDistance = share.get('moveDistance');

	// if (
	// 	moveDistance  > 0            &&
	// 	data.distance < moveDistance ||
	// 	usedCardId == data.card.id
	// ) {
	// 	return;
	// }

	let tips = Tips.getTips();

	let inTips = false;

	for (let i in tips) {
		// if (tips[i].from == deck.name) {
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

	// usedCardId = data.card.id;

	// if (
	// 	typeof data.card.flip == "boolean" &&
	// 	       data.card.flip == false
	// ) {

		// let prevCard = null;

	let cardIndex = deck.getCardIndexById(data.toCard.id);
	let moveDeckCount = deck.cards.length - cardIndex;

	let prevCard = deck.cards.length > moveDeckCount
		? deck.cards[deck.cards.length - moveDeckCount - 1]
		: null;

		// for (let i = data.deck.cards.length - 1; i >= 0 && !prevCard; i -= 1) {
		// 	if (data.deck.cards[i].id == data.card.id && i > 0) {
		// 		prevCard = data.deck.cards[i - 1];
		// 	}
		// }

		// if (prevCard) {
	if (prevCard && prevCard.flip) {
		// event.dispatch('unflipCard', prevCard);
		event.dispatch('unflipCard', prevCard);
	}
	// }
};


// event.listen('click:unflipCard', showFlipCardOnMove);

event.listen('dragDeck', data => {
	if (
		data                                    &&
		data.card                               &&
		data.deck                               &&
		data.distance                           &&
		data.distance > defaults.card.width / 3
	) {
		showFlipCardOnMove({
			"toCard" : data.card,
			"toDeck" : data.deck
		})
	}
});
