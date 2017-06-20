const { Route, Switch } = require('react-router')
const { Provider, connect } = require('react-redux')
const { createBrowserHistory } = require('history')
const { ConnectedRouter } = require('react-router-redux')

const PropTypes = require('prop-types');

const history = createBrowserHistory()

// Pages:
const Layout = require('./shared/_layout').default
const TrangChu = require('./trang-chu/index')
const GioiThieu = require('./gioi-thieu/index')
const CongTrinh = require('./cong-trinh/index')
 
import { default as ExtendConnectedRouter } from './shared/components/_commons/extended-ConnectedRouter';

class Root extends React.Component {
    constructor(props) {
        super(props);
        AOS.init();
    }

    render() {
        const { menuItems, store } = this.props;
        return (
            <Provider store={ store }>
                <ExtendConnectedRouter history={ history } wrapper={Layout}/>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

const stateToProps = (state) => ({
    menuItems: state.menu.menuItems
})

module.exports = {
    Root: connect(stateToProps)(Root),
    history
};

export default exports