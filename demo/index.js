'use strict';

class History {

	constructor() {
		this._hist = [];
		this._redo = [];
		this.draw();
	}

	add(e) {
		this._redo = [];
		this._hist.push(e);
		this.draw();
	}

	undo() {
		let e = this._hist.pop();
		if(e) this._redo.push(e);
		this.draw();
		return e;
	}

	redo() {
		let e = this._redo.pop();
		if(e) this._hist.push(e);
		this.draw();
		return e;	
	}

	clear() {
		this._hist = [];
		this._redo = [];
		this.draw();
	}

	revertToStep(callback) {
		let data = null;
		data = this.redo();
		while(!callback(data) && data) {
			data = this.redo();
		}
		if(!data) {
			console.log('revert impossible');
		}
	}

	draw() {
		document.getElementById('steps').innerHTML = this._hist.length;
	}
};

document.addEventListener("DOMContentLoaded", e => {

	let history = new History();
	
	let showTips = true;

	let gameStructure = {"id":"2","fill":"c1|h9,d6|d10,s5,d3|s1,s4,hj,cq|dq,s7,c6,c4,sq|hk,d2,h1,s8,s6,d8|d1,h6,h10,h3,c10,d7,h4|dj,c8,ck,c3,h2,sj,c5,h5,dk,s2,d9,hq,c2,h7,s10,sk,c9,d5,cj,d4,h8,c7,s9,s3"};

	SolitaireEngine.event.listen('makeStep', function(data) {
		history.add(data);
	});

	SolitaireEngine.event.listen('win', function(data) {
		alert('WIN!');
	});

	var xhr = new XMLHttpRequest();
	xhr.open('GET', './games/kosynkaGame.json', true);
	xhr.send();
	xhr.onload = e => {
	
		let gameConfig = JSON.parse(xhr.responseText);
	
		let _gameStructure = gameStructure.fill.split('|');
		gameConfig.showTips = showTips;
		
		gameConfig.groups.group_row.fill = _gameStructure.slice(0, 7).map(function(e) {return e.split(',');});
		gameConfig.decks[0].fill = _gameStructure.slice(7)[0].split(',');
			
		SolitaireEngine.init(gameConfig);
	}
	
	document.getElementById('b_undo').onclick = e => {
		let data = history.undo();
		SolitaireEngine.event.dispatch('undo', data);
	};

	document.getElementById('b_redo').onclick = e => {
		let data = history.redo();
		SolitaireEngine.event.dispatch('redo', data);
	};

	document.getElementById('b_hints').onclick = e => {
		showTips = !showTips;
		SolitaireEngine.event.dispatch('tips:' + (showTips ? 'on' : 'off'));
	};

	document.getElementById('b_mark').onclick = e => {
		SolitaireEngine.event.dispatch('toggleMarkerMode');
	}

	document.getElementById('b_auto').onclick = e => {
		SolitaireEngine.event.dispatch('autoStepToHome');
	}
});