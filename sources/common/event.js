'use strict';

import share from './share';

/*
 * listen | on
 * once
 * remove
 * dispatch
 * clear
 * setTag
 * clearByTag
 * get
 * has
 * _getAll
 */

class Event {

	constructor() {

		this.tags = {
			"preInit" : 'preInit',
			"inGame"  : 'inGame'
		};

		this._tag = this.tags.preInit;
		
		this._events = {};

		this._id = 0;
	}

	/**
	 * Subscribe to the event
	 * @param {string} eventName 
	 * @param {function} callback 
	 * @param {*} context 
	 * @param {boolean} once 
	 * @returns {number} - subscription id
	 */
	listen(eventName, callback, context, once) {

		if (
			typeof callback  != 'function' ||
			typeof eventName != 'string'
		) {
			return;
		}

		this._id += 1;

		if (this._events[eventName]) {

			this._events[eventName].push({
				"id"       : this._id ,
				"tag"      : this._tag,
				"context"  : context  ,
				"callback" : callback ,
				"once"     : once
			});
		} else {

			this._events[eventName] = [{
				"id"       : this._id ,
				"tag"      : this._tag,
				"callback" : callback ,
				"context"  : context  ,
				"once"     : once
			}];
		}

		return this._id | 0;
	}
	on(eventName, callback, context, once) {
		this.listen(eventName, callback, context, once);
	}

	once(eventName, callback, context) {
		return this.listen(eventName, callback, context, true);
	}

	/**
	 * Remove subscriptions
	 * @param {*} data 
	 */
	remove(data) {

		if (typeof data == 'number') {

			for (let eventName in this._events) {
				this._events[eventName] = this._events[eventName].filter(e => e.id != data);
			}
		} else if (typeof data == 'string' && this._events[eventName]) {

			delete this._events[data]
		} else if (data) { // } && typeof data.context == 'string') {

			for (let key in data) {
				for (let eventName in this._events) {
					this._events[eventName] = this._events[eventName].filter(e => e[key] != data[key]);
				}
			}
		} else {
			console.warn('Event delete is impossible for', data, 'query');
		}
	}

	/**
	 * Cross dispatch
	 * @param {string} eventName 
	 * @param {string} nextEvent 
	 * @param {*} data 
	 */
	pass(eventName, nextEvent, data) {
		this.listen(eventName, e => {
			this.dispatch(nextEvent, data);
		})
	}

	/**
	 * Dispatch event
	 * @param {string} eventName 
	 * @param {*} data 
	 */
	dispatch(eventName, data) {

		if (this._events[eventName]) {

			for (let i in this._events[eventName]) {

				if (this._events[eventName][i]) {

					// let _result = 
					this._events[eventName][i].callback(

						data,

						{
							"eventInfo" : {
								"eventName" : eventName                     ,
								"index"     : i                             ,
								"count"     : this._events[eventName].length
							},

							"gameInfo" : {
								"gameIsWon" : share.get('gameIsWon')
								// "stepType"  : share.get('stepType')
								// "isCurLock" : null
							}
						},
					);

					if (this._events[eventName][i].once) {

						delete this._events[eventName][i];

						// this._removeEmpty(eventName);

						// return _result;
					}
				}
			}

			this._removeEmpty(eventName);

			// return {
			// 	"done" : true
			// }
		}

		// return {
		// 	"done" : false
		// }
	}

	_removeEmpty(eventName) {

		this._events[eventName] = this._events[eventName].filter(e => e);

		if(this._events[eventName].length == 0) {
			delete this._events[eventName];
		}
	}

	/**
	 * Remove all events
	 */
	clear() {
		this._events = {};
	}

	/**
	 * Set TAG for next subscriptions
	 * @param {string} tag 
	 */
	setTag(tag) {
		this._tag = tag;
	}

	/**
	 * Delete subscriptions with a specific tag
	 * @param {string} tag 
	 */
	clearByTag(tag) {

		for (let eventName in this._events) {
			this._events[eventName] = this._events[eventName].filter(e => e.tag != tag);
		}
	}

	/**
	 * Get subscriptions with a specific name
	 * @param {string} eventName 
	 * @param {*} filter 
	 */
	get(eventName, filter) {

		if (filter) {

			let _events = [];

			for (let i in this._events[eventName]) {

				let _correct = true;

				for (let _attr in filter) {
					_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
				}

				if (_correct) {
					_events.push(this._events[eventName][i]);
				}
			}

			return _events;
		} else {
			return this._events[eventName];
		}
	}

	/**
	 * Are there subscriptions with a specific name
	 * @param {string} eventName 
	 * @param {*} filter 
	 */
	has(eventName, filter) {

		if (filter) {

			let _count = 0;

			for (let i in this._events[eventName]) {

				let _correct = true;

				for (let _attr in filter) {
					_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
				}

				if (_correct) {
					_count += 1;
				}
			}

			return _count;
		} else {
			return this._events[eventName] ? this._events[eventName].length : 0;
		}
	}

	/**
	 * Get all subscriptions
	 */
	_getAll() {
		return this._events;
	}

	// getEventsByName(eventName) {
	// 	return this._events.indexOf(eventName) >= 0 ? this._events[this._events.indexOf(eventName)] : null;
	// }
};

export default new Event();
