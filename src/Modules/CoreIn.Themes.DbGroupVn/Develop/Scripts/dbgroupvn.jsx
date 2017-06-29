
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware, push } from 'react-router-redux'

import { default as LocalizationString } from './dbgroupvn/shared/_localization'
global.localizationString = new LocalizationString()

//Keys and action
import { actions as localizationAction } from './dbgroupvn/shared/reducers/localization'

//Components and middleware
import { history, Root } from './dbgroupvn/root'
import { updateLayoutMiddleware } from './dbgroupvn/shared/_layout'

import reducer from './dbgroupvn/shared/reducer'

$(document).ready(function () {


    const historyMiddleware = routerMiddleware(history)
    const store = createStore(reducer, applyMiddleware(historyMiddleware, updateLayoutMiddleware));

    $.ajax({
        url: "/DbGroupVn/GetSiteInitData",
        success: (response) => {

            global.localizationString.setLanguage(response.localization.currentLanguage)
            store.dispatch(localizationAction.init(response.localization))

            const { INIT_ROUTES } = require('./dbgroupvn/shared/reducers/app-routes')
            const routes = require('./dbgroupvn/routes').default
            
            //Routes
            store.dispatch({ type: INIT_ROUTES, routes })

            render(
                <Root store={ store } />,
                document.getElementById('root')
            );
        }
    });
});