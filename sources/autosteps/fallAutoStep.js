'use strict';

import share    from 'share';
import defaults from 'defaults';
import event    from 'event';

import autoStep from 'autoStep';
import Deck     from 'addDeck';
import Tips     from 'tips';

// Fall auto step
const _stepType = 'fallAutoStep',// название для хода (заменяет стандартный ход) для deckPut важно чтобы было равно названию автохода
      _click    = false;         // false - использовать стандартный ход
                                 // true  - действие по клику (по стопке из наблюдаемых групп)
                                 // по умолчанию false

export default class fallAutoStep extends autoStep {

	// init
	constructor(params) {

		if(!params) {
			params = {};
		}

		params._stepType = _stepType;
		params._click    = _click;

		super(params);

		// event.listen('fallAutoStepCheck', this.check);
	}

	start() {

		super.start();
		console.log('fallAutoStep:start', this);

		if(this.autoStep) {
			this.auto();
		} else {
			share.set('stepType', _stepType);
		}

		// Tips.checkTips();
		this.check();
	}

	// есть ли ещё ходы этого типа
	check() {

		super.check();
		console.log('--- fallAutoStep:check ---');

		Tips.checkTips();

		let _tips = Tips.getTips();

		if(_tips.length === 0) {
			share.set('stepType', defaults.stepType);
			Tips.checkTips();
		}
	}

	auto() {

		super.auto();
		console.log('fallAutoStep:auto');
		// fall lines auto

		// get groups
			// get fall directions ???
			// get decks
			// get fall relations

		// OR getTips + random ???

		// share.set('stepType', defaults.stepType);
	}

	// manual если autostep = false
	// если click = true, вручную отрабатываем перемещения карт возвращаем false
	// если click = false то отрабатывается move а здесь проверка возможен ли ход
	manual(data) {

		super.manual();
		
		// empty
		// check fall
		// this.check();
		let _from = Deck.getDeckById(data.putDeck[0].card.parent),
		    _to   = data.to;

		let _relations = _from.getRelationsByName('fall', {from: null});

		for(let i in _relations) {
			if(
				_relations[i].to == _to.name &&
				_to.cardsCount() === 0
			) {
				return true;
			}
		}

		return false;
	}
}
