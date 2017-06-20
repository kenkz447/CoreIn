(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _routes = require('./dbgroupvn/routes');

var _require = require('react-dom'),
    render = _require.render;

var _require2 = require('redux'),
    createStore = _require2.createStore,
    applyMiddleware = _require2.applyMiddleware;

var _require3 = require('react-router-redux'),
    routerMiddleware = _require3.routerMiddleware,
    push = _require3.push;

var _require4 = require('./dbgroupvn/root.jsx'),
    history = _require4.history,
    Root = _require4.Root;

var updateLayout = require('./dbgroupvn/shared/_layout').updateLayout;

var reducer = require('./dbgroupvn/shared/reducer');
var middleware = routerMiddleware(history);

var store = createStore(reducer, applyMiddleware(middleware, updateLayout));

var initLocalization = require('./dbgroupvn/shared/reducers/localization').actions.init;
var initMenu = require('./dbgroupvn/shared/_layout/header/menu').actions.init;

global.localizationString = require('./dbgroupvn/shared/_localization');

$(document).ready(function () {
    $.ajax({
        url: "/DbGroupVn/GetSiteInitData",
        success: function success(response) {

            store.dispatch(initLocalization(response.localization));
            global.localizationString.setLanguage(response.localization.currentLanguage

            //Routes
            );store.dispatch({ type: _routes.INIT_ROUTES }

            //Khởi tạo giá trị mặc định cho components     
            );store.dispatch(initMenu(response.menu));

            render(React.createElement(Root, { store: store }), document.getElementById('root'));
        }
    });
});

function onElementHeightChange(elm, callback) {
    var lastHeight = elm.clientHeight,
        newHeight;
    (function run() {
        newHeight = elm.clientHeight;
        if (lastHeight != newHeight) callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer) clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

//Nếu height của body thay đổi thì refresh AOS
onElementHeightChange(document.body, function () {
    AOS.refresh();
});

global.__DEV__ = true;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./dbgroupvn/root.jsx":16,"./dbgroupvn/routes":17,"./dbgroupvn/shared/_layout":18,"./dbgroupvn/shared/_layout/header/menu":27,"./dbgroupvn/shared/_localization":33,"./dbgroupvn/shared/reducer":60,"./dbgroupvn/shared/reducers/localization":62,"react-dom":"react-dom","react-router-redux":"react-router-redux","redux":"redux"}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactstrap = require('reactstrap');

var _basePage = require('../shared/_layout/main/base-page');

var _basePage2 = _interopRequireDefault(_basePage);

var _routes = require('../routes');

var _components = require('../shared/components');

var _components2 = _interopRequireDefault(_components);

var _ultilities = require('../shared/ultilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var PageComponent = function (_React$Component) {
    _inherits(PageComponent, _React$Component);

    function PageComponent() {
        _classCallCheck(this, PageComponent);

        var _this = _possibleConstructorReturn(this, (PageComponent.__proto__ || Object.getPrototypeOf(PageComponent)).call(this));

        _this.renderSidebar = _this.renderSidebar.bind(_this);
        _this.fetchData = _this.fetchData.bind(_this);
        return _this;
    }

    _createClass(PageComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                onError = _props.onError,
                onDataFetch = _props.onDataFetch,
                refreshRoutePath = _props.refreshRoutePath,
                categories = _props.categories,
                page = _props.page,
                items = _props.items,
                currentCategory = _props.currentCategory;


            if (!page) $.get('/page/getsingle?entityName=bo-suu-tap', function (response) {
                onDataFetch({ page: response.details }, 50);
            });
            if (!categories) $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: 30003 }, function (response) {
                onDataFetch({ categories: response }, 50);
            });

            if (!items) this.fetchData(currentCategory);

            refreshRoutePath('bo-suu-tap');
        }
    }, {
        key: 'fetchData',
        value: function fetchData(currentCategory) {
            var onDataFetch = this.props.onDataFetch;


            (0, _ultilities.dataRequest)('/collection/gettabledata', 9, 1, null, null, currentCategory && { 30003: currentCategory.id }, null, function (response) {
                onDataFetch({ items: response }, 0);
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var currentCategory = this.props.currentCategory;

            if (currentCategory && nextProps.currentCategory && currentCategory.id != nextProps.currentCategory.id) this.fetchData(nextProps.currentCategory);
        }
    }, {
        key: 'renderSidebar',
        value: function renderSidebar() {
            var _props2 = this.props,
                categories = _props2.categories,
                onDataFetch = _props2.onDataFetch,
                currentCategory = _props2.currentCategory;


            return React.createElement(
                _components.Sidebar,
                null,
                categories && React.createElement(_components.CategoryMenu, { currentCategory: currentCategory, categories: categories, onDataFetch: onDataFetch })
            );
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.props.dataFetchProgress != 100) return null;

            var _props3 = this.props,
                thumbnail = _props3.page.thumbnail,
                categories = _props3.categories,
                items = _props3.items,
                currentCategory = _props3.currentCategory;


            return React.createElement(
                _reactstrap.Container,
                { id: 'bo-suu-tap' },
                React.createElement(
                    _reactstrap.Row,
                    null,
                    React.createElement(
                        _reactstrap.Col,
                        { lg: '3' },
                        this.renderSidebar()
                    ),
                    React.createElement(
                        _reactstrap.Col,
                        { xs: '12', lg: '9' },
                        React.createElement(_components.Image, thumbnail),
                        React.createElement(
                            'div',
                            { className: 'page-titles mt-4 mb-3' },
                            React.createElement(
                                'span',
                                { className: 'page-title' },
                                localizationString.getString("Bộ sưu tập")
                            ),
                            React.createElement(
                                'span',
                                null,
                                '|'
                            ),
                            React.createElement(
                                'span',
                                { className: 'page-title' },
                                currentCategory ? currentCategory.title : localizationString.getString("Tất cả")
                            )
                        ),
                        React.createElement(
                            _reactstrap.Row,
                            null,
                            items.length && items.map(function (item, index) {
                                return React.createElement(
                                    _reactstrap.Col,
                                    { key: item.id, xs: '6', lg: '4', className: 'page-item' },
                                    React.createElement(_components2.default, { data: item, extraText: item.area, basePath: './bo-suu-tap' })
                                );
                            })
                        )
                    )
                )
            );
        }
    }]);

    return PageComponent;
}(React.Component);

var stateToProps = function stateToProps(state) {
    return {};
};

var dispathToProps = function dispathToProps(dispath) {
    return bindActionCreators({ refreshRoutePath: _routes.refreshRoutePath }, dispath);
};

var ConnectedPageComponent = connect(stateToProps, dispathToProps)(PageComponent);

module.exports = (0, _basePage2.default)({ page: 'bo-suu-tap', showBreadcrumbs: true })(ConnectedPageComponent);

},{"../routes":17,"../shared/_layout/main/base-page":29,"../shared/components":35,"../shared/ultilities":63,"react-redux":"react-redux","reactstrap":"reactstrap","redux":"redux"}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-router-dom'),
    Link = _require.Link;

var PageItem = function (_React$Component) {
    _inherits(PageItem, _React$Component);

    function PageItem(props) {
        _classCallCheck(this, PageItem);

        var _this = _possibleConstructorReturn(this, (PageItem.__proto__ || Object.getPrototypeOf(PageItem)).call(this, props));

        _this.renderLink = _this.renderLink.bind(_this);
        return _this;
    }

    _createClass(PageItem, [{
        key: "renderLink",
        value: function renderLink(title) {
            return React.createElement(
                Link,
                { to: "/cong-trinh" },
                React.createElement(
                    "span",
                    null,
                    title
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _props$data = this.props.data,
                thumbnailUrl = _props$data.thumbnailUrl,
                title = _props$data.title,
                acreage = _props$data.acreage;


            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "page-item-thumbnail" },
                    React.createElement("img", { className: "w-100", src: "/" + thumbnailUrl }),
                    React.createElement("div", { className: "overlay" }),
                    this.renderLink(localizationString.getString("Chi tiết"))
                ),
                React.createElement(
                    "div",
                    { className: "page-item-title" },
                    this.renderLink(title),
                    React.createElement(
                        "span",
                        { className: "extra" },
                        acreage
                    )
                )
            );
        }
    }]);

    return PageItem;
}(React.Component);

module.exports = PageItem;

},{"react-router-dom":"react-router-dom"}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactstrap = require('reactstrap');

var _basePage = require('../shared/_layout/main/base-page');

var _basePage2 = _interopRequireDefault(_basePage);

var _routes = require('../routes');

var _components = require('../shared/components');

var _ultilities = require('../shared/ultilities');

var _pageItem = require('./components/page-item');

var _pageItem2 = _interopRequireDefault(_pageItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var PageComponent = function (_React$Component) {
    _inherits(PageComponent, _React$Component);

    function PageComponent() {
        _classCallCheck(this, PageComponent);

        var _this = _possibleConstructorReturn(this, (PageComponent.__proto__ || Object.getPrototypeOf(PageComponent)).call(this));

        _this.renderSidebar = _this.renderSidebar.bind(_this);
        _this.fetchData = _this.fetchData.bind(_this);
        return _this;
    }

    _createClass(PageComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                onError = _props.onError,
                onDataFetch = _props.onDataFetch,
                refreshRoutePath = _props.refreshRoutePath,
                categories = _props.categories,
                page = _props.page,
                items = _props.items,
                currentCategory = _props.currentCategory;


            if (!page) $.get('/page/getsingle?entityName=cong-trinh', function (response) {
                onDataFetch({ page: response.details }, 50);
            });
            if (!categories) $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: 10003 }, function (response) {
                onDataFetch({ categories: response }, 50);
            });

            if (!items) this.fetchData(currentCategory);

            refreshRoutePath('cong-trinh');
        }
    }, {
        key: 'fetchData',
        value: function fetchData(currentCategory) {
            var onDataFetch = this.props.onDataFetch;


            (0, _ultilities.dataRequest)('/construction/gettabledata', 9, 1, null, null, currentCategory && { 10003: currentCategory.id }, null, function (response) {
                onDataFetch({ items: response }, 0);
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var currentCategory = this.props.currentCategory;

            if (currentCategory && nextProps.currentCategory && currentCategory.id != nextProps.currentCategory.id) this.fetchData(nextProps.currentCategory);
        }
    }, {
        key: 'renderSidebar',
        value: function renderSidebar() {
            var _props2 = this.props,
                categories = _props2.categories,
                onDataFetch = _props2.onDataFetch,
                currentCategory = _props2.currentCategory;


            return React.createElement(
                _components.Sidebar,
                null,
                categories && React.createElement(_components.CategoryMenu, { currentCategory: currentCategory, categories: categories, onDataFetch: onDataFetch })
            );
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.props.dataFetchProgress != 100) return null;

            var _props3 = this.props,
                thumbnail = _props3.page.thumbnail,
                categories = _props3.categories,
                items = _props3.items,
                currentCategory = _props3.currentCategory;


            return React.createElement(
                _reactstrap.Container,
                { id: 'construction' },
                React.createElement(
                    _reactstrap.Row,
                    null,
                    React.createElement(
                        _reactstrap.Col,
                        { lg: '3' },
                        this.renderSidebar()
                    ),
                    React.createElement(
                        _reactstrap.Col,
                        { xs: '12', lg: '9' },
                        React.createElement(_components.Image, thumbnail),
                        React.createElement(
                            'div',
                            { className: 'page-titles mt-4 mb-3' },
                            React.createElement(
                                'span',
                                { className: 'page-title' },
                                localizationString.getString("Bộ sưu tập")
                            ),
                            React.createElement(
                                'span',
                                null,
                                '|'
                            ),
                            React.createElement(
                                'span',
                                { className: 'page-title' },
                                currentCategory ? currentCategory.title : localizationString.getString("Tất cả")
                            )
                        ),
                        React.createElement(
                            _reactstrap.Row,
                            null,
                            items.length && items.map(function (item, index) {
                                return React.createElement(
                                    _reactstrap.Col,
                                    { key: item.id, xs: '6', lg: '4', className: 'page-item' },
                                    React.createElement(_pageItem2.default, { data: item })
                                );
                            })
                        )
                    )
                )
            );
        }
    }]);

    return PageComponent;
}(React.Component);

var stateToProps = function stateToProps(state) {
    return {};
};

var dispathToProps = function dispathToProps(dispath) {
    return bindActionCreators({ refreshRoutePath: _routes.refreshRoutePath }, dispath);
};

var ConnectedPageComponent = connect(stateToProps, dispathToProps)(PageComponent);

module.exports = (0, _basePage2.default)({ page: 'cong-trinh', showBreadcrumbs: true })(ConnectedPageComponent);

},{"../routes":17,"../shared/_layout/main/base-page":29,"../shared/components":35,"../shared/ultilities":63,"./components/page-item":3,"react-redux":"react-redux","reactstrap":"reactstrap","redux":"redux"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _components = require('../../shared/components');

var _reactstrap = require('reactstrap');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _renderItems = require('../helper/render-items');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pageConfigures = require('../page-configure.js');

var getCurrentCategory = require('../helper/get-current-category.js');

var BigMap = function (_Component) {
    _inherits(BigMap, _Component);

    function BigMap(props) {
        _classCallCheck(this, BigMap);

        var _this = _possibleConstructorReturn(this, (BigMap.__proto__ || Object.getPrototypeOf(BigMap)).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(BigMap, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                searchArea = _props.searchArea,
                searchCity = _props.searchCity,
                fecthData = _props.fecthData,
                categories = _props.categories,
                match = _props.match;

            var currentCategory = getCurrentCategory(match, categories);
            fecthData(currentCategory, searchArea, searchCity);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (JSON.stringify(this.props) != JSON.stringify(nextProps)) {
                var match = nextProps.match,
                    categories = nextProps.categories,
                    searchArea = nextProps.searchArea,
                    searchCity = nextProps.searchCity,
                    fecthData = nextProps.fecthData;

                var currentCategory = getCurrentCategory(match, categories);
                fecthData(currentCategory, searchArea, searchCity);
            }
        }
    }, {
        key: 'renderMarkerContent',
        value: function renderMarkerContent(marker) {
            return _react2.default.createElement(
                'div',
                { className: 'marker-tooltip' },
                _react2.default.createElement(
                    'div',
                    { className: 'marker-thumbnail mb-3' },
                    _react2.default.createElement('img', { className: 'w-100 h-100', src: marker.thumbnailUrl })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'marker-info mb-2' },
                    _react2.default.createElement(
                        'label',
                        { className: 'marker-label' },
                        marker.title || 'Missing Title'
                    ),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(
                        'a',
                        { className: (0, _classnames2.default)('map-marker-hint__ap-link') },
                        localizationString.getString("Click to view more info")
                    )
                )
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var $bigMap = $('#big-map');
            var $parentBigMap = $bigMap.parent();
            var bigMapHeight = $parentBigMap.innerHeight();
            $bigMap.find('.g-map').css('height', bigMapHeight + 'px');
        }
    }, {
        key: 'setStateRandomProject',
        value: function setStateRandomProject(randomItems) {
            var getItemsWithPath = this.props.getItemsWithPath;

            var itemWithPath = getItemsWithPath(randomItems);
            this.setState({ randomItems: itemWithPath });
        }

        //request 9 dự án ngẫu nhiên

    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            $.ajax({
                url: '/project/getrandomEntity',
                data: { count: 9 },
                success: this.setStateRandomProject.bind(this)
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                match = _props2.match,
                pageCoverImage = _props2.pageCoverImage,
                currentCategory = _props2.currentCategory,
                onItemHover = _props2.onItemHover,
                items = _props2.items;

            return _react2.default.createElement(
                'div',
                { id: 'big-map', className: 'big-map-container' },
                _react2.default.createElement(
                    'div',
                    { className: 'g-map big-g-map' },
                    _react2.default.createElement(_components.GoogleMap, _extends({}, this.props.map, { renderMarkerContent: this.renderMarkerContent }))
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'page-titles mt-4 mb-3' },
                    _react2.default.createElement(
                        'span',
                        { className: 'page-title' },
                        localizationString.getString("Dự án")
                    ),
                    _react2.default.createElement(
                        'span',
                        null,
                        '|'
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'page-title' },
                        localizationString.getString("Công trình khác")
                    )
                ),
                _react2.default.createElement(_components.Pagination, { items: this.state.randomItems, itemWrapperClassName: 'page-item', itemPerPage: 3, renderItem: _renderItems.renderItem })
            );
        }
    }]);

    return BigMap;
}(_react.Component);

var bigMapId = pageConfigures.bigMapId;

var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
        map: state.googleMap[bigMapId]
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(BigMap);

},{"../../shared/components":35,"../helper/get-current-category.js":10,"../helper/render-items":11,"../page-configure.js":13,"classnames":"classnames","react":"react","react-redux":"react-redux","reactstrap":"reactstrap"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

var _components = require('../../shared/components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DuAnCategory = function (_Component) {
    _inherits(DuAnCategory, _Component);

    function DuAnCategory(props) {
        _classCallCheck(this, DuAnCategory);

        var _this = _possibleConstructorReturn(this, (DuAnCategory.__proto__ || Object.getPrototypeOf(DuAnCategory)).call(this, props));

        _this.getCurrentCategory = _this.getCurrentCategory.bind(_this);
        return _this;
    }

    _createClass(DuAnCategory, [{
        key: 'getCurrentCategory',
        value: function getCurrentCategory(match) {
            match = match || this.props.match;
            var categories = this.props.categories;


            var currentCategory = categories.filter(function (categoryItem) {
                return categoryItem.name === match.params.category;
            })[0];
            return currentCategory;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                searchArea = _props.searchArea,
                searchCity = _props.searchCity,
                fecthData = _props.fecthData;

            var category = this.getCurrentCategory();
            fecthData(category, searchArea, searchCity);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (JSON.stringify(this.props) != JSON.stringify(nextProps)) this.props.fecthData(this.getCurrentCategory(nextProps.match), nextProps.searchArea, nextProps.searchCity);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                match = _props2.match,
                pageCoverImage = _props2.pageCoverImage,
                currentCategory = _props2.currentCategory,
                basePath = _props2.basePath,
                onItemHover = _props2.onItemHover,
                items = _props2.items;

            return _react2.default.createElement(
                _reactstrap.Container,
                null,
                _react2.default.createElement(_components.Image, pageCoverImage),
                _react2.default.createElement(
                    'div',
                    { className: 'page-titles mt-4 mb-3' },
                    _react2.default.createElement(
                        'span',
                        { className: 'page-title' },
                        localizationString.getString("Bộ sưu tập")
                    ),
                    _react2.default.createElement(
                        'span',
                        null,
                        '|'
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'page-title' },
                        currentCategory ? currentCategory.title : localizationString.getString("Tất cả")
                    )
                ),
                _react2.default.createElement(
                    _reactstrap.Row,
                    null,
                    items.map(function (item, index) {
                        return _react2.default.createElement(
                            _reactstrap.Col,
                            { key: item.id, xs: '6', lg: '4', className: 'page-item',
                                onMouseEnter: function onMouseEnter() {
                                    onItemHover(true, item);
                                },
                                onMouseLeave: function onMouseLeave() {
                                    onItemHover(false, item);
                                }
                            },
                            _react2.default.createElement(_components.PageItem, { data: item, extraText: item.area, path: '/' + basePath + '/' + items.name })
                        );
                    })
                )
            );
        }
    }]);

    return DuAnCategory;
}(_react.Component);

