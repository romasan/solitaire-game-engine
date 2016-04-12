'use strict';

import defaults from "defaults";

export default {
	"count" : function(e) {
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
	},

	"fan" : function(e) {

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
		        	"x" : (radius / 2),
		        	"y" : (radius / 2)
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
	}
};