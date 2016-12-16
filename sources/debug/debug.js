'use strict';

import share         from 'share'        ;
import event         from 'event'        ;
import common        from 'common'       ;
import defaults      from 'defaults'     ;

import deckGenerator from 'deckGenerator';
import field         from 'field'        ;
import elRender      from 'elRender'     ;
import mapCommon     from 'mapCommon'    ;
import history       from 'history'      ;
import stateManager  from 'stateManager' ;

import renderTest    from 'renderTest'   ;

// event.listen('addStep', (e) => {
// 	console.log('* Добавили данные для истории:', e.move ? e.move.stepType : 'none', e);
// 	if(e.move && !e.move.stepType) {
// 		throw new Error('debug');
// 	}
// });

// event.listen('makeStep', (e) => {
// 	console.log('# Отправили данные на сохранение в историю:', e);
// }

// -- LOG

// $(document).ready(() => {
// 	$(document.body).append(
// 		$('<span>')
// 			.attr({id : 'log_1'})
// 			.css({
// 				'display'          : 'none'                                                            ,
// 				'width'            : '250px'                                                           ,
// 				'max-height'       : '70%'                                                             ,
// 				'position'         : 'absolute'                                                        ,
// 				'top'              : '0px'                                                             ,
// 				'right'            : '2px'                                                             ,
// 				'overflow'         : 'hidden'                                                          ,
// 				'zIndex'           : 999                                                               ,
// 				'background'       : 'rgba(0, 0, 0, .5)'                                               ,
// 				'padding'          : '4px'                                                             ,
// 				'border-radius'    : '0px 0px 5px 5px'                                                 ,
// 				'text-shadow'      : '#000 1px 0 0px, #000 0 1px 0px, #000 -1px 0 0px, #000 0 -1px 0px',
// 				'font-size'        : '10pt'                                                            ,
// 				'font-family'      : 'Tahoma, Verdana'
// 			})
// 			.dblclick(function() {
// 				setTimeout(() => {
// 					$(this)
// 						.hide()
// 						.empty();
// 				}, 100);
// 			})
// 	);
// });


let _log = (text, color, e) => {
	
	console.log(
		'%c»%c' + text,

		'color: white;',
		
		// 'background: rgba(0, 0, 0, .5);'                                                 +
		'border-radius: 3px;'                                                               +
		// 'text-shadow: #777 1px 0 0px, #777 0 1px 0px, #777 -1px 0 0px, #777 0 -1px 0px;' +
		'padding: 2px;'                                                                     +
		// 'border: 1px solid black;'                                                       +
		'background: ' + color + ';',
		// 'font-weight: bold;'
		// 'color: ' + color + ';'
		
		e ? e : ''
	);

	// $('#log_1')
	// 	.show()
	// 	.append(
	// 		$('<div>')
	// 		.html(text)
	// 		.css({
	// 			color
	// 		})
	// 	)
	// 	.prop({
	// 		scrollTop : 1e10//log_1.scrollHeight - log_1.clientHeight
	// 	})
};

// event.listen('shareSet:stepType', (e) => {
// 	_log('stepType:' + e, 'yellow');
// })

event.listen('saveSteps', e => {
	if(window.xxx) {
		throw new Error('saveSteps');
	}
	_log('saveSteps', 'yellow');
});

// event.listen('shareSet:curLockState', (e) => {
// 	_log('curLockState:' + e, '#aaffaa');
// });

// event.listen('moveEnd', (e) => {
// 	_log('moveEnd', 'orange');
// });

// event.listen('forceMoveEnd', (e) => {
// 	_log('forceMoveEnd', 'orange');
// });

// event.listen('gameInit', (e, a) => {
// 	_log('gameInit (' + ((a.eventInfo.index | 0) + 1) + ', ' + a.eventInfo.count + ')', '#ff7777');
// });

event.listen('startSession', (e) => {
	_log('start', 'red', e);
});

event.listen('stopSession', () => {
	_log('stop', 'green');
});

document.onwheel = (e) => {

  let area = null;
  // if (e.target.id == 'log_1') {
  // 	area = e.target;
  // } else 
  if(e.target.parentNode.id == 'log_1') {
  	area = e.target.parentNode;
  } else {
  	return;
  }

  let delta = e.deltaY || e.detail || e.wheelDelta;

  area.scrollTop = area.scrollTop + delta;

  // if (delta < 0 && area.scrollTop == 0) {
    e.preventDefault();
  // }

  // if (delta > 0 && area.scrollHeight - area.clientHeight - area.scrollTop <= 1) {
    e.preventDefault();
  // }
  
};

// --

class debugHistoryMgrClass {

	constructor() {
		
		this._history = [];
		this._redo    = [];
	}
	
	record(data) {
		
		this._redo = [];
		this._history.push(data);
	}
	
	undo() {
		
		var _step = this._history.pop();
		if(_step) {
			this._redo.push(_step);
		};
		return _step;
	}
	
	redo() {
		
		var _step = this._redo.pop();
		if(_step) {
			this._history.push(_step);
		};
		return _step;
	}
};

let debugHistoryMgr = new debugHistoryMgrClass();

// add buttons

let _debugHistory = false;
let debugHistory = (a) => {

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
	stateManager                              ,
	history                                   ,
	field                                     ,
	groupGenerators : {
		mapCommon
	}
};