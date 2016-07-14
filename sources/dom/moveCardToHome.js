'use strict';

import event		from 'event';
import common	 from 'common';
import share		from 'share';

import elRender from 'elRender';

// Move card to home
event.listen('moveCardToHome', function(e) {

	if(share.get('lastCursorMove').distance > 0) {
		common.curLock();
	}

		for(var i in e.moveDeck) {

			var _position = e.departure.padding(e.moveDeck[i].index);
			var _params = {
				left : _position.x + 'px',
				top  : _position.y + 'px'
			}

			elRender(e.moveDeck[i].card.domElement)
				.animate(

					_params, 

					()=>{
							
						common.curUnLock();
						
						if(e.departure) {
							e.departure.Redraw();
						}

						if(typeof e.callback == "function") {
							e.callback();
						}
					},

					
					'moveCardToHomeAnimation'
				);
		}
});
