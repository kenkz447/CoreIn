const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, Field, FieldArray} = require('redux-form');
const { FormGroup, Label, Input } = require('reactstrap');
const { Alert, Button } = require('reactstrap');
const { renderField } = require('./render-field');
const CheckboxList = require('./fields/checkboxlist');
const { modalToggle } = require('../file-manager/fm-actions');

const renderFieldType = require('./render-field-type')

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.executeFormAction = this.executeFormAction.bind(this);
        this.fileManagerModalToggle = this.fileManagerModalToggle.bind(this);
    }

    fileManagerModalToggle() {
        const { fileManagerModalToggle, fileManagerModalOpened } = this.props;

        return function (selectFunc, options = {}) {
            fileManagerModalToggle(!fileManagerModalOpened, selectFunc);
        }
    }

    executeFormAction(command, fieldData) {
        const { commands, formValues } = this.props;

        commands[command](formValues, fieldData);
    }


    render() {
        const { formName, formData, onClose, error, handleSubmit, pristine, reset, submitting, submitSucceeded, display } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                {display && <h1>{display.title}</h1>}
                {display && <p className="text-muted">{display.description}</p>}

                {!submitting && (error && <Alert color="danger">{error}</Alert>)}

                {
                    formData.meta &&
                    <div className="meta">
                        {formData.meta.map((props, index) => {
                            return renderFieldType("meta", props);
                        })}
                    </div>
                }

                {
                    formData.details &&
                    <div className="details">
                        {formData.details.map((props, index) => {
                            $.extend(props, { fileManagerModalToggle: this.fileManagerModalToggle(), executeFormAction: this.executeFormAction });
                            return renderFieldType("details", props);
                        })}
                    </div>
                }

                {
                    formData.taxonomyTypes &&
                    <div className="taxonomies">
                        {
                            formData.taxonomyTypes.map((props) => {
                                const { typeId, input: {name}, display: {title}, taxonomies} = props;
                                return <CheckboxList key={typeId} taxonomyName={`taxonomyTypes.${typeId}`} title={title} taxonomies={taxonomies} />;
                            })
                        }
                    </div>
                }

                <div className="actions mt-1">
                    <Button className="mr-1" color="primary" type="submit" disabled={submitting}>{display ? display.submitLabel : "Submit"}</Button>
                    {
                        onClose && <Button type="Button" onClick={onClose} disabled={submitting}>{display ? display.dismissForm : "Cancel"}</Button>
                    }
                </div>
            </form>
        );
    }  
};

const stateToProps = (state) => {
    return {
        fileManagerModalOpened: state.fm.modal.toggle,
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ fileManagerModalToggle: modalToggle }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(Form);