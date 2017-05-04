'use strict';

import event    from 'event'   ;
import share    from 'share'   ;
import common   from 'common'  ;
import defaults from 'defaults';

/*
 * start
 * end
 * init
 */

export default class {

	constructor(params) {

		if(typeof params.groups != 'undefined') {
			this.groups = params.groups;
		}
		
		if(typeof params.event == 'string') {
			this.event = params.event;
		}

		if(typeof params.dispatch == 'string') {
			this.dispatch = params.dispatch;
		}

		if(typeof params.autoStep == 'boolean') {
			this.autoStep = params.autoStep;
		}
	}

	start(data) {

		if(!this.autoStep) {
			event.dispatch('stopSession');
		}

		share.set('autoStep:stepType', this.stepType);
		
		share.set('stepType', this.stepType);

		console.log('autoStep', this.autoStep, this._name);

		if(this.autoStep) {

			common.curLock();

			this.auto();
		} else {

			if(this.check()) {
				
				if(data && typeof data.before == 'function') {
					data.before({
						"stepType" : this.stepType
					});
				}
			}
		}
	}

	end(data) {

		share.set('stepType', defaults.stepType);

		if(this.dispatch) {

			let _data = {
				"stepType" : share.get('stepType')
				// "callback" : e => {
				// 	share.set('stepType', defaults.stepType);
				// }
			};

			if(data) {
				for(let valueName in data) {
					_data[valueName] = data[valueName];
				}
			}

			event.dispatch(this.dispatch, _data);
		} else {
			// share.set('stepType', defaults.stepType);
			event.dispatch('stopSession');
		}

		share.delete('autoStep:stepType');
	}

	init(stepType) {

		this.stepType = stepType;

		if(this.event) {
			event.listen(this.event, data => {
				this.start(data);
			});
		}
		
		if(!this.autoStep) {

			event.listen(
				
				'moveEnd',

				e => {

					if(share.get('stepType') != this.stepType) {
						return; 
					}
				
					this.check();
				},

				// this
				'addAutoStepEvent:' + this.event
			);
		}
	}
}
