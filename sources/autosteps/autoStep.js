'use strict';

import common   from '../common'         ;
import event    from '../common/event'   ;
import share    from '../common/share'   ;
import defaults from '../common/defaults';

// class stepType {
class autoStep {

	/**
	 * Create auto step or new type of moves
	 * @param {*} params 
	 */
	constructor(params) {

		if (typeof params.groups != 'undefined') {
			this.groups = params.groups;
		}
		
		if (typeof params.event == 'string') {
			this.event = params.event;
		}

		if (typeof params.dispatch == 'string') {
			this.dispatch = params.dispatch;
		}

		if (typeof params.autoStep == 'boolean') {
			this.autoStep = params.autoStep;
		}
	}

	/**
	 * Start auto step
	 * @param {*} data 
	 */
	start(data) {

		if (!this.autoStep) {
			event.dispatch('stopSession');
		}

		share.set('autoStep:stepType', this.stepType);
		
		share.set('stepType'         , this.stepType);

		// console.log('autoStep', this.autoStep, this._name, data);

		if (this.autoStep) {

			common.curLock();
			// TODO run data.before();

			this.auto();
		} else {

			// if (this.check()) {
				
			if (data && typeof data.before == 'function') {

				data.before({
					"stepType" : this.stepType
				});
			}

			let _check = this.check();
			
			if (!_check) {
				// this.end();
			} else {
				event.dispatch('saveSteps');
			}
		}
	}

	/**
	 * Finish auto step
	 * @param {*} data 
	 */
	end(data) {

		// console.log('autoStep:end, dispatch:', this.disptch)

		// let _stepType = share.get('stepType');
		share.set('stepType', defaults.stepType);

		if (this.dispatch) {

			let _data = {
				"stepType" : share.get('stepType') // TODO defaults.stepType | _stepType
				// "callback" : e => {
				// 	share.set('stepType', defaults.stepType);
				// }
			};

			if (data) {
				for (let valueName in data) {
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
	/**
	 * initialisation of auto step
	 * @param {string} stepType
	 */
	init(stepType) {

		this.stepType = stepType;

		if (this.event) {
			event.listen(this.event, data => {
				// if (!share.get('gameIsWon')) {
				this.start(data);
				// }
			});
		}
		
		if (!this.autoStep) {

			event.listen(
				
				'moveEnd',

				e => {

					if (share.get('stepType') != this.stepType) {
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

export default autoStep;