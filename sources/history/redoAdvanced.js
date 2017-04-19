'use strict';

import event       from 'event'      ;
import common      from 'common'     ;

import deckActions from 'deckActions';

class redoAdvanced {

	constructor() {
		// 
	}

	handle(data) {

		// Run action
		if(
			       data.runAction                        &&
			typeof data.runAction.actionName == 'string' &&
			typeof data.runAction.deckName   == 'string'
		) {
			let deck = common.getElementByName(data.runAction.deckName, 'deck');

			deckActions.run({
				actionName : data.runAction.actionName,
				deck       : data.runAction.deckName  ,
				eventName  : 'redo'                   ,
				eventData  : {
					"to" : deck
				}
			});

			return true;
		}

		// Make move
		if(
			       data.makeMove                           &&
			       data.makeMove.to                        &&
			       data.makeMove.from                      &&
			typeof data.makeMove.from.cardName == "string"
		) {

			let fromCard = common.getElementByName(data.makeMove.from.cardName, 'card');
			let fromDeck = common.getElementById(fromCard.parent);

			let to = null;

			if(typeof data.makeMove.to.cardName == "string") {
				let toCard = common.getElementByName(data.makeMove.to.cardName, 'card');
				to = toCard.id;
			} else if(typeof data.makeMove.to.deckName == "string") {
				to = common.getElementByName(data.makeMove.to.deckName, 'deck').id;
			}
			if(to) {

				let moveDeck = [];
				let fromDeckCards = fromDeck.getCards();

				let found = false;
				for(let i in fromDeckCards) {

					if(fromDeckCards[i].name == fromCard.name) {
						found = true;
					}

					if(found) {
						moveDeck.push({
							"card"  : fromDeckCards[i],
							"index" : i
						})
					}
				}

				SolitaireEngine.event.dispatch('Move', {
					"moveDeck"   : moveDeck,
					"to"         : to      ,
					"cursorMove" : {
						"dblclick" : false   ,
						"distance" : Infinity
					}
				});
			}

			return true;
		}

		return false;
	}
}

export default new redoAdvanced();