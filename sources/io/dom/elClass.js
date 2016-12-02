'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';

export default class elClass {

	constructor(data) {

		this.el = data;
		
		if(!data) {
			// if(window._debug) throw new Error("test");
			this.el = null;
		}
	}
// --
	attr(attributes) {
		try {
			for(let attrName in attributes) {
				this.el[attrName] = attributes[attrName];
			}

			return this;
		} catch(e) {}
	}
// --	
	hasClass(className) {
		try {

			let _classes = this.el.className.split(' ');
			return _classes.includes(className);
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

			let _classes = this.el.className.split(' ');
			if(!this.hasClass(className)) {
				_classes.push(className);
				this.el.className = _classes.join(' ');
			}

			return this;
		} catch(e) {}
	}
// --	
	removeClass(className) {

		if(!this.el || !this.el.className) {
			return this;
		}

		try {

			let _classes = this.el.className.split(' ');

			// if(this.hasClass(className)) {
			let _clone = [];
			
			for(let i in _classes) {
				if(_classes[i] != className) {
					_clone.push(_classes[i]);
				}
			}
			
			_classes = _clone;
			
			this.el.className = _classes.join(' ');
			// }

			return this;
		} catch(e) {}
	}
// --	
	css(a) {

		if(!this.el) {
			return this;
		}

		try {

			for(let attrName in a) {
				this.el.style[attrName] = a[attrName];
			}

			return this;
		} catch(e) {}
	}
// --	
	hide() {
		try {
			return this.css({
				'display' : 'none'
			});
		} catch(e) {}
	}
// --	
	show() {
		try {
			return this.css({
				'display' : 'block'
			});
		} catch(e) {}
	}
// --	
	append(el) {
		try {

			if(el.el) {
				el = el.el;
			}

			this.el.appendChild(el);
			
			return this;

		} catch(e) {}
	}
// --	
	html(el) {
		try {
	
			if(typeof el == "undefined") {
				return this.el.innerHTML;
			}

			if(el.el) {
				el = el.el;
			}

			this.el.innerHTML = el;

			return this;

		} catch(e) {}
	}
// --
	animate(params, animationTime, callback, animationName) {

		try {

			let _animation = share.get('animation');

			typeof animationTime == "undefined" && (animationTime = share.get('animationTime'));
			typeof animationTime == "function"  && (callback = animationTime, animationTime = share.get('animationTime'));
			typeof callback      == "string"    && (animationName = callback, callback = null);

			// Thread
			setTimeout(e => {

				if(_animation) {
					this.css({
						'transition': (animationTime / 1000) + 's'
					});
				}

				let counter = 0;

				let reType = (data) => {// crutch

					let _e = data + '';

					let _px = _e.split('px')
					if(_px.length == 2) {
						return (_px[0] | 0) + 'px'
					}

					return data;
				};

				for(let attrName in params) {

					if(
						reType(this.el.style[attrName]) != reType(params[attrName])
					) {
						counter += 1;
					}

					this.el.style[attrName] = params[attrName];
				}

				if(_animation) {

					this.addClass("animated");

					this.el.addEventListener("transitionend", ()=>{

						counter -= 1;

						// event.dispatch('animationEnd', this);

						if(!counter) {

							this.removeClass("animated");
							this.css({transition: null});

							if(typeof callback == "function") {
								callback();
							}

							event.dispatch('allAnimationsEnd', animationName);
						}

					}, false);
				} else {

					// event.dispatch('animationEnd', this);

					if(typeof callback == "function") {
						callback();
					}

					event.dispatch('allAnimationsEnd', animationName);
				}
			}, 0);
		} catch(e) {}
	}
// --	
	remove() {
		try {
			// this.el.remove();
			this.el.parentNode.removeChild(this.el);
		} catch(e) {}
	}

	parent() {
		return new elClass(this.el.parentNode);
	}

	after(html) {

		try {
			this.el.parentNode.insertBefore(html, this.el.nextElementSibling);
		} catch(e) {}

		return this;
	}

	before(html) {

		try {
			this.el.parentNode.insertBefore(html, this.el);
		} catch(e) {}

		return this;
	}

	listen(eventName, callback) {
		this.el.addEventListener(eventName, callback);
	}

	trigger(eventName) {
		if(typeof this.el[eventName] == "function") {
			this.el[eventName]();
		}
	}

	click(callback) {
		this.listen('click', callback);
	}
}