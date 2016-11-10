'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';

class stateManager {
	
	constructor() {
		
		this._state = {};

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
			this._state[this._sourceList[i]] = this._sourceList[i];
		}
	}

	restore() {

		// restore share
		for(let i in this._clearList) {
			share.delete(this._clearList[i]);
		}
		
		for(let i in this._sourceList) {
			share.set(this._sourceList[i], this._state[this._sourceList[i]], true);
		}
	}
}

export default new stateManager();