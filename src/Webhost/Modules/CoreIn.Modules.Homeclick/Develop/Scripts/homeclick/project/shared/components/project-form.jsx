const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');

const LayoutModal = require('../../shared/components/layout-modal').default;
const { openLayoutModal } = require('../../shared/components/layout-modal').actions;

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
        const { openLayoutModal } = this.props;

        return {
            SET_LAYOUT: (formValues, fieldData) => {
                var roomName = fieldData.input.name.split('.')[1];

                const roomArrayIndex = /\[([^]+)\]/.exec(roomName)[1];
                const room = formValues.details['rooms'][roomArrayIndex];
                const layoutImage = room.layoutimage;
                if (layoutImage)
                    openLayoutModal(layoutImage, fieldData.input.value, fieldData.input.onChange, fieldData.fileManagerModalToggle);
            }
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

        var ReduxDynamicForm = reduxForm({
            form: formName,
            formData,
            commands: this.getCommands(),
            onSubmit,
            initialValues: formData.initialValues,
        })(form.default);

        ReduxDynamicForm = connect(state => ({ formValues: getFormValues(formName)(state) }))(ReduxDynamicForm);

        return (
            <div>
                <ReduxDynamicForm />
                <LayoutModal />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return state.projectForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, openLayoutModal }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};