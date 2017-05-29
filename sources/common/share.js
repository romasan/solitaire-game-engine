'use strict';

import event    from 'event'   ;
import defaults from 'defaults';

/*
 * get
 * set
 * getAll
 * delete
 */

class shareClass {

	constructor() {
		this._data = {};
	}

	get(name) {
		if(typeof this._data[name] != 'undefined') {
			// TODO решить наконец проблему, 
			// почему Object.assign не работает после babel-я
			
			event.dispatch('shareGet:' + name, this._data[name]);
			return this._data[name];
		} else {
			return null;
		}
	}

	set(name, data, forceClone = false) {

		let _debugValueName = 'stopRunHistory';

		if(name == _debugValueName) {
			console.log('%cgebug: change ' + _debugValueName + ' from ' + this._data[_debugValueName] + ' to ' + data, 'color:' + (data == true ? 'orange' : 'blue'));
		}

		// "foo", "bar", false
		if(typeof name == 'string') {

			event.dispatch('shareChange:' + name, {
				"from" : this._data[name],
				"to"   : data
			});

			if(
				typeof forceClone == 'boolean' && forceClone
			) {
				try {
					// this._data[name] = Object.assign({}, data);
					this._data[name] = [
						'string' ,
						'number' ,
						'boolean'
					].indexOf(typeof data) >= 0
					? data
					: data instanceof Array
						? Object.assign([], data)
						: Object.assign({}, data);
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

			for(let _name in name) {

				event.dispatch('shareChange:' + name, {
					"from" : this._data[_name],
					"to"   : name[_name]
				});

				if(
					typeof forceClone == 'boolean' && forceClone
				) {
					try {
						// this._data[_name] = Object.assign({}, name[_name]);
						this._data[_name] = ['string', 'number', 'boolean'].indexOf(typeof name[_name]) >= 0
						? name[_name]
						: name[_name] instanceof Array
							? Object.assign([], name[_name])
							: Object.assign({}, name[_name]);
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

	delete(name) {
		delete this._data[name];
	}
}

export default new shareClass();