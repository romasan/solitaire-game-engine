'use strict';

import event      from 'event'     ;

import deckAction from 'deckAction';
import Deck       from 'deck'      ;
import History    from 'history'   ;

const defaultOpenCount = 3;

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		let openCount = data.actionData.openCount
			? data.actionData.openCount
			: defaultOpenCount;

		let hiddenCardsCount = deck.cardsCount({
			"visible" : false
		});

		let cardsCount = deck.cardsCount({
			"visible" : true
		});

		if(cardsCount > 0) {

			let unflipCardsCount = deck.cardsCount({
				"visible" : true ,
				"flip"    : false
			});

			let flipCardsCount = deck.cardsCount({
				"visible" : true,
				"flip"    : true
			});

			// first roll
			if(
				hiddenCardsCount == 0 &&
				unflipCardsCount == 0
			) {
				event.dispatch('addStep', {
					"rollerActionStart" : deck.name
				});
			}

			// hide unflipped cards
			if(unflipCardsCount > 0) {

				let cards = deck.getCards();

				for(let i in cards) {

					if(cards[i].flip == false) {

						deck.hideCardByIndex(i);

						event.dispatch('addStep', {
							"hide" : {
								"cardIndex" : i                 ,
								"cardName"  : deck.cards[i].name,
								"deckName"  : deck.name
							}
						});
					}
				}
			}

			// unflip next cards
			for(
				let i = flipCardsCount - 1               ;
				i >= 0 && i >= flipCardsCount - openCount;
				i -= 1
			) {

				deck.cards[i].flip = false;

				event.dispatch('addStep', {
					"unflip" : {
						"cardIndex" : i                 ,
						"cardName"  : deck.cards[i].name,
						"deckName"  : deck.name
					}
				});
			}

			cardsCount = deck.cardsCount({
				"visible" : true
			});

			// не осталось видимых карт
			if(cardsCount == 0) {

				hiddenCardsCount = deck.cardsCount({
					"visible" : false
				});

				// event.dispatch('resetHistory');

				event.dispatch('rewindHistory', data => {

					let found = false;

					let stepsCount = 0;

					for(let i = data.history.length - 1; i >= 0 && !found; i -= 1) {

						stepsCount += 1;

						let step = data.history[i];

						for(let atom of step) {

							// rewind
							if(
								!found                                    &&
								typeof atom.rollerActionStart == "string" &&
								       atom.rollerActionStart == deck.name
							) {

								found = true;

								for(let i = 0; i <= stepsCount; i += 1) {
									data.undo();
								}

								// reset deck
								deck.showCards   (false); // no redraw, add in history
								deck.flipAllCards(false); // no redraw, add in history

								// event.dispatch('saveSteps');

							// reset
							} else if(
								!found    &&
								atom.move
								// typeof atom.move.from == "string" &&
								//        atom.move.from == deck.name
							) {

								found = true;

								// reset deck
								deck.showCards   (false, true); // no redraw, add in history
								deck.flipAllCards(false, true); // no redraw, add in history

								event.dispatch('saveSteps');
							}
						}
					}
				});
			} else {
				event.dispatch('saveSteps');
			}
		} else {
			console.log('В колоде', deck.name, 'не осталось видимых карт');
			// deck.showCards   (false); // no redraw
			// deck.flipAllCards(false); // no redraw
		}

		deck.Redraw();

		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();