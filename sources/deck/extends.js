import paddingTypes   from './paddingTypes'   ;

import actionsExtends from './actions/extends';

let Extends = [];

for (let actionName in actionsExtends) {

    if (actionsExtends[actionName].padding) {

        if (actionsExtends[actionName].padding && actionsExtends[actionName].padding.rules) {
            for(let key in actionsExtends[actionName].padding.rules) {

                if (paddingTypes[key]) {
                    console.warn(`Padding type ${key} exist in defaults rules list`);
                } else {
                    paddingTypes[key] = actionsExtends[actionName].padding.rules[key];
                }
            }
        }
    }

    if (typeof actionsExtends[actionName].padding.do == "function") {
        Extends.push({
            "type" : "padding",
            "from" : "action"                             ,
            "name" : actionName                           ,
            "do"   : actionsExtends[actionName].padding.do
        });
    }
}

let _pading = (deck, ...attrs) => {

    // console.log('extends:padding', deck.name, Object.keys(deck.actions), Extends);

    let _result = null;

    for (let i in Extends) {
        if (
            Extends[i].type == "padding"
        ) {
            
            if (
                                                  Extends[i].from  == "action" &&
                Object.keys(deck.actions).indexOf(Extends[i].name) >= 0
            ) {
                _result = Extends[i].do(deck, ...attrs);
            }
        }
    }

    return _result;
};

export default {
    "padding" : _pading
}