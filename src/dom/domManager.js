'use strict';

import event        from 'event';
import share        from 'share';
import defaults     from 'defaults';
import common       from 'common';

import Field        from 'field';
import Tips         from 'tips';
import elRender     from 'elRender';

import initField    from 'initField';
import drawDeck     from 'drawDeck';
import drawCard     from 'drawCard';
import drawTip      from 'drawTip';
import moveDragDeck from 'moveDragDeck';

// --------------------------------------------------------------------------------------------------------

event.listen('removeEl', function(e) {
	elRender(e.domElement)
		.remove();
})

// --------------------------------------------------------------------------------------------------------

event.listen('moveCardToHome', function(e) {

	//  Move card home
	
	console.log('Move card home', e);
	
	common.curLock();
    for(var i in e.moveDeck) {
    	var _position = e.departure.padding(e.moveDeck[i].index);
    	var _params = {
    		left : _position.x * share.get('zoom') + 'px',
    		top  : _position.y * share.get('zoom') + 'px'
    	}
    	elRender(e.moveDeck[i].card.domElement)
    		.animate(
    			_params, 
    			function() {
				    common.curUnLock();
					if(e.departure) {
						e.departure.Redraw();
					}
				});
    }
    
})

// --------------------------------------------------------------------------------------------------------
	
