'use strict';

module.exports = function(main, share) {
	
	share.bestTip = function(moveDeck, cursorMove) {

		var _autoTips = [];
		for(i in share.Tips) {
			if(share.Tips[i].from.card.id == moveDeck[0].card.id) {
				_autoTips.push(share.Tips[i]);
			}
		}
		
		if(_autoTips.length == 0) {
			return false;
		}

		// move card to closest deck of a possible move

		var _min_distance       = -1,
			_tip_index          = 0,
			_in_direction_count = 0;

		if(share.homeGroups) {
			var _tips = [];
			for(var i in share.homeGroups) {
				for(var t in _autoTips) {
					if(_autoTips[t].to.deck.parent() == share.homeGroups[i]) {
						_tips.push(_autoTips[t]);
					}
				}
			}
			if(_tips.length) _autoTips = _tips;
		}

		if(_autoTips.length >= 2) {

			for(var i in _autoTips) {

				var center_from = {
					x : cursorMove.deckPosition.x + (share.card.width  * share.zoom),
					y : cursorMove.deckPosition.y + (share.card.height * share.zoom)
				}
				
				var _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.getCards().length);
				var center_to = {
					x : _destination_deck_last_card_position.x + (share.card.width  * share.zoom),
					y : _destination_deck_last_card_position.y + (share.card.height * share.zoom)
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
				 // || (cursorMove.direction.y > 0 && center_to.y > center_from.y)
				 // || (cursorMove.direction.y < 0 && center_to.y < center_from.y);
				
			}

			// console.log(_in_direction_count, _autoTips);
			
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

		// console.log('Tip for current card:', _autoTips[_tip_index], 'from:', _autoTips.length, _autoTips[_tip_index].to.deck.getDomElement()[0].id);

		return _autoTips[_tip_index]

	}

};