'use strict';

export default {
	
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
	    // rankindexes : [ 1,   2,   3,   4,   5,   6,   7,   8,   9,   10,   11,  12,  13],
	    ranks36      : ['1',                     '6', '7', '8', '9', '10', 'j', 'q', 'k']
	},
	
	zoom                : 1.0,

	can_move_flip       : false,
	showSlot            : true,
	autohide            : false,

	paddingType         : 'none',
	flip_type           : 'none',
	takeRules           : ['onlytop'],
	putName             : 'any',

	tipRule             : 'allToAll',

	padding_y           : 0,
	padding_x           : 0,
	flip_padding_y      : 0,//5,
	flip_padding_x      : 0,//20,
	move_distance       : 10,

	Tips                : null,
	moveDistance        : 0,
	showTips            : true,
	showTipsDestination : false,
	showTipPriority     : false,

	debugLabels         : false,
	debugLog            : false,

	theme               : {
		name          : 'alternative_theme',
		spriteTexture : true,
	    textureSuits  : ['d', 'c', 'h', 's']
	},
	// theme               : 'default_theme',

	animation           : true,
	animationTime       : 300,// ms.

	actions : {
		twindeck : {
			cardCount : 3
		}
	},


	// start_z_index       : 1,
	startZIndex         : 100,
    topZIndex           : 900,

	canMoveFlip         : false,

	tipsParams   : {
        hideOnEmpty       : false,
        excludeHomeGroups : true
    },

    inputParams : {
        doubleClick : false
    }

};