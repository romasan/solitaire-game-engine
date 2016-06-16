'use strict';

export default function(a) {// Take deck [{card, index}]

	var _deck = [];
	for(var i in a) {
		if(a[i].card && a[i].card.name) {
			_deck.push(a[i].card.name);
		} else if(a[i].name) {
			_deck.push(a[i].name);
		};
	};
	return _deck;
}