exports.default = DuAnCategory;

},{"../../shared/components":35,"react":"react","reactstrap":"reactstrap"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

var _components = require('../../shared/components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AreaSearch = function (_Component) {
    _inherits(AreaSearch, _Component);

    function AreaSearch(props) {
        _classCallCheck(this, AreaSearch);

        var _this = _possibleConstructorReturn(this, (AreaSearch.__proto__ || Object.getPrototypeOf(AreaSearch)).call(this, props));

        _this.ranges = [{ form: 1, to: 3 }, { form: 4, to: 6 }, { form: 7, to: 9 }];
        return _this;
    }

    _createClass(AreaSearch, [{
        key: 'render',
        value: function render() {
            var onSearch = this.props.onSearch;

            return _react2.default.createElement(
                _components.SidebarWidget,
                { className: 'custom-controls-stacked', title: localizationString.getString("Diện tích") },
                _react2.default.createElement(
                    'label',
                    { className: 'custom-control custom-radio' },
                    _react2.default.createElement('input', { id: 'radioStacked1', name: 'radio-stacked', type: 'radio', className: 'custom-control-input', onChange: function onChange() {
                            onSearch(-1, -1);
                        } }),
                    _react2.default.createElement('span', { className: 'custom-control-indicator' }),
                    _react2.default.createElement(
                        'span',
                        { className: 'custom-control-description' },
                        '' + localizationString.getString('Mọi diện tích')
                    )
                ),
                this.ranges.map(function (_ref, index) {
                    var form = _ref.form,
                        to = _ref.to;
                    return _react2.default.createElement(
                        'label',
                        { key: index, className: 'custom-control custom-radio' },
                        _react2.default.createElement('input', { id: 'radioStacked1', name: 'radio-stacked', type: 'radio', className: 'custom-control-input', 'data-from': form, 'data-to': to, onChange: function onChange() {
                                onSearch(form, to);
                            } }),
                        _react2.default.createElement('span', { className: 'custom-control-indicator' }),
                        _react2.default.createElement(
                            'span',
                            { className: 'custom-control-description' },
                            localizationString.getString('từ') + ' ' + form + ' ' + localizationString.getString('đến') + ' ' + to
                        )
                    );
                })
            );
        }
    }]);

    return AreaSearch;
}(_react.Component);

exports.default = AreaSearch;

},{"../../shared/components":35,"react":"react","reactstrap":"reactstrap"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _reactstrap = require('reactstrap');

var _components = require('../../shared/components');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pageConfigures = require('../page-configure.js');

var SearchCity = function (_Component) {
    _inherits(SearchCity, _Component);

    function SearchCity() {
        _classCallCheck(this, SearchCity);

        return _possibleConstructorReturn(this, (SearchCity.__proto__ || Object.getPrototypeOf(SearchCity)).apply(this, arguments));
    }

    _createClass(SearchCity, [{
        key: 'renderMarkerContent',
        value: function renderMarkerContent(marker) {
            return _react2.default.createElement(
                'div',
                { className: 'marker-info' },
                _react2.default.createElement(
                    'label',
                    { className: 'label' },
                    marker.title || 'Missing Title'
                ),
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                    'a',
                    { className: (0, _classnames2.default)('map-marker-hint__ap-link') },
                    localizationString.getString("Click to view more info")
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                _components.SidebarWidget,
                { noBorder: true, noCollapse: true, title: localizationString.getString('Bản đồ') },
                _react2.default.createElement(
                    'div',
                    { className: 'no-left-space' },
                    _react2.default.createElement(
                        'div',
                        { className: 'g-map' },
                        _react2.default.createElement(_components.GoogleMap, _extends({}, this.props.map, { dispath: this.props.dispath, renderMarkerContent: this.renderMarkerContent }))
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: (0, _classnames2.default)('mt-3', { 'd-none': this.props.hiddenBigMapLink }) },
                        _react2.default.createElement(
                            _reactRouterDom.Link,
                            { className: 'btn btn-secondary', to: this.props.linkToBigMap },
                            localizationString.getString("Xem bản đồ")
                        )
                    )
                )
            );
        }
    }]);

    return SearchCity;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
        map: state.googleMap[pageConfigures.smallMapId]
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(SearchCity);

},{"../../shared/components":35,"../page-configure.js":13,"classnames":"classnames","react":"react","react-redux":"react-redux","react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

var _components = require('../../shared/components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cities = {
    'Hà Nội': {
        center: [21.0227431, 105.8194541],
        zoom: 11
    },
    'Đà nẵng': {
        center: [16.0646499, 108.2296327],
        zoom: 11
    },
    'Hồ Chí Minh': {
        center: [10.6917996, 106.6503763],
        zoom: 9
    }
};

var SearchCity = function (_Component) {
    _inherits(SearchCity, _Component);

    function SearchCity() {
        _classCallCheck(this, SearchCity);

        return _possibleConstructorReturn(this, (SearchCity.__proto__ || Object.getPrototypeOf(SearchCity)).apply(this, arguments));
    }

    _createClass(SearchCity, [{
        key: 'onCityChange',
        value: function onCityChange(e) {
            var value = e.target.value;
            this.props.onCityChange(value != "0" && value, cities[value]);
        }
    }, {
        key: 'render',
        value: function render() {
            var onCityChange = this.props.onCityChange;

            return _react2.default.createElement(
                _components.SidebarWidget,
                { noBorder: true, noCollapse: true, title: localizationString.getString('Vị trí') },
                _react2.default.createElement(
                    'div',
                    { className: 'no-left-space' },
                    _react2.default.createElement(
                        _reactstrap.Input,
                        { type: 'select', onChange: this.onCityChange.bind(this) },
                        _react2.default.createElement(
                            'option',
                            { value: 0 },
                            localizationString.getString('Chọn thành phố')
                        ),
                        $.map(cities, function (city, index) {
                            return _react2.default.createElement(
                                'option',
                                { key: index, value: index },
                                index
                            );
                        })
                    )
                )
            );
        }
    }]);

    return SearchCity;
}(_react.Component);

exports.default = SearchCity;

},{"../../shared/components":35,"react":"react","reactstrap":"reactstrap"}],10:[function(require,module,exports){
"use strict";

module.exports = function getCurrentCategory(match, categories) {
    var currentCategory = categories.filter(function (categoryItem) {
        return categoryItem.name === match.params.category;
    })[0];
    return currentCategory;
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderItem = undefined;

var _components = require('../../shared/components');

function renderItem(item) {
    return React.createElement(_components.PageItem, { data: item, extraText: item.area, path: item.path });
}

exports.renderItem = renderItem;

},{"../../shared/components":35}],12:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _reactRouter = require('react-router');

var _reactstrap = require('reactstrap');

var _basePage = require('../shared/_layout/main/base-page');

var _basePage2 = _interopRequireDefault(_basePage);

var _components = require('../shared/components');

var _routes = require('../routes');

var _bigMap = require('./components/big-map');

var _bigMap2 = _interopRequireDefault(_bigMap);

var _category = require('./components/category');

var _category2 = _interopRequireDefault(_category);

var _searchArea = require('./components/search-area');

var _searchArea2 = _interopRequireDefault(_searchArea);

var _sreachCity = require('./components/sreach-city');

var _sreachCity2 = _interopRequireDefault(_sreachCity);

var _smallMap = require('./components/small-map');

var _smallMap2 = _interopRequireDefault(_smallMap);

var _googleMap = require('../shared/reducers/google-map');

var _ultilities = require('../shared/ultilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var pageConfigure = {
    pageName: 'du-an',
    taxonomyTypeId: 20003,
    showBreadcrumb: true
};

var smallMapId = require('./page-configure.js').smallMapId;
var bigMapId = require('./page-configure.js').bigMapId;

var defaultMap = {
    center: [15.866913899999986, 104.1218629],
    zoom: 5
};

var PageComponent = (_temp = _class = function (_React$Component) {
    _inherits(PageComponent, _React$Component);

    function PageComponent() {
        _classCallCheck(this, PageComponent);

        var _this = _possibleConstructorReturn(this, (PageComponent.__proto__ || Object.getPrototypeOf(PageComponent)).call(this));

        _this.renderSidebar = _this.renderSidebar.bind(_this);
        _this.fecthData = _this.fecthData.bind(_this);
        _this.getCurrentChildRoute = _this.getCurrentChildRoute.bind(_this);
        _this.getItemsWithPath = _this.getItemsWithPath.bind(_this);
        return _this;
    }

    _createClass(PageComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                onError = _props.onError,
                onDataFetch = _props.onDataFetch,
                refreshRoutePath = _props.refreshRoutePath,
                categories = _props.categories,
                page = _props.page,
                items = _props.items;


            if (!page) $.get('/page/getsingle?entityName=' + pageConfigure.pageName, function (response) {
                onDataFetch({ page: response.details }, 50);
            });
            if (!categories) $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: pageConfigure.taxonomyTypeId }, function (response) {
                onDataFetch({ categories: response }, 50);
            });

            refreshRoutePath(pageConfigure.pageName);
        }
    }, {
        key: 'onSearchByArea',
        value: function onSearchByArea(from, to) {
            var searchArea = { from: from, to: to };

            if (from === -1 || to === -1) searchArea = null;

            this.props.onDataFetch({ searchArea: searchArea }, 0);
        }
    }, {
        key: 'onSearchByCity',
        value: function onSearchByCity(city, map) {
            var _props2 = this.props,
                setMapValue = _props2.setMapValue,
                searchArea = _props2.searchArea;


            this.props.onDataFetch({ searchCity: city }, 0);

            var currentChildRoute = this.getCurrentChildRoute();
            var mapId = currentChildRoute === "/ban-do" ? bigMapId : smallMapId;

            setMapValue(mapId, map || defaultMap);
        }
    }, {
        key: 'getItemsWithPath',
        value: function getItemsWithPath(items) {
            var match = this.props.match;

            var itemsWithPath = items.map(function (item) {
                var itemWithPath = $.extend(true, {}, item, { path: match.path + '/' + item.name });
                return itemWithPath;
            });
            return itemsWithPath;
        }
    }, {
        key: 'onCategoryFetchComplete',
        value: function onCategoryFetchComplete(items) {
            var _props3 = this.props,
                setMapMarkers = _props3.setMapMarkers,
                match = _props3.match,
                onDataFetch = _props3.onDataFetch;


            var currentChildRoute = this.getCurrentChildRoute();
            var mapId = currentChildRoute === "/ban-do" ? bigMapId : smallMapId;

            var markers = items.map(function (_ref) {
                var id = _ref.id,
                    name = _ref.name,
                    thumbnailUrl = _ref.thumbnailUrl,
                    _ref$moreDetailts = _ref.moreDetailts,
                    mapLongitude = _ref$moreDetailts.mapLongitude,
                    mapLatitude = _ref$moreDetailts.mapLatitude,
                    title = _ref.title;

                return {
                    id: id,
                    lat: mapLatitude,
                    lng: mapLongitude,
                    title: title,
                    thumbnailUrl: '/' + thumbnailUrl,
                    redirect: match.path + '/chi-tiet/' + name,
                    height: mapId === bigMapId && 280,
                    path: match.path + '/' + name
                };
            });

            var itemsWithPath = this.getItemsWithPath(items);

            onDataFetch({ items: itemsWithPath }, 0);

            setMapMarkers(mapId, markers);
        }
    }, {
        key: 'onItemHover',
        value: function onItemHover(isHover, item) {
            var showMarkerBalloon = this.props.showMarkerBalloon;

            var markerId = isHover ? item.id : null;

            var currentChildRoute = this.getCurrentChildRoute();
            var mapId = currentChildRoute === "/ban-do" ? bigMapId : smallMapId;

            showMarkerBalloon(mapId, markerId);
        }
    }, {
        key: 'fecthData',
        value: function fecthData(category, searchArea, searchCity) {
            var filter = [];

            if (searchArea) filter.push({
                id: 'area',
                value: searchArea.from,
                operator: '>='
            }, {
                id: 'area',
                value: searchArea.to,
                operator: '<='
            });

            if (searchCity) filter.push({
                id: 'city',
                value: searchCity,
                operator: '=='
            });
            var additionalFields = ['mapLongitude', 'mapLatitude'];
            (0, _ultilities.dataRequest)('/project/gettabledata', 9, 1, null, filter, category && _defineProperty({}, pageConfigure.taxonomyTypeId, category.id), additionalFields, this.onCategoryFetchComplete.bind(this));
        }
    }, {
        key: 'getCurrentChildRoute',
        value: function getCurrentChildRoute() {
            var _props4 = this.props,
                match = _props4.match,
                location = _props4.location;

            return String(location.pathname).startsWith(match.path + '/ban-do') ? '/ban-do' : '';
        }
    }, {
        key: 'renderSidebar',
        value: function renderSidebar() {
            var _props5 = this.props,
                categories = _props5.categories,
                currentCategory = _props5.currentCategory,
                match = _props5.match,
                location = _props5.location;


            var mapPage = this.getCurrentChildRoute();
            var page = mapPage ? '' : '/1';

            var categoryMenuItems = categories && categories.map(function (category) {
                return { path: '' + match.path + mapPage + '/' + category.name + page, title: category.title, id: category.id };
            });

            categoryMenuItems.unshift({ path: '' + match.path + mapPage + '/' + localizationString.getString('tat-ca') + page, title: localizationString.getString("Tất cả") });

            return React.createElement(
                _components.Sidebar,
                null,
                React.createElement(_components.SidebarMenu, { title: localizationString.getString('loại công trình'),
                    items: categoryMenuItems,
                    currentUrl: match.url
                }),
                React.createElement(_searchArea2.default, { onSearch: this.onSearchByArea.bind(this) }),
                React.createElement(_sreachCity2.default, { onCityChange: this.onSearchByCity.bind(this) }),
                React.createElement(_smallMap2.default, { map: this.props.map,
                    linkToBigMap: match.path + '/ban-do/' + (currentCategory ? currentCategory.name : localizationString.getString('tat-ca')),
                    hiddenBigMapLink: mapPage != ''
                })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.props.dataFetchProgress != 100) return null;
            console.log(this.state);

            var _props6 = this.props,
                match = _props6.match,
                thumbnail = _props6.page.thumbnail,
                categories = _props6.categories,
                currentCategory = _props6.currentCategory,
                searchArea = _props6.searchArea,
                searchCity = _props6.searchCity,
                items = _props6.items;


            var commonRouteProps = {
                items: items,
                searchArea: searchArea,
                searchCity: searchCity,
                categories: categories,
                basePath: match.path,
                fecthData: this.fecthData
            };

            return React.createElement(
                _reactstrap.Container,
                { id: pageConfigure.pageName },
                React.createElement(
                    _reactstrap.Row,
                    null,
                    React.createElement(
                        _reactstrap.Col,
                        { lg: '3' },
                        this.renderSidebar()
                    ),
                    React.createElement(
                        _reactstrap.Col,
                        { xs: '12', lg: '9' },
                        React.createElement(
                            _reactRouter.Switch,
                            null,
                            React.createElement(_reactRouter.Route, { exact: false, path: match.url + '/ban-do/:category', render: function render(route) {
                                    return React.createElement(_bigMap2.default, _extends({}, route, commonRouteProps, {
                                        getItemsWithPath: _this2.getItemsWithPath
                                    }));
                                } }),
                            React.createElement(_reactRouter.Route, { path: match.url + '/:category/:page', render: function render(route) {
                                    return React.createElement(_category2.default, _extends({ match: route.match,
                                        pageCoverImage: thumbnail,
                                        onItemHover: _this2.onItemHover.bind(_this2)
                                    }, commonRouteProps));
                                } })
                        )
                    )
                )
            );
        }
    }]);

    return PageComponent;
}(React.Component), _class.defaultProps = {
    map: defaultMap,
    items: []
}, _temp);


var stateToProps = function stateToProps(state) {
    return {};
};

var dispathToProps = function dispathToProps(dispath) {
    return bindActionCreators({ refreshRoutePath: _routes.refreshRoutePath, setMapValue: _googleMap.setMapValue, setMapMarkers: _googleMap.setMapMarkers, showMarkerBalloon: _googleMap.showMarkerBalloon }, dispath);
};

var ConnectedPageComponent = connect(stateToProps, dispathToProps)(PageComponent);

module.exports = (0, _basePage2.default)({ page: pageConfigure.pageName, showBreadcrumbs: pageConfigure.showBreadcrumb })(ConnectedPageComponent);

},{"../routes":17,"../shared/_layout/main/base-page":29,"../shared/components":35,"../shared/reducers/google-map":61,"../shared/ultilities":63,"./components/big-map":5,"./components/category":6,"./components/search-area":7,"./components/small-map":8,"./components/sreach-city":9,"./page-configure.js":13,"react-redux":"react-redux","react-router":"react-router","reactstrap":"reactstrap","redux":"redux","underscore":78}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var smallMapId = "category-small-map";
var bigMapId = "big-map-id";

exports.smallMapId = smallMapId;
exports.bigMapId = bigMapId;

},{}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('reactstrap'),
    Container = _require.Container;

var _require2 = require('../../shared/components'),
    Title = _require2.Title;

