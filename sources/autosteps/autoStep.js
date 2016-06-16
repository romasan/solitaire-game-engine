'use strict';

import event from 'event';

export default class {
	
	constructor(params) {

		if(typeof params.groups != "undefined") {
			this.groups = params.groups;
		}
		
		if(typeof params.event == "string") {
			event.dispatch(params.event, this.start);
		}
		
		if(typeof params.dispatch == "string") {
			this.dispatch = params.dispatch;
		}
	}
};