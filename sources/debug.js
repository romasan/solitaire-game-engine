'use strict';

import event         from 'event';
import common        from 'common';

import deckGenerator from 'deckGenerator';
import elRender      from 'elRender';

import renderTest from 'renderTest';

let _history = [],
	_redo    = [];

let debugHistoryMgr = new function() {
	
	this.record = function(data) {
		_redo = [];
		_history.push(data);
	}
	
	this.undo = function() {
		
		var _step = _history.pop();
		if(_step) {
			_redo.push(_step);
		};
		return _step;
	}
	
	this.redo = function() {
		
		var _step = _redo.pop();
		if(_step) {
			_history.push(_step);
		};
		return _step;
	}
};

// add buttons

let _debugHistory = false;
let debugHistory = (a)=>{
	
	if(_debugHistory) {
		return;
	}
	_debugHistory = true;
	
	event.listen('makeStep', debugHistoryMgr.record);
	
	if(a && a.drawButtons) elRender(document.body)
		.append(
				elRender("<div>")
					.append(
						$("<span>")
							.addClass('awesome')
							.text('UNDO')
							.click(function() {
								var _data = debugHistoryMgr.undo();
								if(_data) {
									SolitaireEngine.event.dispatch('undo', _data);
								}
							}))
					.append(
						$("<span>")
							.addClass('awesome')
							.text('REDO')
							.click(function() {
								var _data = debugHistoryMgr.redo();
								if(_data) {
									SolitaireEngine.event.dispatch('redo', _data);
								}
							}))
					.css({
						position : 'fixed', 
						top      : '1px', 
						left     : '1px'
					})
	);

};

let tests = ()=>{
	renderTest();
}

export default {
	deckGenerator,
	debugHistory,
	debugHistoryMgr,
	validateCardName : common.validateCardName,
	elRender,
	tests
};