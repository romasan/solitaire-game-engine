'use strict';

import event    from 'event';
import defaults from 'defaults';

let _debug = [];

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

	set(name, data, forceClone = false) {

		let _time = new Date().getTime();
		_debug.push(_time);
		if(_debug.length >= 100) {
			_debug.shift();
			console.log('>>>');
			if(window._debug123 && (_time - _debug[0]) < 1000) {
				throw new Error('time of last 100 iteration = ' + (_time - _debug[0]));
			}
		}
		// "foo", "bar", false
		if(typeof name == "string") {

			console.log(name, _time - _debug[0], window._debug123, (_time - _debug[0]) < 1000);

			event.dispatch('shareChange:' + name, {
				from : this._data[name],
				to   : data
			});

			if(
				typeof forceClone == "boolean" && forceClone
			) {
				try {
					this._data[name] = Object.assign({}, data);
				} catch(e) {
					this._data[name] = data;
				}

			} else {
				this._data[name] = data;
			}

			event.dispatch('shareSet:' + name, data);

		// {"foo" : "bar"}, false
		} else if(name instanceof Object) {

			if(typeof data == 'boolean') {
				forceClone = data;
			}

			for(var _name in name) {

				event.dispatch('shareChange:' + name, {
					from : this._data[_name],
					to   : name[_name]
				});

				if(
					typeof forceClone == "boolean" && forceClone
				) {
					try {
						this._data[_name] = Object.assign({}, name[_name]);
					} catch(e) {
						this._data[_name] = name[_name];
					}

				} else {
					this._data[_name] = name[_name];
				}

				event.dispatch('shareSet:' + _name, name[_name]);
			}

		} else {
			console.warn('Error share.set:', _name, name[_name]);
		}
	}

	getAll() {
		return this._data;
	}
}

export default new shareClass();