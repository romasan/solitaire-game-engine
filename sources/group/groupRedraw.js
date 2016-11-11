'use strict';

import defaults from 'defaults';

export default function(group, data) {

	if(!group || !data) {
		return;
	}

	let _decks = group.getDecks();

	if(
		typeof data.decks == 'undefined' ||
		typeof data.decks == 'number'
	) {
		data.decks = [];
	}

	for(let i in _decks) {
		
		if(!data.decks[i]) {
			data.decks[i] = {};
		};

		// changed values
		if(
			data.position                &&
			data.decks[i].parentPosition
		) {
			data.decks[i].parentPosition = {
				x : data.position.x,
				y : data.position.y
			};
		};

		if(  data.rotate                  ) { data.decks[i].rotate         = data.rotate;       };
		if(  data.paddingX                ) { data.decks[i].paddingX       = data.paddingX;     };
		if(  data.paddingY                ) { data.decks[i].paddingY       = data.paddingY;     };
		if(  data.flipPaddingX            ) { data.decks[i].flipPaddingX   = data.flipPaddingX; };
		if(  data.flipPaddingY            ) { data.decks[i].flipPaddingY   = data.flipPaddingY; };
		if( !data.decks[i].position       ) { data.decks[i].position       = {};                };
		if( !data.decks[i].parentPosition ) { data.decks[i].parentPosition = {};                };

		if(!data.decks[i].parentPosition.x && a.position && a.position.x && typeof a.position.x == 'number') {
			data.decks[i].parentPosition.x = data.position.x;
		};

		if(!data.decks[i].parentPosition.y && a.position && a.position.y && typeof a.position.y == 'number') {
			data.decks[i].parentPosition.y = data.position.y;
		};

		if(data.placement) {
			
			let _card = defaults.card;
			
			if(data.placement.x) { data.decks[i].position.x = (data.placement.x + _card.width)  * i; }
			if(data.placement.y) { data.decks[i].position.y = (data.placement.y + _card.height) * i; }
		};
		
		if( !data.decks[i].rotate       && data.rotate       && typeof data.rotate       == 'number' ) { data.decks[i].rotate       = data.rotate;       };
		if( !data.decks[i].paddingX     && data.paddingX     && typeof data.paddingX     == 'number' ) { data.decks[i].paddingX     = data.paddingX;     };
		if( !data.decks[i].paddingY     && data.paddingY     && typeof data.paddingY     == 'number' ) { data.decks[i].paddingY     = data.paddingY;     };
		if( !data.decks[i].flipPaddingX && data.flipPaddingX && typeof data.flipPaddingX == 'number' ) { data.decks[i].flipPaddingX = data.flipPaddingX; };
		if( !data.decks[i].flipPaddingY && data.flipPaddingY && typeof data.flipPaddingY == 'number' ) { data.decks[i].flipPaddingY = data.flipPaddingY; };
		
		_decks[i].Redraw(data.decks[i]);
	};
};