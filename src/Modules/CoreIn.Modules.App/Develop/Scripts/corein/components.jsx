const table = require('./components/table');
const fileManager = require('./components/file-manager');

const appKeys = {
    parentId: 'parentId'
};

module.exports = {
    form: {
        default: require('./components/dynamic-form'),
        validator: require('./components/form/validator'),
        submit: require('./components/form/submit')
    },
    pageAlerts: require('./components/page-alerts'),
    tabControl: require('./components/tab-control'),
    appKeys,
    table,
    fileManager
};