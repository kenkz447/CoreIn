const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein;
const { loadNewForm } = require('../redux/actions');
const { reduxForm, getFormValues } = require('redux-form');

const LayoutModal = require('../../shared/components/layout-modal').default;
const { openLayoutModal } = require('../../shared/components/layout-modal').actions;
const {SubmissionError} = require('redux-form');

function formAjaxPost(url, data, method) {
    return new Promise((resolve, reject) =>
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: (response) => {
                if (response.resultState !== 0) {
                    resolve(response);
                } else {
                    reject(response);
                }
            },
            error: (response) => {
                reject(response);
            }
        })
    );
}

function formSubmit(props) {
    const {url, method, successAction} = props;

    return function (values) {
        formAjaxPost(url, values, method)
            .then((response) => {
                successAction(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Something wrong?' });
                }
            });
    }
}


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
        const { loadNewForm } = this.props;
        $.get("/project/GetNewProjectForm", (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { formData, formValues } = this.props;

        if (!formData)
            return this.getForm();

        const vatidateData = { details: formData.details, meta: formData.meta };
        const validate = form.validator(vatidateData);

        const onSubmit = formSubmit({
            url: '/project/create',
            method: 'POST',
            successAction: () => {

            }
        });

        var ReduxDynamicForm = reduxForm({
            form: 'newProject',
            validate,
            formData,
            commands: this.getCommands(),
            onSubmit,
            initialValues: formValues || formData.initialValues,
        })(form.default);

        ReduxDynamicForm = connect(state => ({ formValues: getFormValues('newProject')(state) }))(ReduxDynamicForm);

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
    bindActionCreators({ loadNewForm, openLayoutModal }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ProjectForm);
