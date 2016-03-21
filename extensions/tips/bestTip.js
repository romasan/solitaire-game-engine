'use strict';

import share    from 'share';
import defaults from 'defaults';

import Tips     from 'Tips';

export default function(moveDeck, cursorMove) {

	var _autoTips = [];
	var _tips = Tips.getTips();
	for(i in _tips) {
		if(_tips[i].from.card.id == moveDeck[0].card.id) {
			_autoTips.push(_tips[i]);
		}
	}
	
	if(_autoTips.length == 0) {
		return false;
	}

	// move card to closest deck of a possible move
	var _min_distance       = -1,
		_tip_index          = 0,
		_in_direction_count = 0;

	var _homeGroups = share.get('homeGroups');
	if(_homeGroups) {
		var _tips = [];
		for(var i in _homeGroups) {
			for(var t in _autoTips) {
				if(_autoTips[t].to.deck.parent() == _homeGroups[i]) {
					_tips.push(_autoTips[t]);
				}
			}
		}
		if(_tips.length) _autoTips = _tips;
	}

	if(_autoTips.length >= 2) {

		for(var i in _autoTips) {

			var center_from = {
				x : cursorMove.deckPosition.x + (defaults.card.width  * share.get('zoom')),
				y : cursorMove.deckPosition.y + (defaults.card.height * share.get('zoom'))
			}
			
			var _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.cards.length);
			var center_to = {
				x : _destination_deck_last_card_position.x + (defaults.card.width  * share.get('zoom')),
				y : _destination_deck_last_card_position.y + (defaults.card.height * share.get('zoom'))
			}
			
			_autoTips[i].distance = Math.sqrt(Math.sqr(center_from.x - center_to.x) + Math.sqr(center_from.y - center_to.y));
			_autoTips[i].inDirection = false;
			if(
				(cursorMove.direction.x > 0 && center_to.x > center_from.x)
			 || (cursorMove.direction.x < 0 && center_to.x < center_from.x)
			) {
				_autoTips[i].inDirection = true;
    			_in_direction_count += 1;
			}
			
		}

		for(var i in _autoTips) {

			if(_min_distance == '-1') {
				if(_in_direction_count == 0) {
					_min_distance = _autoTips[i].distance;
				} else {
					if(_autoTips[i].inDirection == true) {
						_min_distance = _autoTips[i].distance;
						_tip_index = i;
					}
				}
			}
			
			if(_autoTips[i].distance < _min_distance) {
				if(_in_direction_count == 0) {
					_min_distance = _autoTips[i].distance;
					_tip_index = i;
				} else {
					if(_autoTips[i].inDirection == true) {
						_min_distance = _autoTips[i].distance;
						_tip_index = i;
					}
				}
			}
		}

	}

	return _autoTips[_tip_index]

};