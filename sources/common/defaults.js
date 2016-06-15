'use strict';

export default {

// Theme ---------------------------------------------------------------------------------

	// theme               : {
	// 	name          : 'alternative_theme',
	// 	spriteTexture : true,
	//     textureSuits  : ['d', 'c', 'h', 's']
	// },

    pref : {
    	field : 0,
    	face  : 1,
		back  : 0
		// empty : 1
    },

    stepType : 'default',
    
	themes : {
		field : [
			"default_field",
			"alternative_field"
		],
		face  : [
			"default_face",
			"alternative_face"
		],
		back  : [
			"default_back",
			"alternative_back",
			"red_back",
			"blue_back"
		]
		// empty : [
		// 	"default_empty",
		// 	"alternative_empty"
		// ]
	},

// Tips ----------------------------------------------------------------------------------

	tipRule             : 'allToAll',
	showTips            : true,
	showTipsDestination : false,
	showTipPriority     : false,
	canMoveFlip         : false,

	tipsParams   : {
        hideOnEmpty       : false,
        excludeHomeGroups : true
    },
	
// Field ---------------------------------------------------------------------------------

	zoom                : 1.0,

	animation           : true,
	animationTime       : 300,// ms.

    inputParams : {
        doubleClick : false
    },

// Deck ----------------------------------------------------------------------------------

	can_move_flip       : false,
	showSlot            : true,
	autohide            : false,

	paddingType         : 'none',
	flip_type           : 'none',
	
	takeRules           : ['onlytop'],
	putRule             : 'any',

	moveDistance        : 0,

	padding_y           : 0,
	padding_x           : 0,
	flip_padding_y      : 0,//5,
	flip_padding_x      : 0,//20,
	move_distance       : 10,
	debugLabels         : false,

	startZIndex         : 100,
    topZIndex           : 900,

	afterStep           : false,// Ждать действия после элементарного хода

// Card ----------------------------------------------------------------------------------

	card : {
	    width        : 71,
	    height       : 96,

	    suits        : ['h', 'd', 'c', 's'],
	    // suitindexes : [ 1,   2,   3,   4 ],
	    colors       : {
	    	red   : ['h', 'd'],
			black : ['c', 's']
	    },
	    
	    ranks        : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
	    values       : [ 1,   2,   3,   4,   5,   6,   7,   8,   9,   10,   11,  12,  13],
	    ranks36      : ['1',                     '6', '7', '8', '9', '10', 'j', 'q', 'k']
	}

// Actions defaults ----------------------------------------------------------------------

	// actions : {
	// 	twindeck : {
	// 		cardCount : 3
	// 	}
	// }
};