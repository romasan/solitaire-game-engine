'use strict';

export default {
	
	card : {
	    width   : 71,
	    height  : 96,

	    suits   : ['h', 'd', 'c', 's'],
	    colors  : {
	    	red   : ['h', 'd'],
			black : ['c', 's']
	    },
	    
	    ranks   : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
	    ranks36 : ['1', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
	    indexes : [ 1,   2,   3,   4,   5,   6,   7,   8,   9,   10,   11,  12,  13]
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

	padding_y           : 20,
	padding_x           : 20,
	flip_padding_y      : 5,
	flip_padding_x      : 20,
	start_z_index       : 1,
	move_distance       : 10,

	Tips                : null,
	moveDistance        : 0,
	showTips            : true,
	showTipsDestination : false,
	showTipPriority     : false,

	debugLabels         : false,
	debugLog            : false,

	theme               : 'default_theme',

	animation           : true,
	animationTime       : 300,// ms.

	actions : {
		twindeck : {
			cardCount : 3
		}
	},


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