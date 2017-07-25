'use strict';

import share              from 'share'             ;
import event              from 'event'             ;
import defaults           from 'defaults'          ;
import stateManager       from 'stateManager'      ;

import Tips               from 'tips'              ;
import Field              from 'field'             ;
import History            from 'history'           ;

import drawPreferences    from 'drawPreferences'   ;
import preferencesEvents  from 'preferencesEvents' ;
import defaultPreferences from 'defaultPreferences';
import specialStep        from 'specialStep'       ;
import showFlipCardOnMove from 'showFlipCardOnMove';
import elRender           from 'elRender'          ;

/*
 * Listeners:
 *
 * gameInit
 * gameInited
 * moveEnd
 * actionBreak
 * startSession
 * stopSession
 * historyReapeater
 * toggleMarkerMode
 * toggleSpecialStepMode
 *
 * Methods:
 *
 * isCurLock
 * curLock
 * curUnLock
 * getElements
 * getElementById
 * getElementsByName
 * getElementByName
 * getElementsByType
 * validateCardName
 * genId
 * animationOn
 * animationDefault
 * animationOff
 * stopRunHistory
 * startRunHistory
 * toggleMarkerMode
 * toggleSpecialStepMode
 */

event.listen('gameInit', data => {

	share.set('stepType', defaults.stepType);

	share.delete('sessionStarted');

	share.set('markerMode', false);

	curUnLock();

	share.set('gameIsWon', false);

	if(!data.firstInit) {
		return;
	};

	drawPreferences();
	preferencesEvents();
});

event.listen('gameInited', e => {
	defaultPreferences();
});

event.listen('moveEnd', e => {
	Tips.checkTips();
});

event.listen('actionBreak', e => {
	Tips.checkTips();
});

event.listen('startSession', e => {
	share.set('sessionStarted', true);
	// stateManager.backup();
});

event.listen('stopSession', e => {
	share.set('sessionStarted', false);
	// stateManager.backup();
});

let isCurLock = e => {
	return share.get('curLockState');
};

let curLock = e => {
	share.set('curLockState', true);
};
event.listen('curLock', curLock);

let curUnLock = e => {
	share.set('curLockState', false);
};
event.listen('curUnLock', curUnLock);

// getters

let getElements = e => {
	return share.get('elements');
};

let getElementById = id => {

	let _elements = share.get('elements');

	return _elements[id];
};

let getElementsByName = (name, type) => {

	let response = [];

	let _elements = share.get('elements');

	for(let i in _elements) {
		if(
			       _elements[i].name             &&
			typeof _elements[i].name == 'string' &&
			       _elements[i].name == name
		) {
			if(type && typeof _elements[i].type == 'string') {
				if(type && _elements[i].type == type) {
					response.push(_elements[i]);
				} else {
					response.push(_elements[i]);
				}
			} else {
				response.push(_elements[i]);
			}
		}
	}

	return response;
};

let getElementByName = (name, type) => {
	let element = getElementsByName(name, type)[0];
	return element;
};

let getElementsByType = (type, filter) => {

	let response = [];

	let _elements = share.get('elements');

	if(type) {
		for(let i in _elements) {
			if(
				typeof _elements[i].type == 'string' &&
				       _elements[i].type == type
			) {
				if(filter) {

					let checkedCount = 0,
					    linesCount   = 0;

					for(let filterName in filter) {

						linesCount += 1;

						if(filter[filterName] == _elements[i][filterName]) {
							checkedCount += 1;
						}
					}

					if(checkedCount > 0 && checkedCount == linesCount) {
						response.push(_elements[i]);
					}
				} else {
					response.push(_elements[i]);
				}
			}
		}
	}

	return response;
};

// validator

let validateCardName = name => {

	if(typeof name != 'string') {

		console.warn('Warning: validate name must have string type "' + name + '"', name);

		return false;
	}

	let suit  = name.slice(0, 1)                                       ,
	    rank  = name.slice(1, 3)                                       ,
	    color = null                                                   ,
	    value = defaults.card.values[defaults.card.ranks.indexOf(rank)];

	for(let colorName in defaults.card.colors) {
		if(defaults.card.colors[colorName].indexOf(suit) >= 0) {
			color = colorName;
		}
	}

	if(
		defaults.card.suits.indexOf(suit) >= 0 &&
		defaults.card.ranks.indexOf(rank) >= 0
	) {
		return {
			"color" : color,
			"value" : value,
			"name"  : name ,
			"suit"  : suit , 
			"rank"  : rank
		}
	} else {

		console.warn('Warning: validate name:', name, '- incorrect');

		return false;
	}
};

// ID generator

let _id = 0;

let genId = e => {
	return _id += 1;
};

// animations

share.set('animation', defaults.animation);

let animationOn = e => {
	// console.warn('animationOn');
	share.set('animation', true);
};

let animationDefault = e => {
	// console.warn('animationDefault');
	share.set('animation', defaults.animation);
};

let animationOff = e => {
	// console.warn('animationOff');
	share.set('animation', false);
};

let stopRunHistory = e => {
	share.set('stopRunHistory', true);
};
event.listen('stopRunHistory', stopRunHistory);

let startRunHistory = e => {
	share.set('stopRunHistory', false);
};
event.listen('startRunHistory', startRunHistory);

event.listen('historyReapeater', data => {
	if(data) {
		share.set('noRedraw', true);
		share.set('noTips', true);
	} else {
		share.set('noRedraw', false);
		Field.Redraw();
		share.set('noTips', false);
		Tips.checkTips();
	}
});

share.set('stepType', defaults.stepType);

// Input modes

// Markers

let toggleMarkerMode = data => {

	let mode = share.get('markerMode');

	share.set('markerMode', !mode);

	event.dispatch('markerMode:toggled', mode);

	// выключить остальные режимы

	if(data && data.exit) {
		return
	}

	if(share.get('specialStepMode')) {
		toggleSpecialStepMode({
			"exit" : true
		});
	}
};
event.listen('toggleMarkerMode', toggleMarkerMode);

// Special step (rewind to step with card)

let toggleSpecialStepMode = data => {

	// console.log('toggleSpecialStepMode:', data);

	let mode = share.get('specialStepMode');

	share.set('specialStepMode', !mode);

	let el = elRender(share.get('domElement:field'));
	
	if(!mode) {
		el.addClass('specialStepMark');

		// выключить остальные режимы

		if(data && data.exit) {
			return;
		}

		if(share.get('markerMode')) {
			toggleMarkerMode({
				"exit" : true
			});
		}
	} else {
		el.removeClass('specialStepMark');
	}

	event.dispatch('specialStepMode:toggled', {
		"mode" : mode,
		"done" : data && data.done ? true : false
	});
};
event.listen('toggleSpecialStepMode', toggleSpecialStepMode);

export default {
	"isCurLock"         : isCurLock        ,
	"curLock"           : curLock          ,
	"curUnLock"         : curUnLock        ,
	"getElements"       : getElements      ,
	"getElementById"    : getElementById   ,
	"getElementsByName" : getElementsByName,
	"getElementByName"  : getElementByName ,
	"getElementsByType" : getElementsByType,
	"validateCardName"  : validateCardName ,
	"genId"             : genId            ,
	"animationOn"       : animationOn      ,
	"animationOff"      : animationOff     ,
	"animationDefault"  : animationDefault
};