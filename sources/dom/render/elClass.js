'use strict';

import share    from 'share';
import defaults from 'defaults';

export default class elClass {
	
	constructor(e) {
	
		this.el = e;
		
		if(!e) {
			// if(window._debug) throw new Error("test");
			// console.warn("elClass: empty arrtibutes;");
			this.el = null;
		}
	}
// --
	attr(attributes) {
		try {
			for(var attrName in attributes) {
				this.el[attrName] = attributes[attrName];
			}
			return this;
		} catch(e) {}
	}
// --	
	hasClass(className) {
		try {
	
			var _classes = this.el.className.split(' ');
			return _classes.indexOf(className) >= 0;
		} catch(e) {}
	}
// --	
	toggleClass(className) {
		try {
	
			if(this.hasClass(className)) {
				this.removeClass(className);
			} else {
				this.addClass(className);
			}
		} catch(e) {}
	}
// --	
	addClass(className) {
		try {
	
			var _classes = this.el.className.split(' ');
			if(!this.hasClass(className)) {
				_classes.push(className);
				this.el.className = _classes.join(' ');
			}
			return this;
		} catch(e) {}
	}
// --	
	removeClass(className) {
		try {
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
		} catch(e) {}
	}
// --	
	css(a) {
		try {
	
			// console.log('CSS', this.el ? true : false, a);
	
			for(var attrName in a) {
				try {
					this.el.style[attrName] = a[attrName];
				} catch(e) {
					// S.log('>>>>>', this.el, e);
				}
			}
			return this;
		} catch(e) {}
	}
// --	
	hide() {
		try {
	
			return this.css({'display' : 'none'});
		} catch(e) {}
	}
// --	
	show() {
		try {
			
			return this.css({'display' : 'block'});
		} catch(e) {}
	}
// --	
	append(el) {
		try {
	
			if(el.el) {
				el = el.el;
			};
			this.el.appendChild(el);
			return this;
		} catch(e) {}
	}
// --	
	html(el) {
		try {
	
			if(typeof el == "undefined") {
				return this.el.innerHTML;
			};
			
			if(el.el) {
				el = el.el;
			};
			
			this.el.innerHTML = el;
			
			return this;
		} catch(e) {}
	}
// --
	animate(params, animationTime = defaults.animationTime, callback) {
		typeof animationTime == "function" && (callback = animationTime, animationTime = defaults.animationTime);
		setTimeout(()=>{

			this.css({transition: (animationTime / 1000) + 's'});
			let counter = 0;
			for(var attrName in params) {
				if(this.el.style[attrName] != params[attrName]) {
					counter += 1;
				}
				this.el.style[attrName] = params[attrName];
			}
			this.addClass("animated");
			
			this.el.addEventListener("transitionend", ()=>{
				counter -= 1;

				if(!counter) {
					this.removeClass("animated");
					this.css({transition: null});
					callback();
				}
			}, false);

		}, 0);
	}
	/*animate(params, animationTime, callback) {

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
	}*/

	/*done(callback) {

		if(typeof callback == "function") {
			share.set('animatedCallback', callback);
		};
		
		return this;
	}*/
// --	
	remove() {
		try {
			
			this.el.remove();
		} catch(e) {}
	}

	/*getEl() {
		
		return this.el;
	}*/

	parent() {
		return new elClass(this.el.parentNode);
	}
	
	after(html) {
		try {
			this.el.parentNode.insertBefore(html, this.el.nextElementSibling);
			/*if(html.el) html = html.el;

			var _parentElements = this.el.parentNode.children;
			var _newChildren = [];
			
			for(var i in _parentElements) {
				_newChildren.push(_parentElements[i]);
				if(_parentElements[i] == this.el) {
					_newChildren.push(html);
				}
			}
			
			this.el.parentNode.children = _newChildren;*/
		} catch(e) {}
		return this;
	}

	before(html) {
		try {
			this.el.parentNode.insertBefore(html, this.el);
			/*if(html.el) html = html.el;

			var _parentElements = this.el.parentNode.children;
			var _newChildren = [];
			
			for(var i in _parentElements) {
				if(_parentElements[i] == this.el) {
					_newChildren.push(html);
				}
				_newChildren.push(_parentElements[i]);
			}
			
			this.el.parentNode.children = _newChildren;*/
		} catch(e) {}
		return this;
	}

	event(eventName, callback) {
		this.el.addEventListener(eventName, callback);
	}

	click(callback) {
		this.event(callback);
	}
};