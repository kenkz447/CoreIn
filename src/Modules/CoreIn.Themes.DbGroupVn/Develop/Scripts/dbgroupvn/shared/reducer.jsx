import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

//Reducers
import { googleMapReducer as googleMap } from './reducers/google-map'
import { reducer as appRouter } from './reducers/app-routes'

const localization = require('./reducers/localization').reducer;
const menu = require('./_layout/header/menu').reducer;
const layout = require('./_layout').reducer;
const connectedBasePage = require('./_layout/main/connected-base-page').reducer;

const reducer = combineReducers({
    layout,
    localization,
    menu,
    connectedBasePage,
    router,
    appRouter,
    googleMap
})

module.exports = reducer;