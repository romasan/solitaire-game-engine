'use strict';

/*
 * Solitaire game engine
 * by Roman Bauer - kotapesic@gmail.com
 * Oct. 2015
 * Webpack version Feb. 24 2016
 */

exports.ver = "0.12";

import share           from 'share';
import event           from 'event';
import defaults        from 'defaults';

import Inputs          from 'inputs';
import DomManager      from 'domManager';
import Field           from 'field';
import SolitaireCommon from 'common';
import winCheck        from 'winCheck';

import SolitaireDebug  from 'debug';

exports.event    = event;
exports.options  = defaults;
exports.winCheck = winCheck.hwinCheck;

exports.init = function(gameConfig) {

	// console.log('main:init', gameConfig);
	
	var _field = Field(gameConfig);

	// console.log('Field.Redraw', _field.Redraw);
	
	exports.Redraw = function(data) {
		_field.Redraw(data);
	}
};

if(SolitaireDebug) { exports.debug = SolitaireDebug; };