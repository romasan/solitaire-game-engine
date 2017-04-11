'use strict';

class redoAdvanced {

	constructor() {
		// 
	}


	handle(data) {

		if(
			data.runAction            &&
			data.runAction.actionName &&
			data.runAction.deckName
		) {
			// 
			return true;
		}

		if(
			data.makeMove               &&
			data.makeMove.to            &&
			data.makeMove.from          &&
			data.makeMove.from.cardName &&
			data.makeMove.to.cardName   ||
			data.makeMove.to.deckName
		) {
			// 
			return true;
		}

		return false;
	}
}

export default new redoAdvanced();