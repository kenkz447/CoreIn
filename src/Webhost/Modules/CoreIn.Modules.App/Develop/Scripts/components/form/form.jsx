const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, Field, FieldArray} = require('redux-form');
const { FormGroup, Label, Input } = require('reactstrap');
const { Alert, Button } = require('reactstrap');
const { renderField } = require('./render-field');


const renderFieldType = require('./render-field-type')

const CheckboxList = require('./checkboxlist');

const CHECKBOXLIST = 'checkboxlist';

const TaxonomyFields = (props) => {
    const { renderType } = props;
    switch (renderType) {
        default:
            return <CheckboxList {...props} />
    }
};



module.exports = class Form extends React.Component {
    constructor(props) {
        super(props);
        this.executeFormAction = this.executeFormAction.bind(this);
    }


    executeFormAction(command, fieldData) {
        const { commands, formValues } = this.props;

        commands[command](formValues, fieldData);
    }

    render() {
        const { formName, formData, onClose, error, handleSubmit, pristine, reset, submitting, submitSucceeded, display, fileManagerModalToggle } = this.props;

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
                            $.extend(props, { fileManagerModalToggle, executeFormAction: this.executeFormAction });
                            return renderFieldType("details", props);
                        })}
                    </div>
                }

                {
                    formData.taxonomyTypes &&
                    <div className="taxonomies">
                        {
                            formData.taxonomyTypes.map((props) => {
                                const { typeId, input: {name}, display: {renderType, title}, taxonomies} = props;
                                return <TaxonomyFields key={typeId} renderType={renderType} taxonomyName={`taxonomyTypes.${typeId}`} title={title} taxonomies={taxonomies} />;
                            })
                        }
                    </div>
                }
                <hr />
                <div className="actions">
                    <Button className="mr-1" color="primary" type="submit" disabled={submitting}>{display ? display.submitLabel : "Submit"}</Button>
                    {
                        onClose && <Button type="Button" onClick={onClose} disabled={submitting}>{display ? display.dismissForm : "Cancel"}</Button>
                    }
                </div>
            </form>
        );
    }  
};