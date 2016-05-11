'use strict';

import event     from 'event';

import forceMove from 'forceMove';
import History   from 'SolitaireHistory';

export default function(data) {
		
	// listen move ???
	if(this.name != data.eventData.to.name) { return false; };

	console.log('KICK');

	// var _toDeck = Deck.Deck(data.actionData.to);
	// TODO CURRENT
	var _from = data.eventData.to,
		_deck = _from.getCardsNames();

	forceMove({
		from : _from,                 //this.name,
		to   : data.actionData.to,    //_decks[deckId].name,
		deck : _deck, //[_cardName],
		flip : true                              //true
	});

	History.add({'move' : {
		from : _from.name,
		to   : data.actionData.to,
		deck : _deck,
		flip : true
	}});

	event.dispatch('makeStep', History.get());

	// if(e.after) {
	// 	_events[e.after].call(this, e);
	// };

}