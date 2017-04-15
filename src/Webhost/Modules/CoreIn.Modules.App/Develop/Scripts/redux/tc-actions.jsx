const keys = require('./tc-keys.jsx');

const tabAdd = (id, title, content) => ({
    type: keys.tabAdd,
    tab: { id, title, content }
});

const tabRemove = (tab) => ({
    type: keys.tabRemove,
    tab
});

const tabChange = (tab) => ({
    type: keys.tabChange,
    tab
});

module.exports = {
    tabAdd,
    tabRemove,
    tabChange
};