'use strict';

// var events = {};

class Event {
// export default new function() {
	
	constructor() {
		this._events = {};
		this._tag = 'global';
	}
	// this.on = 
	
	// this._events = {};

	// this.listen = function(name, callback) {
	listen(eventName, callback) {

		console.log('listen:', eventName, 'tag:', this._tag);
		
		if(
			typeof eventName != 'string'       ||
			typeof callback != 'function'
		) {
			return;
		}

		if(this._events[eventName]) {
			this._events[eventName].push({
				tag: this._tag,
				callback
			});
		} else {
			this._events[eventName] = [{
				tag: this._tag,
				callback
			}];
		}
	}

	// this.do =
	// this.dispatch = function(name, data) {
	dispatch(eventName, data) {

		// if(
		// 	this._tag == 'new_game'                 &&
		// 	eventName.search('share') < 0
		// 	// eventName != 'shareGet:startCursor'     &&
		// 	// eventName != 'shareGet:dragDeck'        &&
		// 	// eventName != 'shareGet:curLockState'    &&
		// 	// eventName != 'shareGet:elements'        &&
		// 	// eventName != 'shareGet:stepType'        &&
		// 	// eventName != 'checkTips'                &&
		// 	// eventName != 'hideTips'                 &&
		// 	// eventName != 'redrawDeckFlip'           &&
		// 	// eventName != 'shareGet:animation'       &&
		// 	// eventName != 'shareSet:curLockState'    &&
		// 	// eventName != 'shareChange:curLockState' &&
		// 	// eventName != 'redrawDeck'               &&
		// 	// eventName != 'shareGet:noRedraw'        &&
		// 	// eventName != 'showTip'                  &&
		// 	// eventName != 'moveDragDeckDone'         &&
		// 	// eventName != 'allAnimationsEnd'         &&
		// 	// eventName != 'makeStep'                 &&
		// 	// eventName != 'moveDragDeck'             &&
		// 	// eventName != 'addStep'                  &&
		// 	// eventName != 'saveSteps'                &&
		// 	// eventName != 'shareChange:animation'    &&
		// 	// eventName != 'shareSet:animation'       &&
		// 	// eventName != 'shareChange:stepType'     &&
		// 	// eventName != 'shareSet:stepType'
		// ) {
		// 	console.log('dispatch:', eventName);
		// }

		if(this._events[eventName]) {
			for(let i in this._events[eventName]) {
				if(this._events[eventName][i]) {
					this._events[eventName][i].callback(data);
				}
			}
		}
	}

	// this.clear = function() {
	clear() {
		this._events = {};
	}

	setTag(tag) {
		this._tag = tag;
	}

	clearByTag(tag) {
		for(let eventName in this._events) {
			for(let i in this._events[eventName]) {
				if(
					this._events[eventName][i]            &&
					this._events[eventName][i].tag == tag
				) {
					this._events[eventName][i] = null;
				}
			}
		}
	}

	log() {}
	
	// this.log = function() {
	// 	var _index = [];
	// 	for(let index in this._events) {
	// 		_index.push(index);
	// 	}
	// 	console.log(_index);
	// }

	// this.one function(name, data) {};

};

// class EventManager extends Event {

// 	constructor() {
		
// 		super();

// 		this.global = new Event();

// 		// this.global.listen = (name, data) => {
// 		// 	this.listen(name, data)
// 		// }
// 	}

// 	dispatch(name, data) {
		
// 		super.dispatch(name, data);

// 		this.global.dispatch(name, data);
// 	}

// }

// let _eventManager = new EventManager();

// export default _eventManager;

// let _event = new Event();
// _event.listen = console.log;
// export default _event;
export default new Event();
