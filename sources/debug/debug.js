'use strict';

import share         from 'share'        ;
import event         from 'event'        ;
import defaults      from 'defaults'     ;
import common        from 'common'       ;

import field         from 'field'        ;
import deckGenerator from 'deckGenerator';
import elRender      from 'elRender'     ;
import stateManager  from 'stateManager' ;
import history       from 'history'      ;
import mapCommon     from 'mapCommon'    ;

let _css = {
	"position"    : 'absolute'         ,
	"top"         : '0px'              ,
	"width"       : '100px'            ,
	"height"      : '20px'             ,
	"border"      : '1px solid #c0c0c0',
	"background"  : 'white'            ,
	"color"       : 'white'            ,
	"text-shadow" : 'black 1px 1px 0px,' +
	' black -1px 1px 0px, black -1px -1px 0px, black 1px -1px 0px'
};

$(document).ready(e => {
	$(document.body)
		.append(
			$('<div>').css(_css).css({ "right" : '20px' }).attr({ "id" : 'flag_1' })
				.css({height:'0px'}).animate({height:'20px'}, 'fast')
		)
		.append(
			$('<div>').css(_css).css({ "right" : '122px' }).attr({ "id" : 'flag_2' })
				.css({height:'0px'}).animate({height:'20px'}, 'fast')
		)
		.append(
			$('<div>').css(_css).css({ "right" : '224px' }).attr({ "id" : 'flag_3' })
				.css({height:'0px'}).animate({height:'20px'}, 'fast')
		);
});

event.listen('debugFlag', e => {
	$('#flag_' + e.flag).css({ "background" : e.color }).html(e.text);
});

export default {
	share        ,
	defaults     ,
	common       ,
	field        ,
	deckGenerator,
	elRender     ,
	stateManager ,
	history      ,
	mapCommon
};