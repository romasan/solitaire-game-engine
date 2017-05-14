'use strict';

import event      from 'event'     ;
import share      from 'share'     ;
import common     from 'common'    ;
import defaults   from 'defaults'  ;

import deckAction from 'deckAction';

const stepType = 'kickStepType';

class kickAction extends deckAction {

	constructor() {

		super();

		this._actionName = 'kickAction';
	}

	run(deck, data) { // Deck, {actionData, eventData, eventName}

		// если тип хода не стандартный не выполнять кик
		if(share.get('stepType') != defaults.stepType) {

			super.break();

			return false;
		}

		// TODO спорный момент
		if(
			typeof data.eventData.stepType == 'string'          &&
			       data.eventData.stepType != defaults.stepType
		) {

			super.break();

			return false;
		}

		if(data.eventData.to.name != deck.name) {// data.eventData.to - куда мы перетащили карты

			super.break();

			return false;
		}

		// console.log('kickAction:run');

		share.set('stepType', stepType);

		common.animationDefault();

		let _from = data.eventData.to    , //Deck.Deck(_name),
		    _deck = _from.getCardsNames();

		let _callback = e => {

			// console.log('### kickAction:_callback');

			let _addStep = historyData => {

				for(let i in _deck) {

					event.dispatch('addStep', {
						"flip" : {
							"deckName"  : _from.name,
							"cardName"  : _deck[i]  ,
							"cardIndex" : i
						}
					});
				}

				event.dispatch('addStep', {
					"move" : {
						"from"     : _from.name        ,
						"to"       : data.actionData.to,
						"deck"     : _deck             ,
						// "flip"     : true              ,
						"stepType" : {
							"undo" : historyData.undo,
							"redo" : historyData.redo
						},
						"context"  : 'kickAction'
					}
				});
			};

			share.set('stepType', defaults.stepType);

			event.dispatch('kick:end');

			// _addStep({
			// 	"undo" : data.eventData.stepType,
			// 	"redo" : data.eventData.stepType // stepType
			// });

			let eventStepType = data.eventData.stepType;

			if(data.actionData.dispatch) {

				// event.dispatch('kick:end');

				event.dispatch(data.actionData.dispatch, {
					before: data => {

						_addStep({
							"undo" : eventStepType,
							"redo" : data.stepType
						});

						// event.dispatch('saveSteps', 'KICKACTION#1');
					}
				});
			} else {

				// event.dispatch('kick:end');

				_addStep({
					"undo" : eventStepType,
					"redo" : eventStepType
				});

				event.dispatch('saveSteps', 'KICKACTION#2');

				super.end();
			}
		}

		// TODO interval
		let forceMoveParams = {
			"from"     : _from             ,
			"to"       : data.actionData.to,
			"deck"     : _deck             ,
			"flip"     : true              ,
			"callback" : _callback
		};

		// forceMove(forceMoveParams);
		event.dispatch('forceMove', forceMoveParams);
	}

	// end() {
	// 	event.dispatch('kickEnd');
	// 	super.end();
	// }
}

export default new kickAction();
