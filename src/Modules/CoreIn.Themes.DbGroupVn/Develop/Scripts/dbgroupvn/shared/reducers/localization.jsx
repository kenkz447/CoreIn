const $ = require('jquery');

const keys = {
    init: "INIT",
    swithLanguage: "SWITH_LANGUAGE",
}

const actions = {
    swithLanguage: (language) => ({
        type: keys.swithLanguage,
        language
    }),

    //initState:
    // - languages
    // - currentLanguage
    init: (initState) => ({
        type: keys.init,
        initState
    })
}

const reducer = (state = {}, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.init:
            return action.initState;
        case keys.swithLanguage:
            newState.currentLanguage = actions.language;
            break;
        default:
            return state;
    }
    return newState;
}

module.exports = {
    actions,
    reducer
}