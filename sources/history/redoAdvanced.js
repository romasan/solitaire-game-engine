'use strict';

import event       from 'event'      ;
import common      from 'common'     ;

import deckActions from 'deckActions';

class redoAdvanced {

	constructor() {
		// 
	}

	handle(data) {

		console.log('HANDLE:', data);

		if(
			       data.runAction                        &&
			typeof data.runAction.actionName == 'string' &&
			typeof data.runAction.deckName   == 'string'
		) {
			deckActions.run({
				actionName : data.runAction.actionName,
				deckName   : data.runAction.deckName  ,
				actionData : null                     ,
				eventName  : 'redo'
			});

			return true;
		}

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
				to = parent;
			} else if(typeof data.makeMove.to.deckName == "string") {
				to = common.getElementByName(data.makeMove.to.deckName, 'deck').id;
			}
			if(to) {

				let moveDeck = [];

				// event.dispatch('move', {
				// 	"moveDeck"   : '',
				// 	"to"         : '',
				// 	"cursorMove" : ''
				// });
			}

			return true;
		}

		return false;
	}
}

export default new redoAdvanced();