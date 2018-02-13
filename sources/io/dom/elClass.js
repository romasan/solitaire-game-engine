'use strict';

import common, {event, share, defaults} from '../../common';

export default class elClass {

	constructor(data) {

		this.el = data;

		if (!data) {
			this.el = null;
		}

		this._animationCallbacks = [];
		this._animationIndex = 0;
	}

	/**
	 * Add attributes
	 * @param {*} attributes 
	 */
	attr(attributes) {

		try {

			for (let attrName in attributes) {
				this.el.setAttribute(attrName, attributes[attrName]);
			}

			return this;
		} catch (e) {}
	}

	/**
	 * Add attribute
	 * @param {string} name 
	 * @param {string} value 
	 */
	setAttribute(name, value) {
		try {
			if (
				typeof name  == "string" &&
				typeof value == "string"
			) {
				this.el.setAttribute(name, value);
			}
		} catch (e) {}
	}

	/**
	 * Checking the existence of a class for an element
	 * @param {string} className
	 */
	hasClass(className) {

		try {

			let _classes = this.el.className.split(' ');

			return _classes.indexOf(className) >= 0;
		} catch (e) {}
	}

	/**
	 * Toggle class
	 * @param {string} className 
	 */
	toggleClass(className) {

		try {

			if (this.hasClass(className)) {
				this.removeClass(className);
			} else {
				this.addClass(className);
			}
		} catch (e) {}
	}

	/**
	 * Add class name
	 * @param {string} className 
	 */
	addClass(className) {

		try {

			let _classes = this.el.className.split(' ');

			if (!this.hasClass(className)) {
				_classes.push(className);
				this.el.className = _classes.join(' ');
			}

			return this;
		} catch (e) {}
	}

	/**
	 * Remove class
	 * @param {string} className 
	 */
	removeClass(className) {

		if (!this.el || !this.el.className) {
			return this;
		}

		try {

			let _classes = this.el.className.split(' ');

			// if (this.hasClass(className)) {
			let _clone = [];

			for (let i in _classes) {
				if (_classes[i] != className) {
					_clone.push(_classes[i]);
				}
			}

			_classes = _clone;

			this.el.className = _classes.join(' ');
			// }

			return this;
		} catch (e) {}
	}

	/**
	 * Add css styles
	 * @param {*} a 
	 */
	css(styles) {

		if (!this.el) {
			return this;
		}

		try {

			for (let attrName in styles) {
				this.el.style[attrName] = styles[attrName];
			}

			return this;
		} catch (e) {}
	}

	/**
	 * Hide element
	 */
	hide() {

		try {

			return this.css({
				"display" : 'none'
			});
		} catch (e) {}
	}

	/**
	 * Show element
	 */
	show() {

		try {
			return this.css({
				"display" : 'block'
			});
		} catch (e) {}
	}

	/**
	 * Append element
	 * @param {elClass|HTMLElement} el 
	 */
	append(el) {

		try {

			if (el.el) {
				el = el.el;
			}

			this.el.appendChild(el);
			
			return this;

		} catch (e) {}
	}

	/**
	 * Set HTML
	 * @param {elClass|HTMLElement} el 
	 */
	html(el) {

		try {

			if (typeof el == 'undefined') {
				return this.el.innerHTML;
			}

			if (el.el) {
				el = el.el;
			}

			this.el.innerHTML = el;

			return this;

		} catch (e) {}
	}

	/**
	 * Animate element
	 * @param {*} params 
	 * @param {?number} animationTime 
	 * @param {?function} callback 
	 * @param {?string} animationName 
	 */
	animate(params, animationTime, callback, animationName) {

		let _animation = share.get('animation');

		// console.log('#animate', _animation);
		
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
			if (_px.length == 2) {
				return (_px[0] | 0) + 'px'
			}

			return data;
		};
		
		// let reType = data => { // )===

		// 	const px = (data + '').split('px');

		// 	if (px.length == 2) {
		// 		return (px[0] | 0) + 'px';
		// 	}

