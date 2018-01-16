import share    from "../../../../common/share"   ;
import defaults from '../../../../common/defaults';

export default {

    "roller": (params, card, index, length, deck, data) => {
		// data: "open,group,padding"
		// flipRule: "topUnflip:open"

		let _data   =   data.split(',') ,
		    open    =  _data[0] | 0     , // open cards count
		    group   = (_data[1] | 0) > 0  // closed cards group count
		    	? _data[1] | 0
		    	: 1,
		    padding = _data[2] | 0;

		let correct = 0;

		if (
			index     >= length - open && // delimiter and after
			card.flip == false            // closed cards
		) {

			return {
				"x" : params.x + (defaults.card.width * share.get('zoom')) + padding + ((index - length + open - correct) * params.padding_x),
				"y" : params.y + (index - length + open) * params.padding_y
			}
		} else {                          // before delimiter

			if (index >= length - open) {
				correct += 1;
			}

			return {
				"x" : params.x + params.flip_padding_x * ((index / group) | 0),
				"y" : params.y + params.flip_padding_y * ((index / group) | 0)
			}
		} 

		return {
			"x" : params.x,
			"y" : params.y
		};
	}
};