module.exports = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            $(".cd-timeline-block").each(function (index) {
                var $this = $(this);
                var objPrev = $this.prev('.cd-timeline-block');
                if (objPrev.hasClass('odd')) {
                    $this.find('.cd-timeline-content p').attr('data-aos', 'zoom-in');
                    $this.find('.cd-timeline-content h2').attr('data-aos', 'zoom-in');

                    $this.addClass('even');
                } else {
                    $this.find('.cd-timeline-content p').attr('data-aos', 'zoom-in');
                    $this.find('.cd-timeline-content h2').attr('data-aos', 'zoom-in');
                    $this.addClass('odd');
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                items = _props.items,
                title = _props.title;


            var array = items.map(function (item) {
                var strs = String(item.value).split('\n');
                var obj = {};
                for (var i in strs) {
                    var str = strs[i].split(':');
                    if (str.length == 2) {
                        var kv = str;
                        var k = kv[0].trim();
                        var v = kv[1].trim();
                        obj[k] = v;
                    }
                }
                return obj;
            });

            return React.createElement(
                Container,
                null,
                React.createElement(
                    Title,
                    null,
                    title
                ),
                React.createElement(
                    'section',
                    { id: 'cd-timeline' },
                    array.map(function (item, index) {
                        if (!item.content) {
                            return React.createElement(
                                'p',
                                { className: 'cd-timeline-title' },
                                React.createElement(
                                    'span',
                                    { className: 'text' },
                                    item.label
                                )
                            );
                        }
                        return React.createElement(
                            'div',
                            { className: 'cd-timeline-block clearfix' },
                            React.createElement('div', { className: 'cd-timeline-dot' }),
                            React.createElement(
                                'div',
                                { className: 'cd-timeline-content clearfix' },
                                React.createElement(
                                    'h2',
                                    null,
                                    item.label
                                ),
                                React.createElement(
                                    'p',
                                    null,
                                    item.content
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'cd-icon' },
                                    React.createElement('img', { src: item.icon, alt: item.title })
                                )
                            )
                        );
                    })
                )
            );
        }
    }]);

    return _class;
}(React.Component);

},{"../../shared/components":35,"reactstrap":"reactstrap"}],15:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('reactstrap'),
    Container = _require2.Container,
    Row = _require2.Row;

var _require3 = require('../shared/components'),
    Image = _require3.Image,
    Title = _require3.Title,
    PageArticle = _require3.PageArticle;

var QuyTrinh = require('./components/quy-trinh');

var BasePage = require('../shared/_layout/main/base-page');

var PageComponent = function (_React$Component) {
    _inherits(PageComponent, _React$Component);

    function PageComponent() {
        _classCallCheck(this, PageComponent);

        return _possibleConstructorReturn(this, (PageComponent.__proto__ || Object.getPrototypeOf(PageComponent)).call(this));
    }

    _createClass(PageComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                onError = _props.onError,
                onDataFetch = _props.onDataFetch,
                article = _props.article,
                procedure = _props.procedure;


            if (!article) $.get('/page/GetSingle?entityName=ve-chung-toi', function (response) {
                onDataFetch({ article: response }, 50);
            });

            if (!procedure) $.get('/optionGroup/GetSingle?entityName=quy-trinh', function (response) {
                onDataFetch({ procedure: response.details }, 50);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.dataFetchProgress != 100) return null;

            var _props2 = this.props,
                article = _props2.article,
                procedure = _props2.procedure;


            return React.createElement(
                'div',
                { id: 'gioi-thieu' },
                article && React.createElement(PageArticle, _extends({ className: 'mb-5 mb-xl-6' }, article.details)),
                procedure && React.createElement(QuyTrinh, { items: procedure.options, title: procedure.title })
            );
        }
    }]);

    return PageComponent;
}(React.Component);

module.exports = BasePage({ page: 'gioi-thieu' })(PageComponent);

},{"../shared/_layout/main/base-page":29,"../shared/components":35,"./components/quy-trinh":14,"reactstrap":"reactstrap","redux":"redux"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extendedConnectedRouter = require('./shared/components/_commons/extended-ConnectedRouter');

var _extendedConnectedRouter2 = _interopRequireDefault(_extendedConnectedRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-router'),
    Route = _require.Route,
    Switch = _require.Switch;

var _require2 = require('react-redux'),
    Provider = _require2.Provider,
    connect = _require2.connect;

var _require3 = require('history'),
    createBrowserHistory = _require3.createBrowserHistory;

var _require4 = require('react-router-redux'),
    ConnectedRouter = _require4.ConnectedRouter;

var PropTypes = require('prop-types');

var history = createBrowserHistory

// Pages:
();var Layout = require('./shared/_layout').default;
var TrangChu = require('./trang-chu/index');
var GioiThieu = require('./gioi-thieu/index');
var CongTrinh = require('./cong-trinh/index');

var Root = function (_React$Component) {
    _inherits(Root, _React$Component);

    function Root(props) {
        _classCallCheck(this, Root);

        var _this = _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));

        AOS.init();
        return _this;
    }

    _createClass(Root, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                menuItems = _props.menuItems,
                store = _props.store;

            return React.createElement(
                Provider,
                { store: store },
                React.createElement(_extendedConnectedRouter2.default, { history: history, wrapper: Layout })
            );
        }
    }]);

    return Root;
}(React.Component);

Root.propTypes = {
    store: PropTypes.object.isRequired
};

var stateToProps = function stateToProps(state) {
    return {
        menuItems: state.menu.menuItems
    };
};

module.exports = {
    Root: connect(stateToProps)(Root),
    history: history
};

exports.default = exports;

},{"./cong-trinh/index":4,"./gioi-thieu/index":15,"./shared/_layout":18,"./shared/components/_commons/extended-ConnectedRouter":37,"./trang-chu/index":74,"history":"history","prop-types":"prop-types","react-redux":"react-redux","react-router":"react-router","react-router-redux":"react-router-redux"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.INIT_ROUTES = exports.refreshRoutePath = exports.reducer = undefined;

var _index = require('./trang-chu/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./gioi-thieu/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./cong-trinh/index');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./bo-suu-tap/index');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./du-an/index');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./thu-vien/index');

var _index12 = _interopRequireDefault(_index11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRoutes = function getRoutes() {
    return {
        exact: true,
        path: '/',
        name: 'trang-chu',
        label: localizationString.getString('Trang chủ'),
        component: _index2.default,
        childRoutes: [{
            exact: true,
            path: '/ve-chung-toi',
            name: 've-chung-toi',
            defaultLabel: localizationString.getString('Về chúng tôi'),
            component: _index4.default
        }, {
            exact: true,
            path: '/cong-trinh',
            name: 'cong-trinh',
            defaultLabel: localizationString.getString('Công trình'),
            component: _index6.default
        }, {
            exact: true,
            path: '/bo-suu-tap',
            name: 'bo-suu-tap',
            defaultLabel: localizationString.getString('Bộ sưu tập'),
            component: _index8.default
        }, {
            path: '/du-an',
            name: 'du-an',
            defaultUrl: '/du-an/' + localizationString.getString('tat-ca') + '/1',
            defaultLabel: localizationString.getString('Dự án'),
            component: _index10.default,
            childRoutes: [{
                path: '/du-an/:category/:page',
                name: 'du-an-category',
                defaultLabel: localizationString.getString('Dự án')
            }, {
                path: '/du-an/:du-an',
                name: 'du-an-chi-tiet',
                defaultLabel: localizationString.getString('Dự án')
            }]
        }, {
            exact: true,
            path: '/thu-vien',
            name: 'thu-vien',
            redirectToChild: 0,
            defaultLabel: localizationString.getString('Thư viện'),
            component: _index12.default,
            childRoutes: [{
                path: '/:category/:page',
                name: 'thu-vien-category',
                defaultLocation: '/tat-ca/1',
                defaultLabel: localizationString.getString('Thư viện')
            }, {
                path: '/chi-tiet/:blog',
                name: 'thu-vien-chi-tiet',
                defaultLabel: localizationString.getString('Thư viện')
            }]
        }]
    };
};

var getRoutePath = function getRoutePath() {
    var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var currentRouteName = arguments[1];
    var labels = arguments[2];

    var resultRoutePath = [];

    for (var routeIndex in routes) {
        var route = routes[routeIndex];

        if (labels && labels[route.name]) route.label = labels[route.name];else route.label = route.defaultLabel;

        if (route.name == currentRouteName) {
            resultRoutePath.push(route);
            return resultRoutePath;
        } else if (route.childRoutes) {
            resultRoutePath.push(route);
            var nextRoute = getRoutePath(route.childRoutes, currentRouteName, labels);
            if (nextRoute.length) {
                resultRoutePath = resultRoutePath.concat(nextRoute);
                return resultRoutePath;
            } else resultRoutePath = [];
        } else {
            resultRoutePath = [];
        }
    }

    return resultRoutePath;
};

var INIT_ROUTES = 'INIT_ROUTES';
var REFRESH_ROUTE_PATH = 'REFRESG_ROUTE_PATH';

var refreshRoutePath = function refreshRoutePath(currentRouteName, replaceRouteDefaultLabels) {
    return {
        type: REFRESH_ROUTE_PATH,
        currentRouteName: currentRouteName,
        replaceRouteDefaultLabels: replaceRouteDefaultLabels
    };
};

var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (action.type === INIT_ROUTES) {
        return $.extend(true, { routes: getRoutes() }, state);
    }
    if (action.type === REFRESH_ROUTE_PATH) {
        var routePath = getRoutePath(state.routes.childRoutes, action.currentRouteName, action.routeLabels);
        routePath.unshift(state.routes);
        return $.extend(true, {}, state, { routePath: routePath });
    }

    return state;
};

exports.reducer = reducer;
exports.refreshRoutePath = refreshRoutePath;
exports.INIT_ROUTES = INIT_ROUTES;

},{"./bo-suu-tap/index":2,"./cong-trinh/index":4,"./du-an/index":12,"./gioi-thieu/index":15,"./thu-vien/index":70,"./trang-chu/index":74}],18:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-redux'),
    connect = _require.connect;

var _require2 = require('redux'),
    bindActionCreators = _require2.bindActionCreators;

var Header = require('./_layout/header');
var Footer = require('./_layout/footer');
var OutNav = require('./_layout/mobile/menu');
var PageLoading = require('./_layout/main/page-loading');

var keys = {
    updateLayout: "SET_LAYOUT_PARAMETER",
    togglePageLoading: "TOGGLE_PAGE_LOADING"
};

var actions = {
    updateLayout: function updateLayout() {
        return {
            type: keys.updateLayout
        };
    },
    togglePageLoading: function togglePageLoading(toggle) {
        return {
            type: keys.togglePageLoading,
            toggle: toggle
        };
    }
};
var initState = {
    loadingFadeOutTime: 500

};

var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var newState = {};
    switch (action.type) {
        case keys.updateLayout:
            newState = $.extend(true, {}, state);
            newState.parameters = action.parameters;
            return newState;
        case keys.togglePageLoading:
            newState = $.extend(true, {}, state);
            newState.isPageLoadingVisible = action.toggle;
            return newState;
        default:
            return state;
    }
};

//middle ware to update layout after switch page, etc...
var updateLayout = function updateLayout(store) {
    return function (next) {
        return function (action) {
            if (action.type == keys.updateLayout) {
                var footerElement = document.getElementById('footer');
                var mainElement = document.getElementById('main');

                var headerHeight = document.getElementById('header').clientHeight;
                var footerHeight = footerElement.clientHeight;
                var viewportHeight = window.outerHeight;
                var layoutParameters = {
                    header: { id: header, height: headerHeight },
                    main: { id: main, minHeight: viewportHeight - footerHeight - headerHeight },
                    footer: { id: footer, height: footerHeight },
                    loading: { id: loading },
                    viewportHeight: viewportHeight
                };

                $(mainElement).css('min-height', layoutParameters.main.minHeight);
                $(document.getElementById('layout')).fadeTo(500, 1);
                $(document.getElementById('loading')).css('height', layoutParameters.main.minHeight);
                action.parameters = layoutParameters;
            }

            return next(action);
        };
    };
};

var LayoutController = function (_React$Component) {
    _inherits(LayoutController, _React$Component);

    function LayoutController() {
        _classCallCheck(this, LayoutController);

        return _possibleConstructorReturn(this, (LayoutController.__proto__ || Object.getPrototypeOf(LayoutController)).apply(this, arguments));
    }

    _createClass(LayoutController, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var layoutLoaded = this.props.layoutLoaded;

            if (layoutLoaded) {
                var _updateLayout = this.props.updateLayout;

                _updateLayout();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { className: 'layout-controller' });
        }
    }]);

    return LayoutController;
}(React.Component);

var stateToProps = function stateToProps(state) {
    return {};
};

var reducerToProps = function reducerToProps(reducer) {
    return bindActionCreators(actions, reducer);
};

var ConnectedLayoutController = connect(stateToProps, reducerToProps)(LayoutController);

var Layout = function (_React$Component2) {
    _inherits(Layout, _React$Component2);

    function Layout(props) {
        _classCallCheck(this, Layout);

        var _this2 = _possibleConstructorReturn(this, (Layout.__proto__ || Object.getPrototypeOf(Layout)).call(this, props));

        _this2.state = {
            loaded: false
        };

        _this2.elementRefs = {
            layout: 'layout',
            header: 'header',
            main: 'main',
            footer: 'footer',
            loading: 'loader'
        };
        return _this2;
    }

    _createClass(Layout, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({ loaded: true });
        }
    }, {
        key: 'render',
        value: function render() {
            var children = this.props.children;

            return React.createElement(
                'div',
                { id: this.elementRefs.layout, className: 'layout perspective', style: { opacity: 0 } },
                React.createElement(
                    'div',
                    { className: 'wrapper' },
                    React.createElement(Header, { id: this.elementRefs.header, className: 'p-3 pt-lg-4 pb-lg-4' }),
                    React.createElement(
                        'div',
                        { id: this.elementRefs.main, className: 'main pb-5 mt-lg-3' },
                        children,
                        React.createElement(PageLoading, { id: this.elementRefs.loading })
                    ),
                    React.createElement(Footer, { id: this.elementRefs.footer, className: 'p-4' })
                ),
                React.createElement(OutNav, null),
                React.createElement(ConnectedLayoutController, _extends({}, this.elementRefs, { layoutLoaded: this.state.loaded }))
            );
        }
    }]);

    return Layout;
}(React.Component);

module.exports = {
    updateLayout: updateLayout,
    actions: actions,
    reducer: reducer,
    default: Layout
};

},{"./_layout/footer":19,"./_layout/header":23,"./_layout/main/page-loading":31,"./_layout/mobile/menu":32,"react-redux":"react-redux","redux":"redux"}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = require('classnames');

var _require = require('reactstrap'),
    Container = _require.Container,
    Row = _require.Row,
    Col = _require.Col;

var CopyRight = require('./footer/copy-right');
var Socials = require('./footer/socials');
var Menu = require('./footer/menu');

module.exports = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                this.props,
                React.createElement(
                    Container,
                    { fluid: true },
                    React.createElement(
                        Row,
                        null,
                        React.createElement(
                            Col,
                            { xs: '12', lg: '4', xl: '6', className: 'mb-3 mb-lg-0' },
                            React.createElement(CopyRight, { className: 'text-center text-xl-left' })
                        ),
                        React.createElement(
                            Col,
                            { xs: '12', md: '8', lg: '6', xl: '4' },
                            React.createElement(Menu, { className: 'text-center text-md-left text-xl-right' })
                        ),
                        React.createElement(
                            Col,
                            { xs: '12', md: '4', lg: '2', xl: '2' },
                            React.createElement(Socials, { className: 'text-center text-md-right text-xl-right' })
                        )
                    )
                )
            );
        }
    }]);

    return _class;
}(React.Component);

},{"./footer/copy-right":20,"./footer/menu":21,"./footer/socials":22,"classnames":"classnames","reactstrap":"reactstrap"}],20:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = require('classnames');

module.exports = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: classNames("copyright", this.props.className) },
                "C 2017 dbgroup. All rights reserved"
            );
        }
    }]);

    return _class;
}(React.Component);

},{"classnames":"classnames"}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');
var _ = require('underscore');

var _require = require('reactstrap'),
    Row = _require.Row,
    Col = _require.Col;

var _require2 = require('react-router-dom'),
    Link = _require2.Link;

var _require3 = require('react-redux'),
    connect = _require3.connect;

var PropTypes = require('prop-types');
var classNames = require('classnames');

var stateToProps = function stateToProps(state) {
    return {
        menuItems: state.menu.menuItems
    };
};

var Menu = function (_React$Component) {
    _inherits(Menu, _React$Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

        var footerMenuItem = props.menuItems.filter(function (item) {
            return item.footer;
        });

        _this.state = {
            menuItems: _.sortBy(footerMenuItem, 'footer')
        };
        return _this;
    }

    _createClass(Menu, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                Row,
                { className: classNames("text-uppercase pl-0 mb-0", this.props.className) },
                this.state.menuItems.map(function (menuItem, index) {
                    return React.createElement(
                        Col,
                        { key: index, className: 'menu-item d-inline-block' },
                        React.createElement(
                            Link,
                            { to: menuItem.url },
                            React.createElement(
                                'span',
                                null,
                                menuItem.title
                            )
                        )
                    );
                })
            );
        }
    }]);

    return Menu;
}(React.Component);

Menu.propTypes = {
    menuItems: PropTypes.array.isRequired
};

module.exports = connect(stateToProps)(Menu);

},{"classnames":"classnames","jquery":"jquery","prop-types":"prop-types","react-redux":"react-redux","react-router-dom":"react-router-dom","reactstrap":"reactstrap","underscore":78}],22:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = require('classnames');

module.exports = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.state = {
            facebook: "/",
            twitter: "/",
            instagram: "/"
        };
        return _this;
    }

    _createClass(_class, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "ul",
                { className: classNames("socials pl-0", this.props.className) },
                React.createElement(
                    "li",
                    { className: "facebook" },
                    React.createElement(
                        "a",
                        { href: this.state.facebook },
                        React.createElement("i", { className: "fa fa-facebook-official" })
                    )
                ),
                React.createElement(
                    "li",
                    { className: "twitter" },
                    React.createElement(
                        "a",
                        { href: this.state.twitter },
                        React.createElement("i", { className: "fa fa-twitter" })
                    )
                ),
                React.createElement(
                    "li",
                    { className: "instagram" },
                    React.createElement(
                        "a",
                        { href: this.state.instagram },
                        React.createElement("i", { className: "fa fa-instagram" })
                    )
                )
            );
        }
    }]);

    return _class;
}(React.Component);

},{"classnames":"classnames"}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('reactstrap'),
    Container = _require.Container,
    Row = _require.Row,
    Col = _require.Col;

var LanguageSelect = require('./header/language-select');
var Search = require('./header/search');
var Logo = require('./header/logo');
var Menu = require('./header/menu').default;
var MobileHeader = require('./header/header-mobile');
var classNames = require('classnames');

module.exports = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'header',
                this.props,
                React.createElement(
                    Container,
                    { className: 'd-none d-md-block' },
                    React.createElement(
                        Row,
                        null,
                        React.createElement(
                            Col,
                            { md: '2' },
                            React.createElement(Logo, null)
                        ),
                        React.createElement(
                            Col,
                            { md: '10' },
                            React.createElement(
                                Row,
                                null,
                                React.createElement(
                                    'div',
                                    { className: 'w-100' },
                                    React.createElement(
                                        'div',
                                        { className: 'float-right' },
                                        React.createElement(
                                            'div',
                                            { className: 'float-left language-select pr-3 mr-3' },
                                            React.createElement(LanguageSelect, null)
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'float-left' },
                                            React.createElement(Search, null)
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                Row,
                                { className: 'menu-container' },
                                React.createElement(
                                    'div',
                                    { className: 'align-items-end d-flex' },
                                    React.createElement(Menu, null)
                                )
                            )
                        )
                    )
                ),
                React.createElement(MobileHeader, { className: 'd-block d-md-none' })
            );
        }
    }]);

    return _class;
}(React.Component);

},{"./header/header-mobile":24,"./header/language-select":25,"./header/logo":26,"./header/menu":27,"./header/search":28,"classnames":"classnames","reactstrap":"reactstrap"}],24:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classNames = require('classnames');
var LanguageSelect = require('./language-select');
var Search = require('./search');

