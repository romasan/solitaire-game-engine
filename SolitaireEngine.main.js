'use strict';

/*
 * Solitaire game engine. v. 0.10.6
 * by Roman Bauer - kotapesic@gmail.com
 * Oct. 2015
 * Webpack version 24 Feb. 2016
 */

// var SolitaireExtensions = {};                                 // ON | IN

import SolitaireCommon  from './extensions/SolitaireCommon';     // +
import Field            from './extensions/Field';               // +
//             import * from './extensions/addGroup';            // +    Field
//             import * from './extensions/addDeck';             // +    Field
import DomManager       from './extensions/DomManager';          // +
//             import * from './extensions/deckGenerator';       // +    SolitaireDebug
import SolitaireHistory from './extensions/SolitaireHistory';    // +
//             import * from './extensions/tipsRules';           // +    Tips
import Tips             from './extensions/Tips';                // +
//             import * from './extensions/bestTip';             // +    Tips
//             import * from './extensions/readyTakeRules';      // +    Field.addDeck
//             import * from './extensions/readyPutRules';       // +    Field.addDeck
//             import * from './extensions/fillRules';           // +    Field.addDeck
import Move             from './extensions/Move';                // +
//             import * from './extensions/forceMove';           // +    SolitaireHistory
import winCheck         from './extensions/winCheck';            // +
//             import * from './extensions/addDeckAction';       // +    Field.addDeck
//             import * from './extensions/flipTypes';           // +    Field.addDeck
//             import * from './extensions/paddingTypes';        // +    Field.addDeck
import DragNDrop        from './extensions/DragNDrop';           // +
// import SolitaireDebug   from './extensions/SolitaireDebug';      // + 

// --------------------- INDEX ---------------------
var share = {};

var main = new function() {
	// this.event = null;
};

/*for(var i in SolitaireExtensions) {
	SolitaireExtensions[i](main, share);
};*/

SolitaireCommon  (main, share);
DomManager       (main, share);
DragNDrop        (main, share);
Tips             (main, share);
Move             (main, share);
winCheck         (main, share);
SolitaireHistory (main, share);

if(typeof SolitaireDebug != "undefined") {
	SolitaireDebug (main, share);
}

exports._main    = main;
exports._share   = share;

exports.options  = main.options;
exports.winCheck = main.winCheck;
exports.event    = main.event;

exports.init = function(gameConfig) {

	Field(main, share, gameConfig);
	// var _field = Field(main, share, gameConfig);
	// console.log('field:', _field);
	// return _field;
	exports.Redraw = share.field.Redraw;

};