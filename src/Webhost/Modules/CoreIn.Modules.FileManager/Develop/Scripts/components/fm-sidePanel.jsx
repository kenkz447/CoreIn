const react = require('react');
const reactDOM = require('react-dom');
const $ = require('jquery');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { bindActionCreators } = require('redux');
const { asideTabChange } = require('./fm-actions');
const { dynamicFormValidator, DynamicForm, TabControl, tabControlActions: { tabChange } } = require('corein');
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