module.exports = function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	}

	_createClass(_class, [{
		key: 'openMenu',
		value: function openMenu() {}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			if ('ontouchstart' in window) var click = 'touchstart';else var click = 'click';

			var $layout = $($('.layout')[0]);
			var $wrapper = $layout.find('.wrapper');
			var $burger = $layout.find('.burger');

			global.closeMenu = function closeMenu() {
				$layout.removeClass('animate').delay(500).queue(function () {
					$wrapper.unbind(click);
					$layout.removeClass('modalview').dequeue();
				});
				$burger.removeClass('open');
			};

			global.openMenu = function openMenu() {
				$burger.addClass('open');
				$layout.addClass('modalview');
				$layout.addClass('animate').delay(500).queue(function () {
					$wrapper.bind(click, function () {
						if ($layout.hasClass('modalview')) closeMenu();
					});
					$layout.addClass('modalview').dequeue();
				});
			};

			$burger.on(click, function () {
				openMenu();
			});

			var $nav = $layout.find('.outer-nav');
			$nav.find('a').bind(click, function () {
				closeMenu();
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: classNames("header-mobile clearfix", this.props.className) },
				React.createElement(
					'div',
					{ className: 'float-left mt-1' },
					React.createElement(
						'div',
						{ className: 'burger' },
						React.createElement('span', null),
						React.createElement('span', null),
						React.createElement('span', null),
						React.createElement('span', null)
					)
				),
				React.createElement(
					'div',
					{ className: 'float-right' },
					React.createElement(
						'div',
						{ className: 'float-left language-select pr-3 mr-3' },
						React.createElement(LanguageSelect, null)
					),
					React.createElement(
						'div',
						{ className: 'float-left' },
						React.createElement(Search, null)
					)
				)
			);
		}
	}]);

	return _class;
}(React.Component);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./language-select":25,"./search":28,"classnames":"classnames"}],25:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');

var _require = require('react-redux'),
    connect = _require.connect;

var _require2 = require('redux'),
    bindActionCreators = _require2.bindActionCreators;

var _require3 = require('reactstrap'),
    Input = _require3.Input;

var swithLanguage = require('../../reducers/localization').actions.swithLanguage;

var LanguageSelect = function (_React$Component) {
    _inherits(LanguageSelect, _React$Component);

    function LanguageSelect() {
        _classCallCheck(this, LanguageSelect);

        return _possibleConstructorReturn(this, (LanguageSelect.__proto__ || Object.getPrototypeOf(LanguageSelect)).apply(this, arguments));
    }

    _createClass(LanguageSelect, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                languages = _props.languages,
                currentLanguage = _props.currentLanguage,
                swithLanguage = _props.swithLanguage;

            return React.createElement(
                'form',
                { method: 'post', action: 'localization/switch', ref: 'form' },
                React.createElement(
                    Input,
                    { name: 'culture', value: currentLanguage, className: 'text-uppercase border-0 p-0', type: 'select', onChange: function onChange(e) {
                            _this2.refs.form.submit();
                        } },
                    languages.map(function (language) {
                        return React.createElement(
                            'option',
                            { key: language.name, value: language.name },
                            language.title
                        );
                    })
                )
            );
        }
    }]);

    return LanguageSelect;
}(React.Component);

var stateToProps = function stateToProps(state) {
    return {
        currentLanguage: state.localization.currentLanguage,
        languages: state.localization.languages
    };
};

var dispathToProps = function dispathToProps(dispatch) {
    return bindActionCreators({}, dispatch);
};

module.exports = connect(stateToProps, dispathToProps)(LanguageSelect);

},{"../../reducers/localization":62,"jquery":"jquery","react-redux":"react-redux","reactstrap":"reactstrap","redux":"redux"}],26:[function(require,module,exports){
"use strict";

module.exports = function (props) {
    return React.createElement(
        "div",
        { className: "logo" },
        React.createElement("img", { src: "/img/logo.png" })
    );
};

},{}],27:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');

var _require = require('react-router-dom'),
    NavLink = _require.NavLink;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('redux'),
    bindActionCreators = _require3.bindActionCreators;

var PropTypes = require('prop-types');

var keys = {
    init: "MENU_INIT"
};

var actions = {
    //initState:
    // - menuItems: flat array
    init: function init(initState) {
        return {
            type: keys.init,
            initState: initState
        };
    }
};

var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.init:
            return action.initState;
        default:
            return state;
    }
};

var stateToProps = function stateToProps(state) {
    return {
        menuItems: state.menu.menuItems
    };
};

var dispathToProps = function dispathToProps(dispatch) {
    return bindActionCreators({}, dispatch);
};

var Menu = function (_React$Component) {
    _inherits(Menu, _React$Component);

    function Menu() {
        _classCallCheck(this, Menu);

        return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
    }

    _createClass(Menu, [{
        key: 'render',
        value: function render() {
            var menuItems = this.props.menuItems;

            return React.createElement(
                'ul',
                { className: 'menu text-uppercase pl-0 mb-0' },
                menuItems.map(function (menuItem, index) {
                    return React.createElement(
                        'li',
                        { key: index, className: 'menu-item d-inline-block' },
                        React.createElement(
                            NavLink,
                            { exact: menuItem.url == '/', to: menuItem.url, activeClassName: 'current' },
                            React.createElement(
                                'span',
                                null,
                                menuItem.title
                            )
                        )
                    );
                })
            );
        }
    }]);

    return Menu;
}(React.Component);

Menu.propTypes = {
    menuItems: PropTypes.array.isRequired
};

module.exports = {
    actions: actions,
    reducer: reducer,
    default: connect(stateToProps, dispathToProps, null, { pure: false })(Menu)
};

},{"jquery":"jquery","prop-types":"prop-types","react-redux":"react-redux","react-router-dom":"react-router-dom","redux":"redux"}],28:[function(require,module,exports){
"use strict";

var _require = require('reactstrap'),
    Button = _require.Button;

module.exports = function (props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            Button,
            { color: "link", className: "btn-search text-uppercase pl-0 pr-0 border-0" },
            React.createElement("i", { className: "fa fa-search mr-2", "aria-hidden": "true" }),
            " search"
        )
    );
};

},{"reactstrap":"reactstrap"}],29:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConnectedBasePage = require('./connected-base-page').default;
var PropTypes = require('prop-types');

var baseArgs = {
    page: ''
};

baseArgs.PropTypes = {
    page: PropTypes.string.require
};

module.exports = function () {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : baseArgs;
    return function (Element) {
        return function (_React$Component) {
            _inherits(_class, _React$Component);

            function _class() {
                _classCallCheck(this, _class);

                return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
            }

            _createClass(_class, [{
                key: 'render',
                value: function render() {
                    return React.createElement(ConnectedBasePage, _extends({}, args, this.props, { component: Element }));
                }
            }]);

            return _class;
        }(React.Component);
    };
};

},{"./connected-base-page":30,"prop-types":"prop-types"}],30:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _components = require('../../components');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-redux'),
    connect = _require.connect;

var _require2 = require('redux'),
    bindActionCreators = _require2.bindActionCreators;

var _require3 = require('react-touch'),
    Swipeable = _require3.Swipeable,
    defineSwipe = _require3.defineSwipe;

var layoutActions = require('../../_layout').actions;

var DelayRender = require('../../components/_commons/delay-render');

var keys = {
  createNewPage: "CREATE_NEW_PAGE",
  onDataFetch: "ON_PAGE_FETCH_DATA"
};

var actions = {
  createNewPage: function createNewPage(page) {
    return {
      type: keys.createNewPage,
      page: page
    };
  },

  //progress: 0 - 100.
  onDataFetch: function onDataFetch(page, data) {
    var progress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
    return {
      type: keys.onDataFetch,
      page: page,
      data: data,
      progress: progress
    };
  }
};

var initState = {
  pages: {} //data of all page
};

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments[1];

  var newState = {};
  switch (action.type) {
    case keys.onDataFetch:
      newState = $.extend(true, {}, state);
      var pages = newState.pages;
      var currentPageData = $.extend(pages[action.page], action.data);
      currentPageData.dataFetchProgress += action.progress;
      if (currentPageData.dataFetchProgress > 100) console.error('\'dataFetchProgress\' ph\u1EA3i t\u1EEB 0 \u0111\u1EBFn 100, hi\u1EC7n t\u1EA1i ' + currentPageData.dataFetchProgress + '.');
      newState.pages[action.page] = currentPageData;
      return newState;
    case keys.createNewPage:
      newState = $.extend(true, {}, state);
      newState.pages[action.page] = {
        dataFetchProgress: 0
      };
      return newState;
    default:
      return state;

  }
};

var BasePage = function (_React$Component) {
  _inherits(BasePage, _React$Component);

  function BasePage(props) {
    _classCallCheck(this, BasePage);

    var _this = _possibleConstructorReturn(this, (BasePage.__proto__ || Object.getPrototypeOf(BasePage)).call(this, props));

    _this.baseDelay = 1000;
    var component = _this.props.component;


    _this.swipeLeft = _this.swipeLeft.bind(_this);
    _this.onDataFetch = _this.onDataFetch.bind(_this);

    _this.ElementWithDelayRender = DelayRender({
      delay: _this.baseDelay,
      onRender: _this.onPageComponentRender.bind(_this)
    })(component);
    return _this;
  }

  _createClass(BasePage, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _props = this.props,
          togglePageLoading = _props.togglePageLoading,
          updateLayout = _props.updateLayout;

      updateLayout();
      togglePageLoading(true);
    }
  }, {
    key: 'swipeLeft',
    value: function swipeLeft() {
      global.openMenu();
    }
  }, {
    key: 'onDataFetch',
    value: function onDataFetch(data, progress) {
      var _props2 = this.props,
          onDataFetch = _props2.onDataFetch,
          page = _props2.page;

      onDataFetch(page, data, progress);
    }
  }, {
    key: 'onPageComponentRender',
    value: function onPageComponentRender() {
      var _props3 = this.props,
          togglePageLoading = _props3.togglePageLoading,
          loadingFadeOutTime = _props3.loadingFadeOutTime;

      var $element = $(ReactDOM.findDOMNode(this));

      togglePageLoading(false);
      $element.delay(this.baseDelay).fadeTo(500, 1);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props4 = this.props,
          createNewPage = _props4.createNewPage,
          pages = _props4.pages,
          page = _props4.page;

      var pageData = pages[page];
      if (!pageData) createNewPage(page);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          createNewPage = _props5.createNewPage,
          component = _props5.component,
          pages = _props5.pages,
          page = _props5.page,
          routes = _props5.routes,
          match = _props5.match,
          showBreadcrumbs = _props5.showBreadcrumbs,
          location = _props5.location;


      var pageData = pages[page];
      if (!pageData) return null;

      return React.createElement(
        'div',
        { className: 'base-page', style: { opacity: 0 } },
        React.createElement(
          Swipeable,
          { onSwipeRight: this.swipeLeft },
          React.createElement('div', { className: 'swipeable' })
        ),
        showBreadcrumbs && React.createElement(_components.ConnectedBreacrumbs, { routes: routes, params: match.params }),
        React.createElement(this.ElementWithDelayRender, _extends({}, pageData, { location: location, match: match, onDataFetch: this.onDataFetch }))
      );
    }
  }]);

  return BasePage;
}(React.Component);

;

var stateToProps = function stateToProps(state) {
  return {
    layoutParameter: state.layout.parameters, //remove will take no effect!
    loadingFadeOutTime: state.layout.loadingFadeOutTime,
    pages: state.connectedBasePage.pages,
    routes: state.routes
  };
};

var dispathToProps = function dispathToProps(dispath) {
  return bindActionCreators({
    togglePageLoading: layoutActions.togglePageLoading,
    updateLayout: layoutActions.updateLayout,
    createNewPage: actions.createNewPage,
    onDataFetch: actions.onDataFetch
  }, dispath);
};

module.exports = {
  actions: actions,
  reducer: reducer,
  default: connect(stateToProps, dispathToProps)(BasePage)
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../_layout":18,"../../components":35,"../../components/_commons/delay-render":36,"react-redux":"react-redux","react-touch":"react-touch","redux":"redux"}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-redux'),
    connect = _require.connect;

var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"> <g class="anim-0"> <circle cx="50" cy="50" r="50" fill="white" /> </g> <g class="anim-1"> <circle cx="50" cy="50" r="5" fill="#ff5e7C" /> </g> <g class="anim-2"> <circle cx="75" cy="50" r="5" fill="#ff5e7C" /> <line x1="25" y1="50" x2="75" y2="50" stroke="#ff5e7C" stroke-width="3" /> </g> <g class="anim-3"> <circle cx="50" cy="25" r="5" fill="#ff5e7C" /> <line x1="50" y1="25" x2="25" y2="75" stroke="#ff5e7C" stroke-width="3" /> <line x1="50" y1="25" x2="75" y2="75" stroke="#ff5e7C" stroke-width="3" /> </g> <g class="anim-4"> <circle cx="75" cy="25" r="5" fill="#ff5e7C" /> <line x1="75" y1="25" x2="25" y2="25" stroke="#ff5e7C" stroke-width="3" /> </g></svg>';

var Loading = function (_React$Component) {
    _inherits(Loading, _React$Component);

    function Loading() {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
    }

    _createClass(Loading, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var isVisible = this.props.isVisible;

            var $element = $(ReactDOM.findDOMNode(this));

            if (isVisible) $element.fadeTo(500, 1, function () {});else $element.fadeTo(500, 0, function () {
                $element.hide();
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { id: 'loading', dangerouslySetInnerHTML: { __html: svg } });
        }
    }]);

    return Loading;
}(React.Component);

var stateToProps = function stateToProps(state) {
    return {
        isVisible: state.layout.isPageLoadingVisible
    };
};

module.exports = connect(stateToProps)(Loading);

},{"react-redux":"react-redux"}],32:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');

var _require = require('react-router-dom'),
    NavLink = _require.NavLink;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var PropTypes = require('prop-types');

var Menu = function (_React$Component) {
    _inherits(Menu, _React$Component);

    function Menu() {
        _classCallCheck(this, Menu);

        return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
    }

    _createClass(Menu, [{
        key: 'render',
        value: function render() {
            var menuItems = this.props.menuItems;

            return React.createElement(
                'nav',
                { className: 'left outer-nav vertical' },
                menuItems.map(function (menuItem, index) {
                    return React.createElement(
                        NavLink,
                        { key: index, exact: menuItem.url == '/', to: menuItem.url, activeClassName: 'current' },
                        menuItem.title
                    );
                })
            );
        }
    }]);

    return Menu;
}(React.Component);

Menu.propTypes = {
    menuItems: PropTypes.array.isRequired
};

var stateToProps = function stateToProps(state) {
    return {
        menuItems: state.menu.menuItems
    };
};

module.exports = connect(stateToProps, null, null, { pure: false })(Menu);

},{"jquery":"jquery","prop-types":"prop-types","react-redux":"react-redux","react-router-dom":"react-router-dom"}],33:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var enUS = require('./_localization/en-us');

var strings = {
    'vi-VN': {},
    'en-US': enUS
};

var localization = function () {
    function localization() {
        _classCallCheck(this, localization);

        this.strings = strings;
    }

    _createClass(localization, [{
        key: 'setLanguage',
        value: function setLanguage(language) {
            this.language = language;
        }
    }, {
        key: 'getString',
        value: function getString(string) {
            return this.strings[this.language][string] || string;
        }
    }]);

    return localization;
}();

module.exports = new localization();

},{"./_localization/en-us":34}],34:[function(require,module,exports){
'use strict';

module.exports = {
    'Tìm kiếm': "Search",
    'Công trình': "Construction",
    'Dự án': "Project",
    'Khách<br/>sạn': "Hotel",
    'Nhà ở': "Home",
    'Căn<br/>hộ': "Department"
};

},{}],35:[function(require,module,exports){
'use strict';

var _connectedBreacrumbs = require('./components/connected-breacrumbs');

var _connectedBreacrumbs2 = _interopRequireDefault(_connectedBreacrumbs);

var _sidebar = require('./components/sidebar');

var _sidebar2 = _interopRequireDefault(_sidebar);

var _categoryMenu = require('./components/category-menu');

var _categoryMenu2 = _interopRequireDefault(_categoryMenu);

var _pageItem = require('./components/page-item');

var _pageItem2 = _interopRequireDefault(_pageItem);

var _sidebarMenu = require('./components/sidebar-menu');

var _sidebarMenu2 = _interopRequireDefault(_sidebarMenu);

var _sidebarWidget = require('./components/sidebar-widget');

var _sidebarWidget2 = _interopRequireDefault(_sidebarWidget);

var _googleMap = require('./components/gmap/google-map');

var _googleMap2 = _interopRequireDefault(_googleMap);

var _pagination = require('./components/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Title = require('./components/section-title');
var PageArticle = require('./components/page-article');
var Image = require('./components/image');
var RenderDelay = require('./components/_commons/delay-render');

module.exports = {
    RenderDelay: RenderDelay,
    Title: Title,
    PageArticle: PageArticle,
    Image: Image,
    ConnectedBreacrumbs: _connectedBreacrumbs2.default,
    Sidebar: _sidebar2.default,
    CategoryMenu: _categoryMenu2.default,
    PageItem: _pageItem2.default,
    SidebarMenu: _sidebarMenu2.default,
    SidebarWidget: _sidebarWidget2.default,
    GoogleMap: _googleMap2.default,
    Pagination: _pagination2.default
};

},{"./components/_commons/delay-render":36,"./components/category-menu":38,"./components/connected-breacrumbs":39,"./components/gmap/google-map":42,"./components/image":48,"./components/page-article":49,"./components/page-item":50,"./components/pagination":51,"./components/section-title":56,"./components/sidebar":59,"./components/sidebar-menu":57,"./components/sidebar-widget":58}],36:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DelayRender = function DelayRender() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (Element) {
    return function (_React$Component) {
      _inherits(Component, _React$Component);

      function Component() {
        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));

        _this.state = { ready: true };
        return _this;
      }

      _createClass(Component, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this2 = this;

          var delay = args.delay,
              onRender = args.onRender;

          var d = parseInt(delay, 10);
          if (d && d > 0) {
            this.setState({ ready: false });
            this.timeout = setTimeout(function () {
              _this2.setState({ ready: true });
              if (onRender && typeof onRender === 'function') {
                onRender();
              }
            }, delay);
          } else {
            this.setState({ ready: true });
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          if (this.state.ready) {
            return React.createElement(Element, this.props);
          }
          return null;
        }
      }]);

      return Component;
    }(React.Component);
  };
};

