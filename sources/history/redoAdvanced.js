'use strict';

import common, {event, share, defaults} from '../common';

import {actions as deckActions} from '../deck';

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

			// console.log('RUN ACTION:', data.runAction.actionName, data.runAction.deckName);
			// console.log('%credoAdvanced:runAction', 'color: orange;font-weight: bold;', JSON.stringify(data.runAction));

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
			// TODO check imput data and log warning
			// console.log('%credoAdvanced:makeMove', 'color: blue;font-weight: bold;', JSON.stringify(data.makeMove));

			let fromCard = common.getElementByName(data.makeMove.from.cardName, 'card');
			// try {

			let fromDeck = common.getElementById(fromCard.parent);

			// } catch (e) {
			// 	console.warn('ERROR:', e);
			// 	return;
			// }

			let to = null;

			let toDeck = null;

			// try {

			if (typeof data.makeMove.to.cardName == "string") {
				let toCard = common.getElementByName(data.makeMove.to.cardName, 'card');
				toDeck = common.getElementById(toCard.parent, 'deck');
			} else if (typeof data.makeMove.to.deckName == "string") {
				toDeck = common.getElementByName(data.makeMove.to.deckName, 'deck');			
			}

			// } catch (e) {
			// 	console.warn('ERROR:', e);
			// 	return;
			// }

			to = toDeck.id;
			
			if (to) {

				let moveDeck = [];
				// try {
				
				let fromDeckCards = fromDeck.getCards();
				
				// } catch (e) {
				// 	console.warn('ERROR:', e);
				// 	return;
				// }

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

				let distance = Math.sqrt(
					(e => e * e)(fromDeckPosition.x - toDeckPosition.x) + 
					(e => e * e)(fromDeckPosition.y - toDeckPosition.y)
				);

				if (found) {

					// console.log('redoAdvanced:makeMove', moveDeck.map(e => e.card.name), fromDeck.name, '->', toDeck.name);

					event.dispatch('move', {
						"moveDeck"   : moveDeck,
						"to"         : to      ,
						"cursorMove" : {
							"dblclick" : false   ,
							"distance" : distance,
							"direction": direction,
							"deckPosition": deckPosition
						}
					});
				} else {
					console.warn('Ошибка при попытке хода <<старого>> типа; makeMove',
						data.makeMove.from.cardName + ' ' + 
						data.makeMove.to  .cardName
					);
					// event.dispatch('solitaire_log');
				}
			}

			return true;
		}

		return false;
	}
}

export default new redoAdvanced();
