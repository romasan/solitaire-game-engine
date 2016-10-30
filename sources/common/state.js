'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';

class stateManager {
	
	constructor() {
		this._state = null;
	}

	backup() {

		let _share = share.getAll();

		this._state = _share;
	}

	restore() {

		share.set(this._state, true);
		
		// let _share = {};
		// for(let name in this._state) {
		// 	_share[name] = this._state[name];
		// }

		// share.set(_share);
	}
}

export default new stateManager();