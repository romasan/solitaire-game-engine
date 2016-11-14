'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';

class stateManager {
	
	constructor() {
		
		this._state = null;

		this._sourceList = [
			'elements',
			'stepType'
		];

		this._clearList = [
			'animatedCallback'     ,
			'animatedElements'     ,
			'animatedElementsStack',
			'curLockState'         ,
			'sessionStarted'       ,
			'startCursor'          ,
			'lastCursorMove'
		];
	}

	backup() {

		this._state = {};

		for(let i in this._sourceList) {
			this._state[this._sourceList[i]] = Object.assign({}, share.get(this._sourceList[i]));
		}
	}

	restore() {

		if(!this._state) {

			console.warn('Restore fail. Store is empty.');

			return;
		}

		// restore share
		for(let i in this._clearList) {
			share.delete(this._clearList[i]);
		}

		console.log( '#1', share.get('elements') );

		for(let i in this._sourceList) {

			console.log('>>>', this._sourceList[i]);

			share.set(this._sourceList[i], this._state[this._sourceList[i]], true);
		}

		console.log( '#2', share.get('elements') );

	}

	get() {
		return this._state;
	}
}

export default new stateManager();