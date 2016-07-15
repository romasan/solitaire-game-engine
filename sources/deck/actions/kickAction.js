'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

export default function(data) {
	
	if(share.get('stepType') != defaults.stepType) {
		// console.log('#no_kick 1');
		return false;
	}

	// if(share.get('prevStepType') != defaults.stepType) {
	// 	return false;
	// }

	// let _name = null;
	// if(
	// 	data.eventData[0]                            &&
	// 	data.eventData[0].move                       &&
	// 	typeof data.eventData[0].move.to == "string"
	// ) {
	// 	_name = data.eventData[0].move.to;
	// }
	
	// if(
	// 	data.eventData.to                    &&
	// 	typeof data.eventData.to == "string"
	// ) {
	// 	_name = data.eventData.to;
	// }
	
	// if(
	// 	data.eventData.to                         &&
	// 	typeof data.eventData.to != "string"      &&
	// 	typeof data.eventData.to.name == "string"
	// ) {
	// 	_name = data.eventData.to.name;
	// }

	if(data.eventData.to.name != this.name) {
		return false;
	}

	// console.log('#kick -----------------------------------------');

	console.log('KICK', data, share.get('prevStepType'));

	// if(
	// 	data.eventData[0]                         &&
	// 	typeof data.eventData[0].name == "string" &&
	// 	data.eventData[0].name != this.name
	// ) {
	// 	return false;
	// }

	common.animationDefault();
	
	// var _toDeck = Deck.Deck(data.actionData.to);
	
	// let _from = typeof data.eventData.to == "string"
	// 		? Deck.Deck(_name)
	// 		: data.eventData.to
	
	let _from = data.eventData.to, //Deck.Deck(_name),
	    _deck = _from.getCardsNames();

	let _callback = ()=>{

		event.dispatch('addStep', {
			"move" : {
				from : _from.name,
				to   : data.actionData.to,
				deck : _deck,
				flip : true
			}
		});

		event.dispatch('saveSteps');

		if(data.actionData.dispatch) {
			event.dispatch(data.actionData.dispatch);
		}
	}
	

	// TODO interval
	let forceMoveParams = {
		from     : _from             ,// deck
		to       : data.actionData.to,// _decks[deckId].name,
		deck     : _deck             ,// [_cardName],
		flip     : true              ,// true
		callback : _callback
	};
	
	// forceMove(forceMoveParams);
	event.dispatch('forceMove', forceMoveParams);
	

	// if(e.after) {
	// 	_events[e.after].call(this, e);
	// };
}
