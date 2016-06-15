'use strict';

// module.exports = function(main, share) {
import share     from 'share';
import event     from 'event';
import defaults  from 'defaults';
import common    from 'common';

import Group     from 'addGroup';
import Deck      from 'addDeck';
import Tips      from 'tips';
import tipsRules from 'tipsRules';

var _field = null;
	// _params = {},
	// _elements = {};

var Field = function(data) {

	// window.currentVersion = '0.11';

	// TODO избавиться от share.field и вообще от share ?
	
	// if(!data && share.field) {
	// 	return share.field;
	// }

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
		// BABEL BUG
		// a = JSON.parse(JSON.stringify(data));
		a = Object['assign'] ? Object['assign']({}, data) : JSON.parse(JSON.stringify(data));
		// a = _.clone(data);
	} catch(e) {
		a = data;
		console.warn('Field input params is not JSON, maybe the rules are wrong.');
	}

	// share.set(
	// 	'spriteTexture', 
	// 	typeof a.theme == 'object' 
	// 		? a       .theme.spriteTexture 
	// 		: defaults.theme.spriteTexture
	// );

	// share.set(
	// 	'textureSuits', 
	// 	typeof a.theme == 'object' 
	// 		? a       .theme.textureSuits 
	// 		: defaults.theme.textureSuits
	// );

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

	var _autoTips = a.autoTips
		? typeof a.autoTips == 'string'
			? tipsRules[a.autoTips]
				? a.autoTips       // tipsRules[a.autoTips]
				: defaults.tipRule // tipsRules[defaults.tipRule]
			: defaults.tipRule     // a.autoTips //function OR object
		: defaults.tipRule         //tipsRules[defaults.tipRule]
	
	share.set('autoTips', _autoTips);
	
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

	// var _animation = typeof a.animation == 'boolean' 
	// 	? a.animation 
	// 	: defaults.animation;
	// this.animation = _animation;
	// share.set('animation', _animation);

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

	this.Draw = function(data) {

		share.set('noRedraw',  true);

		if(data) {
			a = Object['assign'] 
				? Object['assign']({}, data)
				: JSON.parse(JSON.stringify(data));
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
				_fill  = Object['assign'] 
					? Object['assign']([], a.fill) 
					: JSON.parse(JSON.stringify(a.fill));

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

	// checkTips()

	if(a.startZIndex && typeof a.startZIndex == 'number') {
		share.set('start_z_index', a.startZIndex);
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
			// BABEL BUG
			// a = JSON.parse(JSON.stringify(data));
			a = Object['assign'] ? Object['assign']({}, data) : JSON.parse(JSON.stringify(data));
			// a = _.clone(data);
			// var g =  Object.assign({}, {});
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
