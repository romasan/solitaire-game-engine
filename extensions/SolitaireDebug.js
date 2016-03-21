'use strict';

import event from 'event';

import deckGenerator from 'deckGenerator';

var debugHistory = new function() {
	
	var _history = [],
		_redo    = [];
	
	this.record = function(data) {

		_redo = [];
		_history.push(data);
	}
	
	this.undo = function() {
		
		var _step = _history.pop();
		if(_step) _redo.push(_step);
		return _step;
	}
	
	this.redo = function() {
		
		var _step = _redo.pop();
		if(_step) _history.push(_step);
		return _step;
	}
};

event.listen('makeStep', debugHistory.record);

// add buttons
document.addEventListener("DOMContentLoaded", function() {
	
	$(document.body).append(
		$("<div>")
			.append(
				$("<span>")
					.addClass('awesome')
					.text('UNDO')
					.click(function() {
						var _data = debugHistory.undo();
						if(_data) {
							SolitaireEngine.event.dispatch('undo', _data);
						}
					})
			).append(
				$("<span>")
					.addClass('awesome')
					.text('REDO')
					.click(function() {
						var _data = debugHistory.redo();
						if(_data) {
							SolitaireEngine.event.dispatch('redo', _data);
						}
					})
			).css({
				position : 'fixed', 
				top      : '1px', 
				left     : '1px'
			})
	);

});

export default {deckGenerator};