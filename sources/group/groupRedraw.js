'use strict';

import defaults from '../common/defaults';

export default (group, data) => {

	// console.log('Group:Redraw', group.name, typeof data);

	if (!group || !data) {
		return;
	}

	// получаем стопки текущей группы
	let decks = group.getDecks();

	if (
		typeof data.decks == 'undefined' ||
		typeof data.decks == 'number'
	) {
		data.decks = [];
	}

	// прокидываем конфигурацию для стопок
	for (let i in decks) {

		// иннициируем конфигурацию стопки если отсутствует
		if (!data.decks[i]) {
			data.decks[i] = {};
		};

		// прокидываем информацию о координатах группы
		if (
			data.position                &&
			data.decks[i].parentPosition
		) {
			data.decks[i].parentPosition = {
				"x" : data.position.x,
				"y" : data.position.y
			};
		};

		// прокидываем остальные параметры (параметры группы приоритетнее)
		if ( typeof data.paddingX == 'number' ) { data.decks[i].paddingX = data.paddingX; };
		if ( typeof data.paddingY == 'number' ) { data.decks[i].paddingY = data.paddingY; };

		if ( typeof data.flipPaddingX == 'number' ) { data.decks[i].flipPaddingX = data.flipPaddingX; };
		if ( typeof data.flipPaddingY == 'number' ) { data.decks[i].flipPaddingY = data.flipPaddingY; };

		if ( typeof data.decks[i].position == 'undefined' ) { data.decks[i].position = {}; };

		data.decks[i].parentPosition = {};

		if (typeof data.rotate == 'number') {
			data.decks[i].parentRotate = data.rotate;
		};
		
		if (data.position && typeof data.position.x == 'number') {
			data.decks[i].parentPosition.x = data.position.x;
		};

		if (data.position && typeof data.position.y == 'number') {
			data.decks[i].parentPosition.y = data.position.y;
		};

		// расстановка стопок
		if (data.placement) {
			if (data.placement.x) { data.decks[i].position.x = (data.placement.x + defaults.card.width)  * i; }
			if (data.placement.y) { data.decks[i].position.y = (data.placement.y + defaults.card.height) * i; }
		};
		
		if ( !data.decks[i].rotate       && data.rotate       && typeof data.rotate       == 'number' ) { data.decks[i].rotate       = data.rotate;       };
		if ( !data.decks[i].paddingX     && data.paddingX     && typeof data.paddingX     == 'number' ) { data.decks[i].paddingX     = data.paddingX;     };
		if ( !data.decks[i].paddingY     && data.paddingY     && typeof data.paddingY     == 'number' ) { data.decks[i].paddingY     = data.paddingY;     };
		if ( !data.decks[i].flipPaddingX && data.flipPaddingX && typeof data.flipPaddingX == 'number' ) { data.decks[i].flipPaddingX = data.flipPaddingX; };
		if ( !data.decks[i].flipPaddingY && data.flipPaddingY && typeof data.flipPaddingY == 'number' ) { data.decks[i].flipPaddingY = data.flipPaddingY; };
		
		decks[i].Redraw(data.decks[i]);
	};
};