'use strict';

module.exports = function(main, share) {
	// пусть будет
	Math.sqr = function(i) {return i * i;}

	// var drag_el = null;
	share.dragDeck = null;
	share.startCursor = null;

	var top_z_index = 900;

	main.event.listen('undo', function() {
		/*share.moveCardToHome(
			share.dragDeck, 
			main.getDeckById(share.dragDeck[0].card.parent)
		);*/
		if(share.dragDeck) main.getDeckById(share.dragDeck[0].card.parent).Redraw();
		share.dragDeck    = null;
		share.startCursor = null;
	});

	main.event.listen('redo', function() {
		/*share.moveCardToHome(
			share.dragDeck, 
			main.getDeckById(share.dragDeck[0].card.parent)
		);*/
		if(share.dragDeck) main.getDeckById(share.dragDeck[0].card.parent).Redraw();
		share.dragDeck    = null;
		share.startCursor = null;
	});

// -------------------------------------------------------------------------------------------------------------

	var cdown = function(target, x, y) {

		if(share.curLockState) return;

		try {
			$('.draggable').finish();
		} catch(e) {
			console.log(e);
		}

		// try{$('.draggable:animated').finish();}catch(e){console.log('Hmmm...', $('.draggable:animated'));}

	    if(share.dragDeck || share.startCursor) return;
	    
	    if( target.className.split(' ').indexOf('slot') >= 0 ) {
		    
		    var _id   = target.id,
		    	_deck = main.getElementById(_id);
	    	main.event.dispatch('runDeckActions', {
				deck : _deck
			});
	    }
	    
	    if( target.className.split(' ').indexOf('draggable') >= 0 ) {
		    
		    var _id     =                         target.id,
    			_card   = _id                   ? main.getElementById(_id)  : null,
				_parent = _card && _card.parent ? _card.parent              : null,
				_deck   = _parent               ? main.getDeckById(_parent) : null;
			
			// console.log('card from deck:', _deck);
			
			main.event.dispatch('runDeckActions', {
				deck : _deck
			});
			
			// TODO
			// в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются
			
			// console.log(_id, _card, _parent, _deck, main.getElements())
			
			share.dragDeck = _deck ? _deck.Take(_id) : null;
			
			// console.log(share.dragDeck);
	    
	        if(share.dragDeck) {

	        	share.startCursor = {
	            	x  : x,
	            	y  : y
		        }

		        main.tipsDestination({currentCard : _card});
		    }
	    }

	    // console.log(share.dragDeck, share.startCursor);


	}

// -------------------------------------------------------------------------------------------------------------

	var cmove = function(x, y) {

	    if(!share.dragDeck || !share.startCursor) return;

		// if(main.debugLabels()) {
			// var canvas = document.createElement('canvas');
			// canvas.setAttribute('width', 128);
			// canvas.setAttribute('height', 128);
			// canvas.setAttribute('id', 'canvas');
			// context = canvas.getContext("2d");
			// context.lineWidth = 2;
			// context.font = "12px Verdana";
			// context.fillStyle = "blue";//white";
			// context.strokeStyle = "white";//black";
			// var text = "(x:y): " + x + ":" + y;
			// context.strokeText(text, 15, 20);
			// context.fillText(text, 15, 20);
			// // if(share.dragDeck) $(share.dragDeck[0].card).hide();
			// var _el = document.elementFromPoint(x, y);
			// if(_el) {
			// text = "cursor on: " + _el.id;
			// 	// if(share.dragDeck) $(share.dragDeck[0].card).show();
			// 	context.strokeText(text, 15, 35);
			// 	context.fillText(text, 15, 35);
			// }
			// if(share.dragDeck) {
			// 	text = "take: " + share.dragDeck[0].card.id;
			// 	context.strokeText(text, 15, 50);
			// 	context.fillText(text, 15, 50);
			// 	text = "...(x:y): " + share.startCursor.x + ":" + share.startCursor.y;
			// 	context.strokeText(text, 15, 65);
			// 	context.fillText(text, 15, 65);
			// 	text = "dist.: " + _distance;
			// 	context.strokeText(text, 15, 80);
			// 	context.fillText(text, 15, 80);
			// }
			// var image = new Image();
			// image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QAAAAAAAD5Q7t/AAABiElEQVRYw+2WwUrDQBBA39TYpFUIFJRa8Cqkn+HVX+jNmydPfpsI6l/0Azz1VFuqZkOt4yGzNal6MokifTAku2GTl9lld+CXEYuWXQEUeLNrIwTAnhrAPrBbEKqVlkUIMBwOUdUF0DGx2iVawI4XmE6nXmLelISf+wDAOde4RFBsZFnGZiZEJAZS4JUaFmZJwDm3vm9KItjscM6tRZqQ+CQQRVGpXbdESSCKIsIwLIn0ej2A2iRKAv7jWZYxGAwAGI/HpQEm0QVWlQt40jSl3++v/15ELoFnYGFRKV3gWFU1jmO/HV+pqiZJokmS+L4T4AiIgYh8D/kx/iUKMJvNEJEL4BbyBVhMjGUhBZZUtAhb9qKlpXoEXAOPInI+mUyA9QJ8sDErKpp/L7ACMhE5A26AGTAH7r/IQpuKUl8kIJ/TjkXb2gfASAsAh/a8MqQQHrW/7JDXBqfkJ+YLcAc8YVNWlcB3/QH5MR2awBLILFZ1C/hnvmARPkq1Rsu1LVu2/E9sW9/yN3gHxBjGgvpF0o0AAAAASUVORK5CYII=";
			// image.onload = function() {
			//     context.drawImage(image, 0, 0, 30, 30);
			// 	$('#mat').css({cursor : 'url(\'' + canvas.toDataURL() + '\'), pointer'});
			// };
		// }

		var _distance = share.startCursor ? Math.sqrt(Math.sqr(x - share.startCursor.x) + Math.sqr(y - share.startCursor.y)) : 0;

    	var _deck = main.getElementById(share.dragDeck[0].card.parent);
	    for(i in share.dragDeck) {
	    	var _position = _deck.padding(share.dragDeck[i].index);
	    	var _params = {
	    		left      : (_position.x + (x - share.startCursor.x)) + 'px',
	    		top       : (_position.y + (y - share.startCursor.y)) + 'px',
	    		// transform : 'rotate(0deg)',
	    		zIndex    : top_z_index + (i|0)
	    	}
	    	// Operations with DOM
	    	$(share.dragDeck[i].card.domElement).css(_params);
	    }


	    var cursorMove = {
	    	distance     : _distance,
	    	direction    : {
		    	x     : x - share.startCursor.x,// (+) rigth / (-) left
		    	y     : y - share.startCursor.y,// (+) down  / (-) up
		    	right : x > share.startCursor.x,
		    	left  : x < share.startCursor.x,
		    	down  : y > share.startCursor.y,
		    	up    : y < share.startCursor.y
	    	},
	    	lastPosition : {
	    		x : x,
	    		y : y
	    	},
	    	deckPosition : {
	    		x : (_position.x + (x - share.startCursor.x)),
	    		y : (_position.y + (y - share.startCursor.y))
	    	}
	    }
	    
	    main.tipsMove({moveDeck : share.dragDeck, cursorMove : cursorMove});

	    //$('#' + drag_el.id).css({display: 'none'});
	    /*/var _dop = document.elementFromPoint(x, y)
	    if(_dop) {
	    	//console.log('DRAG:', _dop.id);
	    }/*/
	    /*/$('#' + drag_el.id).css({
	        left : ( (x|0) - (drag_el.cursor.x|0) + (drag_el.el.x|0) ) + 'px',
	        top  : ( (y|0) - (drag_el.cursor.y|0) + (drag_el.el.y|0) ) + 'px',
	        display: 'block'
	    });/*/
	}

// -------------------------------------------------------------------------------------------------------------

	var cend = function(target, x, y) {

	    if(!share.dragDeck || !share.startCursor) return;

    	var _deck = main.getElementById(share.dragDeck[0].card.parent);
    	var _position = _deck.padding(share.dragDeck[0].index);

	    var cursorMove = {
	    	distance     : Math.sqrt(Math.sqr(x - share.startCursor.x) + Math.sqr(y - share.startCursor.y)),
	    	direction    : {
		    	x     : x - share.startCursor.x,// (+) rigth / (-) left
		    	y     : y - share.startCursor.y,// (+) down  / (-) up
		    	right : x > share.startCursor.x,
		    	left  : x < share.startCursor.x,
		    	down  : y > share.startCursor.y,
		    	up    : y < share.startCursor.y
	    	},
	    	lastPosition : {
	    		x : x,
	    		y : y
	    	},
	    	deckPosition : {
	    		x : (_position.x + (x - share.startCursor.x)),
	    		y : (_position.y + (y - share.startCursor.y))
	    	}
	    }

	    $(target).hide();
	    var _dop = document.elementFromPoint(x, y);
	    $(target).show();
	    // if(_dop) {
    	main.Move(share.dragDeck, _dop, cursorMove);
	    // }

	    share.dragDeck = share.startCursor = null;

	}

// -------------------------------------------------------------------------------------------------------------

	document.onmousedown = function(e) {
		if(e.button != 0) return;
	    cdown(e.target, e.clientX, e.clientY)
	}
	document.onmousemove = function(e) {
	    cmove(e.clientX, e.clientY)
	}
	document.onmouseup = function(e) {
		// if(e.button != 0) return;
	    cend(e.target, e.clientX, e.clientY)
	}

	document.addEventListener('touchstart', function(e) {
	    // e.preventDefault()
	    cdown(e.target, e.touches[0].clientX, e.touches[0].clientY)
	}, false);
	document.addEventListener('touchmove', function(e) {
		if(share.startCursor) e.preventDefault();
	    cmove(e.touches[0].clientX, e.touches[0].clientY)
	}, false);
	document.addEventListener('touchend', function(e) {
	    // e.preventDefault()
	    cend(e.changedTouches[0].target, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	}, false);
};