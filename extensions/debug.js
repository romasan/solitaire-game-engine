'use strict';

module.exports = function(main, share) {

	// debug
	main.debugShowShare = function() {
		console.log(share);
	}

	// ----------------- History -----------------
	var debugHistory = new function() {
		
		var _history = [],
			_redo    = [];
		
		this.record = function(data) {

			// console.log('RECORD HISTORY:', data);
			
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

		main.event.listen('makeStep', this.record);

		// document.addEventListener("DOMContentLoaded", function() {

		$(document.body).append(
			$("<div>").append(
				$("<span>").addClass('awesome').text('UNDO').click(function() {
					var _data = this.undo();
					// 	console.log('undo:', _data);
					if(_data) {
						SolitaireEngine.event.dispatch('undo', _data);
					}
				}.bind(this/*{HM : this, callback : main.Move()}*/))
			).append(
				$("<span>").addClass('awesome').text('REDO').click(function() {
					var _data = this.redo();
					// console.log('redo:', _data);
					if(_data) {
						SolitaireEngine.event.dispatch('redo', _data);
					}
				}.bind(this))
			).css({position : 'fixed', top : '1px', left : '1px'})
		);
		// });
	}
	// -------------------------------------------

};