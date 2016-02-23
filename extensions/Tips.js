'use strict';

module.exports = function(main, share) {

	share.tipTypes = ['tip', 'tipTo', 'tipPriority'];
	
	main.showTips = function() {
		
		// console.log('main.showTips');
		share.showTips = true;
		share.checkTips();
	}.bind(main);

	main.hideTips = function() {
		
		// console.log('main.hideTips');
		share.showTips = false;
		share.checkTips();
	}.bind(main);

	share.checkTips = function(a) {
		
		// console.log('share.checkTips');

		share.Tips = [];

		// $('.tip')        .removeClass('tip');
		// $('.tipTo')      .removeClass('tipTo');
		// $('.tipPriority').removeClass('tipPriority');
		main.event.dispatch('hideTips');


		// console.log('share.checkTips')

		var _decks = this.getDecks({visible : true});
		/*for(i in _all_decks) {
			if(_all_decks[i].visible) {
				_decks.push(_all_decks[i])
			}
		}*/
		// var tips = share.autoTips()
		if(typeof share.autoTips == 'function') {
			share.Tips = share.autoTips({
				decks : _decks
			});
		} else {
			for(i in share.autoTips) {
				if(typeof share.autoTips[i] == 'function') {
					share.Tips = share.Tips.concat(
						share.autoTips[i]({
							decks : _decks
						})
					);
				} else {
					if(share.tipsRules[i]) {
						share.Tips = share.Tips.concat(
							share.tipsRules[i]({
								decks : _decks,
								rules : share.autoTips[i]
							})
						);
					}
				}
			}
		}
		if(share.showTips) {

			// console.log('share.showTips', share.Tips, share.homeGroups);

			for(i in share.Tips) {

				// TODO инициализировать "hideTipsInDom" в Field.js 
				
				// console.log('PARENT IS:', share.Tips[i].from.deck.parent());
				
				if(/*share.hideTipsInDom && */ share.homeGroups && share.homeGroups.indexOf(share.Tips[i].from.deck.parent()) >= 0) {
					// ?#$%&!
				} else {
					// $(share.Tips[i].from.card.domElement).addClass('tip');
					main.event.dispatch('showTip', {el : share.Tips[i].from.card, type : 'tip'});
				}
			}
		}
		
	}.bind(main);

	main.tipsMove = function(a) {

		if(!share.showTipPriority) return;

		// $('.tipPriority').removeClass('tipPriority');
		main.event.dispatch('hideTips', {types : ['tipPriority']});

		// console.log('tipsMove', a, share.showTipPriority);
		
		if( share.showTipPriority 
		 && a 
		 && a.moveDeck 
		 && a.cursorMove 
		 && a.cursorMove.distance 
		 && a.cursorMove.distance >= share.moveDistance
		) {

			var Tip = share.bestTip(a.moveDeck, a.cursorMove);
			if(Tip) {
				/*if(Tip.to.lastCard) {
					$(Tip.to.lastCard.domElement).addClass('tipPriority');
				} else {
					try {
						$(Tip.to.deck.getDomElement()).addClass('tipPriority');
					} catch(e) {
						console.warn('#0', e, Tip)
					}
				}*/
				main.event.dispatch('showTip', {el : share.Tips[i].to.deck, type : 'tipPriority'});

				// $(Tip.to.lastCard.domElement).addClass('tipPriority');
			}
		}
	}.bind(main)

	main.tipsDestination = function(a) {

		// console.log('tipsDestination', a)
		
		if(/*share.showTips && */share.showTipsDestination) {

			// $('.tip')        .removeClass('tip');
			// $('.tipTo')      .removeClass('tipTo');
			// $('.tipPriority').removeClass('tipPriority');
			main.event.dispatch('hideTips'/*, {types : ['tip']}*/);
			
			/*try {
				if(a && a.currentCard && $(a.currentCard)) {
					$(a.currentCard).addClass('tip');
				}
			} catch(e) {}*/
			
			if(a && a.currentCard && a.currentCard.id) for(i in share.Tips) {
				if(share.Tips[i].from.card.id == a.currentCard.id) {					
					// var _cards = share.Tips[i].to.deck.getCards(),
					// _card  = _cards[_cards.length - 1];
					main.event.dispatch('showTip', {el : share.Tips[i].to.deck, type : 'tipTo'});
					/*if(share.Tips[i].to.lastCard) {
						$(share.Tips[i].to.lastCard.domElement).addClass('tipTo');
					} else {
						try {
							$(share.Tips[i].to.deck.getDomElement()).addClass('tipTo');
						} catch(e) {
							console.warn('#1', e, share.Tips[i]);
						}
					}*/
					// $(share.Tips[i].to.lastCard.domElement).addClass('tipTo');
				}
			}
		}
	}.bind(main)

};