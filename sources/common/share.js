'use strict';


// export default new function() {
class shareClass {
	
	constructor() {
		this.data = {};
	}

	get(name) {
		if(typeof this.data[name] != "undefined") {
			// TODO решить наконец проблему, 
			// почему Object.assign не работает после babel-я
			
			// event.dispatch('shareGet', {name : name, data : data[name]});
			return this.data[name];
		} else {
			return null;
		}
	}

	set(name, _data, forceClone) {

		if(typeof name == "string") {
			
			if(
				typeof forceClone == "boolean" && forceClone
			) {
				this.data[name] = Object.assign({}, _data);
			} else {
				this.data[name] = _data;
			}
			// event.dispatch('shareSet', {name : _data});
		
		} else if(name instanceof Object && typeof _data == "undefined") {
			
			for(var _name in name) {
				this.data[_name] = name[_name];
			}
			// event.dispatch('shareSet', name);
		
		} else {
			
			console.warn('Error share.set:', name, _data);

		}
	}

	getAll() {
		return this.data;
	}
}

export default new shareClass();