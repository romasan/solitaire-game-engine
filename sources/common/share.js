'use strict';

import {event} from './';

class shareClass {

	/**
	 * Create shared storage
	 */
	constructor() {
		this._data = {};
		// this.names = {};
	}

	/**
	 * Get element by name
	 * @param {string} name 
	 */
	get(name) {
		if (typeof this._data[name] != 'undefined') {

			// TODO решить наконец проблему, 
			// почему Object.assign не работает после babel-я
			
			event.dispatch('shareGet:' + name, this._data[name]);

			return this._data[name];
		} else {
			return null;
		}
	}

	// _addName(name) {
	// 	this.names[name] = name;
	// }

	// _checkNames() {
	// 	this.names = ((names, result) =>{
	// 		for (let name in names) {
	// 			if (this._data[name]) {
	// 				result[name] = name;
	// 			}
	// 		}
	// 	})(this.names, {});
	// }

	/**
	 * Add new element
	 * @param {string} name 
	 * @param {*} data 
	 * @param {*} forceClone 
	 */
	set(name, data, forceClone = false) {

		// this._addName(name);

		// "foo", "bar", false
		if (typeof name == 'string') {

			event.dispatch('shareChange:' + name, {
				"from" : this._data[name],
				"to"   : data
			});

			if (
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
				} catch (e) {
					this._data[name] = data;
				}

			} else {
				this._data[name] = data;
			}

			event.dispatch('shareSet:' + name, data);

		// {"foo" : "bar"}, false
		} else if (name instanceof Object) {

			if (typeof data == 'boolean') {
				forceClone = data;
			}

			for (let _name in name) {

				event.dispatch('shareChange:' + name, {
					"from" : this._data[_name],
					"to"   : name[_name]
				});

				if (
					typeof forceClone == 'boolean' && forceClone
				) {
					try {
						// this._data[_name] = Object.assign({}, name[_name]);
						this._data[_name] = ['string', 'number', 'boolean'].indexOf(typeof name[_name]) >= 0
						? name[_name]
						: name[_name] instanceof Array
							? Object.assign([], name[_name])
							: Object.assign({}, name[_name]);
					} catch (e) {
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

	/**
	 * Update element
	 * @param {String} name 
	 * @param {Function | *} dataCallback 
	 */
	update(name, dataCallback) {
		if (typeof dataCallback == "function") {
			this.set(name, dataCallback(this.get(name)));
		} else {
			this.set(name, dataCallback);
		}
	}

	/**
	 * Get all elements
	 */
	getAll() {
		return this._data;
	}

	/**
	 * Delete element by name
	 * @param {string} name 
	 */
	delete(name) {
		delete this._data[name];
		// this._checkNames();
	}

	/**
	 * Assign a value to an existing variable.
	 * @param {string} name 
	 * @param {string} fromName 
	 */
	setFrom(name, fromName) {

		if (typeof this._data[fromName] != "undefined") {
			this._data[name] = this._data[fromName];	
		} else {
			console.warn(`The variable ${fromName} does not exist.`);
		}
	}
}

export default new shareClass();