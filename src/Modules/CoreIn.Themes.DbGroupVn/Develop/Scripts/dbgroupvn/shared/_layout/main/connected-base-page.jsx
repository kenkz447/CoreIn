const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { Swipeable, defineSwipe } = require('react-touch');

const layoutActions = require('../../_layout').actions;

const DelayRender = require('../../components/_commons/delay-render');

import { ConnectedBreacrumbs } from '../../components'

const keys = {
  createNewPage: "CREATE_NEW_PAGE",
  onDataFetch: "ON_PAGE_FETCH_DATA"
}

const actions = {
  createNewPage: (page) => ({
    type: keys.createNewPage,
    page
  }),

  //progress: 0 - 100.
  onDataFetch: (page, data, progress = 100) => ({
    type: keys.onDataFetch,
    page,
    data,
    progress
  })
}

const initState = {
  pages: {} //data of all page
}

const reducer = (state = initState, action) => {
  var newState = {};
  switch (action.type) {
    case keys.onDataFetch:
      newState = $.extend(true, {}, state);
      var pages = newState.pages;
      var currentPageData = $.extend(pages[ action.page ], action.data);
      currentPageData.dataFetchProgress += action.progress;
      if (currentPageData.dataFetchProgress > 100)
        console.error(`'dataFetchProgress' phải từ 0 đến 100, hiện tại ${currentPageData.dataFetchProgress}.`);
      newState.pages[ action.page ] = currentPageData;
      return newState;
    case keys.createNewPage:
      newState = $.extend(true, {}, state);
      newState.pages[ action.page ] = {
        dataFetchProgress: 0
      };
      return newState;
    default:
      return state;

  }
}

class BasePage extends React.Component {
  constructor(props) {
    super(props);
    this.baseDelay = 1000;
    const { component } = this.props;

    this.swipeLeft = this.swipeLeft.bind(this);
    this.onDataFetch = this.onDataFetch.bind(this);

    this.ElementWithDelayRender = DelayRender({
      delay: this.baseDelay,
      onRender: this.onPageComponentRender.bind(this)
    })(component);
  }

  componentWillUnmount() {
    const { togglePageLoading, updateLayout } = this.props;
    updateLayout();
    togglePageLoading(true);
  }

  swipeLeft() {
    global.openMenu();
  }

  onDataFetch(data, progress) {
    const { onDataFetch, page } = this.props;
    onDataFetch(page, data, progress);
  }

  onPageComponentRender() {
    const { togglePageLoading, loadingFadeOutTime } = this.props;
    const $element = $(ReactDOM.findDOMNode(this));

    togglePageLoading(false);
    $element.delay(this.baseDelay).fadeTo(500, 1);
  }

  componentWillMount() {
    const { createNewPage,
      pages,
      page } = this.props;
    const pageData = pages[ page ];
    if (!pageData)
      createNewPage(page);
  }

  render() {
    const { createNewPage, component,
      pages,
      page, //page name of component
      routes, match: { params }, showBreadcrumbs } = this.props;

    const pageData = pages[ page ];
    if (!pageData)
      return null;

    return (
      <div className="base-page" style={ { opacity: 0 } }>
        <Swipeable onSwipeRight={ this.swipeLeft }>
          <div className="swipeable" />
        </Swipeable>
        {
          showBreadcrumbs && <ConnectedBreacrumbs routes={routes} params={params} />
        }
        <this.ElementWithDelayRender {...pageData} onDataFetch={ this.onDataFetch } />
      </div>
    );
  }
};

const stateToProps = (state) => ({
  layoutParameter: state.layout.parameters,//remove will take no effect!
  loadingFadeOutTime: state.layout.loadingFadeOutTime,
  pages: state.connectedBasePage.pages,
  routes: state.routes
});

const dispathToProps = (dispath) => (
  bindActionCreators({
    togglePageLoading: layoutActions.togglePageLoading,
    updateLayout: layoutActions.updateLayout,
    createNewPage: actions.createNewPage,
    onDataFetch: actions.onDataFetch
  }, dispath)
);

module.exports = {
  actions,
  reducer,
  default: connect(stateToProps, dispathToProps)(BasePage)
}