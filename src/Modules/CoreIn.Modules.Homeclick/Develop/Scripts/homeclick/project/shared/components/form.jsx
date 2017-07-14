const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');
const alerts = Corein.components.pageAlerts;

const LayoutModal = require('./layout-modal').default;
const { openLayoutModal } = require('./layout-modal').actions;

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
            SET_LAYOUT: (formValues, fieldData) => {
                const { openLayoutModal } = this.props;
                var roomsPath = fieldData.input.name.split('.')

                var select = null
                for (var i in roomsPath) {
                    var currentPart = roomsPath[i]
                    if (currentPart.indexOf('[') != -1) {
                        var currentPathProperty = currentPart.split('[')[0];
                        var indexOfCurrentPath = /\[([^]+)\]/.exec(currentPart)[1];
                    }

                    select = !select ? formValues[currentPart] : select[currentPathProperty][indexOfCurrentPath]
                    if (String(currentPart).startsWith('rooms')) {
                        const layoutImage = select.layoutImage;
                        if (layoutImage)
                            openLayoutModal(layoutImage, fieldData.input.value, fieldData.input.onChange, fieldData.fileManagerModalToggle);
                        break
                    }
                }
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
        const { commands, formData, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: form.submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            <div>
                <form.default {...reduxFormProps} />
                <LayoutModal />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push, openLayoutModal }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};