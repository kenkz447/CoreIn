const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein;
const { loadNewForm } = require('../redux/actions');
const { reduxForm, getFormValues } = require('redux-form');

const LayoutModal = require('../../shared/components/layout-modal').default;
const { openLayoutModal } = require('../../shared/components/layout-modal').actions;

const formSubmit = Corein.form.sumbit;
const alertPush = Corein.pageAlerts.actions.push;

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
        const { loadNewForm, projectId } = this.props;
        $.get("/project/GetNewProjectForm", {projectId},(formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { formData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const vatidateData = { details: formData.details, meta: formData.meta };
        const validate = form.validator(vatidateData);

        const onSubmit = formSubmit({
            url: '/project/update',
            method: 'PUT',
            successAction: (respo) => {
                alertPush("success", respo.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
            validate
        });

        var ReduxDynamicForm = reduxForm({
            form: 'updateProject',
            formData,
            commands: this.getCommands(),
            onSubmit,
            initialValues: formData.initialValues,
        })(form.default);

        return (
            <div>
                <ReduxDynamicForm />
                <LayoutModal />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return {
        formData: state.page.formData,
    }
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm, openLayoutModal, alertPush }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ProjectForm);
