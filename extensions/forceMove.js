'use strict';

module.exports = function(main, share) {
	
	share.forceMove = function(a) {// {'from', 'to', deck[]}

		// console.log('forceMove', a);

		var _warn = function(index) {
			console.warn(index, 'Incorrect move.' + (share.debugLog ? '' : ' (use debugLog : true in field parameters for details)'));
			// if(share.debugLog == true) {console.log('Arguments:', a, index);}
		}
		
		if(!a.from || !a.to || !a.deck) {_warn(1);return;}
		if( typeof a.from != 'string' || typeof a.to != 'string') {_warn(2);return;}
		if(!a.deck.length) return;
		
		var _from = main.Deck(a.from);
		var _to   = main.Deck(a.to);

		if(!_from || !_to) {_warn(3);return;}
		
		var _check = true;
		var _from_deck = _from.getCards();
		
		for(i in _from_deck) {
			
			if(i >= _from_deck.length - a.deck.length) {
				var _id = i - (_from_deck.length|0) + (a.deck.length|0);
				if(a.deck[_id] && _from_deck[i].name != a.deck[_id]) {
					console.log(i, _id, _from_deck, _from_deck[i].name, a.deck[_id])
					_check = false;
				}
			}
		}
		
		if(_check) {
			var _pop = _from.Pop(a.deck.length);
			_to.Push(_pop);
		} else {
			_warn(4);
		}

		_from.Redraw();
		_to  .Redraw();
		//for(var i = deck.length;i;i -= 1) {
		//	_to.push(_to.getCards)
		//}

		share.checkTips();

	}/*.bind(main)*/;

};