'use strict';

import event    from 'event';
import common   from 'common';
import share    from 'share';

import elRender from 'elRender';

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
    
});
