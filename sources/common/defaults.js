'use strict';

export default {

// Theme

	"themes" : {
		"field" : [
			'default_field'    ,
			'alternative_field'
		],
		"face" : [
			'default_face'    ,
			'alternative_face'
		],
		"back" : [
			'default_back'    ,
			'alternative_back',
			'american_back'
		]
	},

	"pref" : {
		"field" : 'default_field'   ,
		"face"  : 'alternative_face',
		"back"  : 'default_back'
	},

// Tips

	// "tips" : {

	"showTips"            : true ,
	"showTipsDestination" : false,
	"showTipPriority"     : false,
	"canMoveFlip"         : false,

	"tipsParams" : {
		"hideOnEmpty"       : false,
		"excludeHomeGroups" : true
	},

// Field

	// "field" : {

	"zoom"                : 1.0 ,

	"locale"              : 'ru',

	"animations"          : true,
	"animationTime"       : 100 , // time in milliseconds for 100px

	// "noReplayHistory"     : false,

	"showPrefFlipCard"    : true,
	"showPrevAttempts"    : false,

	"checkNextCards"      : false,

	"inputParams" : {
		"doubleClick" : false
	},

// Group

	"flip"                : null, // param for deck
	"actions"             : null, // param for deck

// Deck

	// "deck" : {

	// "can_move_flip"       : false     ,
	"showSlot"            : true      , // показывать место для карты в пустой стопке

	"autohide"            : false     , // скрывать стопку если вынули все карты
	"autoUnflipTop"       : true      , // открывать верхнюю карту при ходе из стопки
	"autoCheckFlip"       : false     , // применять правило переворачивания после каждого хода
	                                    // из/в стопку

	"paddingType"         : '_default',
	"flip_type"           : 'none'    ,

	"rotate"              : 0         ,

	"takeRules"           : ['any']   , // правило применяемое чтобы взять карту/карты из стопки
	"putRules"            : ['any']   , // правило применяемое чтобы взять карту/карты в стопку

	"fullRules"           : ['not']   , // правило проверки сложенности стопки

	"moveDistance"        : 0         , // на сколько единиц (пикселей) нужно сдвинуть карту чтобы
	                                    // начать ход  

	"padding_y"           : 0         ,
	"padding_x"           : 0         ,
	"flip_padding_y"      : 0         ,
	"flip_padding_x"      : 0         ,
	// "debugLabels"         : false     ,

	"startZIndex"         : 10        ,
	"topZIndex"           : 900       ,

// Card

	"card" : {
		"width"  : 71,
		"height" : 96,

		"suits"   : [ 'h', 'd', 'c', 's'                                               ],
		"ranks"   : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k' ],
		"aliases" : [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ],
		"values"  : [  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 ,  8 ,  9 ,  10 ,  11,  12,  13 ],
		"ranks36" : [ '1',                     '6', '7', '8', '9', '10', 'j', 'q', 'k' ],

		"colors" : {
			"red"   : [ 'h', 'd' ],
			"black" : [ 'c', 's' ]
		}
	},

// Other

	"stepType"             : 'default',
	// "forceClone"           : true     ,
	// "movesAnimation"    : "simple" // simple|byStep|not
	"showHistoryAnimation" : true
};
