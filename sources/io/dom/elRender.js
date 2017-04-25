'use strict';

// let jquery = require("script!../../../frontend/js/jquery-2.2.4.min.js");

// export default jquery;

import defaults from 'defaults'    ;
import share    from 'share'       ;
import event    from 'event'       ;

import elClass    from 'elClass'   ;
import allElClass from 'allElClass';

share.set('animatedElements'     , 0        );
share.set('animatedElementsStack', []       );
share.set('animatedCallback'     , e => null);

let _allEl = data => {

	if(!data) {
		throw new Error('elRender:empty arguments.');
	}

	if(typeof data == 'string') {

		try {

			if(data[0] == '#') {
				
				let _element = document.getElementById(data.slice(1, Infinity));

				return new elClass(_element);			
			} else if(data[0] == '.') {
				
				let _elements = document.getElementsByClassName(data.slice(1, Infinity));

				return new allElClass(_elements);			
			} else if(data[0] == '<') {
				
				let _temp = document.createElement('temp');
				_temp.innerHTML = data;
				let _element = _temp.children[0];

				return new elClass(_element);			
			}
		} catch(data) {}
		
	} else if(data.el || data.elements) {
		return data;
	} else {
		return new elClass(data);
	}
};

// TODO
_allEl.stopAnimations = e => {

	// console.log('STOP ANIMATIONS');

	// if(!share.get('animation')) {
	// 	return;
	// }

	// return;
	event.dispatch('clearCallbacks');

	_allEl('.animated')
		.stop()
		.css({
			"transition" : false
		})
		.removeClass('animated');
};

event.listen('stopAnimations', _allEl.stopAnimations);

export default _allEl;