import $ from 'jquery'
import { NavLink } from'react-router-dom'
import { connect } from'react-redux'
import { bindActionCreators } from'redux'
import { default as PropTypes} from 'prop-types'

import { DEFAULT_MENU } from '../../reducers/app-routes'

const keys = {
    init: "MENU_INIT"
}

const actions = {
    /**
     * {menuItems: flat array}
     */
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

const stateToProps = (state) => {
    return ({
        menuItems: state.appRouter.menus[ DEFAULT_MENU ]
    })
}

class Menu extends React.Component {
    static propTypes = {
        menuItems: PropTypes.array.isRequired
    }

    static defaultProps = {
        menuItems: []
    }

    render() {
        const { menuItems } = this.props;
        return (
            <ul className="menu text-uppercase pl-0 mb-0">
                {
                    menuItems.map(({ exact, url, label }, index) => {
                        return (
                            <li key={ index } className="menu-item d-inline-block">
                                <NavLink exact={ exact } to={ url } activeClassName="current">
                                    <span>{ label }</span>
                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }
}

export {
    actions,
    reducer
}

export default connect(stateToProps, null, null, { pure: false })(Menu)