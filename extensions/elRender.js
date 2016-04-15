'use strict';

var _elConstructor = function(e) {
	this.el = e ? e : null;
};

_elConstructor.prototype.attr = function(attributes) {

	if(!this.el) return this;
	
	for(var attrName in attributes) { 
		this.el[attrName] = attributes[attrName];
	}
	return this;
};

_elConstructor.prototype.hasClass = function(className) {

	if(!this.el) return this;
	
	var _classes = this.el.className.split(' ');
	return _classes.indexOf(className) >= 0;
};

_elConstructor.prototype.toggleClass = function(className) {

	if(!this.el) return this;
	
	if(this.hasClass(className)) {
		this.removeClass(className);
	} else {
		this.addClass(className);
	}

};

_elConstructor.prototype.addClass = function(className) {

	if(!this.el) return this;
	
	var _classes = this.el.className.split(' ');
	if(!this.hasClass(className)) {
		_classes.push(className);
		this.el.className = _classes.join(' ');
	}
	return this;
};

_elConstructor.prototype.removeClass = function(className) {

	if(!this.el) return this;
	
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
};

_elConstructor.prototype.css = function(a) {

	if(!this.el) return this;
	
	for(var attrName in a) {
		try {
			this.el.style[attrName] = a[attrName];
		} catch(e) {
			// S.log('>>>>>', this.el, e);
		}
	}
	return this;
};

_elConstructor.prototype.hide = function(a) {

	if(!this.el) return this;
	
	return this.css({'display' : 'none'});
};

_elConstructor.prototype.show = function(a) {

	if(!this.el) return this;
	
	return this.css({'display' : 'block'});
};

_elConstructor.prototype.append = function(el) {

	if(!this.el) return this;
	
	if(el.el) {
		el = el.el;
	};
	this.el.appendChild(el);
	return this;
};

_elConstructor.prototype.html = function(el) {

	if(!this.el) return this;
	
	if(typeof el == "undefined") {
		return this.el.innerHTML;
	};
	
	if(el.el) {
		el = el.el;
	};
	
	this.el.innerHTML = el;
	
	return this;
};

var _animatedElements = 0,
	_animatedCallback = null;

_elConstructor.prototype.animate = function(params, animationTime, callback) {

	if(!this.el) return this;


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

		_animatedElements += 1;
		
		this.css({
			'transition'          : (animationTime / 1e3) + 's',
			' -webkit-transition' : (animationTime / 1e3) + 's'
		});
		
		this.css(params);
		
		var _transitionend = function() {
			_animatedElements -= 1;
			if(_animatedElements <= 0) {
				_animatedElements = 0;
				if(typeof _animatedCallback == "function") {
					_animatedCallback.call(this);
					_animatedCallback = null;
				}
			}
		};

		_el.addEventListener("transitionend",       _transitionend, false);
		_el.addEventListener("webkitTransitionEnd", _transitionend, false);
		_el.addEventListener("mozTransitionEnd",    _transitionend, false);
		_el.addEventListener("msTransitionEnd",     _transitionend, false);
		_el.addEventListener("oTransitionEnd",      _transitionend, false);

		return this;
};

_elConstructor.prototype.done = function(callback) {// ALL

	if(!this.el) return this;
	
	if(typeof callback == "function") {
		_animatedCallback = callback;
	};
	return this;
};

_elConstructor.prototype.remove = function() {

	if(!this.el) return this;
	
	this.el.remove();

};

_elConstructor.prototype.getEl = function() {

	if(!this.el) return this;
	
	return this.el;
};

_elConstructor.prototype.debugTest = function() {
	return this;
}

// hasClass +
// html +
// remove 0
// getEl +

var _el = function(e) {

	if(!e) return new _elConstructor(e);
	// console.log('E>>L', e, e.length);

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

	return new _elConstructor(e);
};

var _allElConstructor = function(elements) {
	
	this.elements = [];
	
	for(var i in elements) {
		if(
			typeof elements[i] != "number"
		 && typeof elements[i] != "undefined"
		) {
			this.elements.push(_el(elements[i]));
		}
	}
};

for(var _protoName in _elConstructor.prototype) {
	_allElConstructor.prototype[_protoName] = 
		(function(_protoName) {

			return function() {

				
				for(var i in this.elements) {
					this.elements[i][_protoName].apply(this.elements[i], arguments);
				};
				return this;
			};
			
		}).call(this, _protoName);
};

var _allEl = function(e) {

	if(!e) return _el(e);

	if(typeof e == "string") {
		try {
			e = document.querySelectorAll(e);
		} catch(_e) {
			return _el(e);
		}
	}
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
	}

	return new _allElConstructor(e);
};

export default _allEl;