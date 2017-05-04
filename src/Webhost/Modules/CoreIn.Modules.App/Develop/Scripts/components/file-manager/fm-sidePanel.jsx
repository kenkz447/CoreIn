const react = require('react');
const reactDOM = require('react-dom');
const $ = require('jquery');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { bindActionCreators } = require('redux');
const dynamicFormValidator = require('../form/validator');
const DynamicForm = require('../dynamic-form');
const { tabAdd, tabRemove, tabChange } = require('../../redux/tc-actions');
const TabControl = require('../tabControl');
var { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

class SidePanel extends react.Component {
    render() {
        const { activeTab, tabs, tabChange } = this.props;
        return (
            <aside className={classnames("aside-menu")}>
                {activeTab && <TabControl activeTab={activeTab} tabs={tabs} tabChange={tabChange} />}
            </aside>
        );
    }
}

const stateToProps = (state) => ({
    activeTab: state.fmTabControl.active,
    tabs: state.fmTabControl.tabs
});

const distpatchToProps = (dispatch) => (
    bindActionCreators({ tabChange }, dispatch)
    );

module.exports = connect(stateToProps, distpatchToProps)(SidePanel);
