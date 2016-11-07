'use strict';

import share    from 'share';
import defaults from 'defaults';
import event    from 'event';

import autoStep from 'autoStep';
import Deck     from 'deck';
import Tips     from 'tips';

export default class fallAutoStep extends autoStep {

	constructor(params) {

		super(params);

		// event.listen('fallAutoStepCheck', this.check);
	}

	// есть ли ещё ходы этого типа
	check() {

		Tips.checkTips();

		let _tips = Tips.getTips();

		if(_tips.length === 0) {

			this.end();
			// Tips.checkTips();
		}
	}

	// start() {
	// 	super.start();
	// 	console.log('FALL AUTO STEP');
	// }

	auto() {

		console.log('-- fallAutoStep:auto, curLockState -', share.get('curLockState'));
		// fall lines auto

		// get groups
		// 	get fall directions ???
		// 	get decks
		// 	get fall relations

		// OR getTips + random ???

	}

	// manual если autostep = false
	// если click = true, вручную отрабатываем перемещения карт возвращаем false
	// если click = false то отрабатывается move а здесь проверка возможен ли ход
	manual(data) {

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
