'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';

import elRender from 'elRender';

// Move card to home
event.listen('moveCardToHome', (e) => {

	if(share.get('lastCursorMove').distance > 0) {
		common.curLock();
	}

	for(let i in e.moveDeck) {

		let _position = e.departure.padding(e.moveDeck[i].index);
		let _params = {
			left : _position.x + 'px',
			top  : _position.y + 'px'
		}

		let _cardDomElement = share.get('domElement:' + e.moveDeck[i].card.id);

		elRender(_cardDomElement)
			.animate(

				_params, 

				() => {

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
