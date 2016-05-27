'use strict';

import share    from 'share';
import defaults from 'defaults';

export default class elClass {
	
	constructor(query) {

		// this.el = null;

		// if(typeof query == "string") {
		// 	try {
		// 		this.el = document.querySelector(e);
		// 	} catch(e) {}
		// };

		// if(
		// 	query
		//  && typeof query.length != "undefined"
		//  && query.length != 0
		// // && typeof query[0] TODO is dom element
		// ) {
		// 	this.el = query[0];
		// }

	}
	
	attr(attributes) {
		if(!this.el) { return this; };
	
		for(var attrName in attributes) { 
			this.el[attrName] = attributes[attrName];
		}
		return this;
	}

	// hasClass(className) {

	// 	if(!this.el) { return this; };
	
	// 	var _classes = this.el.className.split(' ');
	// 	return _classes.indexOf(className) >= 0;
	// }

	toggleClass(className) {

		if(!this.el) { return this; };
	
		if(this.hasClass(className)) {
			this.removeClass(className);
		} else {
			this.addClass(className);
		}
	}

	addClass(className) {

		if(!this.el) { return this; };
	
		var _classes = this.el.className.split(' ');
		if(!this.hasClass(className)) {
			_classes.push(className);
			this.el.className = _classes.join(' ');
		}
		return this;
	}

	removeClass(className) {

		if(!this.el) { return this; };
	
		var _classes = this.el.className.split(' ');
		
		if(this.hasClass(className)) {

			var _clone = [];
			for(var i in _classes) {
				if(_classes[i] != className) {
					_clone.push(_classes[i]);
				}
			}
			_classes = _clone;
			this.el.className = _classes.join(' ');
		}
		return this;
	}

	css(a) {

		if(!this.el) { return this; };
		
		for(var attrName in a) {
			try {
				this.el.style[attrName] = a[attrName];
			} catch(e) {}
		}
		return this;
	}
	
	hide() {

		if(!this.el) { return this; };
			
		return this.css({'display' : 'none'});
	}
	
	show() {
		
		if(!this.el) { return this; };
			
		return this.css({'display' : 'block'});
	}

	append(el) {

		if(!this.el) { return this; };
	
		if(el.el) {
			el = el.el;
		};
		this.el.appendChild(el);
		return this;
	}

	html(el) {

		if(!this.el) { return this; };
	
		if(typeof el == "undefined") {
			return this.el.innerHTML;
		};
		
		if(el.el) {
			el = el.el;
		};
		
		this.el.innerHTML = el;
		
		return this;
	}

	animate(params, animationTime, callback) {

		if(!this.el) { return this; };

		if(typeof animationTime == "undefined") {
			animationTime = defaults.animationTime;
		}

		if(
			typeof callback      == "undefined" 
		 && typeof animationTime == "function"
		) {
			callback = animationTime;
			animationTime = defaults.animationTime;
		}

		this.done(callback);

		var _animatedElements = share.get('animatedElements');
		var _animatedElementsStack = share.get('animatedElementsStack');
		_animatedElements += 1;
		_animatedElementsStack.push(this);
		share.set('animatedElements', _animatedElements);
		share.set('animatedElementsStack', _animatedElementsStack);

		var _animateThread = function(params) {
			this.el.style.transition = '0.5s';
			this.css(params);
			this.el.addEventListener("transitionend", function() {
				if(this.el.style.transition) {
					
					var _animatedElements = share.get('animatedElements');
					_animatedElements -= 1;
					share.set('animatedElements', _animatedElements);
					
					var _animatedCallback = share.get('animatedCallback');
					var _cloneCallback = _animatedCallback;
					
					if(share.get('animatedElements') == 0) {
						_animatedCallback.call(this);
					};
					
					if(
						share.get('animatedElements') == 0
					 || _cloneCallback == share.get('animatedCallback')
					) {
						_animatedCallback = function() {};
					};
				};
				this.el.style.transition = null;
			}.bind(this), false);
		}
		
		// Thread
		setTimeout(_animateThread.bind(this, params), 0);

		return this;
	}

	// done(callback) {

	// 	if(!this.el) { return this; };
	
	// 	if(typeof callback == "function") {
	// 		share.set('animatedCallback', callback);
	// 	};
	// 	return this;
	// }

	remove() {
		
		if(!this.el) { return this; };
	
		this.el.remove();
	}

	// elements[0] {
		
	// 	if(!this.el) { return this; };
	
	// 	return this.el;
	// }

};