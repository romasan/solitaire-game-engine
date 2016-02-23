'use strict';

/*
 * Solitaire game engine
 * by Roman Bauer - kotapesic@gmail.com
 * Oct. 2015
 * Webpack version 24 Feb. 2016
 */

var SolitaireExtensions = {};

SolitaireExtensions.SolitaireCommon  = require('./extensions/SolitaireCommon');
SolitaireExtensions.debug            = require('./extensions/debug');
SolitaireExtensions.Field            = require('./extensions/Field');
SolitaireExtensions.addGroup         = require('./extensions/addGroup');
SolitaireExtensions.addDeck          = require('./extensions/addDeck');
SolitaireExtensions.DomManager       = require('./extensions/DomManager');
SolitaireExtensions.deckGenerator    = require('./extensions/deckGenerator');
SolitaireExtensions.SolitaireHistory = require('./extensions/SolitaireHistory');
SolitaireExtensions.tipsRules        = require('./extensions/tipsRules');
SolitaireExtensions.Tips             = require('./extensions/Tips');
SolitaireExtensions.bestTip          = require('./extensions/bestTip');
SolitaireExtensions.readyTakeRules   = require('./extensions/readyTakeRules');
SolitaireExtensions.readyPutRules    = require('./extensions/readyPutRules');
SolitaireExtensions.fillRules        = require('./extensions/fillRules');
SolitaireExtensions.Move             = require('./extensions/Move');
SolitaireExtensions.forceMove        = require('./extensions/forceMove');
SolitaireExtensions.winCheck         = require('./extensions/winCheck');
SolitaireExtensions.addDeckAction    = require('./extensions/addDeckAction');
SolitaireExtensions.flipTypes        = require('./extensions/flipTypes');
SolitaireExtensions.paddingTypes     = require('./extensions/paddingTypes');
SolitaireExtensions.DragNDrop        = require('./extensions/DragNDrop');

// --------------------- INDEX ---------------------
var share = {},
	main = new function() {
	
	this.event = new function() {

		var events = {};

		this.listen = function(name, callback) {
			if(typeof name != 'string' || typeof callback != 'function') return;
			if(events[name]) {
				events[name].push(callback);
			} else {
				events[name] = [callback];
			}
		};

		this.dispatch = function(name, data) {
			if(events[name]) {
				for(i in events[name]) {
					events[name][i](data);
				}
			}
		};
	}
};

for(var i in SolitaireExtensions) {
	SolitaireExtensions[i](main, share);
};
// -------------------------------------------------
exports.main = main;
