const renderField = require('./components/formField.jsx');
const validator = require('./components/validator');
const dynamicFormValidator = require('./components/dynamicFormValidator');
const DynamicForm = require('./components/dynamicForm.jsx');
const TabControl = require('./components/tabControl.jsx');
const tabControlActions = require('./redux/tc-actions.jsx');
const tabControlReducer = require('./redux/tc-reducer.jsx');

const appKeys = {
    parentId: 'parentId'
};

module.exports = {
    renderField,
    validator,
    dynamicFormValidator,
    DynamicForm,
    TabControl,
    tabControlActions,
    tabControlReducer,
    appKeys
};