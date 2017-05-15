'use strict';

import event    from 'event'   ;
import share    from 'share'   ;
import defaults from 'defaults';
import common   from 'common'  ;

/*
 * attr
 * hasClass
 * toggleClass
 * addClass
 * removeClass
 * css
 * hide
 * show
 * append
 * html
 * animate
 * stop
 * remove
 * parent
 * after
 * before
 * listen
 * trigger
 * click
 */

export default class elClass {

	constructor(data) {

		this.el = data;

		if(!data) {
			this.el = null;
		}

		this._animationCallbacks = [];
		this._animationIndex = 0;
	}

	attr(attributes) {
		try {

			for(let attrName in attributes) {
				this.el[attrName] = attributes[attrName];
			}

			return this;
		} catch(e) {}
	}

	hasClass(className) {
		try {

			let _classes = this.el.className.split(' ');

			return _classes.indexOf(className) >= 0;
		} catch(e) {}
	}

	toggleClass(className) {
		try {

			if(this.hasClass(className)) {
				this.removeClass(className);
			} else {
				this.addClass(className);
			}
		} catch(e) {}
	}

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

	hide() {
		try {
			return this.css({
				"display" : 'none'
			});
		} catch(e) {}
	}

	show() {
		try {
			return this.css({
				"display" : 'block'
			});
		} catch(e) {}
	}

	append(el) {
		try {

			if(el.el) {
				el = el.el;
			}

			this.el.appendChild(el);
			
			return this;

		} catch(e) {}
	}

	html(el) {
		try {

			if(typeof el == 'undefined') {
				return this.el.innerHTML;
			}

			if(el.el) {
				el = el.el;
			}

			this.el.innerHTML = el;

			return this;

		} catch(e) {}
	}

	animate(params, animationTime, callback, animationName) {

		let _animation = share.get('animation');
		
		typeof animationTime == 'undefined' && (                          animationTime = share.get('animationTime'));
		typeof animationTime == 'function'  && (callback = animationTime, animationTime = share.get('animationTime'));
		typeof callback      == 'string'    && (                          animationName = callback, callback = null );

		animationName = animationName ? animationName : 'animation_' + this._animationIndex;
		
		this._animationCallbacks[animationName] = callback;
		this._animationIndex += 1;

		let counter = 0;

		let reType = data => { // )===

			let _e = data + '';

			let _px = _e.split('px');
			if(_px.length == 2) {
				return (_px[0] | 0) + 'px'
			}

			return data;
		};

		let noPX = data => {

			let _int = parseInt(data);

			if(_int.toString() != "NaN") {
				return _int | 0;
			}

			return false;
		}

		// console.log('Animation, mode:', _animation ? 'ON' : 'OFF', this.el.id);

		/*
		 * Animation On
		 */

		if(_animation) {

			try {
			setTimeout(e => {

				// TODO
				let top  = params.top  ? Math.abs(noPX(params.top ) - noPX(this.el.style.top )) : 0;
				let left = params.left ? Math.abs(noPX(params.left) - noPX(this.el.style.left)) : 0;

				let distance = Math.sqrt((e => e * e)(left) + (e => e * e)(top)) | 0;

				if(distance > 100) {
					animationTime = animationTime + (animationTime * (distance / 100)) / 5;
					// console.log('New animationTime: from', defaults.animationTime, 'to', animationTime, 'for', distance + 'px');
				}

				this.css({
					"transition" : (animationTime / 1000) + 's'
				});

				for(let attrName in params) {

					if(
						reType(this.el.style[attrName]) != reType(params[attrName])
					) {
						counter += 1;
					}
					this.el.style[attrName] = params[attrName];
				}

				// console.log('### animation changes', this.el.id, counter);

				this.addClass('animated');

				this.el.addEventListener('transitionend', e => {

					// console.log('### transitionend:', this.el.id, counter);

					counter -= 1;

					// event.dispatch('animationEnd', this);

					if(!counter) {

						this.removeClass('animated');

						this.css({
							"transition" : null
						});

						if(typeof this._animationCallbacks[animationName] == 'function') {
							this._animationCallbacks[animationName]();
							this._animationCallbacks[animationName] = null;
						}

						event.dispatch('allAnimationsEnd', animationName);
					}

				}, false);
			}, 0);
			} catch(e) {}
		
		/*
		 * Animation Off
		 */

		} else {
			try {
				
				for(let attrName in params) {

					if(
						reType(this.el.style[attrName]) != reType(params[attrName])
					) {
						counter += 1;
					}
					this.el.style[attrName] = params[attrName];
				}

				if(typeof this._animationCallbacks[animationName] == 'function') {
					this._animationCallbacks[animationName]();
					this._animationCallbacks[animationName] = null;
				}

				event.dispatch('allAnimationsEnd', animationName);
			} catch(e) {}
		}
	}

	stop() {
		this._animationCallbacks = [];
	}

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
		if(typeof this.el[eventName] == 'function') {
			this.el[eventName]();
		}
	}

	click(callback) {
		this.listen('click', callback);
	}
}