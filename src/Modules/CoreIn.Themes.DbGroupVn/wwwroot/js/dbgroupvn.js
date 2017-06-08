(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const { render } = require('react-dom');
const { combineReducers, createStore, applyMiddleware } = require('redux');
const { routerReducer, routerMiddleware, push } = require('react-router-redux');
const { history, Root } = require('./dbgroupvn/Root');

const middleware = routerMiddleware(history)

const reducer = combineReducers({
    app: require('./dbgroupvn/shared/reducer'),
    router: routerReducer
});

const store = createStore(reducer, applyMiddleware(middleware));

render(
    React.createElement(Root, {store: store}),
    document.getElementById('root')
);

},{"./dbgroupvn/Root":2,"./dbgroupvn/shared/reducer":10,"react-dom":"Ld8xHf","react-router-redux":"dMW2Ug","redux":"czVV+t"}],2:[function(require,module,exports){
const { Route } = require('react-router');
const { Provider } = require('react-redux');
const { createBrowserHistory } = require('history');
const { ConnectedRouter } = require('react-router-redux');

const PropTypes = require('prop-types');

const history = createBrowserHistory();

// Pages:
const Layout = require('./shared/_layout');
const TrangChu = require('./trang-chu/index');
const GioiThieu = require('./gioi-thieu/index');

const Root = (props) => {
    return (
        React.createElement(Provider, {store: props.store}, 
            React.createElement(ConnectedRouter, {history: history}, 
                React.createElement(Layout, null, 
                    React.createElement(Route, {exact: true, path: "/", component: TrangChu}), 
                    React.createElement(Route, {path: "/gioi-thieu", component: GioiThieu})
                )
            )
        )
    );
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

module.exports = { Root, history };

},{"./gioi-thieu/index":3,"./shared/_layout":4,"./trang-chu/index":11,"history":"WUs/z/","prop-types":"PZOAv3","react-redux":"MzQWgz","react-router":"twxWLU","react-router-redux":"dMW2Ug"}],3:[function(require,module,exports){
module.exports = (props) => {
    return (
        React.createElement("div", null, "bbbbb")
    );
};

},{}],4:[function(require,module,exports){
const Header = require('./components/_header');

module.exports = (props) => {
    const { children } = props;
    return (
        React.createElement("div", {className: "layout"}, 
            React.createElement(Header, null), 
            React.createElement("div", {className: "main"}, 
                children
            )
        )
        );
}

},{"./components/_header":5}],5:[function(require,module,exports){
const { Container, Row, Col } = require('reactstrap');

const LanguageSelect = require('./_header/language-select');
const Search = require('./_header/search');
const Logo = require('./_header/logo');
const Menu = require('./_header/menu');

module.exports = (props) => {
    return (
        React.createElement("header", {className: "pt-4"}, 
            React.createElement(Container, null, 
                React.createElement(Row, null, 
                    React.createElement(Col, {md: "2"}, 
                        React.createElement(Logo, null)
                    ), 
                    React.createElement(Col, {md: "10"}, 
                        React.createElement(Row, null, 
                            React.createElement("div", {className: "w-100"}, 
                                React.createElement("div", {className: "float-right"}, 
                                    React.createElement("div", {className: "float-left language-select pr-3 mr-3"}, 
                                        React.createElement(LanguageSelect, null)
                                    ), 
                                    React.createElement("div", {className: "float-left"}, 
                                        React.createElement(Search, null)
                                    )
                                )
                            )
                        ), 
                        React.createElement(Row, {className: "menu-container"}, 
                            React.createElement("div", {className: "align-items-end d-flex"}, 
                                React.createElement(Menu, null)
                            )
                        )
                    )
                )
            )
        )
    );
}

},{"./_header/language-select":6,"./_header/logo":7,"./_header/menu":8,"./_header/search":9,"reactstrap":"jldOQ7"}],6:[function(require,module,exports){
const { Input } = require('reactstrap');

module.exports = (props) => {
    return (
        React.createElement(Input, {className: "text-uppercase border-0 p-0", type: "select"}, 
            React.createElement("option", {value: "en-US"}, "english"), 
            React.createElement("option", {value: "vi-vn"}, "vietnam")
        )
        );
}

},{"reactstrap":"jldOQ7"}],7:[function(require,module,exports){
module.exports = (props) => {
    return (
        React.createElement("div", {className: "logo"}, 
            React.createElement("img", {src: "/img/logo.png"})
        )
        );
}

},{}],8:[function(require,module,exports){

const { NavLink } = require('react-router-dom');

const menuData = [
    {
        title: "trang chủ",
        url: "/"
    },
    {
        title: "về chúng tôi",
        url: "/ve-chung-toi"
    },
    {
        title: "công trình",
        url: "#"
    },
    {
        title: "dự án",
        url: "#"
    },
    {
        title: "bộ sưu tập",
        url: "#"
    },
    {
        title: "thư viện",
        url: "#"
    },
    {
        title: "hỏi đáp",
        url: "#"
    },
    {
        title: "liên hệ",
        url: "#"
    },
];

class Menu extends React.Component {
    render() {
        return (
            React.createElement("ul", {className: "menu text-uppercase pl-0 mb-0"}, 
                
                    menuData.map((menuItem, index) => {
                        return (
                            React.createElement("li", {key: index, className: "menu-item d-inline-block"}, 
                                React.createElement(NavLink, {to: menuItem.url, activeClassName: "current"}, 
                                    React.createElement("span", null, menuItem.title)
                                )
                            ))
                    })
                
            )
        );
    }
}

module.exports = Menu;

},{"react-router-dom":"O/XT3x"}],9:[function(require,module,exports){
const { Button } = require('reactstrap');

module.exports = (props) => {
    return (
        React.createElement("div", null, 
            React.createElement(Button, {color: "link", className: "btn-search text-uppercase pl-0 pr-0 border-0"}, 
                React.createElement("i", {className: "fa fa-search mr-2", "aria-hidden": "true"}), " search"
            )
        )
        )
}

},{"reactstrap":"jldOQ7"}],10:[function(require,module,exports){
module.exports = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

},{}],11:[function(require,module,exports){
module.exports = (props) => {
    return (
        React.createElement("div", null, "aaaaa")
    );
};

},{}]},{},[1])

//# sourceMappingURL=dbgroupvn.js.map
