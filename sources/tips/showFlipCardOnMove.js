'use strict';

import event  from '../common/event';
import common from '../common'      ;

import Tips   from './'             ;

let usedCardId = null;

let showFlipCardOnMove = data => { // to, toCard

	if (!data.toCard || !data.toCard.parent) {
		return;
	}

	// console.log('showFlipCardOnMove:', data);

	let deck = common.getElementById(data.toCard.parent);

	if (
		!deck               ||
		!deck.autoUnflipTop
	) {
		return;
	}

	// if (
	// 	!data.deck                           ||
	// 	!data.card                           ||
	// 	 data.deck.showPrevFlipCard == false
	// ) {
	// 	return;
	// }

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

	let prevCard = deck.cards.length > moveDeckCount ? deck.cards[deck.cards.length - moveDeckCount - 1] : null;

		// for (let i = data.deck.cards.length - 1; i >= 0 && !prevCard; i -= 1) {
		// 	if (data.deck.cards[i].id == data.card.id && i > 0) {
		// 		prevCard = data.deck.cards[i - 1];
		// 	}
		// }

		// if (prevCard) {
	if (prevCard) {
		// event.dispatch('unflipCard', prevCard);
		event.dispatch('unflipCard', prevCard);
	}
	// }
};

event.listen('click:unflipCard', showFlipCardOnMove);