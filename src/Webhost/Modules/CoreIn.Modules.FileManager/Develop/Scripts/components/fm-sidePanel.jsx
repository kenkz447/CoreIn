const react = require('react');
const reactDOM = require('react-dom');
const $ = require('jquery');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { bindActionCreators } = require('redux');
const { asideTabChange } = require('./fm-actions');

var { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

class SidePanel extends react.Component {
    render() {
        const { isOpen, activeTab, tabs, tabChange } = this.props;
        return (
            <aside className={"aside-menu" + (isOpen && " aside-menu-hidden")}>
                {activeTab && (
                    <div className="tab-container">
                        <Nav tabs>
                            {tabs.map((tab) => (
                            <NavItem key={tab.id} >
                                    <NavLink className={classnames({ active: activeTab === tab.id })}
                                        onClick={() => { tabChange(tab); }}
                                        dangerouslySetInnerHTML={{ __html: tab.title }}></NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            {tabs.map((tab) => (
                                <TabPane key={tab.id} tabId={tab.id}>
                                    {tab.content}
                                </TabPane>
                            ))}
                        </TabContent>
                    </div>)
                 }
            </aside>
        );
    }
}

const stateToProps = (state) => ({
    isOpen: state.fm.aside.isOpen, 
    activeTab: state.fm.aside.activeTab,
    tabs: state.fm.aside.tabs
});

const distpatchToProps = (dispatch) => (
    bindActionCreators({ tabChange: asideTabChange}, dispatch)
    );

module.exports = connect(stateToProps, distpatchToProps)(SidePanel);
