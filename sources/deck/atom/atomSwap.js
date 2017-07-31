'use strict'

import event from 'event';

export default (deck, fromIndex, toIndex, save = true) => {

	// console.log('SWAP:', deck.name, fromIndex, toIndex);

	if(typeof deck == "undefined") {

		console.warn('Swap: deck is undefined')

		return false;
	}

	if(deck.cards[fromIndex] && deck.cards[toIndex]) {

		let tmp               = deck.cards[fromIndex];
		deck.cards[fromIndex] = deck.cards[toIndex]  ;
		deck.cards[toIndex]   = tmp                  ;

		if(save) {
			event.dispatch('addStep', {
				"swap" : {
					"deckName"  : deck.name,
					"fromIndex" : fromIndex,
					"toIndex"   : toIndex
				}
			});
		}
	} else {

		console.warn('Card flip for', fromIndex, 'and', toIndex, 'cards in', deck.name, 'is impossible.');

		return false;
	}

	return true;
}