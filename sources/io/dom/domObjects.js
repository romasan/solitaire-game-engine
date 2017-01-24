'use strict';

class domObjects {

	constructor() {
		this._oblects = {};
		this._id = -1;
	}

	get(id) {
		return this._oblects[id];
	}

	add(object) {

		this._id += 1;
		let _i = 'el_' + this._id;
		
		this._oblects[_id] = object;

		return _id;
	}
}
