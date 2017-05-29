const $ = require('jquery');
const _ = require('underscore');

const { modalToggle } = require('../file-manager/fm-actions');
const { Alert, Button } = require('reactstrap');
const renderFieldType = require('./render-field-type')
const CheckboxList = require('./fields/checkboxlist');

module.exports = class BaseForm extends React.Component {
    constructor(props) {
        super(props);
        this.executeFormAction = this.executeFormAction.bind(this);
        this.fileManagerModalToggle = this.fileManagerModalToggle.bind(this);

        this.renderFormHeader = this.renderFormHeader.bind(this);
        this.renderMetaFields = this.renderMetaFields.bind(this);
        this.renderDetailFields = this.renderDetailFields.bind(this);
        this.renderTaxonomies = this.renderTaxonomies.bind(this);
        this.renderFormActions = this.renderFormActions.bind(this);
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

    renderFormHeader() {
        const { display, submitting, error } = this.props;
        return (
            <div className="form-header">
                {display && <h1>{display.title}</h1>}
                {display && <p className="text-muted">{display.description}</p>}

                {!submitting && (error && <Alert color="danger">{error}</Alert>)}
            </div>
            )
    }

    renderMetaFields() {
        const { formData: { meta } } = this.props;
        return meta &&
            <div className="meta">
                {meta.map((props, index) => {
                    return renderFieldType("meta", props);
                })}
            </div>
    }

    renderDetailFields() {
        const { formData: { details } } = this.props;
        return details &&
            <div className="details">
                {details.map((props, index) => {
                    $.extend(props, { fileManagerModalToggle: this.fileManagerModalToggle(), executeFormAction: this.executeFormAction });
                    return renderFieldType("details", props);
                })}
            </div>
    }

    renderTaxonomies() {
        const { formData: { taxonomyTypes } } = this.props;

        return taxonomyTypes &&
            <div className="taxonomies">
                {
                    taxonomyTypes.map((props) => {
                        const { typeId, input: { name }, display: { title }, taxonomies } = props;
                        return <CheckboxList key={typeId} taxonomyName={`taxonomyTypes.${typeId}`} title={title} taxonomies={taxonomies} />;
                    })
                }
            </div>
    }

    renderFormActions() {
        const { submitting, display, onClose } = this.props;

        return (
            <div className="actions">
                <Button color="primary" type="submit" disabled={submitting}>{display ? display.submitLabel : "Submit"}</Button>
                {
                    onClose && <Button className="ml-h" type="Button" onClick={onClose} disabled={submitting}>{display ? display.dismissForm : "Cancel"}</Button>
                }
            </div>
        )
    }
};
