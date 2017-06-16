const $ = require('jquery');
const { NavLink } = require('react-router-dom');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');

class Menu extends React.Component {
    render() {
        const { menuItems } = this.props;
        return (
            <nav className="left outer-nav vertical">
                {
                    menuItems.map((menuItem, index) => {
                        return (
                            <NavLink key={index} exact={menuItem.url == '/'} to={menuItem.url} activeClassName="current">
                                {menuItem.title}
                            </NavLink>
                        )
                    })
                }
            </nav>
        );
    }
}

Menu.propTypes = {
    menuItems: PropTypes.array.isRequired
}

const stateToProps = (state) => ({
    menuItems: state.menu.menuItems,
});

module.exports = connect(stateToProps, null, null, { pure: false })(Menu);