module.exports = DelayRender;

},{}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

var _reactRedux = require('react-redux');

var DuAn = require('../../../du-an/index');

var renderRoute = function renderRoute(route) {
    var name = route.name,
        childRoutes = route.childRoutes,
        redirectToChild = route.redirectToChild,
        path = route.path,
        component = route.component;


    if (redirectToChild != null || redirectToChild != undefined) return React.createElement(
        _reactRouter.Switch,
        { key: name },
        childRoutes.map(function (child, index) {

            if (String(child.path).startsWith('/:')) child.path = path + child.path;

            if (!child.component) child.component = component;
            return renderRoute(child);
        }),
        React.createElement(_reactRouter.Redirect, { from: path, to: path + childRoutes[redirectToChild].defaultLocation })
    );

    return React.createElement(_reactRouter.Route, _extends({ key: name }, route));
};

var renderRoutes = function renderRoutes(_ref) {
    var path = _ref.path,
        exact = _ref.exact,
        component = _ref.component,
        childRoutes = _ref.childRoutes;

    var routeComponents = childRoutes.map(renderRoute);

    //Root route
    routeComponents.unshift(React.createElement(_reactRouter.Route, { exact: exact, key: path, path: path, component: component }));

    return routeComponents;
};

var ExtendedConnectedRouter = function ExtendedConnectedRouter(_ref2) {
    var routes = _ref2.routes,
        history = _ref2.history,
        wrapper = _ref2.wrapper;

    var Wrapper = wrapper;
    return React.createElement(
        _reactRouterRedux.ConnectedRouter,
        { history: history },
        React.createElement(
            Wrapper,
            null,
            routes && renderRoutes(routes)
        )
    );
};

var stateToProps = function stateToProps(state) {
    return {
        routes: state.appRouter.routes
    };
};

exports.default = (0, _reactRedux.connect)(stateToProps)(ExtendedConnectedRouter);

},{"../../../du-an/index":12,"react-redux":"react-redux","react-router":"react-router","react-router-redux":"react-router-redux"}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _listToTree = require('list-to-tree');

var _listToTree2 = _interopRequireDefault(_listToTree);

var _reactstrap = require('reactstrap');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CategoryMenu = function (_React$Component) {
    _inherits(CategoryMenu, _React$Component);

    function CategoryMenu(props) {
        _classCallCheck(this, CategoryMenu);

        var _this = _possibleConstructorReturn(this, (CategoryMenu.__proto__ || Object.getPrototypeOf(CategoryMenu)).call(this, props));

        var categories = props.categories,
            openListByDefault = props.openListByDefault;


        var tree = new _listToTree2.default(categories, { key_parent: 'parentId', key_child: 'children' }).GetTree();

        var collapse = {};

        for (var index in categories) {
            collapse[categories[index].name] = openListByDefault;
        }

        _this.state = {
            collapse: collapse,
            tree: tree
        };

        _this.renderCategories = _this.renderCategories.bind(_this);
        _this.renderCategory = _this.renderCategory.bind(_this);
        return _this;
    }

    _createClass(CategoryMenu, [{
        key: 'renderCategories',
        value: function renderCategories(categoryItems) {
            var _this2 = this;

            return React.createElement(
                'ul',
                { className: 'category-menu-dropdown' },
                categoryItems.map(function (categoryItem, index) {
                    return _this2.renderCategory(categoryItem);
                })
            );
        }
    }, {
        key: 'renderCategory',
        value: function renderCategory(_ref, className) {
            var _this3 = this;

            var title = _ref.title,
                id = _ref.id,
                name = _ref.name,
                children = _ref.children;
            var _props = this.props,
                onDataFetch = _props.onDataFetch,
                currentCategory = _props.currentCategory;


            return React.createElement(
                'li',
                { id: id && 'category-' + id, 'data-name': name, className: (0, _classnames2.default)("category-menu-item", className, { 'current': currentCategory && currentCategory.id === id }) },
                React.createElement(
                    'a',
                    { href: '#', className: 'all category-menu-item-link', onClick: function onClick(e) {
                            e.preventDefault();
                            onDataFetch({ currentCategory: { title: title, id: id, name: name } }, 0);
                        } },
                    title
                ),
                children && React.createElement(
                    'span',
                    { className: 'chevron', onClick: function onClick() {
                            _this3.toogle(name);
                        } },
                    React.createElement('i', { className: 'fa fa-angle-down', 'aria-hidden': 'true' })
                ),
                children && React.createElement(
                    _reactstrap.Collapse,
                    { isOpen: this.state.collapse[name] },
                    this.renderCategories(children)
                )
            );
        }
    }, {
        key: 'toogle',
        value: function toogle(name) {
            var collapse = this.state.collapse;

            this.setState({ collapse: $.extend(true, {}, collapse, _defineProperty({}, name, !collapse[name])) });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var currentCategory = this.props.currentCategory;
            var tree = this.state.tree;

            return React.createElement(
                'section',
                { className: 'category-menu' },
                React.createElement(
                    'ul',
                    { className: 'category-menu-list d-none d-lg-block' },
                    this.renderCategory({ title: localizationString.getString('Tất cả') }, !currentCategory && 'current'),
                    tree && tree.map(function (item) {
                        return _this4.renderCategory(item);
                    })
                )
            );
        }
    }]);

    return CategoryMenu;
}(React.Component);

CategoryMenu.defaultProps = {
    categories: [],
    openListByDefault: true
};

exports.default = CategoryMenu;

},{"classnames":"classnames","list-to-tree":"list-to-tree","reactstrap":"reactstrap"}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactstrap = require('reactstrap');

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var ConnectedBreadcrumbs = function ConnectedBreadcrumbs(props) {
    var routes = props.routes,
        params = props.params;

    if (routes) return React.createElement(
        _reactstrap.Container,
        { className: 'd-none d-lg-block mb-lg-4' },
        React.createElement(
            'div',
            { className: 'breadcrumbs' },
            routes.map(function (route, index) {
                var isLast = route.path === routes[routes.length - 1].path;

                return React.createElement(
                    'span',
                    { key: index, className: '' },
                    !isLast ? React.createElement(
                        _reactRouterDom.Link,
                        { to: route.path },
                        route.label
                    ) : React.createElement(
                        'a',
                        null,
                        route.label
                    )
                );
            })
        )
    );else return null;
};

ConnectedBreadcrumbs.defaultProps = {
    routes: []
};

var stateToProps = function stateToProps(state) {
    return {
        routes: state.appRouter.routePath
    };
};

exports.default = (0, _reactRedux.connect)(stateToProps)(ConnectedBreadcrumbs);

},{"react-redux":"react-redux","react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],40:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-router-dom'),
    Link = _require.Link;

var DuAn = function (_React$Component) {
    _inherits(DuAn, _React$Component);

    function DuAn(props) {
        _classCallCheck(this, DuAn);

        var _this = _possibleConstructorReturn(this, (DuAn.__proto__ || Object.getPrototypeOf(DuAn)).call(this, props));

        _this.renderLink = _this.renderLink.bind(_this);
        return _this;
    }

    _createClass(DuAn, [{
        key: "renderLink",
        value: function renderLink(title) {
            return React.createElement(
                Link,
                { to: "/du-an" },
                React.createElement(
                    "span",
                    null,
                    title
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _props$data = this.props.data,
                thumbnailUrl = _props$data.thumbnailUrl,
                title = _props$data.title;


            return React.createElement(
                "div",
                { "data-aos": "zoom-in-up" },
                React.createElement(
                    "div",
                    { className: "page-item-thumbnail" },
                    React.createElement("img", { className: "w-100", src: "/" + thumbnailUrl }),
                    React.createElement("div", { className: "overlay" }),
                    this.renderLink(localizationString.getString("Chi tiết"))
                ),
                React.createElement(
                    "div",
                    { className: "page-item-title" },
                    this.renderLink(title)
                )
            );
        }
    }]);

    return DuAn;
}(React.Component);

module.exports = DuAn;

},{"react-router-dom":"react-router-dom"}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * marker visual parameters
 * image param is more prior than imageClass if both defined
 */

var markerDescriptions = [{
    size: { width: 33, height: 51 },
    origin: { x: 15 / 33, y: 1 },
    withText: true,
    // image: require('icons/map_icons/map_icon_text_red.svg')
    imageClass: 'map_icon_text_red'
}];

exports.default = markerDescriptions;

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactControllables = require('react-controllables');

var _reactControllables2 = _interopRequireDefault(_reactControllables);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _googleMapReact = require('google-map-react');

var _googleMapReact2 = _interopRequireDefault(_googleMapReact);

var _marker = require('./marker.jsx');

var _marker2 = _interopRequireDefault(_marker);

var _calcMarkersVisibility = require('./helpers/calc-markers-visibility.js');

var _markerDescriptions = require('./constants/marker-descriptions.js');

var _markerDescriptions2 = _interopRequireDefault(_markerDescriptions);

var _customDistance = require('./helpers/custom-distance.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var K_MARGIN_TOP = 30;
var K_MARGIN_RIGHT = 30;
var K_MARGIN_BOTTOM = 30;
var K_MARGIN_LEFT = 30;

var K_HOVER_DISTANCE = 30;

var MainMapBlock = (_dec = (0, _reactControllables2.default)(['center', 'zoom', 'markers']), _dec(_class = (_temp = _class2 = function (_Component) {
    _inherits(MainMapBlock, _Component);

    function MainMapBlock(props) {
        _classCallCheck(this, MainMapBlock);

        var _this = _possibleConstructorReturn(this, (MainMapBlock.__proto__ || Object.getPrototypeOf(MainMapBlock)).call(this, props));

        _this.shouldComponentUpdate = _function2.default;

        _this._onBoundsChange = function (_ref) {
            var center = _ref.center,
                zoom = _ref.zoom,
                bounds = _ref.bounds,
                marginBounds = _ref.marginBounds;
        };

        _this._onChildClick = function (key, childProps) {
            var markerId = childProps.marker.id;
            var index = _this.props.markers.findIndex(function (m) {
                return m.id === markerId;
            });
            var currentMarker = _this.props.markers[index];
            if (currentMarker.redirect) _this.props.dispatch((0, _reactRouterRedux.push)(currentMarker.redirect));else _this.setState({ openBallonIndex: index });
        };

        _this._onChildMouseEnter = function (key, childProps) {
            var markerId = childProps.marker.id;
            var index = _this.props.markers.findIndex(function (m) {
                return m.id === markerId;
            });
            if (_this.props.onMarkerHover) {
                _this.props.onMarkerHover(index);
            }
        };

        _this._onChildMouseLeave = function () /* key, childProps */{
            if (_this.props.onMarkerHover) {
                _this.props.onMarkerHover(-1);
            }
        };

        _this._onBalloonCloseClick = function () {
            if (_this.props.onChildClick) {
                _this.props.onChildClick(-1);
            }
        };

        _this._distanceToMouse = _customDistance.customDistanceToMouse;

        _this.state = {};
        return _this;
    }

    _createClass(MainMapBlock, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _props = this.props,
                center = _props.center,
                zoom = _props.zoom;

            if (nextProps.center != center || nextProps.zoom != zoom) {
                this.props.onCenterChange(center);
                this.props.onZoomChange(zoom);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _getRealFromTo = (0, _calcMarkersVisibility.getRealFromTo)(this.props.visibleRowFirst, this.props.visibleRowLast, this.props.maxVisibleRows, this.props.markers.length),
                rowFrom = _getRealFromTo.rowFrom,
                rowTo = _getRealFromTo.rowTo;

            var Markers = this.props.markers &&
            //this.props.markers.filter((m, index) => index >= rowFrom && index <= rowTo)
            this.props.markers.map(function (marker, index) {
                return _react2.default.createElement(_marker2.default
                // required props
                , _extends({ key: marker.id,
                    lat: marker.lat,
                    lng: marker.lng
                    // any user props
                    , showBallon: marker.id === _this2.props.showBalloonForMarker,
                    onCloseClick: _this2._onBalloonCloseClick,
                    renderMarkerContent: _this2.props.renderMarkerContent
                    //hoveredAtTable={ index + rowFrom === this.props.hoveredRowIndex }
                    , scale: (0, _calcMarkersVisibility.getScale)(index + rowFrom, _this2.props.visibleRowFirst, _this2.props.visibleRowLast, _marker.K_SCALE_NORMAL)
                }, _markerDescriptions2.default[0], {
                    marker: marker }));
            });

            return _react2.default.createElement(
                _googleMapReact2.default,
                {
                    bootstrapURLKeys: { key: "AIzaSyBB5V34f3crBWyutuwFCy73IzRCdIwqUrI" },
                    center: this.props.center,
                    zoom: this.props.zoom,
                    options: this.props.options,
                    onChange: this._onBoundsChange,
                    onChildClick: this._onChildClick,
                    onChildMouseEnter: this._onChildMouseEnter,
                    onChildMouseLeave: this._onChildMouseLeave,
                    margin: [K_MARGIN_TOP, K_MARGIN_RIGHT, K_MARGIN_BOTTOM, K_MARGIN_LEFT],
                    hoverDistance: K_HOVER_DISTANCE,
                    distanceToMouse: this._distanceToMouse
                },
                Markers
            );
        }
    }]);

    return MainMapBlock;
}(_react.Component), _class2.propTypes = {
    onCenterChange: _propTypes2.default.func, // @controllable generated fn
    onZoomChange: _propTypes2.default.func, // @controllable generated fn
    onBoundsChange: _propTypes2.default.func,
    onMarkerHover: _propTypes2.default.func,
    onChildClick: _propTypes2.default.func,
    center: _propTypes2.default.any,
    zoom: _propTypes2.default.number,
    markers: _propTypes2.default.any,
    visibleRowFirst: _propTypes2.default.number,
    visibleRowLast: _propTypes2.default.number,
    maxVisibleRows: _propTypes2.default.number,
    hoveredRowIndex: _propTypes2.default.number,
    openBallonIndex: _propTypes2.default.number
}, _class2.defaultProps = {
    center: [15.866913899999986, 104.1218629],
    zoom: 5,
    options: {
        styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#878787" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "invert_lightness": true }, { "weight": "3.37" }, { "gamma": "5" }, { "saturation": "0" }, { "lightness": "0" }] }]
    },
    visibleRowFirst: -1,
    visibleRowLast: -1,
    hoveredRowIndex: -1,
    maxVisibleRows: 10,
    markers: []
}, _temp)) || _class);
exports.default = (0, _reactRedux.connect)()(MainMapBlock);

},{"./constants/marker-descriptions.js":41,"./helpers/calc-markers-visibility.js":44,"./helpers/custom-distance.js":45,"./marker.jsx":47,"google-map-react":"google-map-react","prop-types":"prop-types","react":"react","react-controllables":"react-controllables","react-pure-render/function":76,"react-redux":"react-redux","react-router-redux":"react-router-redux"}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHintBaloonVerticalPosClass = getHintBaloonVerticalPosClass;
exports.getHintBaloonHorizontalPosStyle = getHintBaloonHorizontalPosStyle;
exports.getHintBottomOffsetClass = getHintBottomOffsetClass;
var K_MAX_BALLOON_HEIGHT = 120;

function getHintBaloonVerticalPosClass(y, mapHeight, balloonHeight) {
    balloonHeight = balloonHeight || K_MAX_BALLOON_HEIGHT;

    return y > balloonHeight ? 'hint--top' : 'hint--bottom';
}

function getHintBaloonHorizontalPosStyle(x, markerWidth, markerOffset, mapWidth) {
    var K_BALLOON_WIDTH_BASE = 250;
    // offset from map side
    var K_BALLOON_MAP_OFFSET = 10;
    // balloon with not more than map width
    var K_BALLOON_WIDTH = Math.min(K_BALLOON_WIDTH_BASE, mapWidth - 2 * K_BALLOON_MAP_OFFSET);
    // default ballon offset from arrow center i want
    var K_BALLOON_DEFAULT_OFFSET = K_BALLOON_WIDTH * 0.15;
    // from corner
    var offset = -K_BALLOON_DEFAULT_OFFSET + markerWidth * 0.5;
    // overflow in px (marker assymetric)
    var leftX = x + offset - markerWidth * markerOffset;
    var rightX = leftX + K_BALLOON_WIDTH;
    // recalc if overflow
    var mapOffset = offset + Math.min(0, mapWidth - K_BALLOON_MAP_OFFSET - rightX) + Math.max(0, K_BALLOON_MAP_OFFSET - leftX);

    var K_BALLOON_WIDTH_STYLE = {
        width: K_BALLOON_WIDTH + 'px',
        left: mapOffset + 'px',
        marginLeft: '0px'
    };
    return K_BALLOON_WIDTH_STYLE;
}

function getHintBottomOffsetClass(markerWidth, markerOffset) {
    var K_HINT_ARROW_WIDTH = 12;
    var offset = Math.round(-(markerWidth / 2 + K_HINT_ARROW_WIDTH / 2 - markerOffset * markerWidth));
    if (__DEV__) {
        if (offset < -40 || offset > 40) {
            console.error('HintBottomOffset is out of range, extend range at sass/markers/map_marker.sass'); // eslint-disable-line no-console
        }
    }
    // classes generated at sass/markers/map_marker.sass
    return 'map-marker--hint-bottom-delta-' + offset;
}

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getScale = getScale;
exports.getRealFromTo = getRealFromTo;
// import {K_SCALE_NORMAL} from 'components/markers/map_marker.jsx';
// import invariant from 'fixed-data-table-ice/internal/invariant.js';

// {l: 10, scale: 0.3}, {l: 5, scale: 0.4} - означает
// 10 элементов размера 0.3, потом 5 размера 0.4, потом те что видны в табличке обычного размера
// потом снова потом 5 размера 0.4, и 10 элементов размера 0.3
// если поставить пусто то на карте будут видны тока те что на экране
var K_SCALE_SMALL = 0.3;
var K_SCALE_MEDIUM = 0.45;
var K_BEFORE_AFTER_SCALES = [{ l: 15, scale: K_SCALE_SMALL }, { l: 10, scale: K_SCALE_MEDIUM }];
var K_SCALES_SUM = K_BEFORE_AFTER_SCALES.reduce(function (sum, el) {
    return el.l + sum;
}, 0);

