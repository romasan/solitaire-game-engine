'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

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

	start(e) {

		console.log('### start auto step:', this.stepType, e);

		if(e && typeof e.before == "function") {
			e.before({
				stepType: this.stepType
			});
		}
		
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
			event.dispatch(this.dispatch, {
				stepType: share.get('stepType'),
				callback: () => {
					share.set('stepType', defaults.stepType);
				}
			});
		} else {
			// share.set('stepType', defaults.stepType);
		}
	}

	init(stepType) {

		this.stepType = stepType;

		if(this.event) {
			event.listen(this.event, (e) => {
				this.start(e);
			});
		}
		
		if(!this.autoStep) {

			event.listen('moveEnd', () => {

				if(share.get('stepType') != this.stepType) { return; }
				
				this.check();
			});
		}
	}
}
