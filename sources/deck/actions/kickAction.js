'use strict';

import event     from 'event';

import forceMove from 'forceMove';
import History   from 'history';

export default function(data) {
			
	// listen move ???
	if(
		typeof data.eventData.to == "string" &&
		this.name != data.eventData.to       ||
		this.name != data.eventData.to.name
	) {
		console.log('kickAction OFF', data, this.name);
		return false;
	} else {
		console.log('kickAction OK', data, this.name);
	}

	// var _toDeck = Deck.Deck(data.actionData.to);
	// TODO CURRENT
	var _from = data.eventData.to,
		_deck = _from.getCardsNames();

	// TODO interval

	forceMove({
		from : _from,             // this.name,
		to   : data.actionData.to,// _decks[deckId].name,
		deck : _deck,             // [_cardName],
		flip : true               // true
	});

	// event.dispatch('historyAdd', {});
	History.add({
		"move" : {
			from : _from.name,
			to   : data.actionData.to,
			deck : _deck,
			flip : true
		}
	});

	if(data.eventData.dispatch) {
		event.dispatch(data.eventData.dispatch, History.get());
	}

	// if(e.after) {
	// 	_events[e.after].call(this, e);
	// };
}
