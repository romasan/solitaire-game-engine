'use strict';

var events = {};

export default new function() {
	
	// this.on = 
	this.listen = function(name, callback) {
		if(typeof name != 'string' || typeof callback != 'function') return;
		if(events[name]) {
			events[name].push(callback);
		} else {
			events[name] = [callback];
		}
	};

	// this.do =
	this.dispatch = function(name, data) {

		if(events[name]) {
			for(var i in events[name]) {
				events[name][i](data);
			}
		}
	};

	// this.one function(name, data) {};

};
