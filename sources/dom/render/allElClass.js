'use strict';

import defaults from 'defaults';

import elClass  from 'elClass';

export default class allElClass {
	
	constructor(elements) {
		
		this.elements = [];

		for(var i in elements) {
			this.elements.push(new elClass(elements[i]));
		}
	}
// --
	attr(attributes) {
		for(var i in this.elements) {
			this.elements[i].attr(attributes)
		}
		return this;
	}
// --
	toggleClass(className) {
		for(var i in this.elements) {
			this.elements[i].toggleClass(className);
		}
		return this;
	}
// --
	addClass(className) {
		for(var i in this.elements) {
			this.elements[i].addClass(className);
		}
		return this;
	}
// --
	removeClass(className) {
		for(var i in this.elements) {
			this.elements[i].removeClass(className);
		}
		return this;
	}
// --
	css(a) {
		for(var i in this.elements) {
			this.elements[i].css(a);
		}
		return this;
	}
// --
	hide() {
		for(var i in this.elements) {
			this.elements[i].hide();
		}
		return this;
	}
// --
	show() {
		for(var i in this.elements) {
			this.elements[i].show();
		}
		return this;
	}
// --
	animate(params, animationTime, callback, animationName) {
		
		typeof animationTime == "undefined" && (animationTime = defaults.animationTime);
		typeof animationTime == "function"  && (callback = animationTime, animationTime = defaults.animationTime);
		typeof callback      == "string"    && (animationName = callback, callback = null);

		let counter = 0;
		
		for(var i in this.elements) {
			counter += 1;
			this.elements[i].animate(params, animationTime, ()=>{
				counter -= 1;
				if(!counter) callback();
			});
		}
		return this;
	}
// --
	remove() {
		for(var i in this.elements) {
			this.elements[i].remove();
		}
		return this;
	}
}