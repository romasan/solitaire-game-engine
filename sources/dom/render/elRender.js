'use strict';

import defaults from 'defaults';
import share    from 'share';

import elClass    from 'elClass';
import allElClass from 'allElClass';
import _el        from 'el';

share.set('animatedElements',      0);
share.set('animatedElementsStack', []);
share.set('animatedCallback',      ()=>{});

var _allEl = (e)=>{

	if(!e) { return _el(e); };

	if(typeof e == "string") {
		try {
			e = document.querySelectorAll(e);
		} catch(_e) {
			return _el(e);
		}
	};

	if(typeof e.length != "undefined") {
		if(e.length == 1) {
			return _el(e[0]);
		}
		if(e.length == 0) {
			return _el();
		}
	} else {
		var __el = _el(e);
		return __el;
	};

	return new allElClass(e);
};

_allEl.stopAnimations = (callback)=>{

	// console.log('end all animations.', _animatedElementsStack);

	var _animatedElementsStack = share.get('animatedElementsStack');

	for(var i in _animatedElementsStack) {
		_animatedElementsStack[i].el.style.transition = null;
	};
	share.set('animatedElementsStack', []);

	share.set('animatedElements', 0);
	var _animatedCallback = share.get('animatedCallback');
	_animatedCallback.call(this);
	share.set('animatedCallback', ()=>{});
};

export default _allEl;