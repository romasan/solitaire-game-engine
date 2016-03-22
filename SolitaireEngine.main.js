'use strict';

/*
 * Solitaire game engine. v. 0.10.7
 * by Roman Bauer - kotapesic@gmail.com
 * Oct. 2015
 * Webpack version 24 Feb. 2016
 */

import share           from 'share';
import event           from 'event';
import defaults        from 'defaults';

import Inputs          from 'Inputs';
import DomManager      from 'DomManager';
import Field           from 'Field';
import SolitaireCommon from 'SolitaireCommon';
import winCheck        from 'winCheck';

// import SolitaireDebug  from 'SolitaireDebug';

exports.event    = event;
exports.options  = defaults;
exports.winCheck = winCheck.hwinCheck;

exports.init = function(gameConfig) {

	// console.log('main:init', gameConfig);
	
	Field(gameConfig);
	exports.Redraw = Field.Redraw;
};

// if(SolitaireDebug) exports.debug = SolitaireDebug;