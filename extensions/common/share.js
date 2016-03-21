'use strict';

var data = {};

export default new function() {
	
	this.get = function(name) {
		if(typeof data[name] != "undefined") {
			// TODO решить наконец проблему, 
			// почему Object.assign не работает после babel-я
			
			// try {

			// if( (data[data]).toString() == "[object Object]" ) {
			// 	return Object['assign'] ? Object['assign']({}, data[name]) : data[name]
			// } else {
			return data[name];
			// }

			// } catch(e) {
			// 	console.log( (data[name]).toString() );
			// 	console.log('CATCH:', name, data[name]);
			// }
		} else {
			return null;
		}
	};

	this.set = function(name, _data) {
		// if(data[name]) {
		data[name] = _data;
		// }
	};

	this.getAll = function() {
		return data;
	}

};
