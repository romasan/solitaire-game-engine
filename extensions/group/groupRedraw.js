'use strict';

import defaults from 'defaults';

export default function(_a) {

	concole.log('groupRedraw:', _a);

	var _decks = this.getDecks();
	var _index = {}

	if(typeof _a.decks == 'undefined' || typeof _a.decks == 'number') {_a.decks = [];}

	for(var i in _decks) {
		
		if(!_a.decks[i]) _a.decks[i] = {};

		// changed values
		if(
			_a.position
		 && _a.decks[i].parentPosition
		) {
			_a.decks[i].parentPosition = {
				x : _a.position.x,
				y : _a.position.y
			}
		}
		if( _a.rotate                   ) { _a.decks[i].rotate         = _a.rotate;       }
		if( _a.paddingX                 ) { _a.decks[i].paddingX       = _a.paddingX;     }
		if( _a.paddingY                 ) { _a.decks[i].paddingY       = _a.paddingY;     }
		if( _a.flipPaddingX             ) { _a.decks[i].flipPaddingX   = _a.flipPaddingX; }
		if( _a.flipPaddingY             ) { _a.decks[i].flipPaddingY   = _a.flipPaddingY; }
		if( !_a.decks[i].position       ) { _a.decks[i].position       = {};              }
		if( !_a.decks[i].parentPosition ) { _a.decks[i].parentPosition = {};              }

		if(!_a.decks[i].parentPosition.x && a.position && a.position.x && typeof a.position.x == 'number') {
			_a.decks[i].parentPosition.x = _a.position.x;
		}
		if(!_a.decks[i].parentPosition.y && a.position && a.position.y && typeof a.position.y == 'number') {
			_a.decks[i].parentPosition.y = _a.position.y;
		}
		if(_a.placement) {
			
			var _card = defaults.card;
			if(_a.placement.x) _a.decks[i].position.x = (_a.placement.x + _card.width)  * i;
			if(_a.placement.y) _a.decks[i].position.y = (_a.placement.y + _card.height) * i;
		}
		
		if( !_a.decks[i].rotate       && _a.rotate        && typeof _a.rotate       == 'number' ) { _a.decks[i].rotate       = _a.rotate;       }
		if( !_a.decks[i].paddingX     && _a.paddingX      && typeof _a.paddingX     == 'number' ) { _a.decks[i].paddingX     = _a.paddingX;     }
		if( !_a.decks[i].paddingY     && _a.paddingY      && typeof _a.paddingY     == 'number' ) { _a.decks[i].paddingY     = _a.paddingY;     }
		if( !_a.decks[i].flipPaddingX && _a.flipPaddingX  && typeof _a.flipPaddingX == 'number' ) { _a.decks[i].flipPaddingX = _a.flipPaddingX; }
		if( !_a.decks[i].flipPaddingY && _a.flipPaddingY  && typeof _a.flipPaddingY == 'number' ) { _a.decks[i].flipPaddingY = _a.flipPaddingY; }
		
		_decks[i].Redraw(_a.decks[i]);
	}
};