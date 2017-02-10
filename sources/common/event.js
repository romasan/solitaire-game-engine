'use strict';

/*
 * listen
 * dispatch
 * clear
 * setTag
 * clearByTag
 * get
 * has
 */

class Event {

	constructor() {

		this.tags = {
			"preInit" : 'preInit',
			"inGame"  : 'inGame'
		};

		this._tag = this.tags.preInit;
		
		this._events = {};
	}

	listen(eventName, callback, context, once) {

		if(
			typeof callback  != 'function' ||
			typeof eventName != 'string'
		) {
			return;
		}

		if(this._events[eventName]) {
			this._events[eventName].push({
				"tag"      : this._tag,
				"context"  : context  ,
				"callback" : callback ,
				"once"     : once
			});
		} else {
			this._events[eventName] = [{
				"tag"      : this._tag,
				"callback" : callback ,
				"context"  : context  ,
				"once"     : once
			}];
		}
	}

	once(eventName, callback, context) {
		this.listen(eventName, callback, context, true);
	}

	dispatch(eventName, data) {

		if(this._events[eventName]) {

			for(let i in this._events[eventName]) {

				if(this._events[eventName][i]) {

					this._events[eventName][i].callback(

						data,

						{
							"eventInfo" : {
								"eventName" : eventName                     ,
								"index"     : i                             ,
								"count"     : this._events[eventName].length
							}
						}
					);

					if(this._events[eventName][i].once) {
						delete this._events[eventName][i];
					}
				}
			}
		}
	}

	clear() {
		this._events = {};
	}

	setTag(tag) {
		this._tag = tag;
	}

	clearByTag(tag) {

		for(let eventName in this._events) {
			for(let i in this._events[eventName]) {
				if(
					this._events[eventName][i]            &&
					this._events[eventName][i].tag == tag
				) {
					// this._events[eventName][i] = null;
					this._events[eventName] = this._events[eventName]
						.slice(0, i)
						.concat(
							this._events[eventName]
								.slice((i | 0) + 1)
						);
				}
			}
		}
	}

	get(eventName, filter) {

		if(filter) {

			let _events = [];

			for(let i in this._events[eventName]) {

				let _correct = true;

				for(let _attr in filter) {
					_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
				}

				if(_correct) {
					_events.push(this._events[eventName][i]);
				}
			}

			return _events;
		} else {
			return this._events[eventName];
		}
	}

	has(eventName, filter) {

		if(filter) {

			let _count = 0;

			for(let i in this._events[eventName]) {

				let _correct = true;

				for(let _attr in filter) {
					_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
				}

				if(_correct) {
					_count += 1;
				}
			}

			return _count;
		} else {
			return this._events[eventName] ? this._events[eventName].length : 0;
		}
	}

	_getAll() {
		return this._events;
	}

	// getEventsByName(eventName) {
	// 	return this._events.indexOf(eventName) >= 0 ? this._events[this._events.indexOf(eventName)] : null;
	// }

	// log() {}
};

export default new Event();
