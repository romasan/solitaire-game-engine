'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

import forceMove from 'forceMove';
import History   from 'history';
import Deck      from 'addDeck';

export default function(data) {


	
	if(share.get('stepType') != defaults.stepType) {
		// console.log('#no_kick 1');
		return false;
	}

	let _name = null;
	if(
		data.eventData[0]                            &&
		data.eventData[0].move                       &&
		typeof data.eventData[0].move.to == "string"
	) {
		
		_name = data.eventData[0].move.to;
		
		// if(
		// 	data.eventData[0].move.to == data.actionData.to &&
		// 	data.eventData[1]                               &&
		// 	typeof data.eventData[1].move.to == "string"
		// ) {
		// 	_name = data.eventData[1].move.to;
		// }
	}
	
	if(
		data.eventData.to                    &&
		typeof data.eventData.to == "string"
	) {
		_name = data.eventData.to;
	}
	
	if(
		data.eventData.to                         &&
		typeof data.eventData.to != "string"      &&
		typeof data.eventData.to.name == "string"
	) {
		_name = data.eventData.to.name;
	}

	if(_name != this.name) {
		// console.log('#no_kick 2', _name, this.name, data);
		return false;
	}
	
	// console.log('#kick -----------------------------------------');

	// console.log('KICK', data);

	// if(
	// 	data.eventData[0]                         &&
	// 	typeof data.eventData[0].name == "string" &&
	// 	data.eventData[0].name != this.name
	// ) {
	// 	return false;
	// }

	common.animationDefault();
	
	// var _toDeck = Deck.Deck(data.actionData.to);
	// TODO CURRENT
	
	// let _from = typeof data.eventData.to == "string"
	// 		? Deck.Deck(_name)
	// 		: data.eventData.to
	
	let _from = Deck.Deck(_name)     ,
		_deck = _from.getCardsNames();
	
	// TODO interval
	let forceMoveParams = {
		from : _from             ,// deck
		to   : data.actionData.to,// _decks[deckId].name,
		deck : _deck             ,// [_cardName],
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

	// event.dispatch('makeStep', History.get());

	if(data.actionData.dispatch) {
		event.dispatch(data.actionData.dispatch);
	}

	// if(e.after) {
	// 	_events[e.after].call(this, e);
	// };
}
