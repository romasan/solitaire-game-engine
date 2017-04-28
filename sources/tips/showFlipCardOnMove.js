'use strict';

import event from 'event';

let showFlipCardOnMove = data => {

	if(
		!data.deck                           ||
		!data.card                           ||
		 data.deck.showPrefFlipCard == false
	) {
		return;
	}

	// TODO вкл./выкл. defaults, field, group, deck

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

event.listen('dragStart', showFlipCardOnMove);