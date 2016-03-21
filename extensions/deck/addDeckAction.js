'use strict';

import event       from 'event';

import deckActions from 'deckActions';

export default function() {

	event.listen('runDeckActions', function(e) {

		for(var actionName in e.deck.actions) {
			if(deckActions[actionName]) {
				deckActions[actionName]({
					deck_from : e.deck, 
					data      : e.deck.actions[actionName]
				});
			}
		}
	});

	event.listen('runDeckAction', function(e) {
		if(e.name && typeof deckActions[e.name] == 'string') {// && e.data
			deckActions[e.name](e.data);
		}
	});

	/*
	event.listen('addDeckAction', function(e) {
		console.log(deckActions);
		if(e.name && e.callback) deckActions[e.name] = e.callback;

	});

	event.listen('removeDeckAction', function(e) {
		// TODO
	});
	*/
	
};