'use strict';

// module.exports = function(main, share) {
import share     from 'share';
import event     from 'event';
import defaults  from 'defaults';
import common    from 'SolitaireCommon';

import Group     from 'addGroup';
import Deck      from 'addDeck';
import Tips      from 'Tips';
import tipsRules from 'tipsRules';

var _field = null;
	// _params = {},
	// _elements = {};

var Field = function(data) {

	// TODO избавиться от share.field и вообще от share ?
	// console.log('FIELD', data, _field);	
	
	// if(!data && share.field) {
	// 	return share.field;
	// }

	if(!data) {
		return false;
	}

	common.unlock();
	
	if(data && _field) {
		
		// console.log('CLEAR');
		
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
		// 'zxczxc';
		// console.log(JSON.parse(JSON.stringify(data)));
		// console.log(data);
	}

	this.homeGroups = a.homeGroups;
	
	share.set(
		'debugLog', 
		a.debugLog && typeof a.debugLog == 'boolean' 
			? a.debugLog 
			: defaults.debugLog
	);

	// Tips

	if(typeof a.showTips == 'boolean' && a.showTips) {
		Tips.showTips({init : true});
	} else {
		Tips.hideTips({init : true});
	}

	// console.log('SHOW TIPS:', share.get('showTips'));

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
				? a.autoTips// tipsRules[a.autoTips]
				: defaults.tipRule// tipsRules[defaults.tipRule]
			: defaults.tipRule// a.autoTips //function OR object
		: defaults.tipRule//tipsRules[defaults.tipRule]
	
	share.set('autoTips', _autoTips);
	
	// console.log('set autoTips', _autoTips)

	if(document.location.hash == "#god") {
		document.body.innerHTML = "<h1>=)</h1>";
	}

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
		// console.log('a.saveStep', a.saveStep);
		saveStepCallback = a.saveStep;
	}

	// paraneters and values

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

	this.Draw = function() {
		
		if(!a) return;
		
		// console.log('draw all');		
		
		if(a.groups) for(var groupName in a.groups) {

			a.groups[groupName].name = groupName;
			Group.addGroup(a.groups[groupName]);
		}

		if(a.decks) for(var e in a.decks) {
			
			// main.addDeck(a.decks[e]);
			Deck.addDeck(a.decks[e]);
		}

		Tips.checkTips();

		event.dispatch('newGame');

		common.unlock();

	}

	// checkTips()

	if(a.startZIndex && typeof a.startZIndex == 'number') {
		share.set('start_z_index', a.startZIndex);
	}

	// fill elements in field
	
	if(a.fill) {
		
		for(var _name in a.fill) {
			var _elements = this.getElementsByName(_name);
			for(var i in _elements) {
				if(['deck', 'group'].indexOf(_elements[i].type) && typeof a.fill[_name] != 'string') {
					_elements[i].Fill(a.fill[_name]);
				}
			}
		}
		// }
	}

};

Field.prototype.clear = function() {
	
	// console.log('clear field', share);
	
	var _elements = share.get('elements');
	for(var i in _elements) {
		// console.log(elements[i]);
		if(_elements[i].type == 'deck') {
			_elements[i].clear();
			_elements[i] = null;
		} else if(_elements[i].type == 'group') {
			_elements[i] = null;
		}
	}
	share.set('elements', {});
};

Field.prototype.Redraw = function() {
		
	// console.log('redraw field');

	var a = null;

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

		// console.log('redraw group:', _groupName);

		var _group = Group.Group(_groupName);
		if(_group) {
			_group.Redraw(a.groups[_groupName]);
		}
	}

	for(var i in a.decks) {
		
		// console.log('redraw deck:', a.decks[i].name);
		
		var _deck = Deck.Deck(a.decks[i].name);
		if(_deck) {
			_deck.Redraw(a.decks[i]);
		}
	}
};

export default function(data) {

	// if(data) console.log("Field:export", data, _field);	
	
	if(data && _field) {// TODO THIS
		
		// console.log('RESET', data);
		
		_field.clear();
		_field.Draw(data);
	}

	if(data && !_field) {

		// console.log('NEW');
		
		_field = new Field(data);
		event.dispatch('initField', {a : data});
		_field.Draw();
	};
	
	return _field;
};