function getScale(rowIndex, rowFrom, rowTo, K_SCALE_NORMAL) {
    if (rowIndex >= rowFrom && rowIndex <= rowTo) {
        return K_SCALE_NORMAL;
    }

    if (K_BEFORE_AFTER_SCALES.length) {
        if (rowIndex < rowFrom) {
            var deltaS = rowFrom;
            for (var index = K_BEFORE_AFTER_SCALES.length - 1; index >= 0; --index) {
                deltaS -= K_BEFORE_AFTER_SCALES[index].l;
                if (rowIndex >= deltaS) {
                    return K_BEFORE_AFTER_SCALES[index].scale;
                }
            }

            // yes, the code can be here (dirty calculus)
            return K_BEFORE_AFTER_SCALES[0].scale;
        }

        if (rowIndex > rowTo) {
            var _deltaS = rowTo;
            for (var _index = K_BEFORE_AFTER_SCALES.length - 1; _index >= 0; --_index) {
                _deltaS += K_BEFORE_AFTER_SCALES[_index].l;
                if (rowIndex <= _deltaS) {
                    return K_BEFORE_AFTER_SCALES[_index].scale;
                }
            }

            // yes, the code can be here (dirty calculus)
            return K_BEFORE_AFTER_SCALES[0].scale;
        }
    }
    return K_SCALE_NORMAL;
}

// this calculations is not precise (dirty)
function _getRealFromTo(rowFrom, rowTo, maxVisibleRows, totalSize) {
    var addFrom = rowFrom + maxVisibleRows + K_SCALES_SUM > totalSize - 1 ? rowFrom + maxVisibleRows + K_SCALES_SUM - (totalSize - 1) : 0;

    var dadd = K_SCALES_SUM - rowFrom;
    var addTo = dadd >= 0 ? dadd : 0;

    return {
        rowFrom: Math.max(0, rowFrom - K_SCALES_SUM - addFrom),
        rowTo: Math.min(totalSize - 1, rowFrom + maxVisibleRows + K_SCALES_SUM + addTo)
    };
}

function getRealFromTo(rowFrom, rowTo, maxVisibleRows, totalSize) {
    var current = _getRealFromTo(rowFrom, rowTo, maxVisibleRows, totalSize);

    var result = {
        rowFrom: current.rowFrom,
        rowTo: current.rowTo
    };

    return result;
}

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.customDistanceToMouse = customDistanceToMouse;
function customDistanceToMouse(pt, mousePos, markerProps) {
    var K_SCALE_NORMAL = 0.65;

    var K_MARKER_HEIGHT = 60;
    // marker is more tall at top, so calc distance to some point at marker top
    var K_MARKER_WEIGHT_PT = K_MARKER_HEIGHT * 0.7;
    // distance to markers depends on scale so hover on big markers is more probable
    var scale = markerProps.scale;
    var x = pt.x;
    var y = pt.y - K_MARKER_WEIGHT_PT * scale;

    var scaleNormalized = Math.min(scale / K_SCALE_NORMAL, 1);
    var K_MIN_DIST_MIN_KOEF = 0.6;

    var distKoef = 1 + scaleNormalized * (K_MIN_DIST_MIN_KOEF - 1);
    return distKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
}

},{}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMarkerHolderStyle = getMarkerHolderStyle;
exports.getMarkerStyle = getMarkerStyle;
exports.getMarkerTextStyle = getMarkerTextStyle;
function getMarkerHolderStyle(size, origin) {
  var left = -size.width * origin.x;
  var top = -size.height * origin.y;
  return {
    position: 'absolute',
    width: size.width,
    height: size.height,
    left: left,
    top: top,
    cursor: 'pointer'
  };
}

function getMarkerStyle(size, origin) {
  var sizeOriginX = size.width * origin.x;
  var sizeOriginY = size.height * origin.y;

  return {
    position: 'absolute',
    width: size.width,
    height: size.height,
    left: 0,
    top: 0,
    willChange: 'transform', // it looks like this setting make firefox random marker movements smaller
    backgroundSize: size.width + 'px ' + size.height + 'px',
    backgroundRepeat: 'no-repeat',
    // transition: 'transform 0.25s ease',
    transition: 'transform 0.25s cubic-bezier(0.485, 1.650, 0.545, 0.835)',
    WebkitTransition: '-webkit-transform 0.25s cubic-bezier(0.485, 1.650, 0.545, 0.835)',
    transformOrigin: sizeOriginX + 'px ' + sizeOriginY + 'px',
    WebkitTransformOrigin: sizeOriginX + 'px ' + sizeOriginY + 'px'
  };
}

var textStyle_ = {
  width: '100%',
  textAlign: 'center',
  marginTop: 10,
  fontWeight: 'bold',
  fontSize: '18px',
  color: 'black'
};

function getMarkerTextStyle() {
  return textStyle_;
}

},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.K_SCALE_NORMAL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactControllables = require('react-controllables');

var _reactControllables2 = _interopRequireDefault(_reactControllables);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _balloonPos = require('./helpers/balloon-pos.js');

var _markerStyles = require('./helpers/marker-styles.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var K_HINT_HTML_DEFAULT_Z_INDEX = 1000000;
var K_SCALE_HOVER = 1;
var K_SCALE_TABLE_HOVER = 1;
var K_SCALE_NORMAL = 0.65;
var K_MIN_CONTRAST = 0.4;

function calcMarkerMarkerStyle(scale, zIndexStyle, markerStyle, imageStyle) {
    var contrast = K_MIN_CONTRAST + (1 - K_MIN_CONTRAST) * Math.min(scale / K_SCALE_NORMAL, 1);

    return _extends({
        transform: 'scale(' + scale + ' , ' + scale + ')',
        WebkitTransform: 'scale(' + scale + ' , ' + scale + ')',
        filter: 'contrast(' + contrast + ')',
        WebkitFilter: 'contrast(' + contrast + ')'
    }, markerStyle, zIndexStyle, imageStyle);
}

function calcMarkerTextStyle(scale, markerTextStyle) {
    var K_MAX_COLOR_VALUE = 0;
    var K_MIN_COLOR_VALUE = 8;
    var colorV = Math.ceil(K_MIN_COLOR_VALUE + (K_MAX_COLOR_VALUE - K_MIN_COLOR_VALUE) * Math.min(scale / K_SCALE_NORMAL, 1));
    var colorHex = colorV.toString(16);
    var colorHTML = '#' + colorHex + colorHex + colorHex;

    return _extends({}, markerTextStyle, {
        color: colorHTML
    });
}

exports.K_SCALE_NORMAL = K_SCALE_NORMAL;
var MapMarker = (_dec = (0, _reactControllables2.default)(['hoverState', 'showBallonState']), _dec(_class = (_temp = _class2 = function (_Component) {
    _inherits(MapMarker, _Component);

    function MapMarker(props) {
        _classCallCheck(this, MapMarker);

        var _this = _possibleConstructorReturn(this, (MapMarker.__proto__ || Object.getPrototypeOf(MapMarker)).call(this, props));

        _this.shouldComponentUpdate = _function2.default;

        _this._onShowBallonStateChange = function () {
            var _this$props;

            if (!_this.alive) return;
            (_this$props = _this.props).onShowBallonStateChange.apply(_this$props, arguments);
        };

        _this._onHoverStateChange = function () {
            var _this$props2;

            if (!_this.alive) return;
            (_this$props2 = _this.props).onHoverStateChange.apply(_this$props2, arguments);
        };

        _this._onMouseEnterContent = function () /*e*/{
            _this.props.$onMouseAllow(false); // disable mouse move hovers
        };

        _this._onMouseLeaveContent = function () /*e*/{
            _this.props.$onMouseAllow(true); // enable mouse move hovers
        };

        _this._onCloseClick = function () {
            if (_this.props.onCloseClick) {
                _this.props.onCloseClick();
            }
        };

        _this.alive = true;
        return _this;
    }

    _createClass(MapMarker, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // if (this.props.onCloseClick) {
            //   this.props.onCloseClick();
            // }
            this.alive = false;
        }

        // no optimizations at all

    }, {
        key: 'render',
        value: function render() {
            var scale = this.props.$hover || this.props.showBallon ? K_SCALE_HOVER : K_SCALE_NORMAL;
            scale = this.props.hoveredAtTable ? K_SCALE_TABLE_HOVER : scale;

            var markerHolderStyle = (0, _markerStyles.getMarkerHolderStyle)(this.props.size, this.props.origin);
            var markerStyle = (0, _markerStyles.getMarkerStyle)(this.props.size, this.props.origin);

            var zIndexStyle = {
                zIndex: Math.round(scale * 10000) - (this.props.showBallon ? 20 : 0) + (this.props.$hover ? K_HINT_HTML_DEFAULT_Z_INDEX : 0) // balloon
            };

            var textStyleDef = (0, _markerStyles.getMarkerTextStyle)();
            var textStyle = calcMarkerTextStyle(scale, textStyleDef);

            var showHint = this.props.hoverState || this.props.showBallonState; // || this.props.hoveredAtTable;

            // baloon position calc
            var mapWidth = this.props.$geoService.getWidth();
            var mapHeight = this.props.$geoService.getHeight();
            var markerDim = this.props.$getDimensions(this.props.$dimensionKey);

            var hintBaloonHorizontalPosStyle = (0, _balloonPos.getHintBaloonHorizontalPosStyle)(markerDim.x, this.props.size.width, this.props.origin.x, mapWidth);
            var hintBaloonVerticalPosClass = (0, _balloonPos.getHintBaloonVerticalPosClass)(markerDim.y, mapHeight, this.props.marker.height);

            var hintBalloonBottomOffsetClass = (0, _balloonPos.getHintBottomOffsetClass)(this.props.size.width, this.props.origin.x);

            // set baloon position at first and then animate (it must be some lib for react animations)
            var noTransClass = this.props.$hover === true && this.props.hoverState !== true ? 'hint--notrans' : '';
            var noTransBalloonClass = this.props.showBallon === true && this.props.showBallonState !== true ? 'hint--notrans' : '';

            var imageClass = this.props.image ? '' : this.props.imageClass;
            var imageStyle = this.props.image ? {
                backgroundImage: 'url(' + this.props.image + ')'
            } : null;

            var styleMarkerMarker = calcMarkerMarkerStyle(scale, zIndexStyle, markerStyle, imageStyle);

            // css hints library https://github.com/istarkov/html-hint
            return _react2.default.createElement(
                'div',
                {
                    style: markerHolderStyle,
                    className: (0, _classnames2.default)('map-marker hint hint--html', this.props.hintType, hintBalloonBottomOffsetClass, noTransClass, noTransBalloonClass, hintBaloonVerticalPosClass, this.props.showBallon ? 'hint--balloon' : '', showHint ? 'hint--always' : 'hint--hidden') },
                _react2.default.createElement(
                    'div',
                    {
                        style: styleMarkerMarker,
                        className: (0, _classnames2.default)('map-marker__marker', imageClass) },
                    this.props.withText ? _react2.default.createElement(
                        'div',
                        { style: textStyle },
                        this.props.marker.number
                    ) : _react2.default.createElement('div', null)
                ),
                _react2.default.createElement(
                    'div',
                    { style: hintBaloonHorizontalPosStyle, className: (0, _classnames2.default)('hint__content map-marker-hint', this.props.showBallon ? '' : 'noevents'),
                        onMouseEnter: this._onMouseEnterContent,
                        onMouseLeave: this._onMouseLeaveContent },
                    this.props.renderMarkerContent(this.props.marker)
                )
            );
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var _this2 = this;

            var K_TRANS_DELAY = 30;

            if (prevProps.$hover !== this.props.$hover) {
                setTimeout(function () {
                    return _this2._onHoverStateChange(_this2.props.$hover);
                }, K_TRANS_DELAY);
            }

            if (prevProps.showBallon !== this.props.showBallon) {
                setTimeout(function () {
                    return _this2._onShowBallonStateChange(_this2.props.showBallon);
                }, K_TRANS_DELAY);
            }
        }
    }]);

    return MapMarker;
}(_react.Component), _class2.propTypes = {
    $hover: _propTypes2.default.bool,
    $dimensionKey: _propTypes2.default.any,
    $getDimensions: _propTypes2.default.func,
    $geoService: _propTypes2.default.any,
    $onMouseAllow: _propTypes2.default.func,

    marker: _propTypes2.default.any,
    hoveredAtTable: _propTypes2.default.bool,
    scale: _propTypes2.default.number,
    showBallon: _propTypes2.default.bool,
    onCloseClick: _propTypes2.default.func,
    showBallonState: _propTypes2.default.bool.isRequired,
    onShowBallonStateChange: _propTypes2.default.func.isRequired,

    // animation helpers
    hoverState: _propTypes2.default.bool.isRequired,
    onHoverStateChange: _propTypes2.default.func.isRequired,

    size: _propTypes2.default.any,
    origin: _propTypes2.default.any,
    imageClass: _propTypes2.default.string,
    image: _propTypes2.default.string,
    withText: _propTypes2.default.bool,
    hintType: _propTypes2.default.string
}, _class2.defaultProps = {
    scale: K_SCALE_NORMAL,
    hoverState: false,
    showBallonState: false,
    withText: false,
    size: { width: 62, height: 60 },
    origin: { x: 15 / 62, y: 1 },
    imageClass: 'map-marker__marker--big',
    hintType: 'hint--info'
}, _temp)) || _class);
exports.default = MapMarker;

},{"./helpers/balloon-pos.js":43,"./helpers/marker-styles.js":46,"classnames":"classnames","prop-types":"prop-types","react":"react","react-controllables":"react-controllables","react-pure-render/function":76}],48:[function(require,module,exports){
"use strict";

module.exports = function (props) {
    var url = props.url,
        title = props.title,
        description = props.description,
        className = props.className;


    return React.createElement("img", { className: "w-100 " + className, src: "/" + url, title: title, alt: description });
};

},{}],49:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var classnames = require('classNames');

var _require = require('reactstrap'),
    Container = _require.Container,
    Row = _require.Row;

var Title = require('./section-title');
var Image = require('./image');

var renderArticle = function renderArticle(props) {
    var className = props.className,
        thumbnail = props.thumbnail,
        title = props.title,
        content = props.content;

    return React.createElement(
        'article',
        { className: classnames(className) },
        React.createElement(
            Container,
            { fluid: true, className: 'mb-5' },
            React.createElement(
                Row,
                null,
                React.createElement(Image, _extends({ className: 'h-100' }, thumbnail))
            )
        ),
        React.createElement(
            Container,
            null,
            React.createElement(
                Title,
                null,
                title
            ),
            React.createElement('div', { className: 'ml-3 mr-3 ml-lg-0 mr-lg-0', dangerouslySetInnerHTML: { __html: content } })
        )
    );
};

module.exports = renderArticle;

},{"./image":48,"./section-title":56,"classNames":75,"reactstrap":"reactstrap"}],50:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('react-router-dom'),
    Link = _require.Link;

var PageItem = function (_React$Component) {
    _inherits(PageItem, _React$Component);

    function PageItem(props) {
        _classCallCheck(this, PageItem);

        var _this = _possibleConstructorReturn(this, (PageItem.__proto__ || Object.getPrototypeOf(PageItem)).call(this, props));

        _this.renderLink = _this.renderLink.bind(_this);
        return _this;
    }

    _createClass(PageItem, [{
        key: "renderLink",
        value: function renderLink(title) {
            var path = this.props.path;

            return React.createElement(
                Link,
                { to: path },
                React.createElement(
                    "span",
                    null,
                    title
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                _props$data = _props.data,
                thumbnailUrl = _props$data.thumbnailUrl,
                title = _props$data.title,
                extraText = _props.extraText;


            return React.createElement(
                "div",
                { className: "page-item-wrapper" },
                React.createElement(
                    "div",
                    { className: "page-item-thumbnail" },
                    React.createElement("img", { className: "w-100", src: "/" + thumbnailUrl }),
                    React.createElement("div", { className: "overlay" }),
                    this.renderLink(localizationString.getString("Chi tiết"))
                ),
                React.createElement(
                    "div",
                    { className: "page-item-title" },
                    this.renderLink(title),
                    React.createElement(
                        "span",
                        { className: "extra-text" },
                        extraText
                    )
                )
            );
        }
    }]);

    return PageItem;
}(React.Component);

PageItem.defautProps = {
    basePath: '/',
    extraText: '',
    data: {
        title: 'Missing title!',
        thumbnailUrl: '/img/default.png'
    }
};

module.exports = PageItem;

},{"react-router-dom":"react-router-dom"}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _pager = require('./pagination/pager');

var _pager2 = _interopRequireDefault(_pager);

var _itemContainer = require('./pagination/item-container');

var _itemContainer2 = _interopRequireDefault(_itemContainer);

var _pagerAjax = require('./pagination/pager-ajax');

var _pagerAjax2 = _interopRequireDefault(_pagerAjax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var componentName = (_temp = _class = function (_Component) {
    _inherits(componentName, _Component);

    function componentName(props) {
        _classCallCheck(this, componentName);

        var _this = _possibleConstructorReturn(this, (componentName.__proto__ || Object.getPrototypeOf(componentName)).call(this, props));

        _this.state = {
            currentPage: 1
        };
        _this.onItemsChange = _this.onItemsChange.bind(_this);
        return _this;
    }

    _createClass(componentName, [{
        key: 'onItemsChange',
        value: function onItemsChange(pageItems, currentPage, totalPages) {
            this.setState({ pageItems: pageItems, currentPage: currentPage, totalPages: totalPages });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                items = _props.items,
                itemPerPage = _props.itemPerPage,
                layout = _props.layout,
                renderItem = _props.renderItem,
                itemWrapperClassName = _props.itemWrapperClassName,
                getPageUrl = _props.getPageUrl,
                currentPage = _props.currentPage,
                totalPages = _props.totalPages;

            //ItemContainer will render current page item

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)(className, "pagination-container") },
                _react2.default.createElement(_itemContainer2.default, { className: "mb-4",
                    items: this.state.pageItems || items,
                    layout: layout,
                    renderItem: renderItem,
                    itemWrapperClassName: itemWrapperClassName }),
                getPageUrl ? _react2.default.createElement(_pagerAjax2.default, { className: 'float-right',
                    currentPage: currentPage,
                    totalPages: totalPages,
                    itemPerPage: itemPerPage,
                    getPageUrl: getPageUrl,
                    onItemsChange: this.onItemsChange
                }) : _react2.default.createElement(_pager2.default, { className: 'float-right',
                    items: items,
                    itemPerPage: itemPerPage,
                    onItemsChange: this.onItemsChange
                })
            );
        }
    }]);

    return componentName;
}(_react.Component), _class.propTypes = {
    renderItem: _propTypes2.default.func.isRequired
}, _class.defaultProps = {
    items: [],
    itemPerPage: 9,
    layout: {
        xs: 12, sm: 6, md: 4, lg: 4, xl: 4
    }
}, _temp);
exports.default = componentName;

},{"./pagination/item-container":52,"./pagination/pager":55,"./pagination/pager-ajax":54,"classnames":"classnames","prop-types":"prop-types","react":"react"}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactstrap = require('reactstrap');

