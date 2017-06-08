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
        <Provider store={props.store}>
            <ConnectedRouter history={history}>
                <Layout>
                    <Route exact path="/" component={TrangChu} />
                    <Route path="/gioi-thieu" component={GioiThieu} />
                </Layout>
            </ConnectedRouter>
        </Provider>
    );
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

module.exports = { Root, history };