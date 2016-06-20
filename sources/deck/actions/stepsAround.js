'use strict';

import event  from 'event';
import share  from 'share';
import common from 'common';

import Tips from 'tips';
import Deck from 'addDeck';

// let _callback = null;
let _callback = ()=>{
	console.log(' --- empty callback ---');
};

event.listen('allAnimationsEnd', (e)=>{
	if(
		typeof _callback == 'function' &&
		e == 'moveCardToHomeAnimation'// kickAnimation
	) {
		_callback();
	}
})

export default function(data) {// {actionData, eventData, eventName}

	share.set('stepType', 'stepsAround');
	// stop Drag'n'Drop
	common.clearInput();

	let _relations = this.getRelationsByName('around', {from: null});
	let _tips = Tips.getTips();

	if(typeof data.actionData.run == "string") {
		
		let _central = typeof data.actionData.central == "boolean" ? data.actionData.central : true;
		if(_central) {
			console.log('#0 >>>', {to: this.name});
			event.dispatch(data.actionData.run, {
				to: this.name
			});
			console.log('#0 <<<');
		}

		for(let i in _relations) {
			
			console.log('#1 >>>', this.name, _relations[i].to);
			if(
				Tips.fromTo(this.name, _relations[i].to)
			) {
				event.dispatch(data.actionData.run, _relations[i]);
				console.log('#1 <<<');
			}
		}
	}

	// TODO подождать завершения анимации
	// stepType

	// dispatch

	_callback = ()=>{

		console.log('stepsAround:callback', data.actionData.dispatch);
		// if(data.actionData.dispatch) {
		// 	event.dispatch(data.actionData.dispatch, data.eventData)
		// }
	}


	console.log('stepsAround', data, _relations);
};