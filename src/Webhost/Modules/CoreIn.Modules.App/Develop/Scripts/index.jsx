const validator = require('./components/validator');
const TabControl = require('./components/tabControl');
const tabControlActions = require('./redux/tc-actions');
const tabControlReducer = require('./redux/tc-reducer');
const table = require('./components/table');
const fileManager = require('./components/file-manager');

const appKeys = {
    parentId: 'parentId'
};

module.exports = {
    validator,
    form: {
        default: require('./components/dynamic-form'),
        validator: require('./components/form/validator'),
        submit: require('./components/form/sumbit')
    },
    pageAlerts: require('./components/page-alerts'),
    TabControl,
    tabControlActions,
    tabControlReducer,
    appKeys,
    table,
    fileManager
};

global.Corein = module.exports;