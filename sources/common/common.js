'use strict';

import share              from 'share';
import event              from 'event';
import defaults           from 'defaults';
import state              from 'state';

import Tips               from 'tips';
import Field              from 'field';
import History            from 'history';

import drawPreferences    from 'drawPreferences';
import preferencesEvents  from 'preferencesEvents';
import defaultPreferences from 'defaultPreferences';

// event.listen('shareChange:stepType', (e) => {
// 	console.log('%cshareChange:stepType', 'background-color: green;color: white;', e);
// });

// event.listen('shareChange:curLockState', (e) => {
// 	console.log('%cshareChange:curLockState', 'background-color: blue;color: white;', e);
// });

event.listen('gameInit', (e) => {

	share.set('stepType', defaults.stepType);
	share.delete('sessionStarted');

	curUnLock();
	
	if(!e.firstInit) {
		return;
	};
	
	drawPreferences();
	preferencesEvents();
});

event.listen('gameInited', () => {
	defaultPreferences();
});

// share.set('prevStepType', defaults.stepType);
// event.listen('shareChange:stepType', (e) => {
// 	share.set('prevStepType', e.from);
// });

event.listen('moveEnd', () => {
	Tips.checkTips();
});

event.listen('actionBreak', () => {
	Tips.checkTips();
});

event.listen('startSession', () => {
	share.set('sessionStarted', true);
	state.backup();
});

event.listen('stopSession', () => {
	share.set('sessionStarted', false);
	// state.backup();
});

// --

let sqr = i => i * i;

// --

// Lock/Unlock

// let _lock = false;

// let isLock = function() {
// 	return _lock;
// };

// let lock = function() {
// 	_lock = true;
// }
// event.listen('lock', lock);

// let unlock = function() {
// 	lock = false;
// }
// event.listen('unlock', unlock);

// --

let _inputStack = [];

let isCurLock = () => {
	return share.get('curLockState');
};

let curLock = () => {
	share.set('curLockState', true);
};

let curUnLock = () => {
	
	share.set('curLockState', false);
	
	for(let i in _inputStack) {
		if(typeof _inputStack[i] == "function") {
			_inputStack[i]();
		}
	}
	_inputStack = [];
}

// let input = (callback) => {
// 	if(!isCurLock()) {
// 		callback();
// 	} else {
// 		_inputStack.push(callback);
// 	}
// }

// getters

let getElements = () => {
	return share.get('elements');
}

let getElementById = (id) => {
	
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

let validateCardName = (name, nolog) => {
	
	if(typeof name != 'string') {
		console.warn('Warning: validate name must have string type "' + name + '"');
		// throw new Error('z');
		return false;
	}
	
	let suit  = name.slice(0, 1),
		rank  = name.slice(1, 3),
		color = null,
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
			color,
			value,
			name ,
			suit , 
			rank
		}
	} else {
		console.warn('Warning: validate name:', name, '- incorrect');
		// throw new Error();
		return false;
	}
};

// ID generator

let _id = 0;

let genId = () => {
	return _id += 1;
};

// --

share.set('animation', defaults.animation);

let animationOn = () => {
	share.set('animation', true);
}

let animationDefault = () => {
	share.set('animation', defaults.animation);
}

let animationOff = () => {
	share.set('animation', false);
}

event.listen('newGame', () => {
	// TODO
	// из-за отключения анимации 
	// на время восстановления ходов из истории приходится костылять
	// и везде где нужна анимация ставить common.animationDefault();
	// надо исправить когда из истории можно будет получить
	// не только историю ходов
	animationOff();
});

// --

event.listen('historyReapeater', (data) => {
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

// --

let deckInGroups = (deck, groups) => {
	for(let groupName in groups) {
		Group.getByName(groupName).hasDeck();
	}
}

// event.listen('makeStep', function(e) {
	// share.set('animation', defaults.animation);
// });

share.set('stepType', defaults.stepType);

// let clearInput = ()=>{
//     share.set('dragDeck',    null);
//     share.set('startCursor', null);
// 		console.log('clearInput');
// }

// share.set('lang', defaults.lang);

export default {
//	isLock           ,
//	lock             ,
//	unlock           ,
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
	animationDefault ,
	deckInGroups     ,
	sqr              
};
