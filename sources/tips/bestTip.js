'use strict';

import share    from 'share'   ;
import defaults from 'defaults';
import common   from 'common'  ;

import Tips     from 'tips'    ;
import Field    from 'field'   ;

export default (moveDeck, cursorMove) => {

	let _autoTips = [];

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

		for(let homeGroupIndex in _homeGroups) {

			for(let i in _autoTips) {
				if(_autoTips[i].to.deck.parent == _homeGroups[homeGroupIndex]) {
					_tips.push(_autoTips[i]);
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

		// у пустых стопок назначения приоритет меньше
		for(let i = 0; i < _autoTips.length; i += 1) {

			let _tips = [];

			if(_autoTips[i].to.deck.cardsCount()) {
				_tips.push(_autoTips[i]);
			}

			if(_tips.length) {
				_autoTips = _tips;
			}
		}

		for(let i in _autoTips) {

			// координаты центра перетаскиваемой карты/стопки
			let center_from = {
				"x" : cursorMove.deckPosition.x + ((defaults.card.width  / 2) | 0),
				"y" : cursorMove.deckPosition.y + ((defaults.card.height / 2) | 0)
			}

			let _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.cards.length);

			// координаты центра стопки назначения
			let center_to = {
				"x" : _destination_deck_last_card_position.x + ((defaults.card.width  / 2) | 0),
				"y" : _destination_deck_last_card_position.y + ((defaults.card.height / 2) | 0)
			}

			// расстояние между стопкой и перетаскиваемой картой/стопкой
			_autoTips[i].distance = Math.sqrt((i => i * i)(center_from.x - center_to.x) + (i => i * i)(center_from.y - center_to.y));

			// смотрим находится ли стопка назначения в направлении движения
			_autoTips[i].inDirection = false;
			if(
				(cursorMove.direction.x > 0 && center_to.x > center_from.x)
			 || (cursorMove.direction.x < 0 && center_to.x < center_from.x)
			) {
				_autoTips[i].inDirection = true;
				_in_direction_count += 1;
			}

		}

		// ищем ближайшую стопку среди из подсказок
		for(let i in _autoTips) {

			// первая итерация
			if(_min_distance == '-1') {

				// нет подсказок в направлении движения
				if(_in_direction_count == 0) {
					_min_distance = _autoTips[i].distance;

				// есть подсказки в направлении движения
				} else {
					if(_autoTips[i].inDirection) {
						_min_distance = _autoTips[i].distance;
						_tip_index = i;
					}
				}
			} else {

				// нашли меньше
				if(_autoTips[i].distance < _min_distance) {

					// нет подсказок в направлении движения
					if(_in_direction_count == 0) {
						_min_distance = _autoTips[i].distance;
						_tip_index = i;

					// есть подсказки в направлении движения
					} else {
						if(_autoTips[i].inDirection) {
							_min_distance = _autoTips[i].distance;
							_tip_index = i;
						}
					}
				}
			}
		}
		// _tip_index - номер ближайшей стопки в направлении движения

	}

	return _autoTips[_tip_index]

};
