'use strict';

import event  from 'event';
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

		this.autoStep = params.autoStep;

		if(
			!params.autoStep
		 && params.click
		) {

			// TODO move
			event.listen('click', (deck)=>{
				if(
					share.get('stepType') == params.stepType
				 && common.deckInGroups(deck, this.groups)
				) {
						this.manual(deck);
				};
			});
		};
	}
};