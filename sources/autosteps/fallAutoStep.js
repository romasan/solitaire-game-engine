'use strict';

import {share, defaults, event} from '../common' ;

import autoStep                 from './autoStep';
import Deck                     from '../deck'   ;
import Tips                     from '../tips'   ;

export default class fallAutoStep extends autoStep {

	/**
	 * Create auto step
	 * @param {*} params 
	 */
	constructor(params) {

		super(params);

		this._name = 'fall';

		// со скольки стопок могут <<упасть>> карты в стопку из которой сделан ход
		this.manualPossibleMoves = 0;

		// event.listen('fallAutoStepCheck', this.check);
	}

	/**
	 * Check if there are possible moves for the current type of moves
	 * @param {*} data 
	 */
	check() {

		Tips.checkTips();

		let _tips = Tips.getTips();

		// console.log('fallAutoStep:check', _tips.length);

		if (_tips.length == 0) {

			this.end();
			// Tips.checkTips();
			return false;
		} else {
			// event.dispatch('saveSteps');
		}

		return true;
	}

	// start() {
	// 	super.start();
	// }

	/**
	 * Automatic execution
	 */
	auto() {

		// TODO
		console.log('fallAutoStep:auto');
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
	/**
	 * Check for progress for the current type of move
	 * @param {*} data 
	 */
	manual(data) {

		// console.log('fallAutoStep:manual');

		// empty
		// check fall
		// this.check();
		let _from = Deck.getDeckById(data.putDeck[0].card.parent),
		    _to   = data.to;

		let _relations = _from.getRelationsByName('fall', {
			"from" : null
		});

		for (let i in _relations) {
			if (
				_relations[i].to == _to.name &&
				_to.cardsCount() === 0
			) {
				this.manualPossibleMoves += 1;
				return true;
			}
		}

		return false;
	}

	// end() {
	// 	super.end({
	// 		"save" : true // (this.manualPossibleMoves > 0 ? true : false)
	// 	});
	// }
}
