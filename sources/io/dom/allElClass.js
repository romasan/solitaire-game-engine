'use strict';

import defaults from 'defaults';

import elClass  from 'elClass';

/*
 * attr
 * toggleClass
 * addClass
 * removeClass
 * css
 * hide
 * show
 * animate
 * stop
 * remove
*/

export default class allElClass {
	
	constructor(elements) {
		
		this.elements = [];

		for(let i in elements) {
			this.elements.push(new elClass(elements[i]));
		}
	}

	attr(attributes) {

		for(let i in this.elements) {
			this.elements[i].attr(attributes)
		}

		return this;
	}

	toggleClass(className) {

		for(let i in this.elements) {
			this.elements[i].toggleClass(className);
		}

		return this;
	}

	addClass(className) {

		for(let i in this.elements) {
			this.elements[i].addClass(className);
		}

		return this;
	}

	removeClass(className) {

		for(let i in this.elements) {
			this.elements[i].removeClass(className);
		}

		return this;
	}

	css(a) {

		for(let i in this.elements) {
			this.elements[i].css(a);
		}

		return this;
	}

	hide() {

		for(let i in this.elements) {
			this.elements[i].hide();
		}

		return this;
	}

	show() {

		for(let i in this.elements) {
			this.elements[i].show();
		}

		return this;
	}

	animate(params, animationTime, callback, animationName) {
		
		typeof animationTime == "undefined" && (animationTime = share.get('animationTime'));
		typeof animationTime == "function"  && (callback = animationTime, animationTime = share.get('animationTime'));
		typeof callback      == "string"    && (animationName = callback, callback = null);

		let counter = 0;
		
		for(let i in this.elements) {
			counter += 1;
			this.elements[i].animate(params, animationTime, ()=>{
				counter -= 1;
				if(!counter) callback();
			});
		}

		return this;
	}

	stop() {

		for(let i in this.elements) {
			this.elements[i].stop();
		}

		return this;
	}

	remove() {

		for(let i in this.elements) {
			// this.elements[i].remove();
			this.elements[i].parentNode.removeChild(this.elements[i]);
		}

		return this;
	}
}