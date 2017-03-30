'use strict'

import event from 'event';

export default (deck, fromIndex, toIndex, save = true) => {

	console.log('atomSwap:', deck, fromIndex, toIndex, save);

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