'use strict';

import defaults from "defaults";

export default {
	"count" : function(e) {
		
		// console.log('COUNT GENERATOR', e);
		
		var _count = e.count;
		var _decks = [];
		for(var deckNum	= 0; deckNum < _count; deckNum += 1) {
			
			var _deckName = this.name + "_deck" + (deckNum + 1);

			// console.log('DECKGENERATOR:BY_COUNT', _deckName, this);
			
			_decks.push({
				name : _deckName
			});
		}
		return _decks;
	},

	"map" : function(e) {
		
		// TODO
		console.log('MAP GENERATOR', e);
		
		var _decks = [];
		
		var _default_placement = {
			x : 0,
			y : 0
		};

		var _placement = 
			this.placement
				? {
					x : typeof this.placement.x != "undefined" ? this.placement.x : _default_placement.x,
					y : typeof this.placement.y != "undefined" ? this.placement.y : _default_placement.y
				}
				: _default_placement;

		this.placement = {x:0, y:0};

		var _index = 1;
		
		for(var y in e.map) {
			for(var x in e.map[y]) {
				if(e.map[y][x]) {
					_decks.push({
						"name"     : e.map[y][x],//this.name + "_deck" + _index,
						"position" : {
							"x" : x * ((defaults.card.width|0)  + (_placement.x|0)),
							"y" : y * ((defaults.card.height|0) + (_placement.y|0))
						},
					});
					_index += 1;
				}
			}
		}

		return _decks;
	},

	"fan" : function(e) {//{count, radus, center}

		this.placement = {x:0, y:0};

		// console.log('FAN GENERATOR', e);
        // SolitaireEngine.ready(function(SE) {
        //              b
        //       C  ..`:   A = sin(b) * C
        //     ...``   :B  B = cos(b) * C
        // a.``.......+:
        //        A     y 90deg
        var _decks = [];

        var _count = typeof e.count == "number" ? e.count : 3;//16
        var _step = 180 / _count;
        var _radius = typeof e.radius == "number" ? e.radius : 100;//405;
        var _center = 
        	typeof e.center   != "undefined"
         && typeof e.center.x != "undefined"
         && typeof e.center.y != "undefined"
        		? e.center 
        		: {
		        	"x" : 0,
		        	"y" : 0
		        };
        // x : 450 + 15,
        // y : 450 + 20
        var _angle = _step / 2 + 270;
        var _deg = Math.PI / 180;
        for(var deckNum = 0; deckNum < _count; deckNum += 1) {
            var _a = Math.sin(_angle * _deg) * _radius;
            var _b = Math.cos(_angle * _deg) * _radius;
            if(_angle > 360) _angle -= 360;
            // console.log("lunaDeck_" + i, _angle);
            _decks.push({
                "name"     : this.name + "_deck" + deckNum,
                "rotate"   : _angle,
                "position" : {
                    "x" : _center.x + _a - defaults.card.width  / 2,
                    "y" : _center.y - _b - defaults.card.height / 2
                }
            });
            _angle += _step;
        }

        return _decks;
	}
};