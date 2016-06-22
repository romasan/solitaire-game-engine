'use strict';

import event  from 'event';
import share  from 'share';
import common from 'common';

export default class {

	constructor(params) {

		if(typeof params.groups != "undefined") {
			this.groups = params.groups;
		}
		
		if(typeof params.event == "string") {
			event.listen(params.event, this.start);
		}

		if(typeof params.dispatch == "string") {
			this.dispatch = params.dispatch;
		}

		this.autoStep = params._autoStep;

		if(
			!params.autoStep &&
			params.click
		) {

			// TODO move
			event.listen('click', (deck)=>{
				if(
					share.get('stepType') == params._stepType &&
					common.deckInGroups(deck, this.groups)
				) {
					this.manual(deck);
				}
			});
		}

		if(!params.autoStep) {
			console.log(">>>#1");
			event.listen('moveEnd', (data)=>{
				console.log(">>>#2");
				this.check(data);
			});
		}

	}

	start() {}
	
	check() {}
	
	auto() {}
	
	manual(data) {}
	
}
