'use strict';

import share    from 'share';
import event    from 'event';
import common   from 'common';
import defaults from 'defaults';

import deckGenerator from 'deckGenerator';
import elRender      from 'elRender';
import mapCommon     from 'mapCommon';
import history       from 'history';

import renderTest from 'renderTest';

// event.listen('addStep', (e) => {
// 	console.log('* Добавили данные для истории:', e.move ? e.move.stepType : 'none', e);
// 	if(e.move && !e.move.stepType) {
// 		throw new Error('debug');
// 	}
// });

// event.listen('makeStep', (e) => {
// 	console.log('# Отправили данные на сохранение в историю:', e);
// }

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

// let runTests = ()=>{
// 	// renderTest();
// }

// event.listen('gameInit', (e)=>{
// 	if(!e.firstInit) {return;};
// 	runTests();
// })

export default {
	share                                     ,
	deckGenerator                             ,
	debugHistory                              ,
	debugHistoryMgr                           ,
	validateCardName : common.validateCardName,
	elRender                                  ,
	defaults                                  ,
	groupGenerators : {
		mapCommon
	},
	history
};