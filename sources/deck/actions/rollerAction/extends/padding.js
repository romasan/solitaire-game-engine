import rules from './paddingTypes'          ;
import event from '../../../../common/event';

let rollerPaddingExtend = (deck, padding, paddingMethod, index) => {

    if ( !deck.hasTag('ignore_visibility') ) {
        return padding;
    }
    
    let firstOpenCardIndex = -1;
    
    const cards = deck.getCards({});
    
    for (let i in cards) {
        if (
            firstOpenCardIndex < 0 &&
            cards[i].flip == false
        ) {
            firstOpenCardIndex = i;
        }
    }
    
    // console.log('rollerPaddingExtend', deck.name, index, firstOpenCardIndex);

    if (
        cards[index].visible == false    &&
                 firstOpenCardIndex >= 0 &&
        index >= firstOpenCardIndex
    ) {

        let _padding = paddingMethod(firstOpenCardIndex);

        // TODO
        console.log('rollerPaddingExtend', deck.hasTag('ignore_visibility'), index, cards[index].name, firstOpenCardIndex, _padding, cards[firstOpenCardIndex].name);
        // event.dispatch('solitaire_log');

        return _padding;
    }

    return padding;
}

export default {
    "do"    : rollerPaddingExtend,
    "rules" : rules
};