import rules from './paddingTypes';

let rollerPaddingExtend = (deck, padding, paddingMethod, index) => {

    if (!deck.hasTag('ignore_visibility')) {
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
        deck.cards[index].visible   == false &&
                 firstOpenCardIndex >= 0     &&
        index >= firstOpenCardIndex
    ) {
        return paddingMethod(firstOpenCardIndex);
    }

    return padding;
}

export default {
    "do"    : rollerPaddingExtend,
    "rules" : rules
};