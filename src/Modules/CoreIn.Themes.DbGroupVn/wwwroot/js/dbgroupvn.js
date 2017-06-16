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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./dbgroupvn/root.jsx":8,"./dbgroupvn/routes":9,"./dbgroupvn/shared/_layout":10,"./dbgroupvn/shared/_layout/header/menu":19,"./dbgroupvn/shared/_localization":25,"./dbgroupvn/shared/reducer":38,"./dbgroupvn/shared/reducers/localization":39,"react-dom":"react-dom","react-router-redux":"react-router-redux","redux":"redux"}],2:[function(require,module,exports){
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
                { to: "/bo-suu-tap" },
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

},{"react-router-dom":"react-router-dom"}],3:[function(require,module,exports){
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


            (0, _ultilities.dataRequest)('/collection/gettabledata', 9, 1, null, null, currentCategory && { 30003: currentCategory.id }, function (response) {
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

module.exports = (0, _basePage2.default)({ page: 'bo-suu-tap', showBreadcrumbs: true })(ConnectedPageComponent);

},{"../routes":9,"../shared/_layout/main/base-page":21,"../shared/components":27,"../shared/ultilities":40,"./components/page-item":2,"react-redux":"react-redux","reactstrap":"reactstrap","redux":"redux"}],4:[function(require,module,exports){
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

},{"react-router-dom":"react-router-dom"}],5:[function(require,module,exports){
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


            (0, _ultilities.dataRequest)('/construction/gettabledata', 9, 1, null, null, currentCategory && { 10003: currentCategory.id }, function (response) {
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

},{"../routes":9,"../shared/_layout/main/base-page":21,"../shared/components":27,"../shared/ultilities":40,"./components/page-item":4,"react-redux":"react-redux","reactstrap":"reactstrap","redux":"redux"}],6:[function(require,module,exports){
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

},{"../../shared/components":27,"reactstrap":"reactstrap"}],7:[function(require,module,exports){
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

},{"../shared/_layout/main/base-page":21,"../shared/components":27,"./components/quy-trinh":6,"reactstrap":"reactstrap","redux":"redux"}],8:[function(require,module,exports){
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

},{"./cong-trinh/index":5,"./gioi-thieu/index":7,"./shared/_layout":10,"./shared/components/_commons/extended-ConnectedRouter":29,"./trang-chu/index":45,"history":"history","prop-types":"prop-types","react-redux":"react-redux","react-router":"react-router","react-router-redux":"react-router-redux"}],9:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRoutes = function getRoutes() {
    return {
        exact: true,
        path: '/',
        name: 'trang-chu',
        label: localizationString.getString("Trang chủ"),
        component: _index2.default,
        childRoutes: [{
            exact: true,
            path: '/ve-chung-toi',
            name: 've-chung-toi',
            defaultLabel: localizationString.getString("Về chúng tôi"),
            component: _index4.default
        }, {
            exact: true,
            path: '/cong-trinh',
            name: 'cong-trinh',
            defaultLabel: localizationString.getString("Công trình"),
            component: _index6.default
        }, {
            exact: true,
            path: '/bo-suu-tap',
            name: 'bo-suu-tap',
            defaultLabel: localizationString.getString("Bộ sưu tập"),
            component: _index8.default
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

var INIT_ROUTES = "INIT_ROUTES";
var REFRESH_ROUTE_PATH = "REFRESG_ROUTE_PATH";

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

},{"./bo-suu-tap/index":3,"./cong-trinh/index":5,"./gioi-thieu/index":7,"./trang-chu/index":45}],10:[function(require,module,exports){
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

},{"./_layout/footer":11,"./_layout/header":15,"./_layout/main/page-loading":23,"./_layout/mobile/menu":24,"react-redux":"react-redux","redux":"redux"}],11:[function(require,module,exports){
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

},{"./footer/copy-right":12,"./footer/menu":13,"./footer/socials":14,"classnames":"classnames","reactstrap":"reactstrap"}],12:[function(require,module,exports){
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

},{"classnames":"classnames"}],13:[function(require,module,exports){
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

},{"classnames":"classnames","jquery":"jquery","prop-types":"prop-types","react-redux":"react-redux","react-router-dom":"react-router-dom","reactstrap":"reactstrap","underscore":48}],14:[function(require,module,exports){
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

},{"classnames":"classnames"}],15:[function(require,module,exports){
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

},{"./header/header-mobile":16,"./header/language-select":17,"./header/logo":18,"./header/menu":19,"./header/search":20,"classnames":"classnames","reactstrap":"reactstrap"}],16:[function(require,module,exports){
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

},{"./language-select":17,"./search":20,"classnames":"classnames"}],17:[function(require,module,exports){
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

},{"../../reducers/localization":39,"jquery":"jquery","react-redux":"react-redux","reactstrap":"reactstrap","redux":"redux"}],18:[function(require,module,exports){
"use strict";

module.exports = function (props) {
    return React.createElement(
        "div",
        { className: "logo" },
        React.createElement("img", { src: "/img/logo.png" })
    );
};

},{}],19:[function(require,module,exports){
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

},{"jquery":"jquery","prop-types":"prop-types","react-redux":"react-redux","react-router-dom":"react-router-dom","redux":"redux"}],20:[function(require,module,exports){
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

},{"reactstrap":"reactstrap"}],21:[function(require,module,exports){
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

},{"./connected-base-page":22,"prop-types":"prop-types"}],22:[function(require,module,exports){
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
          params = _props5.match.params,
          showBreadcrumbs = _props5.showBreadcrumbs;


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
        showBreadcrumbs && React.createElement(_components.ConnectedBreacrumbs, { routes: routes, params: params }),
        React.createElement(this.ElementWithDelayRender, _extends({}, pageData, { onDataFetch: this.onDataFetch }))
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

},{"../../_layout":10,"../../components":27,"../../components/_commons/delay-render":28,"react-redux":"react-redux","react-touch":"react-touch","redux":"redux"}],23:[function(require,module,exports){
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

},{"react-redux":"react-redux"}],24:[function(require,module,exports){
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

},{"jquery":"jquery","prop-types":"prop-types","react-redux":"react-redux","react-router-dom":"react-router-dom"}],25:[function(require,module,exports){
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

},{"./_localization/en-us":26}],26:[function(require,module,exports){
'use strict';

module.exports = {
    'Tìm kiếm': "Search",
    'Công trình': "Construction",
    'Dự án': "Project",
    'Khách<br/>sạn': "Hotel",
    'Nhà ở': "Home",
    'Căn<br/>hộ': "Department"
};

},{}],27:[function(require,module,exports){
'use strict';

var _connectedBreacrumbs = require('./components/connected-breacrumbs');

var _connectedBreacrumbs2 = _interopRequireDefault(_connectedBreacrumbs);

var _sidebar = require('./components/sidebar');

var _sidebar2 = _interopRequireDefault(_sidebar);

var _categoryMenu = require('./components/category-menu');

var _categoryMenu2 = _interopRequireDefault(_categoryMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Title = require('./components/section-title');
var PageArticle = require('./components/page-article');
var Image = require('./components/image');
var RenderDelay = require('./components/_commons/delay-render');

module.exports = {
    RenderDelay: RenderDelay, Title: Title, PageArticle: PageArticle, Image: Image, ConnectedBreacrumbs: _connectedBreacrumbs2.default, Sidebar: _sidebar2.default, CategoryMenu: _categoryMenu2.default
};

},{"./components/_commons/delay-render":28,"./components/category-menu":31,"./components/connected-breacrumbs":32,"./components/image":34,"./components/page-article":35,"./components/section-title":36,"./components/sidebar":37}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

var _reactRedux = require('react-redux');

var TrangChu = require('../../../trang-chu/index');

var renderRoute = function renderRoute(_ref, index) {
    var path = _ref.path,
        exact = _ref.exact,
        component = _ref.component,
        childRoutes = _ref.childRoutes;

    var routeComponent = React.createElement(_reactRouter.Route, { exact: exact, key: path, path: path, component: component });

    if (childRoutes != null) {
        var routeComponents = childRoutes.map(renderRoute);
        routeComponents.push(routeComponent);
        return React.createElement(
            _reactRouter.Switch,
            null,
            routeComponents
        );
    } else return routeComponent;
};

var renderRoutes = function renderRoutes(_ref2) {
    var path = _ref2.path,
        exact = _ref2.exact,
        component = _ref2.component,
        childRoutes = _ref2.childRoutes;

    var routeComponents = childRoutes.map(renderRoute);

    //Root route
    routeComponents.unshift(React.createElement(_reactRouter.Route, { exact: exact, key: path, path: path, component: component }));

    return routeComponents;
};

var ExtendedConnectedRouter = function ExtendedConnectedRouter(_ref3) {
    var routes = _ref3.routes,
        history = _ref3.history,
        wrapper = _ref3.wrapper;

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

},{"../../../trang-chu/index":45,"react-redux":"react-redux","react-router":"react-router","react-router-redux":"react-router-redux"}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _exenv = require('exenv');

var _exenv2 = _interopRequireDefault(_exenv);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global window */

/**
 * @class Breadcrumbs
 * @description New breadcrumbs class based on ES6 structure.
 * @exports Breadcrumbs
 * @version 1.6
 * @extends component
 * @requires react
 * @requires react-router
 *
 */

var Breadcrumbs = function (_React$Component) {
  _inherits(Breadcrumbs, _React$Component);

  function Breadcrumbs(props) {
    _classCallCheck(this, Breadcrumbs);

    var _this = _possibleConstructorReturn(this, (Breadcrumbs.__proto__ || Object.getPrototypeOf(Breadcrumbs)).call(this, props));

    _this.displayName = 'Breadcrumbs';
    return _this;
  }

  _createClass(Breadcrumbs, [{
    key: '_getDisplayName',
    value: function _getDisplayName(route) {
      var name = null;

      if (typeof route.getDisplayName === 'function') {
        name = route.getDisplayName.bind(null, this.props.params)();
      }

      if (route.indexRoute) {
        name = name || route.indexRoute.displayName || null;
      } else {
        name = name || route.displayName || null;
      }

      // Check to see if a custom name has been applied to the route
      if (!name && Boolean(route.label)) {
        name = route.label;
      }

      // If the name exists and it's in the excludes list exclude this route
      // If (name && this.props.excludes.some(item => item === name)) return null

      if (!name && this.props.displayMissing) {
        name = this.props.displayMissingText;
      }

      return name;
    }
  }, {
    key: '_addKeyToElement',
    value: function _addKeyToElement(el) {
      return el && !el.key && el.type ? Object.assign({}, el, { 'key': Math.random() * 100 }) : el;
    }
  }, {
    key: '_addKeyToArrayElements',
    value: function _addKeyToArrayElements(item) {
      var _this2 = this;

      return item.map(function (el) {
        return _this2._addKeyToElement(el);
      });
    }
  }, {
    key: '_processCustomElements',
    value: function _processCustomElements(items) {
      var _this3 = this;

      return items.map(function (el) {
        if (!el) {
          return null;
        }
        if (Array.isArray(el)) {
          return _this3._addKeyToArrayElements(el);
        }
        return _this3._addKeyToElement(el);
      });
    }
  }, {
    key: '_appendAndPrependElements',
    value: function _appendAndPrependElements(originalBreadCrumbs) {
      var crumbs = [];
      var appendAndPrepend = this._processCustomElements([originalBreadCrumbs.shift(), originalBreadCrumbs.pop()]);
      if (appendAndPrepend[0]) {
        crumbs.unshift(appendAndPrepend[0]);
      }
      crumbs.push(originalBreadCrumbs[0]);
      if (appendAndPrepend[1]) {
        crumbs.push(appendAndPrepend[1]);
      }

      return crumbs.reduce(function (acc, cur) {
        return acc.concat(cur);
      }, []).filter(function (e) {
        return e;
      });
    }
  }, {
    key: '_resolveRouteName',
    value: function _resolveRouteName(route) {
      var name = this._getDisplayName(route);
      if (!name && route.breadcrumbName) {
        name = route.breadcrumbName;
      }
      if (!name && route.label) {
        name = route.label;
      }
      return name;
    }
  }, {
    key: '_processRoute',
    value: function _processRoute(route, routesLength, lastCrumb, createElement) {
      var _this4 = this;

      // If there is no route path defined and we are set to hide these then do so
      if (!route.path && this.props.hideNoPath) {
        return null;
      }

      var separator = '';
      var name = this._resolveRouteName(route);
      if (name && 'excludes' in this.props && this.props.excludes.some(function (item) {
        return item === name;
      })) {
        return null;
      }

      var makeLink = true;

      // Don't make link if route doesn't have a child route
      if (makeLink) {
        makeLink = Boolean(route.childRoutes);
      }

      // Set up separator
      separator = lastCrumb ? '' : this.props.separator;
      if (!makeLink) {
        separator = '';
      }

      // Don't make link if route has a disabled breadcrumblink prop
      if (Object.prototype.hasOwnProperty.call(route, 'breadcrumblink')) {
        makeLink = route.breadcrumblink;
      }

      // Replace route param with real param (if provided)
      var currentKey = route.path.split('/')[route.path.split('/').length - 1];
      var keyValue = void 0;
      route.path.split('/').forEach(function (link) {
        // If this is not a param, or we've been given no params to replace with, we need not do anything
        if (link.substring(0, 1) !== ':' || !_this4.props.params) {
          return;
        }

        keyValue = Object.keys(_this4.props.params).map(function (param) {
          return _this4.props.params[param];
        });
        var pathWithParam = route.path.split('/').map(function (link) {
          if (link.substring(0, 1) === ':') {
            return keyValue.shift();
          }
          return link;
        });
        route.path = pathWithParam.reduce(function (start, link) {
          return start + '/' + link;
        });

        if (!route.staticName && currentKey.substring(0, 1) === ':') {
          if (typeof route.getDisplayName === 'function') {
            name = route.getDisplayName.bind(null, _this4.props.params)();
          } else {
            name = pathWithParam.reduce(function (start, link) {
              return link;
            });
          }
        }

        if (typeof route.prettifyParam === 'function') {
          name = route.prettifyParam(name, _this4.props.params);
        }
      });

      if (!name) {
        return null;
      }

      if (this.props.prettify) {
        // Note: this could be replaced with a more complex prettifier
        name = name.replace(/-/g, ' ');
        name = name.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      var link = name;
      var itemClass = this.props.itemClass;
      if (makeLink) {
        if (createElement) {
          link = _react2.default.createElement(this.props.Link || _reactRouter.Link, { 'to': route.path }, name);
        }
      } else {
        itemClass += ' ' + this.props.activeItemClass;
      }

      if (!createElement) {
        return link;
      }
      return _react2.default.createElement(this.props.itemElement, { 'className': itemClass, 'key': Math.random() * 100 }, link, separator);
    }
  }, {
    key: '_buildRoutes',
    value: function _buildRoutes(routes, createElement, prepend, append) {
      var _this5 = this;

      var crumbs = [];
      var parentPath = '/';

      // Iterate over the initial list of routes and remove all that don't apply
      routes = routes.map(function (_route, index) {
        var route = Object.assign({}, _route);
        if (typeof _route.prettifyParam === 'function') {
          route.prettifyParam = _route.prettifyParam;
        }
        if ('props' in route && 'path' in route.props) {
          route.path = route.props.path;
          route.children = route.props.children;
          route.label = route.props.label;
          route.prettifyParam = route.props.prettifyParam;
        }
        if (!route.path) {
          return null;
        }
        if (route.path.charAt(0) === '/') {
          parentPath = route.path;
        } else {
          if (parentPath.charAt(parentPath.length - 1) !== '/') {
            parentPath += '/';
          }
          parentPath += route.path;
        }
        if (index > 0 && route.path.charAt(0) !== '/') {
          route.path = parentPath;
        }
        var name = _this5._resolveRouteName(route);
        if ((_this5.props.displayMissing || name) && !('excludes' in _this5.props && _this5.props.excludes.some(function (item) {
          return item === name;
        }))) {
          return route;
        }
        return null;
      }).filter(function (route) {
        return Boolean(route);
      }

      // Iterate over the pruned list of routes and build the crumbs for each
      );crumbs = routes.map(function (route, idx) {
        return _this5._processRoute(route, routes.length, routes.length === idx + 1, createElement);
      }).filter(function (crumb) {
        return Boolean(crumb);
      });

      if (_exenv2.default.canUseDOM && window && window.document && 'setDocumentTitle' in this.props && this.props.setDocumentTitle && crumbs[crumbs.length - 1].props.children[0] > 0) {
        window.document.title = crumbs[crumbs.length - 1].props.children[0].props.children;
      }

      if (prepend || append) {
        crumbs = this._appendAndPrependElements([prepend, crumbs, append]);
      }

      if (!createElement) {
        return crumbs;
      }

      return _react2.default.createElement(this.props.wrapperElement, { 'className': this.props.customClass || this.props.wrapperClass }, crumbs);
    }
  }, {
    key: 'render',
    value: function render() {
      return this._buildRoutes(this.props.routes, this.props.createElement, this.props.prepend, this.props.append);
    }
  }]);

  return Breadcrumbs;
}(_react2.default.Component);

/**
 * @property PropTypes
 * @description Property types supported by this component
 * @type {{separator: *, createElement: *, displayMissing: *, wrapperElement: *, wrapperClass: *, itemElement: *, itemClass: *, activeItemClass: *,  customClass: *,excludes: *, append: *, prepend: *, params: *, Link: *}}
 */


Breadcrumbs.propTypes = {
  'params': _propTypes2.default.object.isRequired,
  'prepend': _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.bool]),
  'append': _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.bool]),
  'separator': _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),
  'createElement': _propTypes2.default.bool,
  'Link': _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),
  'displayMissing': _propTypes2.default.bool,
  'prettify': _propTypes2.default.bool,
  'displayMissingText': _propTypes2.default.string,
  'wrapperElement': _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),
  'wrapperClass': _propTypes2.default.string,
  'itemElement': _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),
  'itemClass': _propTypes2.default.string,
  'customClass': _propTypes2.default.string,
  'activeItemClass': _propTypes2.default.string,
  'excludes': _propTypes2.default.arrayOf(_propTypes2.default.string),
  'hideNoPath': _propTypes2.default.bool,
  'routes': _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
  'setDocumentTitle': _propTypes2.default.bool

  /**
   * @property defaultProps
   * @description sets the default values for propTypes if they are not provided
   * @type {{separator: string, displayMissing: boolean, wrapperElement: string, itemElement: string, wrapperClass: string, customClass: string, prepend: false, append: false}}
   */
};Breadcrumbs.defaultProps = {
  'prepend': false,
  'append': false,
  'separator': '',
  'createElement': true,
  'displayMissing': true,
  'displayMissingText': 'Missing name prop from Route',
  'wrapperElement': 'div',
  'wrapperClass': 'breadcrumbs',
  'itemElement': 'span',
  'itemClass': '',
  'activeItemClass': '',
  'excludes': [''],
  'prettify': false,
  'hideNoPath': true,
  'setDocumentTitle': false
};

exports.default = Breadcrumbs;

},{"exenv":47,"prop-types":"prop-types","react":"react","react-router":"react-router"}],31:[function(require,module,exports){
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

},{"classnames":"classnames","list-to-tree":"list-to-tree","reactstrap":"reactstrap"}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactstrap = require('reactstrap');

var _reactRouterDom = require('react-router-dom');

var _breacrumbs = require('./breacrumbs');

var _breacrumbs2 = _interopRequireDefault(_breacrumbs);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectedBreadcrumbs = function ConnectedBreadcrumbs(props) {
    var routes = props.routes,
        params = props.params;

    if (routes) return React.createElement(
        _reactstrap.Container,
        { className: 'd-none d-lg-block mb-lg-4' },
        React.createElement(_breacrumbs2.default, { Link: _reactRouterDom.Link, routes: routes, params: params, setDocumentTitle: true })
    );else return null;
};

var stateToProps = function stateToProps(state) {
    return {
        routes: state.appRouter.routePath
    };
};

exports.default = (0, _reactRedux.connect)(stateToProps)(ConnectedBreadcrumbs);

},{"./breacrumbs":30,"react-redux":"react-redux","react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],33:[function(require,module,exports){
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

},{"react-router-dom":"react-router-dom"}],34:[function(require,module,exports){
"use strict";

module.exports = function (props) {
    var url = props.url,
        title = props.title,
        description = props.description,
        className = props.className;


    return React.createElement("img", { className: "w-100 " + className, src: "/" + url, title: title, alt: description });
};

},{}],35:[function(require,module,exports){
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

},{"./image":34,"./section-title":36,"classNames":46,"reactstrap":"reactstrap"}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
'use strict';

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
    appRouter: _routes.reducer
});

