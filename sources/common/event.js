'use strict';

// var events = {};

class Event {
// export default new function() {
	
	constructor() {
		this._events = {};
		this._tag = 'global';
	}

	listen(eventName, callback, context) {

		// console.log('listen: (tag:', this._tag + ')', eventName);
		
		if(
			typeof callback  != 'function' ||
			typeof eventName != 'string'
		) {
			return;
		}

		if(this._events[eventName]) {
			this._events[eventName].push({
				tag: this._tag,
				context       ,
				callback
			});
		} else {
			this._events[eventName] = [{
				tag: this._tag,
				callback
			}];
		}
	}

	// this.do =
	dispatch(eventName, data) {

		if(this._events[eventName]) {
			for(let i in this._events[eventName]) {
				if(this._events[eventName][i]) {
					this._events[eventName][i].callback(data);
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
					this._events[eventName][i] = null;
				}
			}
		}
	}

	getEventsByName(eventName) {
		return this._events.indexOf(eventName) >= 0 ? this._events[this._events.indexOf(eventName)] : null;
	}

	log() {}
};

// let _event = new Event();
// _event.listen = console.log;
// export default _event;
export default new Event();
