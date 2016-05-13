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
			
			// event.dispatch('shareGet', {name : name, data : data[name]});
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

		if(typeof name == "string") {
			
			data[name] = _data;
			// event.dispatch('shareSet', {name : _data});
		
		} else if(name instanceof Object && typeof _data == "undefined") {
			
			for(var _name in name) {
				data[_name] = name[_name];
			}
			// event.dispatch('shareSet', name);
		
		} else {
			
			console.warn('Error share.set:', name, _data);

		}
		// }
	};

	this.getAll = function() {
		return data;
	}

};