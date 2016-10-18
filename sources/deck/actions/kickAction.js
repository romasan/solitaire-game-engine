'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

const stepType = 'kickStepType';

export default function(data) {
	
	// если тип хода не стандартный не выполнять кик
	if(share.get('stepType') != defaults.stepType) {
		return false;
	}

	// TODO спорный момент
	if(
		typeof data.eventData.stepType == "string"   &&
		data.eventData.stepType != defaults.stepType
	) {
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

	if(data.eventData.to.name != this.name) {// data.eventData.to - куда мы перетащили карты
		return false;
	}

	// if(window.debug_kick) {
	// 	console.log('data.eventData.stepType:', data);
	// 	throw new Error();
	// }
	window.debug_kick = 1;

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

	let _callback = () => {

		event.dispatch('addStep', {
			"move" : {
				from         : _from.name,
				to           : data.actionData.to,
				deck         : _deck,
				flip         : true,
				stepType     : {
					undo: stepType,// share.get('stepType'),
					redo: stepTypedata.actionData.dispatch ? share.get('stepType') : defaults.stepType
				},
				context: "kickAction"
			}
		});

		share.set('stepType', defaults.stepType);

		event.dispatch('saveSteps');

		if(data.actionData.dispatch) {
			event.dispatch(data.actionData.dispatch);
		}
	}
	

	// TODO interval
	let forceMoveParams = {
		from     : _from             ,
		to       : data.actionData.to,
		deck     : _deck             ,
		flip     : true              ,
		callback : _callback
	};
	
	// forceMove(forceMoveParams);
	event.dispatch('forceMove', forceMoveParams);
	

	// if(e.after) {
	// 	_events[e.after].call(this, e);
	// };
}
