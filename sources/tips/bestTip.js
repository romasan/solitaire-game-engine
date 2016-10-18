'use strict';

import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import Tips  from 'tips';
import Field from 'field';

export default function(moveDeck, cursorMove) {
	
	// TODO 
	// Пустая ячейка должна иметь наименьший приоритет
	// при выборе ближайшей карты, расстояние считать не от курсора, а от центров карт

	var _autoTips = [];
	
	// выбрать подсказки для стопки из кторорой взяли карты
	let _tips = Tips.getTips();
	for(let i in _tips) {
		if(_tips[i].from.card.id == moveDeck[0].card.id) {
			_autoTips.push(_tips[i]);
		}
	}
	
	if(_autoTips.length == 0) {
		return false;
	}

	// move card to closest deck of a possible move
	let _tip_index          = 0 ,
		_in_direction_count = 0 ,
		_min_distance       = -1;

	// Приоритет для homeGroups
	let _homeGroups = Field.homeGroups;
	if(_homeGroups) {
		
		let _tips = [];
		
		for(let i in _homeGroups) {
			for(let t in _autoTips) {
				if(_autoTips[t].to.deck.parent == _homeGroups[i]) {
					_tips.push(_autoTips[t]);
				}
			}
		}

		// есть подсказки ведущие в homeGroups
		if(_tips.length) {
			_autoTips = _tips;
		}
	}

	// вариантов несколько
	if(_autoTips.length > 1) {

		for(let i in _autoTips) {

			// правый нижний край ???
			let center_from = {
				x : cursorMove.deckPosition.x + (defaults.card.width ),
				y : cursorMove.deckPosition.y + (defaults.card.height)
			}
			
			var _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.cards.length);
			var center_to = {
				x : _destination_deck_last_card_position.x + (defaults.card.width ),
				y : _destination_deck_last_card_position.y + (defaults.card.height)
			}
			
			_autoTips[i].distance = Math.sqrt(common.sqr(center_from.x - center_to.x) + common.sqr(center_from.y - center_to.y));
			_autoTips[i].inDirection = false;
			if(
				(cursorMove.direction.x > 0 && center_to.x > center_from.x)
			 || (cursorMove.direction.x < 0 && center_to.x < center_from.x)
			) {
				_autoTips[i].inDirection = true;
    			_in_direction_count += 1;
			}
			
		}

		for(let i in _autoTips) {

			if(_min_distance == '-1') {
				if(_in_direction_count == 0) {
					_min_distance = _autoTips[i].distance;
				} else {
					if(_autoTips[i].inDirection) {
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
					if(_autoTips[i].inDirection) {
						_min_distance = _autoTips[i].distance;
						_tip_index = i;
					}
				}
			}
		}

	}

	return _autoTips[_tip_index]

};
