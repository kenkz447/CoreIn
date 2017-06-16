const $ = require('jquery');
const _ = require('underscore');
const { Row, Col } = require('reactstrap');
const { Link } = require('react-router-dom');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const classNames = require('classnames');

const stateToProps = (state) => ({
    menuItems: state.menu.menuItems,
});

class Menu extends React.Component {
    constructor(props) {
        super(props);

        const footerMenuItem = props.menuItems.filter(item => {
            return item.footer;
        });

        this.state = {
            menuItems: _.sortBy(footerMenuItem, 'footer') 
        }
    }
    
    render() {
        return (
            <Row className={classNames("text-uppercase pl-0 mb-0", this.props.className)}>
                {
                    this.state.menuItems.map((menuItem, index) => {
                        return (
                            <Col key={index} className="menu-item d-inline-block">
                                <Link to={menuItem.url}>
                                    <span>{menuItem.title}</span>
                                </Link>
                            </Col>)
                    })
                }
            </Row>
        );
    }
}

Menu.propTypes = {
    menuItems: PropTypes.array.isRequired
}

module.exports = connect(stateToProps)(Menu)