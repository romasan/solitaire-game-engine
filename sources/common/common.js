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

/*

Listeners:

 * gameInit
 * gameInited
 * moveEnd
 * actionBreak
 * startSession
 * stopSession

 * newGame
 * historyReapeater

Methods:

 * isCurLock
 * curLock
 * curUnLock
 * getElements
 * getElementById
 * getElementsByName
 * validateCardName
 * genId
 * animationOn
 * animationDefault
 * animationOff

 */

event.listen('gameInit', data => {

	share.set('stepType', defaults.stepType);
	share.delete('sessionStarted');

	curUnLock();

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
	stateManager.backup();
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

let curUnLock = e => {	
	share.set('curLockState', false);
}

// getters

let getElements = e => {
	return share.get('elements');
}

let getElementById = id => {

	let _elements = share.get('elements');

	return _elements[id];
}

let getElementsByName = (name, type) => {

	let response = [];

	let _elements = share.get('elements');

	for(let i in _elements) {
		if(_elements[i].name && typeof _elements[i].name == 'string' && _elements[i].name == name) {
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

// validator

let validateCardName = name => {

	if(typeof name != 'string') {

		console.warn('Warning: validate name must have string type "' + name + '"', name);

		// throw new Error('validateCardName');

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
		// throw new Error();
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
	share.set('animation', true);
}

let animationDefault = e => {
	share.set('animation', defaults.animation);
}

let animationOff = e => {
	share.set('animation', false);
}

event.listen('newGame', e => {
	// TODO
	// из-за отключения анимации 
	// на время восстановления ходов из истории приходится костылять
	// и везде где нужна анимация ставить common.animationDefault();
	// надо исправить когда из истории можно будет получить
	// не только историю ходов
	animationOff();
});

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

export default {
	isCurLock        ,
	curLock          ,
	curUnLock        ,
	getElements      ,
	getElementById   ,
	getElementsByName,
	validateCardName ,
	genId            ,
	animationOn      ,
	animationOff     ,
	animationDefault
};
