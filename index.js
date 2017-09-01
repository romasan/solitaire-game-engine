import {Map} from 'immutable';

import Field from '../field';

export default function(state = Map({}), action) {
    switch (action.type) {
        case 'INIT_STATE':
            return action.data ? Field.create(Map({}), action.data): Map({});
        default:
            return state;
    }
    return state;
}