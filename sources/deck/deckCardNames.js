'use strict';

let deckCardNames = data => { // Take deck [{card, index}]

	let _deck = [];

	for (let i in data) {
		if (
			data[i].card      &&
			data[i].card.name
		) {
			_deck.push(data[i].card.name);
		} else if (
			data[i].name
		) {
			_deck.push(data[i].name);
		};
	};

	return _deck;
}

export default deckCardNames;