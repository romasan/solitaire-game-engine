'use strict';

import event         from 'event';
import common        from 'common';

import deckGenerator from 'deckGenerator';
import elRender      from 'elRender';

var _history = [],
	_redo    = [];

var debugHistoryMgr = new function() {
	
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

var _debugHistory = false;
var debugHistory = function(a) {
	
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

export default {
	deckGenerator    : deckGenerator,
	debugHistory     : debugHistory,
	debugHistoryMgr  : debugHistoryMgr,
	validateCardName : common.validateCardName,
	elRender         : elRender
};