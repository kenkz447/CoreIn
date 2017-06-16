const { render } = require('react-dom');
const { createStore, applyMiddleware } = require('redux');
const { routerMiddleware, push } = require('react-router-redux');

const { history, Root } = require('./dbgroupvn/root.jsx');
const updateLayout = require('./dbgroupvn/shared/_layout').updateLayout;

const reducer = require('./dbgroupvn/shared/reducer');
const middleware = routerMiddleware(history)

const store = createStore(reducer, applyMiddleware(middleware, updateLayout));

const initLocalization = require('./dbgroupvn/shared/reducers/localization').actions.init;
const initMenu = require('./dbgroupvn/shared/_layout/header/menu').actions.init;

import { INIT_ROUTES } from './dbgroupvn/routes';

global.localizationString = require('./dbgroupvn/shared/_localization');

$(document).ready(function () {
    $.ajax({
        url: "/DbGroupVn/GetSiteInitData",
        success: (response) => {

            store.dispatch(initLocalization(response.localization))
            global.localizationString.setLanguage(response.localization.currentLanguage)

            //Routes
            store.dispatch({type: INIT_ROUTES})

            //Khởi tạo giá trị mặc định cho components     
            store.dispatch(initMenu(response.menu))

            render(
                <Root store={store} />,
                document.getElementById('root')
            );
        }
    });
});

function onElementHeightChange(elm, callback) {
    var lastHeight = elm.clientHeight, newHeight;
    (function run() {
        newHeight = elm.clientHeight;
        if (lastHeight != newHeight)
            callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer)
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

//Nếu height của body thay đổi thì refresh AOS
onElementHeightChange(document.body, function () {
    AOS.refresh();
});