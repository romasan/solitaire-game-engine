'use strict';

// module.exports = function(main, share) {
import Group     from './addGroup';
import Deck      from './addDeck';
import tipsRules from './tipsRules';


var Field = function(main, share, data) {
	
	var addDeck = function(data) {
		return new Deck(main, share, data);
	};

	var addGroup = function(data) {
		return new Group(main, share, data);
	};
	
	if(!data && share.field) return share.field;
	if(!data) return false;

	if(data && share.field) {
		share.field.clear();
	}
	
	var a = null;
	try {
		a = JSON.parse(JSON.stringify(data));
	} catch(e) {
		a = data;
		console.warn('Field input params is not JSON, maybe the rules are wrong.');
		// DEBUG
		/*var _names = [];
		for(var i in a.groups.group_a) {
			_names.push(i);
		}
		console.log('DATA:', _names, a.groups.group_a);*/
	}

	share.homeGroups = a.homeGroups ? a.homeGroups : null;
	
	share.field = new (function(a) {
		
		main.unlock();
	})(a);
	
	
	main.event.dispatch('initField', {
		a     : a//, 
		// field : share.field
	});

	share.debugLog = a.debugLog && typeof a.debugLog == 'boolean' ? a.debugLog : share.debugLog;

	// Tips

	share.showTips            = typeof a.showTips            == 'boolean' ? a.showTips            : share.showTips;
	share.showTipsDestination = typeof a.showTipsDestination == 'boolean' ? a.showTipsDestination : share.showTipsDestination;
	share.showTipPriority     = typeof a.showTipPriority     == 'boolean' ? a.showTipPriority     : share.showTipPriority;

	share.autoTips = a.autoTips 
	? typeof a.autoTips == 'string'
		? tipsRules[a.autoTips]
			? tipsRules[a.autoTips]
			: tipsRules[share.default_tipRule]
		: a.autoTips //function OR object
	: tipsRules[share.default_tipRule];

	if(document.location.hash == "#god") {
		document.body.innerHTML = "<h1>=)</h1>";
	}

	share.moveDistance = a.moveDistance && typeof a.moveDistance == 'number' ? a.moveDistance : share.default_move_distance;

	// check Win

	share.winCheckMethod = (
		a.winCheck
	 // && a.winCheck.callback && typeof a.winCheck.callback == 'function'
	 && a.winCheck.rules
	) ? typeof a.winCheck.rules == 'string'
		? share.winCheckMethods[a.winCheck.rules]
			? share.winCheckMethods[a.winCheck.rules]
			: share.winCheckMethods['newerWin']
		: a.winCheck.rules
		// : typeof a.winCheck.method == 'function'
		// 	? a.winCheck.method
		// 	: a.winCheck.method
	  : share.winCheckMethods['newerWin'];

	if(a.winCheck && a.winCheck.callback && typeof a.winCheck.callback == 'function') {
		winCheckCallback = a.winCheck.callback;
	}

	// extension: winCheckMethods

	if(a.saveStep && typeof a.saveStep == 'function') {
		console.log('a.saveStep', a.saveStep);
		saveStepCallback = a.saveStep;
	}

	// paraneters and values

	if(a.zoom && typeof a.zoom == 'number') {
		share.zoom = a.zoom
	}

	share.can_move_flip = a.can_move_flip && typeof a.can_move_flip == 'boolean' 
		? a.can_move_flip 
		: share.default_can_move_flip;

	if(a.debugLabels && typeof a.debugLabels == 'boolean') {
		share.debugLabels = a.debugLabels
	}

	if(a.groups) for(var groupName in a.groups) {
		// if(a.groups[i].elements) for(e in a.groups[i].elements) {
		// 	main.addDeck(a.groups[i].elements[e])
		// }
		a.groups[groupName].name = groupName;
		addGroup(a.groups[groupName]);
	}
	if(a.decks) for(var e in a.decks) {
		main.addDeck(a.decks[e]);
	}

	// checkTips()

	if(a.startZIndex && typeof a.startZIndex == 'number') {
		share.start_z_index = a.startZIndex;
	}

	// fill elements in field
	
	if(a.fill) {
		
		// var _isDeck = true;
		// for(i in a.fill) _isDeck = _isDeck && validateCardName(a.fill[i], true);
		// _isDeck = _isDeck && a.fill.length;
		
		// if(_isDeck) {
			// TODO
			// Fill field, all decks
			// field.fill(a.fill);
		// } else {
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

	if(a.cardLoader && typeof a.cardLoader == 'function') {// && a.cardsSet) {
		a.cardLoader(a.cardsSet, main);
	}

	// share.checkTips(); // has in 'newGame' listener

	// Clear field

	share.field.clear = function() {
		// console.log('clear field');
		for(var i in share.elements) {
			// console.log(elements[i]);
			if(share.elements[i].type == 'deck') {
				share.elements[i].clear();
				share.elements[i] = null;
			} else if(share.elements[i].type == 'group') {
				share.elements[i] = null;
			}
		}
		share.elements = {};
	}

	// Redraw field


	// field.fill = function(a) {};
	main.event.dispatch('newGame');

};//.bind(main);

Field.prototype.Redraw = function() {
	var a = null;

	try {
		a = JSON.parse(JSON.stringify(data));
	} catch(e) {
		a = data;
		console.warn('Field.Redraw input params is not JSON, can\'t clone');
	}

	for(var _groupName in a.groups) {
		var _group = main.Group(_groupName);
		if(_group) {
			_group.Redraw(a.groups[_groupName]);
		}
		// for(_deckIndex in a.groups[_groupName]) {
		// 	a.groups[_groupName][_deckIndex].name
		// }
	}
	for(var i in a.decks) {
		//var _parent = main.getElementById(_decks[i].parent());
		//var _parentName = _parent ? _parent.name : null;
		var _deck = main.Deck(a.decks[i].name);
		if(_deck) {
			_deck.Redraw(a.decks[i]);
		} //else {
		// 	_decks[i].Redraw(a.groups[_parentName]);
		// }
	}
	// }
};

export default function(main, share, data) {
	
	// return Field;
	share.field = new Field(main, share, data);
};