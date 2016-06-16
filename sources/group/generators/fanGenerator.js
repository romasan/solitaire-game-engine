'use strict';

import defaults from 'defaults';

export default function(e) {//{count, radus, center}

	this.placement = {
        x : 0, 
        y : 0
    };

	console.log('FAN GENERATOR', e);
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
    var _angle = _step / 2 + 270;
    var _deg = Math.PI / 180;
    for(var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
        var _a = Math.sin(_angle * _deg) * _radius;
        var _b = Math.cos(_angle * _deg) * _radius;
        if(_angle > 360) _angle -= 360;
        // console.log("lunaDeck_" + i, _angle);
        _decks.push({
            "name"     : this.name + "_deck" + deckIndex,
            "rotate"   : _angle,
            "position" : {
                "x" : _center.x + _a - defaults.card.width  / 2,
                "y" : _center.y - _b - defaults.card.height / 2
            }
        });
        _angle += _step;
    }

    return _decks;
};