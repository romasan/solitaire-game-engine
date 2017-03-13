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
			'alternative_back'
		]
		// empty : [
		// 	"default_empty"    ,
		// 	"alternative_empty"
		// ]
	},

	"pref" : {
		"field" : 'default_field'   , // 0
		"face"  : 'alternative_face', // 1
		"back"  : 'default_back'      // 0
	},

// Tips

	"showTips"            : true ,
	"showTipsDestination" : false,
	"showTipPriority"     : false,
	"canMoveFlip"         : false,

	"tipsParams" : {
		"hideOnEmpty"       : false,
		"excludeHomeGroups" : true
	},

// Field

	"zoom"                : 1.0 ,

	"locale"              : 'ru',

	"animation"           : true,
	"animationTime"       : 400 , // time in milliseconds

	"inputParams" : {
		"doubleClick" : false
	},

// Group

	"flip"                : null, // param for deck
	"actions"             : null, // param for deck

// Deck

	"can_move_flip"       : false      ,
	"showSlot"            : true       ,
	"autohide"            : false      ,

	"paddingType"         : 'none'     ,
	"flip_type"           : 'none'     ,

	"rotate"              : 0          ,

	"takeRules"           : ['any']    ,
	"putRules"            : ['any']    ,

	"fullRules"           : ['not']    ,

	"moveDistance"        : 0          ,

	"padding_y"           : 0          ,
	"padding_x"           : 0          ,
	"flip_padding_y"      : 0          ,
	"flip_padding_x"      : 0          ,
	"move_distance"       : 10         ,
	"debugLabels"         : false      ,

	"startZIndex"         : 100        ,
	"topZIndex"           : 900        ,

// Card

	"card" : {
		"width"  : 71,
		"height" : 96,

		"suits"   : [ 'h', 'd', 'c', 's'                                               ],
		"ranks"   : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k' ],
		"values"  : [  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 ,  8 ,  9 ,  10 ,  11,  12,  13 ],
		"ranks36" : [ '1',                     '6', '7', '8', '9', '10', 'j', 'q', 'k' ],

		"colors" : {
			"red"   : [ 'h', 'd' ],
			"black" : [ 'c', 's' ]
		}
	},

// Other

	"stepType"             : 'default',
	"forceClone"           : true     ,
	// "movesAnimation"    : "simple" // simple|byStep|not
	"showHistoryAnimation" : true
};