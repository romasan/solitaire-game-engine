'use strict';

import elClass  from 'elClass';
import _el      from 'el';

export default class allElClass {
	
	constructor(elements) {
		
		this.elements = [];

		for(var i in elements) {
			if(
				typeof elements[i] != "number"
			 && typeof elements[i] != "undefined"
			) {
				this.elements.push(_el(elements[i]));
			}
		}
	}

	attr() {
		for(var i in this.elements) {
			this.elements[i].attr.apply(this.elements[i], arguments);
		}
		return this;
	}

	hasClass() {
		return this.elements.length ? this.elements[0].hasClass() : null;
	}

	toggleClass() {
		for(var i in this.elements) {
			this.elements[i].toggleClass.apply(this.elements[i], arguments);
		}
		return this;
	}

	addClass() {
		for(var i in this.elements) {
			this.elements[i].addClass.apply(this.elements[i], arguments);
		}
		return this;
	}

	removeClass() {
		for(var i in this.elements) {
			this.elements[i].removeClass.apply(this.elements[i], arguments);
		}
		return this;
	}

	css() {
		for(var i in this.elements) {
			this.elements[i].css.apply(this.elements[i], arguments);
		}
		return this;
	}

	hide() {
		for(var i in this.elements) {
			this.elements[i].hide.apply(this.elements[i], arguments);
		}
		return this;
	}

	show() {
		for(var i in this.elements) {
			this.elements[i].show.apply(this.elements[i], arguments);
		}
		return this;
	}

	append() {
		for(var i in this.elements) {
			this.elements[i].append.apply(this.elements[i], arguments);
		}
		return this;
	}

	html() {
		for(var i in this.elements) {
			this.elements[i].html.apply(this.elements[i], arguments);
		}
		return this;
	}

	animate() {
		for(var i in this.elements) {
			this.elements[i].animate.apply(this.elements[i], arguments);
		}
		return this;
	}

	done() {
		this.elements.length ? this.elements[0].done.apply(elements[0], arguments) : null;
		return this;
	}

	remove() {
		for(var i in this.elements) {
			this.elements[i].remove.apply(this.elements[i], arguments);
		}
		return this;
	}

	getEl() {
		return this.elements.length ? this.elements[0].el : null;
	}
}