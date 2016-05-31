'use strict';

import elClass from 'elClass';

export default (e) => {

	if(!e) {
		return new elClass(e);
	}
	
	if(typeof e == "string") {
		try {
			e = document.querySelector(e);
		} catch(_e) {
			var _temp = document.createElement('temp');
			_temp.innerHTML = e;
			e = _temp.children[0];
		}
	} else if(e.length) {
		try{ 
			e = e[0];
		} catch(_e) {
			throw new Error();
		}
	} else if(e.el) {
		e = e.el;
	}

	return new elClass(e);
};