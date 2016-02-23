'use strict';

module.exports = function(main, share) {

	share.elements = {};

	share.cardsSuits   = ['h', 'd', 'c', 's']; // Red, Red, Black, Black
	share.cardColors   = {
		'red'   : ['h', 'd'],
		'black' : ['c', 's']
	}
	// share.redCards     = ;
	// share.blackCards   = ['c', 's'];
	share.cardsRank    = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k'];
	share.cardsRankS   = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
	share.cardsRankInt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

	share.field = null;
	
	share.default_can_move_flip = false;
	share.default_showSlot      = false;
	share.default_autohide      = false;

	share.default_paddingType = 'none',
	share.default_flip_type   = 'none',
	share.default_takeName    = 'onlytop',
	share.default_putName     = 'any';

	share.default_tipRule = 'allToAll';

	share.default_padding_y      = 20;
	share.default_padding_x      = 20;
	share.default_flip_padding_y = 5;
	share.default_flip_padding_x = 20;
	share.default_start_z_index  = 1;
	share.default_move_distance  = 10;

	share.default_theme = 'default_theme';
	
	share.animationTime = 300;

	share.default_twindeck_move_card_count = 3;
	// share.default_twindeck_max_cards       = 7;
	// share.default_twindeck_deck_length     = 3;

	share.Tips                = null,
	share.moveDistance        = 0,     // default 0
	share.showTips            = true,  // default true
	share.showTipsDestination = false, // default false
	share.showTipPriority     = false; // default false

	share.debugLabels = false;
	share.start_z_index = share.default_start_z_index;

	share.oneStepWay = {};

	share.debugLog = false;

	share.can_move_flip = null;

	share.zoom = 1.0;
	
	share.card = {
	    width       : 71,
	    height      : 96
	}

	share.saveStepCallback = function() {};
	share.winCheckCallback = function() {};
	share.autoTips = function() {};

	var _id = 0;
	share.genId = function() {
		return _id++;
	}

	main.options = {
		card : share.card
	};

	// Lock/Unlock

	share.lock = false;

	main.lock = function() {
		if(share.debugLog) console.log('LOCK');
		share.lock = true;
	}.bind(main);

	main.unlock = function() {
		if(share.debugLog) console.log('UNLOCK');
		// throw new Error('asda');
		share.lock = false;
	}.bind(main);

	share.curLockState = false;
	share.curLock = function() {
		share.curLockState = true;
	}
	share.curUnLock = function() {
		share.curLockState = false;
	}

	main.getElements = function() {
		return share.elements;
	}.bind(main);

	main.getElementsByName = function(name, type) {
		var s = [];
		for(i in share.elements) {
			if(share.elements[i].name && typeof share.elements[i].name == 'string' && share.elements[i].name == name) {
				if(type && typeof share.elements[i].type == 'string') {
					if(type && share.elements[i].type == type) {
						s.push(share.elements[i]);
					} else {
						s.push(share.elements[i]);
					}
				} else {
					s.push(share.elements[i]);
				}
			}
		}
		return s;
	}.bind(main);

	main.getElementById = function(a) {
		return share.elements[a];
	}.bind(main);

	main.event.listen('makeStep', function(e) {
		share.saveStepCallback(e);
		// console.log('clear share.oneStepWay', onlytopeStepWay);
		share.oneStepWay = {};
		// console.log('share.oneStepWay cleared', share.oneStepWay);
	});

	main.event.listen('win', function(e) {
		// console.log('win', share.winCheckCallback, e);
		if(e && e.show) share.winCheckCallback(e);
	});

	main.event.listen('newGame', function(e) {
		share.checkTips();
	});

	share.validateCardName = function(name, nolog) {
		if(typeof name != 'string') {
			if(!nolog) console.log('Warning: validate name must have string type', name);
			// throw new Error('z');
			return false;
		}
		var suit  = name.slice(0, 1),
			rank  = name.slice(1, 3),
			color = null;
			for(var colorName in share.cardColors) {
				if(share.cardColors[colorName].indexOf(suit) >= 0) {
					color = colorName;
				}
			}
		// console.log('validateCardName:', color, suit, rank);
		if( share.cardsSuits.indexOf(suit) >= 0 && share.cardsRankS.indexOf(rank) >= 0 ) {
			return {
				suit  : suit, 
				rank  : rank,
				color : color 
			}
		} else {
			if(!nolog) console.log('Warning: validate name:', name, '- incorrect');
			return false;
		}
	}
	
};