'use strict';

import event  from 'event';
import share  from 'share';
import common from 'common';

import Tips from 'tips';
import Deck from 'addDeck';

export default function(data) {// {actionData, eventData, eventName}

	share.set('stepType', 'stepsAround');
	// stop Drag'n'Drop
	common.clearInput();

	let _relations = this.getRelationsByName('around', {from: null});
	let _tips = Tips.getTips();

	if(typeof data.actionData.run == "string") {
		
		let _central = typeof data.actionData.central == "boolean" ? data.actionData.central : true;
		if(_central) {
// 			event.dispatch(data.actionData.run, {
// 				to: this.name
// 			});
		}

		let _runStack = [];

		for(let i in _relations) {
			
			if(
				Tips.fromTo(this.name, _relations[i].to)
			) {
				_runStack.push(_relations[i]);
			}
		}

		for(let i in _runStack) {
			let _data = Object.assign({}, _relations[i]);
			_data.callback = ()=>{
				console.log('--- .:|:. ---');
			}
			event.dispatch(data.actionData.run, _data);
		}
	}

	// TODO подождать завершения анимации
	// stepType

	// dispatch


	console.log('stepsAround', data, _relations);
};