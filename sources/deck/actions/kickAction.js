'use strict';

import event      from 'event';
import share      from 'share';
import common     from 'common';
import defaults   from 'defaults';

import deckAction from 'deckAction';

const stepType = 'kickStepType';

class kickAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {
		
		// если тип хода не стандартный не выполнять кик
		if(share.get('stepType') != defaults.stepType) {
			
			super.break();

			return false;
		}

		// TODO спорный момент
		if(
			typeof data.eventData.stepType == "string"   &&
			data.eventData.stepType != defaults.stepType
		) {
			
			super.break();

			return false;
		}

		if(data.eventData.to.name != deck.name) {// data.eventData.to - куда мы перетащили карты
			
			super.break();

			return false;
		}

		share.set('stepType', stepType);

		common.animationDefault();
		
		let _from = data.eventData.to, //Deck.Deck(_name),
		    _deck = _from.getCardsNames();

		let _callback = () => {

			let _addStep = (e) => {

				event.dispatch('addStep', {
					"move" : {
						from     : _from.name,
						to       : data.actionData.to,
						deck     : _deck,
						flip     : true,
						stepType : {
							undo: e.undo,
							redo: e.redo
						},
						context  : "kickAction"
					}
				});
			};		

			share.set('stepType', defaults.stepType);

			if(data.actionData.dispatch) {
				
				event.dispatch(data.actionData.dispatch, {
					before: (e) => {
						
						_addStep({
							undo: stepType,
							redo: e.stepType	
						});

						event.dispatch('saveSteps');
					}
				});
			} else {
				
				_addStep({
					undo: stepType,// share.get('stepType'),
					redo: data.actionData.dispatch ? share.get('stepType') : defaults.stepType
				})
				
				event.dispatch('saveSteps');

				super.end();
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
	}

}

export default new kickAction();
