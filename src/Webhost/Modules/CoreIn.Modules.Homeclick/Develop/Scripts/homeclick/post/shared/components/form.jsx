const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        return {
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { formData, formName, formSubmitData } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate }, formSubmitData);
        const onSubmit = form.submit(sumbitProps);

        var initialValues = formData.initialValues;

        if (!initialValues || !initialValues.taxonomyTypes) {
            if (!initialValues)
                initialValues = {};

            if (formData.taxonomyTypes) {
                initialValues.taxonomyTypes = {};
                for (var type in formData.taxonomyTypes) {
                    initialValues.taxonomyTypes[formData.taxonomyTypes[type].typeId] = {}
                }
            }
        }

        var ReduxDynamicForm = reduxForm({
            form: formName,
            formData,
            commands: this.getCommands(),
            onSubmit,
            initialValues,
        })(form.default);

        ReduxDynamicForm = connect(state => ({ formValues: getFormValues(formName)(state) }))(ReduxDynamicForm);

        return (
            <div>
                <ReduxDynamicForm />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return state.projectForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};