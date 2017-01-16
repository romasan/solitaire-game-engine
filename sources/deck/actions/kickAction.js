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

		this._actionName = 'kickAction';
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

		let _callback = e => {

			console.log('kickAction:run:callback');

			let _addStep = historyData => {

				event.dispatch('addStep', {
					"move" : {
						from     : _from.name,
						to       : data.actionData.to,
						deck     : _deck,
						flip     : true,
						stepType : {
							undo: historyData.undo,
							redo: historyData.redo
						},
						context  : "kickAction"
					}
				});
			};

			share.set('stepType', defaults.stepType);

			if(window.debug_1) console.log('сюда пришли #1', data.actionData.dispatch);

			if(data.actionData.dispatch) {
				console.log('kickAction:dispatch:', data.actionData.dispatch);
				event.dispatch(data.actionData.dispatch, {
					before: data => {

						_addStep({
							undo: stepType,
							redo: data.stepType	
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
