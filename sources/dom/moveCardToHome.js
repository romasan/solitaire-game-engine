'use strict';

import event    from 'event';
import common   from 'common';
import share    from 'share';

import elRender from 'elRender';

event.listen('moveCardToHome', function(e) {

	//  Move card home
	
	common.curLock();
    for(var i in e.moveDeck) {
    	var _position = e.departure.padding(e.moveDeck[i].index);
    	var _params = {
    		left : _position.x + 'px',
    		top  : _position.y + 'px'
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
    
});
