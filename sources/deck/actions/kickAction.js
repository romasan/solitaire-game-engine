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

	// стопка назначения = текущая
	if(data.eventData.to.name != this.name) {
		return false;
	}

	share.set('stepType', stepType);

	common.animationDefault();
	
	let _from = data.eventData.to    ,
	    _deck = _from.getCardsNames();

	let _callback = () => {

		event.dispatch('addStep', {
			"move" : {
				from         : _from.name,
				to           : data.actionData.to,
				deck         : _deck,
				flip         : true,
				stepType     : {
					undo: share.get('stepType'),
					redo: data.actionData.dispatch ? share.get('stepType') : defaults.stepType
				}
			}
		});

		share.set('stepType', defaults.stepType);

		event.dispatch('saveSteps');

		if(data.actionData.dispatch) {
			event.dispatch(data.actionData.dispatch);
		}
	}
	

	// TODO interval
	// лучше/красивее раздавать карты по одной
	
	let forceMoveParams = {
		from     : _from             ,
		to       : data.actionData.to,
		deck     : _deck             ,
		flip     : true              ,
		callback : _callback
	};
	event.dispatch('forceMove', forceMoveParams);
}
