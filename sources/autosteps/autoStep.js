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
			this.event = params.event;
		}

		if(typeof params.dispatch == "string") {
			this.dispatch = params.dispatch;
		}

		if(typeof params.autoStep == "boolean") {
			this.autoStep = params.autoStep;
		}
	}

	start() {
		
		share.set('stepType', this.stepType);

		if(this.autoStep) {

			common.curLock();
			this.auto();
		} else {

			this.check();
		}
	}

	end() {

		if(this.dispatch) {
			event.dispatch(this.dispatch);
		}
	}

	init(stepType) {

		this.stepType = stepType;

		if(this.event) {
			event.listen(this.event, ()=>{
				this.start();
			});
		}
		
		if(!this.autoStep) {
			event.listen('moveEnd', ()=>{
				this.check();
			});
		}
	}
}