var _itemWrapper = require('./item-wrapper');

var _itemWrapper2 = _interopRequireDefault(_itemWrapper);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagingItemContainer = (_temp = _class = function (_Component) {
    _inherits(PagingItemContainer, _Component);

    function PagingItemContainer(props) {
        _classCallCheck(this, PagingItemContainer);

        var _this = _possibleConstructorReturn(this, (PagingItemContainer.__proto__ || Object.getPrototypeOf(PagingItemContainer)).call(this, props));

        _this.state = {
            itemToDisplay: []
        };
        _this.refreshContainerView = _this.refreshContainerView.bind(_this);
        _this.displayNewItems = _this.displayNewItems.bind(_this);
        return _this;
    }

    _createClass(PagingItemContainer, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (JSON.stringify(nextProps.items) != JSON.stringify(this.props.items)) {
                this.refreshContainerView(nextProps.items);
            }
        }
    }, {
        key: 'displayNewItems',
        value: function displayNewItems() {
            this.setState({ displayNewItems: this.itemToDisplay });
        }
    }, {
        key: 'refreshContainerView',
        value: function refreshContainerView(itemToDisplay) {
            this.itemToDisplay = itemToDisplay;

            var $wrapper = (0, _jquery2.default)(_reactDom2.default.findDOMNode(this.refs['wrapper']));
            (0, _jquery2.default)('.paging-item-wrapper.on-display').addClass('fade-left').delay(500).queue(this.displayNewItems);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                items = _props.items,
                renderItem = _props.renderItem,
                layout = _props.layout,
                itemWrapperClassName = _props.itemWrapperClassName;

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)("paging-wrapper", className), ref: 'wrapper' },
                _react2.default.createElement(
                    _reactstrap.Row,
                    { className: 'paging-item-container' },
                    items.map(function (item, index) {
                        return _react2.default.createElement(_itemWrapper2.default, _extends({ key: index, className: (0, _classnames2.default)("paging-item-wrapper", itemWrapperClassName) }, layout, { item: item, renderItem: renderItem }));
                    })
                )
            );
        }
    }]);

    return PagingItemContainer;
}(_react.Component), _class.defaultProps = {
    items: []
}, _temp);
exports.default = PagingItemContainer;

},{"./item-wrapper":53,"classnames":"classnames","jquery":"jquery","react":"react","react-dom":"react-dom","reactstrap":"reactstrap"}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagingItemWrapper = function (_Component) {
    _inherits(PagingItemWrapper, _Component);

    function PagingItemWrapper() {
        _classCallCheck(this, PagingItemWrapper);

        return _possibleConstructorReturn(this, (PagingItemWrapper.__proto__ || Object.getPrototypeOf(PagingItemWrapper)).apply(this, arguments));
    }

    _createClass(PagingItemWrapper, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                xs = _props.xs,
                sm = _props.sm,
                md = _props.md,
                lg = _props.lg,
                xl = _props.xl,
                item = _props.item,
                renderItem = _props.renderItem,
                className = _props.className;

            return _react2.default.createElement(
                _reactstrap.Col,
                { className: className, xs: xs, sm: sm, md: md, lg: lg, xl: xl },
                renderItem(item)
            );
        }
    }]);

    return PagingItemWrapper;
}(_react.Component);

exports.default = PagingItemWrapper;

},{"react":"react","reactstrap":"reactstrap"}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pager = (_temp = _class = function (_React$Component) {
    _inherits(Pager, _React$Component);

    function Pager(props) {
        _classCallCheck(this, Pager);

        var _this = _possibleConstructorReturn(this, (Pager.__proto__ || Object.getPrototypeOf(Pager)).call(this, props));

        _this.state = { pager: {} };
        _this.renderPage = _this.renderPage.bind(_this);
        _this.renderPageLink = _this.renderPageLink.bind(_this);
        return _this;
    }

    _createClass(Pager, [{
        key: 'renderPageLink',
        value: function renderPageLink(page, label) {
            var getPageUrl = this.props.getPageUrl;

            return _react2.default.createElement(_reactRouterDom.Link, { className: 'page-link', to: getPageUrl(page), dangerouslySetInnerHTML: { __html: label || page } });
        }
    }, {
        key: 'renderPage',
        value: function renderPage() {
            var _props = this.props,
                currentPage = _props.currentPage,
                totalPages = _props.totalPages,
                basePath = _props.basePath,
                getPageUrl = _props.getPageUrl;

            var pageComonents = [];

            for (var page = 1; page <= totalPages; page++) {
                pageComonents.push(_react2.default.createElement(
                    'li',
                    { key: page, className: (0, _classnames2.default)("page-item", { active: currentPage === page }) },
                    this.renderPageLink(page)
                ));
            }

            return pageComonents;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                totalPages = _props2.totalPages,
                currentPage = _props2.currentPage,
                getPageUrl = _props2.getPageUrl;


            if (!totalPages || totalPages <= 1) {
                // don't display pager if there is only 1 page
                return null;
            }

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)("pager", this.props.className) },
                _react2.default.createElement(
                    'ul',
                    { className: 'pagination' },
                    _react2.default.createElement(
                        'li',
                        { className: (0, _classnames2.default)("page-item", { disabled: currentPage === 1 }) },
                        this.renderPageLink(1, '<i class="fa fa-angle-left" aria-hidden="true"></i>')
                    ),
                    this.renderPage(),
                    _react2.default.createElement(
                        'li',
                        { className: (0, _classnames2.default)("page-item", { disabled: currentPage === totalPages }) },
                        this.renderPageLink(totalPages, '<i class="fa fa-angle-right" aria-hidden="true"></i>')
                    )
                )
            );
        }
    }]);

    return Pager;
}(_react2.default.Component), _class.propTypes = {
    onItemsChange: _react.PropTypes.func.isRequired,
    initialPage: _react.PropTypes.number
}, _temp);
exports.default = Pager;

},{"classnames":"classnames","react":"react","react-router-dom":"react-router-dom","underscore":78}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pager = (_temp = _class = function (_React$Component) {
    _inherits(Pager, _React$Component);

    function Pager(props) {
        _classCallCheck(this, Pager);

        var _this = _possibleConstructorReturn(this, (Pager.__proto__ || Object.getPrototypeOf(Pager)).call(this, props));

        _this.state = { pager: {} };
        return _this;
    }

    _createClass(Pager, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            // set page if items array isn't empty
            if (this.props.items && this.props.items.length) {
                this.setPage(this.props.initialPage);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // reset page if items array has changed
            if (this.props.items !== prevProps.items) {
                this.setPage(this.props.initialPage);
            }
        }
    }, {
        key: 'setPage',
        value: function setPage(page) {
            var items = this.props.items;
            var pager = this.state.pager;

            if (page < 1 || page > pager.totalPages) {
                return;
            }

            // get new pager object for specified page
            pager = this.getPager(items.length, page);

            // get new page of items from items array
            var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

            // update state
            this.setState({ pager: pager });

            // call change page function in parent component
            this.props.onItemsChange(pageOfItems);
        }
    }, {
        key: 'getPager',
        value: function getPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || this.props.itemPerPage;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _underscore2.default.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var pager = this.state.pager;

            if (!pager.pages || pager.pages.length <= 1) {
                // don't display pager if there is only 1 page
                return null;
            }

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)("pager", this.props.className) },
                _react2.default.createElement(
                    'ul',
                    { className: 'pagination' },
                    _react2.default.createElement(
                        'li',
                        { className: (0, _classnames2.default)("page-item", { disabled: pager.currentPage === 1 }) },
                        _react2.default.createElement(
                            'a',
                            { className: 'page-link', onClick: function onClick() {
                                    return _this2.setPage(1);
                                } },
                            '<'
                        )
                    ),
                    pager.pages.map(function (page, index) {
                        return _react2.default.createElement(
                            'li',
                            { key: index, className: (0, _classnames2.default)("page-item", { active: pager.currentPage === page }) },
                            _react2.default.createElement(
                                'a',
                                { className: 'page-link', onClick: function onClick() {
                                        return _this2.setPage(page);
                                    } },
                                page
                            )
                        );
                    }),
                    _react2.default.createElement(
                        'li',
                        { className: (0, _classnames2.default)("page-item", { disabled: pager.currentPage === pager.totalPages }) },
                        _react2.default.createElement(
                            'a',
                            { className: 'page-link', onClick: function onClick() {
                                    return _this2.setPage(pager.totalPages);
                                } },
                            ">"
                        )
                    )
                )
            );
        }
    }]);

    return Pager;
}(_react2.default.Component), _class.defaultProps = {
    initialPage: 1
}, _class.propTypes = {
    items: _react.PropTypes.array.isRequired,
    onItemsChange: _react.PropTypes.func.isRequired,
    initialPage: _react.PropTypes.number
}, _temp);
exports.default = Pager;

},{"classnames":"classnames","react":"react","underscore":78}],56:[function(require,module,exports){
"use strict";

module.exports = function (props) {
    return React.createElement(
        "div",
        { className: "section-title w-100 text-center mb-3 mb-lg-4 mb-lg-5" },
        React.createElement(
            "h2",
            { className: "title" },
            props.children
        )
    );
};

},{}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sidebarWidget = require('./sidebar-widget');

var _sidebarWidget2 = _interopRequireDefault(_sidebarWidget);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SidebarMenu = function (_Component) {
    _inherits(SidebarMenu, _Component);

    function SidebarMenu() {
        _classCallCheck(this, SidebarMenu);

        return _possibleConstructorReturn(this, (SidebarMenu.__proto__ || Object.getPrototypeOf(SidebarMenu)).apply(this, arguments));
    }

    _createClass(SidebarMenu, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                noBorder = _props.noBorder,
                title = _props.title,
                onTransitionTo = _props.onTransitionTo,
                currentUrl = _props.currentUrl,
                items = _props.items;


            return _react2.default.createElement(
                _sidebarWidget2.default,
                { noBorder: noBorder, title: title },
                _react2.default.createElement(
                    'ul',
                    { className: 'sidebar-widget-menu' },
                    items.map(function (item, index) {
                        return _react2.default.createElement(
                            'li',
                            { className: 'sidebar-widget-item', key: index },
                            _react2.default.createElement(
                                _reactRouterDom.NavLink,
                                { className: 'sidebar-widget-link', to: item.path, activeClassName: 'current' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'sidebar-widget-link-title' },
                                    item.title
                                )
                            )
                        );
                    })
                )
            );
        }
    }]);

    return SidebarMenu;
}(_react.Component);

SidebarMenu.defaultProps = {
    items: []
};

exports.default = SidebarMenu;

},{"./sidebar-widget":58,"react":"react","react-router-dom":"react-router-dom"}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRouterDom = require('react-router-dom');

var _reactstrap = require('reactstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SidebarWidget = (_temp = _class = function (_Component) {
    _inherits(SidebarWidget, _Component);

    function SidebarWidget(props) {
        _classCallCheck(this, SidebarWidget);

        var _this = _possibleConstructorReturn(this, (SidebarWidget.__proto__ || Object.getPrototypeOf(SidebarWidget)).call(this, props));

        _this.state = {
            toggle: props.toggleDefault
        };

        _this.widgetClassName = (0, _classnames2.default)("widget-item", { "no-border": props.noBorder });
        _this.titleClassName = (0, _classnames2.default)('widget-item-title', props.titleClassName);
        _this.toggle = _this.toggle.bind(_this);
        _this.renderContent = _this.renderContent.bind(_this);
        return _this;
    }

    _createClass(SidebarWidget, [{
        key: 'toggle',
        value: function toggle() {
            this.setState({ toggle: !this.state.toggle });
        }
    }, {
        key: 'renderContent',
        value: function renderContent() {
            var _props = this.props,
                children = _props.children,
                className = _props.className;


            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)(className, 'widget-item-content') },
                children
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                title = _props2.title,
                link = _props2.link,
                noCollapse = _props2.noCollapse;


            return _react2.default.createElement(
                'div',
                { className: this.widgetClassName },
                _react2.default.createElement(
                    'div',
                    { className: 'widget-item-header' },
                    link ? _react2.default.createElement(
                        _reactRouterDom.Link,
                        { to: link, className: this.titleClassName },
                        title
                    ) : _react2.default.createElement(
                        'span',
                        { href: '#', className: this.titleClassName },
                        title
                    ),
                    noCollapse || _react2.default.createElement(
                        'span',
                        { className: 'chevron', onClick: this.toggle },
                        _react2.default.createElement('i', { className: 'fa fa-angle-down', 'aria-hidden': 'true' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'widget-item-content-container' },
                    noCollapse ? this.renderContent() : _react2.default.createElement(
                        _reactstrap.Collapse,
                        { isOpen: this.state.toggle },
                        this.renderContent()
                    )
                )
            );
        }
    }]);

    return SidebarWidget;
}(_react.Component), _class.propTypes = {
    title: _propTypes2.default.string.isRequired,
    toggleDefault: _propTypes2.default.bool
}, _class.defaultProps = {
    title: 'Missing title',
    toggleDefault: true
}, _temp);
exports.default = SidebarWidget;

},{"classnames":"classnames","prop-types":"prop-types","react":"react","react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sidebar = function (_React$Component) {
    _inherits(Sidebar, _React$Component);

    function Sidebar() {
        _classCallCheck(this, Sidebar);

        return _possibleConstructorReturn(this, (Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).apply(this, arguments));
    }

    _createClass(Sidebar, [{
        key: "render",
        value: function render() {
            var children = this.props.children;

            return React.createElement(
                "aside",
                { className: "sidebar mr-lg-4" },
                children
            );
        }
    }]);

    return Sidebar;
}(React.Component);

exports.default = Sidebar;

},{}],60:[function(require,module,exports){
'use strict';

var _googleMap = require('./reducers/google-map');

var _routes = require('../routes');

var _require = require('redux'),
    combineReducers = _require.combineReducers;

var _require2 = require('react-router-redux'),
    routerReducer = _require2.routerReducer;

//reducers


var localization = require('./reducers/localization').reducer;
var menu = require('./_layout/header/menu').reducer;
var layout = require('./_layout').reducer;
var connectedBasePage = require('./_layout/main/connected-base-page').reducer;

var reducer = combineReducers({
    layout: layout,
    localization: localization,
    menu: menu,
    connectedBasePage: connectedBasePage,
    router: routerReducer,
    appRouter: _routes.reducer,
    googleMap: _googleMap.googleMapReducer
});

module.exports = reducer;

},{"../routes":17,"./_layout":18,"./_layout/header/menu":27,"./_layout/main/connected-base-page":30,"./reducers/google-map":61,"./reducers/localization":62,"react-router-redux":"react-router-redux","redux":"redux"}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var SHOW_MARKER_BALLOON = "GMAP_SHOW_MARKER_BALLOON";
var CREATE_MAP = "GMAP_CEATE_MAP";
var SET_MAP_VALUE = "GMAP_SET_MAP";
var SET_MAP_MARKERS = "GMAP_SET_MAP_MARKERS";

var showMarkerBalloon = function showMarkerBalloon(mapId, markerId) {
    return {
        type: SHOW_MARKER_BALLOON,
        mapId: mapId,
        markerId: markerId
    };
};

var createMap = function createMap(mapId) {
    return {
        type: CREATE_MAP,
        mapId: mapId
    };
};

var setMapValue = function setMapValue(mapId, map) {
    return {
        type: SET_MAP_VALUE,
        mapId: mapId,
        map: map
    };
};

var setMapMarkers = function setMapMarkers(mapId, markers) {
    return {
        type: SET_MAP_MARKERS,
        mapId: mapId,
        markers: markers
    };
};

var googleMapInitialState = {};

var googleMapReducer = function googleMapReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : googleMapInitialState;
    var action = arguments[1];

    switch (action.type) {
        case CREATE_MAP:
            var newState = $.extend(true, {}, state);
            newState[action.mapId] = {};
            return newState;
        case SET_MAP_VALUE:
            var newState = $.extend(true, {}, state);
            newState[action.mapId] = $.extend(true, {}, newState[action.mapId], action.map);
            return newState;
        case SET_MAP_MARKERS:
            var newState = $.extend(true, {}, state

            //Đôi khi, action này đc gọi trước khi init map
            //các giá trị của map sẽ lấy theo mặc định của component
            );if (!newState[action.mapId]) newState[action.mapId] = {};

            newState[action.mapId].markers = action.markers;
            return newState;
        case SHOW_MARKER_BALLOON:
            var newState = $.extend(true, {}, state);
            newState[action.mapId].showBalloonForMarker = action.markerId;
            return newState;
        default:
            return state;
    }
};

exports.createMap = createMap;
exports.showMarkerBalloon = showMarkerBalloon;
exports.setMapValue = setMapValue;
exports.setMapMarkers = setMapMarkers;
exports.googleMapReducer = googleMapReducer;

},{}],62:[function(require,module,exports){
"use strict";

var $ = require('jquery');

var keys = {
    init: "INIT",
    swithLanguage: "SWITH_LANGUAGE"
};

var actions = {
    swithLanguage: function swithLanguage(language) {
        return {
            type: keys.swithLanguage,
            language: language
        };
    },

    //initState:
    // - languages
    // - currentLanguage
    init: function init(initState) {
        return {
            type: keys.init,
            initState: initState
        };
    }
};

var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var newState = $.extend(true, {}, state);
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
};

module.exports = {
    actions: actions,
    reducer: reducer
};

},{"jquery":"jquery"}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEntities = exports.dataRequest = undefined;

var _requestData = require('./ultilities/requestData');

var _requestData2 = _interopRequireDefault(_requestData);

var _fetchEntities = require('./ultilities/fetchEntities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dataRequest = _requestData2.default;
exports.fetchEntities = _fetchEntities.fetchEntities;

},{"./ultilities/fetchEntities":64,"./ultilities/requestData":65}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchEntities = fetchEntities;
var dataRequest = require('./requestData');

function getItemsWithPath(items, basePath) {
    var itemsWithPath = items.map(function (item) {
        item.path = basePath + '/' + item.name;
        return item;
    });
    return itemsWithPath;
}

