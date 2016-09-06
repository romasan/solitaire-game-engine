'use strict';

import event    from 'event';
import defaults from 'defaults';

// export default new function() {
class shareClass {

	constructor() {
		this._data = {};
	}

	get(name) {
		if(typeof this._data[name] != "undefined") {
			// TODO решить наконец проблему, 
			// почему Object.assign не работает после babel-я
			
			event.dispatch('shareGet:' + name, this._data[name]);
			return this._data[name];
		} else {
			return null;
		}
	}

	set(name, data, forceClone) {

		if(typeof name == "string") {

			if(
				typeof forceClone == "boolean" && forceClone
			) {

				this._data[name] = Object.assign({}, data);

			} else {
				
				event.dispatch('shareChange:' + name, {
					from: this._data[name],
					to: data
				});

				this._data[name] = data;

				event.dispatch('shareSet:' + name, data);

			}
			// event.dispatch('shareSet', {name : _data});
		
		} else if(name instanceof Object && typeof data == "undefined") {

			for(var _name in name) {
				this._data[_name] = name[_name];
			}
			// event.dispatch('shareSet', name);

		} else {

			console.warn('Error share.set:', name, data);

		}
	}

	getAll() {
		return this._data;
	}
}

export default new shareClass();