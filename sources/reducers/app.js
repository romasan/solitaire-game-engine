import {Map} from 'immutable';

import {create} from '../field';

export default function reducer(state, action) {
    switch (action.type) {
        case 'INIT_STATE':
            return action.data ? create(Map({}), action.data): Map({});
        default:
            return state;
    }
    return state;
}