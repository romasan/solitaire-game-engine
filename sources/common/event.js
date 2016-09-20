'use strict';

// var events = {};

class Event {
// export default new function() {
	
	constructor() {
		this._events = {};
	}
	// this.on = 

	listen(name, callback) {
		if(typeof name != 'string' || typeof callback != 'function') return;
		if(this._events[name]) {
			this._events[name].push(callback);
		} else {
			this._events[name] = [callback];
		}
	}

	// this.do =
	dispatch(name, data) {

		if(this._events[name]) {
			for(var i in this._events[name]) {
				this._events[name][i](data);
			}
		}
	}

	// this.one function(name, data) {};

};

class EventManager extends Event {

	constructor() {
		
		super();

		this.global = new Event();
	}

	dispatch(name, data) {
		
		super.dispatch(name, data);

		this.global.dispatch(name, data);
	}

	clear() {
		this._events = {};
	}
}

let _eventManager = new EventManager();

export default _eventManager;
