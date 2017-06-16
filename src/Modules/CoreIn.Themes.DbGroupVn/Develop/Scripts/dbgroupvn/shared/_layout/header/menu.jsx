const $ = require('jquery');
const { NavLink } = require('react-router-dom');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const PropTypes = require('prop-types');

const keys = {
    init: "MENU_INIT"
}

const actions = {
    //initState:
    // - menuItems: flat array
    init: (initState) => ({
        type: keys.init,
        initState
    })
}

const reducer = (state = {}, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.init:
            return action.initState;
        default:
            return state;
    }
}

const stateToProps = (state) => ({
    menuItems: state.menu.menuItems,
});

const dispathToProps = (dispatch) => (
    bindActionCreators({  }, dispatch)
);


class Menu extends React.Component {
    render() {
        const { menuItems } = this.props;
        return (
            <ul className="menu text-uppercase pl-0 mb-0">
                {
                    menuItems.map((menuItem, index) => {
                        return (
                            <li key={index} className="menu-item d-inline-block">
                                <NavLink exact={ menuItem.url == '/'} to={menuItem.url} activeClassName="current">
                                    <span>{menuItem.title}</span>
                                </NavLink>
                            </li>)
                    })
                }
            </ul>
        );
    }
}

Menu.propTypes = {
    menuItems: PropTypes.array.isRequired
}

module.exports ={
    actions,
    reducer,
    default: connect(stateToProps, dispathToProps, null, { pure: false })(Menu)
}