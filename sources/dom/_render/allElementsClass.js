'use strict';

import elClass  from 'elClass';

export default class allElClass {// extends elClass {
	
	constructor(query) {

		// super();

		this.elements = [];

		console.log('all:constructor:', query);

		if(typeof query == "undefined") {
		
			// throw new Error("test");
			
			console.log('allElClass:SET#1');

		} else if(typeof query == "string") {
		
			console.log('allElClass:SET#2');
			if(query[0] == ".") {
	
				var _elements = [];
				var _elements = document.getElementsByClassName(query.split('.')[1]);
				for(var i in _elements) {
					this.elements.push(new elClass(_elements[i]));
				};
			} else if(query[0] == "#"){
				
				var _element = document.getElementById(query.split('#')[1]);
				var _id = query.split('#')[1];
				console.log(">>", _id, document.getElementById(_id), _element);
				this.elements.push(new elClass(_element));
			} else if(query[0] == "<") {
	
				var _temp = document.createElement('temp');
				_temp.innerHTML = query;
				this.elements.push(new elClass(_temp.children[0]));
			}
		} else if(
			query
		 && typeof query.length != "undefined"
		 && query.length != 0
		// && typeof query[i] TODO is dom element
		) {

			console.log('allElClass:SET#4');

			this.elements = query;
		} else {
			
			console.log('allElClass:SET#5');

			this.elements.push(new elClass(query));
		};

		console.log('>>>', this.elements);

		// return this;
	}

	attr() {
		this.elements.forEach((el)=>{
			el.attr.apply(el, arguments);
		});
		return this;
	}

	// hasClass() {
	// 	throw new Error("");
	// }

	toggleClass() {
		this.elements.forEach((el)=>{
			el.toggleClass.apply(el, arguments);
		});
		return this;
	}

	addClass() {
		this.elements.forEach((el)=>{
			el.addClass.apply(el, arguments);
		});
		return this;
	}

	removeClass() {
		this.elements.forEach((el)=>{
			el.removeClass.apply(el, arguments);
		});
		return this;
	}

	css() {
		this.elements.forEach((el)=>{
			console.log(el);
			el.css.apply(el, arguments);
		});
		return this;
	}

	hide() {
		this.elements.forEach((el)=>{
			el.hide.apply(el, arguments);
		});
		return this;
	}

	show() {
		this.elements.forEach((el)=>{
			el.show.apply(el, arguments);
		});
		return this;
	}

	append() {
		this.elements.forEach((el)=>{
			el.append.apply(el, arguments);
		});
		return this;
	}

	html() {
		this.elements.forEach((el)=>{
			el.html.apply(el, arguments);
		});
		return this;
	}

	animate() {
		this.elements.forEach((el)=>{
			el.animate.apply(el, arguments);
		});
		return this;
	}

	// done() {
	// 	this.elements.length ? this.elements[0].done.apply(elements[0], arguments) : null;
	// 	return this;
	// }

	remove() {
		this.elements.forEach((el)=>{
			el.remove.apply(el, arguments);
		});
		return this;
	}

	// elements[0] {
	// 	return this.elements.length ? this.elements[0].el : null;
	// }
}