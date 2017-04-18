const $ = require('jquery');
const keys = require('./tc-keys.jsx');

const initState = {
    active: null,
    tabs: []
};

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) { 
        case keys.tabAdd:
            newState.tabs = newState.tabs.filter(tab => tab.id !== action.tab.id);
            newState.tabs.push(action.tab);
            newState.active = action.tab;
            break;
        case keys.tabRemove:
            newState.tabs = newState.tabs.filter(tab => tab.id !== action.tab.id);
            if (newState.tabs.length !== 0)
                newState.active = newState.tabs[0];
            break;
        case keys.tabChange:
            if (newState.active.id !== action.tab.id)
                newState.active = action.tab;
            break;
        default:
            return state;
    }
    return newState;
};

module.exports = reducer;