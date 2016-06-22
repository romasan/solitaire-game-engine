'use strict';

import event  from 'event';
import common from 'common';

import forceMove from 'forceMove';
import History   from 'history';
import Deck      from 'addDeck';

export default function(data) {
	
	if(
		typeof data.eventData.to == "string" &&
		this.name != data.eventData.to
	) {
		return false;
	}
	
	if(
		typeof data.eventData.to != "string" &&
		this.name != data.eventData.to.name
	) {
		return false;
	}

	common.animationDefault();
	
	// var _toDeck = Deck.Deck(data.actionData.to);
	// TODO CURRENT
	let _from = typeof data.eventData.to == "string"
			? Deck.Deck(data.eventData.to)
			: data.eventData.to,
		_deck = _from.getCardsNames();
	
	// TODO interval
	let forceMoveParams = {
		from : _from,             // deck
		to   : data.actionData.to,// _decks[deckId].name,
		deck : _deck,             // [_cardName],
		flip : true               // true
	};
	if(typeof data.eventData.callback == "function") {
		forceMoveParams.callback = data.eventData.callback;
	}
	forceMove(forceMoveParams);

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
