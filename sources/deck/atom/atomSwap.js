'use strict'

import event from 'event';

export default (deck, fromIndex, toIndex, save = true) => {

	// console.log('SWAP:', deck.name, fromIndex, toIndex);
	let fromCard = deck.cards[fromIndex];
	let toCard   = deck.cards[toIndex]  ;

	if(fromCard && toCard) {

		let tmp  = fromCard;
		fromCard = toCard  ;
		toCard   = tmp     ;

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
	}
}