function fetchEntities(mvcControllerUrl, postParams, baseItemPath, callBack) {
    var page = postParams.page,
        pageSize = postParams.pageSize,
        filtering = postParams.filtering,
        sorted = postParams.sorted,
        categories = postParams.categories,
        additionalFields = postParams.additionalFields;


    dataRequest(mvcControllerUrl + "/GetTableData", pageSize, page, sorted, filtering, categories, additionalFields, function (responseItems) {
        if (responseItems.length) {
            var itemsWithPath = getItemsWithPath(responseItems, baseItemPath);
            $.get(mvcControllerUrl + '/GetTotalEntitiesCount', function (totalItem) {
                var totalPages = Math.ceil(totalItem / pageSize);
                callBack(itemsWithPath, totalPages);
            });
        }
    });
}

},{"./requestData":65}],65:[function(require,module,exports){
"use strict";

var requestData = function requestData(url, pageSize, page, sorted, filtering, taxonomies, additionalFields, callback) {
    $.ajax({
        url: url,
        method: "POST",
        data: { pageSize: pageSize, page: page, sorted: sorted, filtering: filtering, taxonomies: taxonomies, additionalFields: additionalFields },
        success: callback
    });
};

module.exports = requestData;

},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;
//Components


//Helper functions


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactstrap = require('reactstrap');

var _components = require('../../shared/components');

var _renderItems = require('../helper/render-items');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../../shared/ultilities'),
    fetchEntities = _require.fetchEntities;

var _require2 = require('../helper/functions'),
    getCurrentCategory = _require2.getCurrentCategory;

var pageConfigure = require('../configuration.js');

var DefaultView = (_temp = _class = function (_Component) {
    _inherits(DefaultView, _Component);

    function DefaultView(props) {
        _classCallCheck(this, DefaultView);

        return _possibleConstructorReturn(this, (DefaultView.__proto__ || Object.getPrototypeOf(DefaultView)).call(this, props));
    }

    _createClass(DefaultView, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (JSON.stringify(nextProps.match) != JSON.stringify(this.props.match) || JSON.stringify(nextProps.categories) != JSON.stringify(this.props.categories)) {
                var categories = nextProps.categories,
                    match = nextProps.match,
                    onDataFetch = nextProps.onDataFetch;

                var currentCategory = getCurrentCategory(match, categories);
                var currentPage = match.params.page;

                var postParams = {
                    page: currentPage,
                    pageSize: pageConfigure.ITEM_PER_PAGE,
                    categories: currentCategory.id && _defineProperty({}, pageConfigure.TAXONOMY_TYPE_ID_CATEGORY, currentCategory.id)
                };
                var baseItemPath = pageConfigure.page + '/' + pageConfigure.detailPage;

                fetchEntities(pageConfigure.mvcController, postParams, baseItemPath, function (items, totalPages) {
                    onDataFetch({ items: items, totalPages: totalPages }, 0);
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                match = _props.match,
                _props$pageContent = _props.pageContent,
                thumbnail = _props$pageContent.thumbnail,
                title = _props$pageContent.title,
                categories = _props.categories,
                items = _props.items,
                totalPages = _props.totalPages;

            var currentCategory = getCurrentCategory(match, categories);
            var currentPage = parseInt(match.params.page);

            return _react2.default.createElement(
                _reactstrap.Row,
                null,
                _react2.default.createElement(_components.Image, _extends({ className: 'h-100' }, thumbnail)),
                _react2.default.createElement(
                    'div',
                    { className: 'page-titles mt-4 mb-3' },
                    _react2.default.createElement(
                        'span',
                        { className: 'page-title' },
                        title
                    ),
                    _react2.default.createElement(
                        'span',
                        null,
                        '|'
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'page-title' },
                        currentCategory && currentCategory.title
                    )
                ),
                currentCategory && _react2.default.createElement(_components.Pagination, { itemWrapperClassName: 'page-item', className: 'w-100',
                    items: items,
                    totalPages: totalPages,
                    currentPage: currentPage,
                    getPageUrl: function getPageUrl(pageNumber) {
                        return String(match.path).replace(':category', currentCategory.name).replace(':page', pageNumber);
                    },

                    renderItem: _renderItems.renderItem,
                    onPageChange: this.onPageChange
                })
            );
        }
    }]);

    return DefaultView;
}(_react.Component), _class.defaultProps = {
    categories: [],
    pageContent: {
        thumbnail: {}
    }
}, _temp);


var mapStateToProps = function mapStateToProps(state, ownProps) {
    var _state$connectedBaseP = state.connectedBasePage.pages[pageConfigure.page],
        totalPages = _state$connectedBaseP.totalPages,
        items = _state$connectedBaseP.items,
        categories = _state$connectedBaseP.categories,
        pageContent = _state$connectedBaseP.pageContent;

    return {
        totalPages: totalPages,
        items: items,
        categories: categories,
        pageContent: pageContent
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(DefaultView);

},{"../../shared/components":35,"../../shared/ultilities":63,"../configuration.js":67,"../helper/functions":68,"../helper/render-items":69,"react":"react","react-redux":"react-redux","reactstrap":"reactstrap"}],67:[function(require,module,exports){
'use strict';

module.exports = {
    mvcController: '/post',
    page: 'thu-vien',
    detailPage: 'chi-tiet',
    showBreadcrumbs: true,
    ITEM_PER_PAGE: 5,
    TAXONOMY_TYPE_ID_TAG: 40006,
    TAXONOMY_TYPE_ID_CATEGORY: 40005
};

},{}],68:[function(require,module,exports){
'use strict';

function getCurrentCategory(match, categories) {
    var currentCategory = categories.filter(function (categoryItem) {
        return categoryItem.name === match.params.category;
    })[0];
    return currentCategory;
}

function getCategoryUrl(match, categoryName, page) {
    return String(match.path).replace(':category', categoryName).replace(':page', 1);
}

module.exports = {
    getCategoryUrl: getCategoryUrl,
    getCurrentCategory: getCurrentCategory
};

},{}],69:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"../../shared/components":35,"dup":11}],70:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp; //React/Redux


//Actions


//Components


//Routes component


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _routes = require('../routes');

var _basePage = require('../shared/_layout/main/base-page');

var _basePage2 = _interopRequireDefault(_basePage);

var _components = require('../shared/components');

var _reactstrap = require('reactstrap');

var _defaultView = require('./components/default-view');

var _defaultView2 = _interopRequireDefault(_defaultView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Page configuration
var pageConfigure = require('./configuration.js');

var _require = require('./helper/functions'),
    getCategoryUrl = _require.getCategoryUrl,
    getCurrentCategory = _require.getCurrentCategory;

var ThuVien = (_temp = _class = function (_Component) {
    _inherits(ThuVien, _Component);

    function ThuVien(props) {
        _classCallCheck(this, ThuVien);

        var _this = _possibleConstructorReturn(this, (ThuVien.__proto__ || Object.getPrototypeOf(ThuVien)).call(this, props));

        _this.renderSidebar = _this.renderSidebar.bind(_this);
        return _this;
    }

    _createClass(ThuVien, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                match = _props.match,
                onError = _props.onError,
                onDataFetch = _props.onDataFetch,
                refreshRoutePath = _props.refreshRoutePath,
                categories = _props.categories,
                pageContent = _props.pageContent,
                items = _props.items;


            if (!pageContent) $.get('/page/getsingle?entityName=' + pageConfigure.page, function (response) {
                onDataFetch({ pageContent: response.details }, 50);
            });

            if (!categories.length) $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: pageConfigure.TAXONOMY_TYPE_ID_CATEGORY }, function (responseCategories) {
                responseCategories.unshift({
                    name: localizationString.getString('tat-ca'),
                    path: getCategoryUrl(match, localizationString.getString('tat-ca'), 1),
                    title: localizationString.getString("Tất cả")
                });
                onDataFetch({ categories: responseCategories }, 50);
            });

            refreshRoutePath(pageConfigure.page);
        }
    }, {
        key: 'renderSidebar',
        value: function renderSidebar() {
            var _props2 = this.props,
                categories = _props2.categories,
                match = _props2.match;


            var categoryMenuItems = categories.map(function (_ref) {
                var name = _ref.name,
                    title = _ref.title;

                return { path: getCategoryUrl(match, name, 1), title: title };
            });

            return _react2.default.createElement(
                _components.Sidebar,
                { title: localizationString.getString("Danh mục") },
                _react2.default.createElement(_components.SidebarMenu, { noBorder: true, title: localizationString.getString('loại công trình'),
                    items: categoryMenuItems,
                    currentUrl: match.url
                })
            );
        }
    }, {
        key: 'renderRoutes',
        value: function renderRoutes() {
            var _props3 = this.props,
                match = _props3.match,
                categories = _props3.categories,
                onDataFetch = _props3.onDataFetch;


            return _react2.default.createElement(
                _reactRouter.Switch,
                null,
                _react2.default.createElement(_reactRouter.Route, { path: match.path, render: function render(route) {
                        return _react2.default.createElement(_defaultView2.default, _extends({}, route, { onDataFetch: onDataFetch }));
                    } })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactstrap.Container,
                { id: 'thu-vien' },
                _react2.default.createElement(
                    _reactstrap.Row,
                    null,
                    _react2.default.createElement(
                        _reactstrap.Col,
                        _defineProperty({ xl: '12', lg: '4' }, 'xl', '3'),
                        this.renderSidebar()
                    ),
                    _react2.default.createElement(
                        _reactstrap.Col,
                        _defineProperty({ xl: '12', lg: '8' }, 'xl', '9'),
                        this.renderRoutes()
                    )
                )
            );
        }
    }]);

    return ThuVien;
}(_react.Component), _class.defaultProps = {
    categories: []
}, _temp);


var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {};
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return _extends({}, (0, _redux.bindActionCreators)({ refreshRoutePath: _routes.refreshRoutePath }, dispatch));
};

var ConnectedThuVien = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ThuVien);

module.exports = (0, _basePage2.default)({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumbs })(ConnectedThuVien);

},{"../routes":17,"../shared/_layout/main/base-page":29,"../shared/components":35,"./components/default-view":66,"./configuration.js":67,"./helper/functions":68,"react":"react","react-redux":"react-redux","react-router":"react-router","reactstrap":"reactstrap","redux":"redux"}],71:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');
var classNames = require('classnames');

var _require = require('react-router-dom'),
    Link = _require.Link;

var _require2 = require('reactstrap'),
    Row = _require2.Row,
    Col = _require2.Col;

var Title = require('../../shared/components/section-title');

module.exports = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'section',
                { className: classNames('cong-trinh', this.props.className) },
                React.createElement(
                    Title,
                    null,
                    localizationString.getString('Công trình')
                ),
                React.createElement(
                    Row,
                    { className: 'mt-2' },
                    React.createElement(
                        Col,
                        { xs: '12', md: 6, className: 'pr-1' },
                        React.createElement(
                            Row,
                            { className: 'mb-2' },
                            React.createElement(
                                Col,
                                null,
                                React.createElement(
                                    'div',
                                    { 'data-aos': 'fade-left' },
                                    React.createElement(
                                        'div',
                                        { className: 'link link-khach-san' },
                                        React.createElement(Link, { className: 'title', to: '/', dangerouslySetInnerHTML: { __html: localizationString.getString("Khách<br/>sạn") } })
                                    ),
                                    React.createElement('img', { className: 'w-100', src: '/img/khach-san-cover.jpg' })
                                )
                            )
                        ),
                        React.createElement(
                            Row,
                            null,
                            React.createElement(
                                Col,
                                null,
                                React.createElement(
                                    'div',
                                    { 'data-aos': 'fade-left' },
                                    React.createElement(
                                        'div',
                                        { className: 'link link-can-ho' },
                                        React.createElement(Link, { className: 'title', to: '/', dangerouslySetInnerHTML: { __html: localizationString.getString("Căn<br/>hộ") } })
                                    ),
                                    React.createElement('img', { className: 'w-100', src: '/img/can-ho-cover.jpg' })
                                )
                            )
                        )
                    ),
                    React.createElement(
                        Col,
                        { xs: '12', md: 6, className: 'pl-1' },
                        React.createElement(
                            'div',
                            { className: 'h-100', 'data-aos': 'flip-left', 'data-aos-delay': '300' },
                            React.createElement(
                                'div',
                                { className: 'link link-nha-o' },
                                React.createElement(Link, { className: 'title', to: '/', dangerouslySetInnerHTML: { __html: localizationString.getString("Nhà ở") } })
                            ),
                            React.createElement('img', { className: 'h-100 w-100', src: '/img/nha-o-cover.jpg' })
                        )
                    )
                )
            );
        }
    }]);

    return _class;
}(React.Component);

},{"../../shared/components/section-title":56,"classnames":"classnames","jquery":"jquery","react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],72:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('reactstrap'),
    Row = _require.Row,
    Col = _require.Col;

var _require2 = require('react-router-dom'),
    Link = _require2.Link;

var SectionTitle = require('../../shared/components/section-title');

var DuAnItem = require('../../shared/components/du-an/du-an');

var _require3 = require('../../shared/ultilities'),
    dataRequest = _require3.dataRequest;

var DuAn = function (_React$Component) {
    _inherits(DuAn, _React$Component);

    function DuAn(props) {
        _classCallCheck(this, DuAn);

        var _this = _possibleConstructorReturn(this, (DuAn.__proto__ || Object.getPrototypeOf(DuAn)).call(this, props));

        _this.state = {
            projects: []
        };

        dataRequest("/project/GetTableData", 7, 1, null, null, null, null, function (response) {
            _this.setState({ projects: response });
        });
        return _this;
    }

    _createClass(DuAn, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'section',
                { className: this.props.className },
                React.createElement(
                    SectionTitle,
                    null,
                    localizationString.getString('Dự án')
                ),
                React.createElement(
                    Row,
                    { className: 'pt-3' },
                    this.state.projects.length && this.state.projects.map(function (project, index) {
                        return React.createElement(
                            Col,
                            { key: project.id, xs: '6', md: '4', lg: '3', className: 'page-item' },
                            React.createElement(DuAnItem, { data: project })
                        );
                    }),
                    React.createElement(
                        Col,
                        { xs: '6', md: '4', lg: '3', className: 'page-item' },
                        React.createElement(
                            'div',
                            { className: 'h-100', 'data-aos': 'zoom-in-up' },
                            React.createElement(
                                'div',
                                { className: 'project-load-more' },
                                React.createElement('div', { className: 'overlay' }),
                                React.createElement(
                                    'div',
                                    { className: 'content mr-3 mr-lg-5' },
                                    React.createElement(
                                        'h5',
                                        { className: 'cant-find' },
                                        ' can\u2019t find',
                                        React.createElement('br', null),
                                        ' your project'
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'dots clearfix' },
                                        React.createElement('div', { className: 'dot' }),
                                        React.createElement('div', { className: 'dot' }),
                                        React.createElement('div', { className: 'dot' }),
                                        React.createElement('div', { className: 'dot' })
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'mt-4' },
                                        React.createElement(
                                            Link,
                                            { to: '/du-an', className: 'btn-white mt-4' },
                                            'Load more'
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return DuAn;
}(React.Component);

module.exports = DuAn;

},{"../../shared/components/du-an/du-an":40,"../../shared/components/section-title":56,"../../shared/ultilities":63,"react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],73:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');
var OwlCarousel = require('react-owl-carousel2');

var Slider = function (_React$Component) {
    _inherits(Slider, _React$Component);

    function Slider(props) {
        _classCallCheck(this, Slider);

        var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

        _this.state = {
            slides: []
            /* Chú ý: slides không phải là một array của hình ảnh.
            Ví dụ cho 'slides'
                slides: [
                    {
                        "image": {
                            "urlThumb": "uploads/2/2017/6/slider-2-2017-6-9-310_thumb.jpg",
                            "dimension": "Size [ Width=1058, Height=463 ]",
                            "title": "slider-2",
                            "description": null,
                            "fileName": null,
                            "url": "uploads/2/2017/6/slider-2-2017-6-9-310.jpg",
                            "type": "Image",
                            "extension": ".jpg",
                            "size": "194 KB",
                            "taxonomyTypes": null
                        }
                    },...
                ]
            Hình ảnh('image') chỉ là một prop của 'slide', và còn một số prop khác như caption, etc... sẽ được thêm vào sau này nếu cần thiết.
            */
            , options: {
                items: 1,
                nav: false,
                rewind: false,
                autoplay: true
            }
        };
        $.get("/album/getsingle?entityName=home-slider", function (response) {
            _this.setState({ slides: response.details.images });
        });
        return _this;
    }

    _createClass(Slider, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {}
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                { className: this.props.className },
                this.state.slides.length && React.createElement(
                    OwlCarousel,
                    { ref: function ref(owl) {
                            _this2.owl = owl;
                        }, options: this.state.options },
                    this.state.slides.map(function (slide, index) {
                        return React.createElement(
                            'div',
                            { key: index, id: 'slide' + index },
                            React.createElement('img', { src: slide.image.url, alt: slide.image.description, title: slide.image.title })
                        );
                    })
                )
            );
        }
    }]);

    return Slider;
}(React.Component);

;

module.exports = Slider;

},{"jquery":"jquery","react-owl-carousel2":"react-owl-carousel2"}],74:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('reactstrap'),
    Container = _require.Container;

var Slider = require('./components/slider');
var ConTrinh = require('./components/cong-trinh');
var DuAn = require('./components/du-an');

var BasePage = require('../shared/_layout/main/base-page');

var PageComponent = function (_React$Component) {
    _inherits(PageComponent, _React$Component);

    function PageComponent() {
        _classCallCheck(this, PageComponent);

        return _possibleConstructorReturn(this, (PageComponent.__proto__ || Object.getPrototypeOf(PageComponent)).call(this));
    }

    _createClass(PageComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props,
                onError = _props.onError,
                onDataFetch = _props.onDataFetch,
                dataFetchProgress = _props.dataFetchProgress;


            if (dataFetchProgress != 100) $.get('/', function (response) {
                if (!response) onError('Error');else onDataFetch({ temp: response }, 100);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var dataFetchProgress = this.props.dataFetchProgress;


            if (dataFetchProgress != 100) return null;

            return React.createElement(
                'div',
                { id: 'gioi-thieu' },
                React.createElement(Slider, { className: 'mb-lg-5' }),
                React.createElement(
                    Container,
                    { className: 'pt-5' },
                    React.createElement(ConTrinh, { className: 'mb-3 mb-md-5' }),
                    React.createElement(DuAn, { className: 'pt-5' })
                )
            );
        }
    }]);

    return PageComponent;
}(React.Component);

module.exports = BasePage({ page: 'trang-chu' })(PageComponent);

},{"../shared/_layout/main/base-page":29,"./components/cong-trinh":71,"./components/du-an":72,"./components/slider":73,"reactstrap":"reactstrap"}],75:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],76:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = shouldPureComponentUpdate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function shouldPureComponentUpdate(nextProps, nextState) {
  return !(0, _shallowEqual2['default'])(this.props, nextProps) || !(0, _shallowEqual2['default'])(this.state, nextState);
}

module.exports = exports['default'];
},{"./shallowEqual":77}],77:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = shallowEqual;

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

module.exports = exports['default'];
},{}],78:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1])

//# sourceMappingURL=dbgroupvn.js.map
