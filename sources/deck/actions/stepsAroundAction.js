'use strict';

import event      from 'event'     ;
import share      from 'share'     ;
import common     from 'common'    ;
import defaults   from 'defaults'  ;

import deckAction from 'deckAction';
import Tips       from 'tips'      ;
import Deck       from 'deck'      ;

let stepType = 'stepsAround';

class stepsAroundAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {// {actionData, eventData, eventName}

		let _stepType = share.get('stepType');
		
		if(_stepType != defaults.stepType) {
			
			super.break();

			return;
		};

		share.set('stepType', stepType);
		// stop Drag'n'Drop
		common.curLock();
		
		let _relations = deck.getRelationsByName('around', {from: null});
		// let _tips = Tips.getTips();

		// выполняется для всех вокруг
		// ход не делается
		// вместо хода выполняется едействие для текущей стопки (если _central, по умолчанию true)
		if(typeof data.actionData.run == 'string') {

			let _central = typeof data.actionData.central == 'boolean' ? data.actionData.central : true;

			let _runStack = [];

			for(let i in _relations) {
				
				if(
					Tips.fromTo(deck.name, _relations[i].to)
				) {
					_runStack.push(_relations[i]);
				}
			}

			let _counter = _runStack.length;

			let _callback = e => {
					
				_counter -= 1;
				if(_counter === 0) {
					
					this.end();
					// event.dispatch(data.actionData.dispatch)
				}
			}
			
			if(_counter === 0) {

				this.end();

			} else if(_central) {

				_counter += 1;

				event.dispatch(data.actionData.run, {
					to       : deck.name,
					callback : _callback
				});
			}

			for(let i in _runStack) {
				
				let _data = null;
				try {
					_data = Object.assign({}, _runStack[i]);
				} catch(e) {
					_data = _runStack[i];
				}
				
				_data.callback = _callback;
				event.dispatch(data.actionData.run, _data);
			}

		// выполняется после хода 
		} else {
			
			let _callback = e => {

				if(share.get('stepType') == stepType) {
					this.end();
				}
			};
			
			event.listen('makeStep', _callback)
			// event.dispatch(data.actionData.dispatch)
		}
	}

	end() {

		share.set('stepType', defaults.stepType);
		common.curUnLock();
		// Tips.checkTips();

		if(data.actionData.dispatch) {
			event.dispatch(data.actionData.dispatch, data.eventData);
		}

		super.end();
	}

}

export default new stepsAroundAction();