		// 	return data;
		// };

		let noPX = data => {

			let _int = parseInt(data);

			if (_int.toString() != "NaN") {
				return _int | 0;
			}

			return false;
		}

		/*
		 * Animation On
		 */

		if (_animation) {

			try {

				// TODO
				let top  = params.top  ? Math.abs(noPX(params.top ) - noPX(this.el.style.top )) : 0;
				let left = params.left ? Math.abs(noPX(params.left) - noPX(this.el.style.left)) : 0;

				let distance = Math.sqrt((e => e * e)(left) + (e => e * e)(top)) | 0;

				if (distance > 100) {
					animationTime = animationTime + (animationTime * (distance / 100)) / 5;
				}

				this.css({
					"transition" : (animationTime / 1000) + 's'
				});

				for (let attrName in params) {

					if (
						reType(this.el.style[attrName]) != reType(params[attrName]) && // old style not new style 
						(
							(el, attr) => ['left', 'top'].indexOf(attr) >= 0 // параметр left или top
								? (
									parseInt(this.el['offset' + attr[0].toUpperCase() + attr.slice(1)]) != parseInt(params[attr]) // offset not old style
								)
								: true
						)(this.el.style, attrName)
					) {
						counter += 1;
					}

					this.el.style[attrName] = params[attrName]; // set new style
				}

				this.addClass('animated');

				// let animationKey = Math.random();

				let transitionEndCallback = e => {

					counter -= 1;

					// event.dispatch('animationEnd', this);

					if (counter == 0) {

						this.removeClass('animated');

						this.css({
							"transition" : null
						});

						if (typeof this._animationCallbacks[animationName] == 'function') {
							this._animationCallbacks[animationName]();
							this._animationCallbacks[animationName] = null;
						}

						event.dispatch('allAnimationsEnd', animationName);
					}

				};

				if (counter > 0) {
					this.el.addEventListener('transitionend', transitionEndCallback, false);
				} else {

					counter = 1;

					transitionEndCallback();
				}

			} catch (e) {}
		
		/*
		 * Animation Off
		 */

		} else {

			try {
				
				for (let attrName in params) {

					if (
						reType(this.el.style[attrName]) != reType(params[attrName])
					) {
						counter += 1;
					}
					this.el.style[attrName] = params[attrName];
				}

				if (typeof this._animationCallbacks[animationName] == 'function') {
					this._animationCallbacks[animationName]();
					this._animationCallbacks[animationName] = null;
				}

				event.dispatch('allAnimationsEnd', animationName);
			} catch (e) {}
		}
	}

	stop() {
		this._animationCallbacks = [];
	}

	/**
	 * Delete element
	 */
	remove() {
		try {
			// this.el.remove();
			this.el.parentNode.removeChild(this.el);
		} catch (e) {}
	}

	/**
	 * Get parent element
	 */
	parent() {
		return new elClass(this.el.parentNode);
	}

	/**
	 * Add HTML after element
	 * @param {HTMLElement} html 
	 */
	after(html) {

		try {
			this.el.parentNode.insertBefore(html, this.el.nextElementSibling);
		} catch (e) {}

		return this;
	}

	/**
	 * Add HTML before element
	 * @param {HTMLElement} html 
	 */
	before(html) {

		try {
			this.el.parentNode.insertBefore(html, this.el);
		} catch (e) {}

		return this;
	}

	/**
	 * Add event listener
	 * @param {string} eventName 
	 * @param {function} callback 
	 */
	listen(eventName, callback) {
		this.el.addEventListener(eventName, callback);
	}

	/**
	 * Dispatch DOM element event
	 * @param {*} eventName 
	 */
	trigger(eventName) {
		if (typeof this.el[eventName] == 'function') {
			this.el[eventName]();
		}
	}

	/**
	 * Add click event listener
	 * @param {function} callback 
	 */
	click(callback) {
		this.listen('click', callback);
	}
}