'use strict';

import elClass  from 'elClass';

export default class allElClass extends elClass {
	
	constructor(query) {

		console.log('constructor', query, typeof query == "undefined");

		super();

		this.elements = [];

		if(typeof query == "string") {
			try {
				this.elements = document.querySelectorAll(e);
			} catch(e) {
				var _temp = document.createElement('html');
				_temp.innerHTML = query;
				query = _temp.children[0];
			}
		};

		if(
			query
		 && typeof query.length != "undefined"
		 && query.length != 0
		// && typeof query[i] TODO is dom element
		) {
			this.elements = query;
		}
	}

	attr() {
		for(var i in this.elements) {
			super.attr.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	// hasClass() {
	// 	throw new Error("");
	// }

	toggleClass() {
		for(var i in this.elements) {
			super.toggleClass.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	addClass() {
		for(var i in this.elements) {
			console.log('>>>', this.elements);
			super.addClass.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	removeClass() {
		for(var i in this.elements) {
			super.removeClass.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	css() {
		for(var i in this.elements) {
			super.css.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	hide() {
		for(var i in this.elements) {
			super.hide.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	show() {
		for(var i in this.elements) {
			super.show.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	append() {
		for(var i in this.elements) {
			super.append.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	html() {
		for(var i in this.elements) {
			super.html.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	animate() {
		for(var i in this.elements) {
			super.animate.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	// done() {
	// 	this.elements.length ? this.elements[0].done.apply(elements[0], arguments) : null;
	// 	return this;
	// }

	remove() {
		for(var i in this.elements) {
			super.remove.apply({el : this.elements[i]}, arguments);
		}
		return this;
	}

	// elements[0] {
	// 	return this.elements.length ? this.elements[0].el : null;
	// }
}