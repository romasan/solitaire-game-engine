'use strict';

import paddingTypes   from './paddingTypes'   ;
import actionsExtends from './actions/extends';

let Extends = [];

for (let actionName in actionsExtends) {

    if (actionsExtends[actionName].padding) {

        if (typeof actionsExtends[actionName].padding.do == "function") {
            Extends.push({
                "type" : "padding"                            ,
                "from" : "action"                             ,
                "name" : actionName                           ,
                "do"   : actionsExtends[actionName].padding.do
            });
        }
    
        if (typeof actionsExtends[actionName].padding.rules != "undefined") {
            for (let ruleName in actionsExtends[actionName].padding.rules) {
                paddingTypes._add(ruleName, actionsExtends[actionName].padding.rules[ruleName]);
            }
        }
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