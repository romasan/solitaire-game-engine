'use strict';

// let jquery = require("script!../../../frontend/js/jquery-2.2.4.min.js");

// export default jquery;

import defaults from 'defaults';
import share    from 'share';

import elClass    from 'elClass';
import allElClass from 'allElClass';

share.set('animatedElements'     , 0       );
share.set('animatedElementsStack', []      );
share.set('animatedCallback'     , () => {});

var _allEl = (e) => {

	if(!e) {
		throw new Error("elRender:empty arguments");
	}
	
	if(typeof e == "string") {

		try {
			if(e[0] == "#") {
				let _element = document.getElementById(e.slice(1, Infinity));
				return new elClass(_element);
			} else if(e[0] == ".") {
				let _elements = document.getElementsByClassName(e.slice(1, Infinity));
				return new allElClass(_elements);
			} else if(e[0] == "<") {
				let _temp = document.createElement('temp');
				_temp.innerHTML = e;
				let _element = _temp.children[0];
				return new elClass(_element);
			}
		} catch(e) {}
		
	} else if(e.el || e.elements) {
		return e;
	} else {
		return new elClass(e);
	}
};

_allEl.stopAnimations = (callback) => {

	_allEl(".animated")
		.css({transition: '0s'}) // false
		.removeClass("animated");
};

export default _allEl;