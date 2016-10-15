'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

export default function(data) {
	
	if(share.get('stepType') != defaults.stepType) {
		return false;
	}

	if(
		typeof data.eventData.stepType == "string"   &&
		data.eventData.stepType != defaults.stepType
	) {
		// ??? TODO проверить нужно ли это
		return false;
	}

	if(data.eventData.to.name != this.name) {// стопка назначения = текущая
		return false;
	}

	common.animationDefault();
	
	let _from = data.eventData.to    ,
	    _deck = _from.getCardsNames();

	let _callback = ()=>{

		event.dispatch('addStep', {
			"move" : {
				from         : _from.name,
				to           : data.actionData.to,
				deck         : _deck,
				flip         : true,
				stepType     : share.get('stepType'),
				prevStepType : share.get('prevStepType')
			}
		});

		event.dispatch('saveSteps');

		if(data.actionData.dispatch) {
			event.dispatch(data.actionData.dispatch);
		}
	}
	

	// TODO interval
	// лучше/красивее раздавать карты по одной
	
	let forceMoveParams = {
		from     : _from             ,// deck
		to       : data.actionData.to,// _decks[deckId].name,
		deck     : _deck             ,// [_cardName],
		flip     : true              ,// true
		callback : _callback
	};
	event.dispatch('forceMove', forceMoveParams);
}
