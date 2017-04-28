'use strict';

import event from 'event';

import Tips from 'tips';

let usedCardId = null;

let showFlipCardOnMove = data => {

	return; // TODO

	if(
		!data.deck                           ||
		!data.card                           ||
		 data.deck.showPrefFlipCard == false
	) {
		return;
	}

	let moveDistance = share.get('moveDistance');

	if(
		moveDistance  > 0            &&
		data.distance < moveDistance ||
		usedCardId == data.card.id
	) {
		return;
	}

	let tips = Tips.getTips();

	let inTips = false;

	for(let i in tips) {
		if(tips[i].from == deck.name) {
			inTips = true;
		}
	}

	if(!inTips) {
		return;
	}

	usedCardId = data.card.id;

	console.log('showFlipCardOnMove:', data);
	// TODO вкл./выкл. defaults, field, group, deck
	return;

	if(
		typeof data.card.flip == "boolean" &&
		       data.card.flip == false
	) {

		let prevCard = null;

		for(let i = data.deck.cards.length - 1; i >= 0 && !prevCard; i -= 1) {
			if(data.deck.cards[i].id == data.card.id && i > 0) {
				prevCard = data.deck.cards[i - 1];
			}
		}

		if(prevCard) {
			event.dispatch('unflipCard', prevCard);
		}
	}
};

event.listen('dragDeck', showFlipCardOnMove);