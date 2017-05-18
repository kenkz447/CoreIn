const $ = require('jquery');
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
        const { form, commands, onSubmit, formData, _initialValues} = this.props;

        const initialValues = _initialValues || {};
        if ($.isEmptyObject(initialValues.taxonomyTypes)) {
            if (formData.taxonomyTypes) {
                initialValues.taxonomyTypes = {};
                for (var type in formData.taxonomyTypes) {
                    initialValues.taxonomyTypes[formData.taxonomyTypes[type].typeId] = {}
                }
            }
        }

        var ReduxDynamicForm = reduxForm({
            form,
            formData,
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