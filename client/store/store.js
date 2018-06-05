import Vuex from 'vuex';

import defaultState from './state/state';
import actions from './actions/actions';
import getters from './getters/getters';
import mutations from './mutations/mutations';

export default () => {
    const store = new Vuex.Store({
        state: defaultState,
        actions,
        getters,
        mutations
    });

    if (module.hot) {
        module.hot.accept([
            './state/state',
            './mutations/mutations',
            './actions/actions',
            './getters/getters'
        ], () => {
            const newState = require('./state/state').default;
            const newMutations = require('./mutations/mutations').default;
            const newActions = require('./actions/actions').default;
            const newGetters = require('./getters/getters').default;

            store.hotUpdate({
                state: newState,
                mutations: newMutations,
                getters: newGetters,
                actions: newActions
            });
        });
    }

    return store;
}