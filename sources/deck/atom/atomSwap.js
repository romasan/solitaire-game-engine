'use strict'

import event from 'event';

export default (deck, fromIndex, toIndex, save = true) => {

	// console.log('SWAP:', deck.name, fromIndex, toIndex);

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
}