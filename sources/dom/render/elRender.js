'use strict';

// let jquery = require("script!../../../frontend/js/jquery-2.2.4.min.js");

// export default jquery;

import defaults from 'defaults';
import share    from 'share';

import elClass    from 'elClass';
import allElClass from 'allElClass';

share.set('animatedElements',      0);
share.set('animatedElementsStack', []);
share.set('animatedCallback',      ()=>{});

var _allEl = (e)=>{

	if(!e) {
		throw new Error("elRender:empty arguments");
	};

	if(typeof e == "string") {
		
		if(e[0] == "#") {
			var _element = document.getElementById(e.slice(1, Infinity));
			return new elClass(_element);
		} else if(e[0] == ".") {
			var _elements = document.getElementsByClassName(e.slice(1, Infinity));
			return new allElClass(_elements);
		} else if(e[0] == "<") {
			var _temp = document.createElement('temp');
			_temp.innerHTML = e;
			var _element = _temp.children[0];
			return new elClass(_element);
		}
	} else if(e.el || e.elements) {
		return e;
	} else {
		return new elClass(e);
	};
};

_allEl.stopAnimations = (callback)=>{

	_allEl(".animated")
		.css({transition: '0s'})
		.removeClass("animated");

	// console.log('end all animations.', _animatedElementsStack);

	/*var _animatedElementsStack = share.get('animatedElementsStack');

	for(var i in _animatedElementsStack) {
		_animatedElementsStack[i].el.style.transition = null;
	};
	share.set('animatedElementsStack', []);

	share.set('animatedElements', 0);
	var _animatedCallback = share.get('animatedCallback');
	_animatedCallback.call(this);
	share.set('animatedCallback', ()=>{});*/
};

export default _allEl;