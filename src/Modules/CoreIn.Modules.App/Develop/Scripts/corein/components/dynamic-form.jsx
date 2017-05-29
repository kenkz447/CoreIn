const $ = require('jquery');
const _ = require('underscore');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, getFormValues } = require('redux-form');

const { modalToggle } = require('./file-manager/fm-actions');

var DynamicFormBasic = require('./form/form');

const FileManagerModal = require('./file-manager/modal');


class DynamicForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { layout, form, commands, onSubmit, formData, _initialValues} = this.props;

        const initialValues = _initialValues || {};
        if ($.isEmptyObject(initialValues.taxonomyTypes)) {
            if (formData.taxonomyTypes) {
                initialValues.taxonomyTypes = {};
                for (var type in formData.taxonomyTypes) {
                    initialValues.taxonomyTypes[formData.taxonomyTypes[type].typeId] = {}
                }
            }
        }

        const _formData = $.extend(true, {}, formData);
        _formData.details = _.sortBy(formData.details, (o) => o.group);

        var ReduxDynamicForm = reduxForm({
            layout,
            form,
            formData: _formData,
            commands,
            onSubmit,
            initialValues,
        })(DynamicFormBasic);

        ReduxDynamicForm = connect(state => ({ formValues: getFormValues(form)(state) }))(ReduxDynamicForm);

        return (
            <div className="dynamic-form">
                <ReduxDynamicForm />
                <FileManagerModal />
            </div>
        );
    }
}

const stateToProps = (state) => {
    return {
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(DynamicForm);