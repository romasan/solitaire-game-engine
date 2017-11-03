'use strict';

import event       from '../common/event'    ;
import share       from '../common/share'    ;
import common      from '../common'          ;
import defaults    from '../common/defaults' ;

import deckActions from '../deck/deckActions';

class redoAdvanced {

	constructor() {
		// 
	}

	handle(data) {

		// Run action
		if (
			       data.runAction                        &&
			typeof data.runAction.actionName == 'string' &&
			typeof data.runAction.deckName   == 'string'
		) {

			let deck = common.getElementByName(data.runAction.deckName, 'deck');

			deckActions.run({
				deck       : deck                     ,
				actionName : data.runAction.actionName,
				eventName  : 'redo'                   ,
				eventData  : {
					"to" : deck
				}
			});

			return true;
		}

		// Make move
		if (
			       data.makeMove                           &&
			       data.makeMove.to                        &&
			       data.makeMove.from                      &&
			typeof data.makeMove.from.cardName == "string"
		) {

			// console.log('redoAdvanced:makeMove', JSON.stringify(data.makeMove));

			let fromCard = common.getElementByName(data.makeMove.from.cardName, 'card');
			let fromDeck = common.getElementById(fromCard.parent);

			let to = null;

			let toDeck = null;

			if (typeof data.makeMove.to.cardName == "string") {
				let toCard = common.getElementByName(data.makeMove.to.cardName, 'card');
				to = toCard.id;
				toDeck = common.getElementById(toCard.parent, 'deck');
			} else if (typeof data.makeMove.to.deckName == "string") {
				toDeck = common.getElementByName(data.makeMove.to.deckName, 'deck');			
				to = toDeck.id;
			}
			if (to) {

				let moveDeck = [];
				let fromDeckCards = fromDeck.getCards();

				let found = false;
				for (let i in fromDeckCards) {

					if (fromDeckCards[i].name == fromCard.name) {
						found = true;
					}

					if (found) {
						moveDeck.push({
							"card"  : fromDeckCards[i],
							"index" : i
						})
					}
				}

				let fromDeckPosition = fromDeck.getPosition();
				let toDeckPosition   = toDeck.getPosition();

				const zoom = share.get('zoom');

				const moveDistance = share.get('moveDistance');

				let deckPosition = {
					"x": toDeckPosition.x + defaults.card.width  * zoom / 2,
					"y": toDeckPosition.y + defaults.card.height * zoom / 2
				};

				let direction = {
					"x": toDeckPosition.x > fromDeckPosition.x ? moveDistance + 1 : -moveDistance - 1,
					"y": toDeckPosition.y > fromDeckPosition.y ? moveDistance + 1 : -moveDistance - 1
					// "right": null,
					// "left" : null,
					// "down" : null,
					// "up"   : null
				};

				if (found) {

					SolitaireEngine.event.dispatch('move', {
						"moveDeck"   : moveDeck,
						"to"         : to      ,
						"cursorMove" : {
							"dblclick" : false   ,
							"distance" : Infinity,
							"direction": direction,
							"deckPosition": deckPosition
						}
					});
				} else {
					console.warn('АШИПКА ПРИ ПОПЫТКЕ ХОДА <<СТАРОГО>> ТИПА');
					console.log('###', 'move', {
						"moveDeck"   : moveDeck,
						"to"         : to      ,
						"cursorMove" : {
							"dblclick" : false   ,
							"distance" : Infinity
						}
					});
				}
			}

			return true;
		}

		return false;
	}
}

export default new redoAdvanced();