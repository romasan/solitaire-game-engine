'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

import Tips from 'tips';
import Deck from 'addDeck';

let stepType = 'stepsAround';

let endAction = ()=>{

	share.set('stepType', defaults.stepType);
	common.curUnLock();
	// Tips.checkTips();

	if(data.actionData.dispatch) {
		event.dispatch(data.actionData.dispatch, data.eventData);
	}
};

export default function(data) {// {actionData, eventData, eventName}

	let _stepType = share.get('stepType');
	if(_stepType != defaults.stepType) { return; };

	share.set('stepType', stepType);
	// stop Drag'n'Drop
	common.curLock();
	
	let _relations = this.getRelationsByName('around', {from: null});
	let _tips = Tips.getTips();

	if(typeof data.actionData.action == "string") {
	
	}

	// выполняется для всех вокруг
	// ход не делается
	// вместо хода выполняется едействие для текущей стопки (если _central, по умолчанию true)
	if(typeof data.actionData.run == "string") {

		let _central = typeof data.actionData.central == "boolean" ? data.actionData.central : true;

		let _runStack = [];

		for(let i in _relations) {
			
			if(
				Tips.fromTo(this.name, _relations[i].to)
			) {
				_runStack.push(_relations[i]);
			}
		}

		let _counter = _runStack.length;

		let _callback = ()=>{
				
			_counter -= 1;
			if(_counter === 0) {
				
				endAction();
				// event.dispatch(data.actionData.dispatch)
			}
		}
		
		if(_counter === 0) {

			endAction();

		} else if(_central) {

			_counter += 1;

			event.dispatch(data.actionData.run, {
				to       : this.name,
				callback : _callback
			});
		}

		for(let i in _runStack) {
			
			let _data = Object.assign({}, _runStack[i]);
			_data.callback = _callback;
			event.dispatch(data.actionData.run, _data);
		}

	// выполняется после хода 
	} else {
		
		let _callback = ()=>{

			if(share.get('stepType') == stepType) {
				endAction();
			}
		};
		
		event.listen('makeStep', _callback)
		// event.dispatch(data.actionData.dispatch)
	}
};
