const $ = require('jquery');
const classnames = require('classnames');
const { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

const keys = {
    tabAdd: "TAB_ADD",
    tabRemove: "TAD_REMOVE",
    tabChange: "TAB_CHANGE"
};
const actions = {
    tabAdd: (id, title, content) => ({
        type: keys.tabAdd,
        tab: { id, title, content }
    }),

    tabRemove: (tab) => ({
        type: keys.tabRemove,
        tab
    }),

    tabChange: (tab) => ({
        type: keys.tabChange,
        tab
    })
}

const initState = {
    active: null,
    tabs: []
};

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.tabAdd:
            newState.tabs = newState.tabs.filter(tab => tab.id !== action.tab.id);
            newState.tabs.push(action.tab);
            newState.active = action.tab;
            break;
        case keys.tabRemove:
            newState.tabs = newState.tabs.filter(tab => tab.id !== action.tab.id);
            if (newState.tabs.length !== 0)
                newState.active = newState.tabs[0];
            break;
        case keys.tabChange:
            if (newState.active.id !== action.tab.id)
                newState.active = action.tab;
            break;
        default:
            return state;
    }
    return newState;
};

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

module.exports = {
    default: TabControl,
    actions,
    reducer
};