module.exports = reducer;

},{"../routes":9,"./_layout":10,"./_layout/header/menu":19,"./_layout/main/connected-base-page":22,"./reducers/localization":39,"react-router-redux":"react-router-redux","redux":"redux"}],39:[function(require,module,exports){
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

},{"jquery":"jquery"}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataRequest = undefined;

var _requestData = require('./ultilities/requestData');

var _requestData2 = _interopRequireDefault(_requestData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dataRequest = _requestData2.default;

},{"./ultilities/requestData":41}],41:[function(require,module,exports){
"use strict";

var requestData = function requestData(url, pageSize, page, sorted, filtering, taxonomies, callback) {
    $.ajax({
        url: url,
        method: "POST",
        data: { pageSize: pageSize, page: page, sorted: sorted, filtering: filtering, taxonomies: taxonomies },
        success: callback
    });
};
module.exports = requestData;

},{}],42:[function(require,module,exports){
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

},{"../../shared/components/section-title":36,"classnames":"classnames","jquery":"jquery","react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],43:[function(require,module,exports){
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

        dataRequest("/project/GetTableData", 7, 1, null, null, null, function (response) {
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

},{"../../shared/components/du-an/du-an":33,"../../shared/components/section-title":36,"../../shared/ultilities":40,"react-router-dom":"react-router-dom","reactstrap":"reactstrap"}],44:[function(require,module,exports){
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

},{"jquery":"jquery","react-owl-carousel2":"react-owl-carousel2"}],45:[function(require,module,exports){
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

},{"../shared/_layout/main/base-page":21,"./components/cong-trinh":42,"./components/du-an":43,"./components/slider":44,"reactstrap":"reactstrap"}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
/* global define */

(function () {
	'use strict';

	var canUseDOM = !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);

	var ExecutionEnvironment = {

		canUseDOM: canUseDOM,

		canUseWorkers: typeof Worker !== 'undefined',

		canUseEventListeners:
			canUseDOM && !!(window.addEventListener || window.attachEvent),

		canUseViewport: canUseDOM && !!window.screen

	};

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function () {
			return ExecutionEnvironment;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = ExecutionEnvironment;
	} else {
		window.ExecutionEnvironment = ExecutionEnvironment;
	}

}());

},{}],48:[function(require,module,exports){
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
