import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { LOCATION_CHANGE } from 'react-router-redux';

import {
    TOGGLE_MOBILE_SIDEBAR, UPDATE_LAYOUT, TOGGLE_PAGE_LOADING,
    toggleMobileSidebar, updateLayout, togglePageLoading
} from './_layout/actions'

const Header = require('./_layout/header');
const Footer = require('./_layout/footer');
const OutNav = require('./_layout/mobile/menu');
const PageLoading = require('./_layout/main/page-loading');

const initState = {
    loadingFadeOutTime: 500,
}

const reducer = (state = initState, action) => {
    var newState = {};
    switch (action.type) {
        case UPDATE_LAYOUT:
            newState = $.extend(true, {}, state);
            newState.parameters = action.parameters;
            return newState;
        case TOGGLE_PAGE_LOADING:
            newState = $.extend(true, {}, state);
            newState.isPageLoadingVisible = action.toggle;
            return newState;
        case TOGGLE_MOBILE_SIDEBAR:
            newState = $.extend(true, {}, state);
            newState.isMobileSidebarOpen = action.toggle
            return newState
        default:
            return state;
    }
}

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

//middle ware to update layout after switch page, etc...
const updateLayoutMiddleware = store => next => action => {
    if (action.type == UPDATE_LAYOUT) {
        const mainElement = document.getElementById('main');

        onElementHeightChange(document.body, function () {
            //Nếu height của body thay đổi thì refresh AOS
            AOS.refresh();
        });

        onElementHeightChange(mainElement, function () {
            store.dispatch(action)
        });

        const footerElement = document.getElementById('footer')
        const breadcrumbs = document.getElementById('breadcrumbs')

        const toggleSidebarWrapper = document.getElementById('sidebar-toggle-wrapper')

        const headerHeight = document.getElementById('header').clientHeight;
        const footerHeight = footerElement.clientHeight;
        const viewportHeight = window.innerHeight;

        const toggleSidebarButtonOffsetTop = toggleSidebarWrapper &&
            parseInt($(toggleSidebarWrapper).offset().top - $(toggleSidebarWrapper).outerHeight() -
                (toggleSidebarWrapper ? $(toggleSidebarWrapper).outerHeight() / 2 : 0) - (breadcrumbs ? breadcrumbs.clientHeight / 2 : 0))

        const layoutParameters = {
            header: { id: header, height: headerHeight },
            main: { id: main, minHeight: viewportHeight - footerHeight - headerHeight },
            footer: { id: footer, height: footerHeight },
            loading: { id: loading },
            breadcrumbs: { height: breadcrumbs && parseInt(breadcrumbs.clientHeight) },
            toggleSidebarButtonOffsetTop,
            viewportHeight,
        }
        var windowWidth = parseInt(window.innerWidth)
        if (windowWidth > 1200)
            layoutParameters.mediaSize = 'xl'
        else if (windowWidth > 992)
            layoutParameters.mediaSize = 'lg'
        else if (windowWidth > 786)
            layoutParameters.mediaSize = 'md'
        else if (windowWidth > 579)
            layoutParameters.mediaSize = 'md'
        else
            layoutParameters.mediaSize = 'xs'

        $(mainElement).css('min-height', layoutParameters.main.minHeight)
        $(document.getElementById('layout')).fadeTo(500, 1)
        $(document.getElementById('loading')).css('height', layoutParameters.main.minHeight)
        action.parameters = layoutParameters;
    }
    if (action.type === TOGGLE_MOBILE_SIDEBAR) {
        if (action.toggle)
            $('html').css('overflow-y', 'hidden')
        else
            $('html').css('overflow-y', 'auto')
    }

    //hidden sidebar after navigated
    if (action.type === LOCATION_CHANGE) {
        store.dispatch(toggleMobileSidebar(false))
    }

    return next(action)
}


class LayoutController extends React.Component {
    componentDidUpdate() {
        const { layoutLoaded } = this.props;
        if (layoutLoaded) {
            const { updateLayout } = this.props;
            updateLayout();
        }
    }

    render() {
        return <div className="layout-controller" />;
    }
}

const stateToProps = (state) => ({
});

const reducerToProps = (reducer) => (
    bindActionCreators({ updateLayout, togglePageLoading }, reducer)
);

const ConnectedLayoutController = connect(stateToProps, reducerToProps)(LayoutController);

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }

        this.elementRefs = {
            layout: 'layout',
            header: 'header',
            main: 'main',
            footer: 'footer',
            loading: 'loader'
        }
    }

    componentDidMount() {
        this.setState({ loaded: true });
    }

    render() {
        const { children } = this.props;
        return (
            <div id={ this.elementRefs.layout } className="layout perspective" style={ { opacity: 0 } }>
                <div className="wrapper">
                    <Header id={ this.elementRefs.header } className="p-3 pt-lg-4 pb-lg-4" />
                    <div id={ this.elementRefs.main } className="main pb-5 mt-lg-3">
                        { children }
                        <PageLoading id={ this.elementRefs.loading } />
                    </div>
                    <Footer id={ this.elementRefs.footer } className="p-4" />
                </div>
                <OutNav />
                <ConnectedLayoutController {...this.elementRefs} layoutLoaded={ this.state.loaded } />
            </div>
        );
    }
}


module.exports = {
    updateLayoutMiddleware,
    actions: { toggleMobileSidebar, updateLayout, togglePageLoading },
    reducer,
    default: Layout
}