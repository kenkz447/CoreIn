const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');

const Header = require('./_layout/header');
const Footer = require('./_layout/footer');
const OutNav = require('./_layout/mobile/menu');
const PageLoading = require('./_layout/main/page-loading');

const keys = {
    updateLayout: "SET_LAYOUT_PARAMETER",
    togglePageLoading: "TOGGLE_PAGE_LOADING",
}

const actions = {
    updateLayout: () => ({
        type: keys.updateLayout
    }),
    togglePageLoading: (toggle) => ({
        type: keys.togglePageLoading,
        toggle
    })
}
const initState = {
    loadingFadeOutTime: 500,

}

const reducer = (state = initState, action) => {
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
}

//middle ware to update layout after switch page, etc...
const updateLayout = store => next => action => {
    if (action.type == keys.updateLayout) {
        const footerElement = document.getElementById('footer');
        const mainElement = document.getElementById('main');

        const headerHeight = document.getElementById('header').clientHeight;
        const footerHeight = footerElement.clientHeight;
        const viewportHeight = window.outerHeight;
        const layoutParameters = {
            header: { id: header, height: headerHeight },
            main: { id: main, minHeight: viewportHeight - footerHeight - headerHeight },
            footer: { id: footer, height: footerHeight },
            loading: { id: loading },
            viewportHeight,
        }

        $(mainElement).css('min-height', layoutParameters.main.minHeight)
        $(document.getElementById('layout')).fadeTo(500, 1)
        $(document.getElementById('loading')).css('height', layoutParameters.main.minHeight)
        action.parameters = layoutParameters;
    }

    return next(action)
}


class LayoutController extends React.Component {
    componentDidUpdate() {
        const { layoutLoaded } = this.props;
        if (layoutLoaded) {
            const { updateLayout} = this.props;
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
    bindActionCreators(actions, reducer)
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
            <div id={this.elementRefs.layout} className="layout perspective" style={{ opacity: 0 }}>
                <div className="wrapper">
                    <Header id={this.elementRefs.header} className="p-3 pt-lg-4 pb-lg-4" />
                    <div id={this.elementRefs.main} className="main pb-5 mt-lg-3">
                        {children}
                        <PageLoading id={this.elementRefs.loading} />
                    </div>
                    <Footer id={this.elementRefs.footer} className="p-4" />
                </div>
                <OutNav />
                <ConnectedLayoutController {...this.elementRefs} layoutLoaded={this.state.loaded} />
            </div>
        );
    }
}


module.exports = {
    updateLayout,
    actions,
    reducer,
    default: Layout
}