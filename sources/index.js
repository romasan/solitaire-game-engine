'use strict';

/*
 * Solitaire game engine
 * by Roman Bauer - kotapesic@gmail.com
 * Oct. 2015
 * Webpack version Feb. 24 2016
 */

import share      from 'share';
import event      from 'event';
import defaults   from 'defaults';

import Inputs     from 'inputs';
import Move       from 'move';
import domManager from 'domManager';
import Field      from 'field';
import common     from 'common';
import winCheck   from 'winCheck';

import debug from 'debug';

// var _themes = ['default', 'alternative'];

import 'common.scss';
import 'default_theme.scss';
import 'alternative_theme.scss';

exports.event    = event;
exports.options  = defaults;
exports.winCheck = winCheck.hwinCheck;

let firstInit = true;

exports.init = function(gameConfig) {
	
	if(firstInit) {
		debug.tests();
		common.onInit();
		firstInit = false;
	};

	var _field = Field(gameConfig);

	common.afterInit();

	exports.Redraw = function(data) {
		_field.Redraw(data);
	}
};

if(debug) {

	
	exports.debug = debug;
};