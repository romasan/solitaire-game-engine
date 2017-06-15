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

	let inDistance = (defaults.card.height - (defaults.card.height - defaults.card.width) / 2) * share.get('zoom');

	// Приоритет для homeGroups
	let _homeGroups = Field.homeGroups;

	// console.log(_autoTips.map(e => e.distance), _autoTips.length);
	// вариантов несколько
	if(_autoTips.length > 1) {

		// ищем расстояние до карт/стопок назначения от перетаскиваемой карты
		// и направление перетаскивания
		for(let i in _autoTips) {

			// координаты центра перетаскиваемой карты/стопки
			let center_from = {
				"x" : cursorMove.deckPosition.x + ((defaults.card.width  / 2) | 0),
				"y" : cursorMove.deckPosition.y + ((defaults.card.height / 2) | 0)
			}

			let _cardsCount = _autoTips[i].to.deck.cardsCount();
			let _destination_deck_position = null;

			if(_cardsCount) {
				// координаты последней карты стопки назначения
				_destination_deck_position = _autoTips[i].to.deck.padding(_cardsCount);
			} else {
				// координаты стопки назначения
				_destination_deck_position = _autoTips[i].to.deck.getPosition();
			}

			// координаты центра стопки назначения
			let center_to = {
				"x" : _destination_deck_position.x + ((defaults.card.width  / 2) | 0),
				"y" : _destination_deck_position.y + ((defaults.card.height / 2) | 0)
			}

			// расстояние между стопкой и перетаскиваемой картой/стопкой
			_autoTips[i].distance = Math.sqrt((i => i * i)(center_from.x - center_to.x) + (i => i * i)(center_from.y - center_to.y));

			// смотрим находится ли стопка назначения в направлении движения
			_autoTips[i].inHorisontalDirection = false;

			if(
				(cursorMove.direction.x > 0 && center_to.x > center_from.x) ||
				(cursorMove.direction.x < 0 && center_to.x < center_from.x)
			) {
				_autoTips[i].inHorisontalDirection  = true;
				_in_direction_count      += 1;
			}
		}

		// ищем ближайшую
		_autoTips.sort((a, b) => parseFloat(a.distance) > parseFloat(b.distance) ? 1 : -1);

		// если карта над ближайшей, то этот ход с самым высоким приоритетом
		// карта над другой стопкой или над полем
		if(_autoTips[0].distance > inDistance) {
			
			// есть домашние группы
			if(_homeGroups.length) {

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

			// ищем ближайшую стопку из подсказок
			if(_in_direction_count == 0) {

				let _tips = _autoTips.filter(e => e.inHorisontalDirection);

				if(_tips.length) {
					_autoTips = _tips;
				}
			}
		}
	}

	return _autoTips[0];
};