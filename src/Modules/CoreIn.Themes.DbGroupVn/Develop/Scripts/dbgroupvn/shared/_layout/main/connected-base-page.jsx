import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Swipeable, defineSwipe } from 'react-touch'

//Actions
import { togglePageLoading, updateLayout } from '../actions'

//Components
import { ConnectedBreacrumbs, RenderDelay } from '../../components'
import { refreshRoutePath } from '../../reducers/app-routes'

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

    this.ElementWithDelayRender = RenderDelay({
      delay: this.baseDelay,
      onRender: this.onPageComponentRender.bind(this)
    })(component);
  }

  componentWillUnmount() {
    const { togglePageLoading, updateLayout } = this.props;
    //updateLayout();
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
    const { refreshRoutePath, createNewPage,
      pages,
      page } = this.props;
    const pageData = pages[ page ];
    if (!pageData)
      createNewPage(page);
      
    refreshRoutePath(page)
  }

  render() {
    const { createNewPage, component,
      pages,
      page, //page name of component
      routes, match, showBreadcrumbs, location } = this.props;

    const pageData = pages[ page ];
    if (!pageData)
      return null;

    return (
      <div className="base-page" style={ { opacity: 0 } }>
        <Swipeable onSwipeRight={ this.swipeLeft }>
          <div className="swipeable" />
        </Swipeable>
        {
          showBreadcrumbs && <ConnectedBreacrumbs routes={ routes } params={ match.params } />
        }
        <this.ElementWithDelayRender {...pageData} location={ location } match={ match } onDataFetch={ this.onDataFetch } />
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
    togglePageLoading,
    updateLayout,
    createNewPage: actions.createNewPage,
    onDataFetch: actions.onDataFetch,
    refreshRoutePath
  }, dispath)
);

export { actions, reducer }

export default connect(stateToProps, dispathToProps)(BasePage)