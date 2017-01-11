'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';

import elRender from 'elRender';

// Move card to home
event.listen('moveCardToHome', data => {

	console.log('home');

	if(share.get('lastCursorMove').distance > 0) {
		common.curLock();
	}

	for(let i in data.moveDeck) {

		let _position = data.departure.padding(data.moveDeck[i].index);
		let _params = {
			left : _position.x + 'px',
			top  : _position.y + 'px'
		}

		let _cardDomElement = share.get('domElement:' + data.moveDeck[i].card.id);

		elRender(_cardDomElement)
			.animate(

				_params, 

				() => {

					common.curUnLock();

					if(data.departure) {
						data.departure.Redraw();
					}

					if(typeof data.callback == "function") {
						data.callback();
					}
				},

				'moveCardToHomeAnimation'
			);
	}
});
