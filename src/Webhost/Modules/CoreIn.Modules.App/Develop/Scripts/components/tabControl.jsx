const classnames = require('classnames');
const { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

class TabControl extends React.Component {
    render()
    {
        const { activeTab, tabs, tabChange } = this.props;
        return (
            <div className="tab-control">
                <Nav tabs>
                    {tabs.map((tab) => (
                        <NavItem key={tab.id}>
                            <NavLink className={classnames({ active: activeTab && activeTab.id === tab.id })}
                                onClick={() => { tabChange(tab); }}
                                dangerouslySetInnerHTML={{ __html: tab.title }}></NavLink>
                        </NavItem>
                    ))}
                </Nav>
                <TabContent activeTab={activeTab && activeTab.id}>
                    {tabs.map((tab) => {
                        return (
                            <TabPane key={tab.id} tabId={tab.id}>
                                {tab.content}
                            </TabPane>
                        );
                    })}
                </TabContent>
            </div>
        );    
    }
};

module.exports = TabControl;

