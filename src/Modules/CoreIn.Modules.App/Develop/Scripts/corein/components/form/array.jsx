const $ = require('jquery');
const classNames = require('classnames')
const {Card, CardBlock, CardHeader, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const renderFieldType = require('./render-field-type');

module.exports = (props) => {
    const { fields, childFields, fieldValidate, display: { title, prompt}, fileManagerModalToggle, executeFormAction, meta: {error, warning } } = props;

    var validationState = fieldValidate ? (error ? 'danger' : (warning && 'warning')) : null;

    return (
        <div className="form-member">
            <div className={classNames({ "mb-1": prompt != undefined })} >
                <label>{title}</label>
                {prompt && <FormText color="muted">{prompt}</FormText>}
            </div>
            
            <div className="form-array-container">
                {
                    fields.map((field, index) => {
                        return (
                            <Card key={index} className="form-array-item">
                                <span className="dot"/>
                                <CardHeader>
                                    Member #{index + 1} { }
                                    <div className="card-actions">
                                        <a className="btn-close" onClick={
                                            (e) => {
                                                fields.remove(index);
                                                e.preventDefault();
                                            }} href="#"><i className="icon-close"></i></a>
                                    </div>
                                </CardHeader>
                                <CardBlock>
                                    {
                                        childFields &&
                                        childFields.map((props) => {
                                            $.extend(props, { fileManagerModalToggle, executeFormAction });
                                            return renderFieldType(field, props);
                                        })
                                    }
                                </CardBlock>
                            </Card>
                        )
                    }
                )}
                <div className="form-array-actions">
                    <div>
                        <Button type="button" className="btn-rounded" outline color="primary" onClick={() => fields.push({})}>Add +</Button>
                    </div>
                </div>
            </div>
            {
                validationState &&
                <FormGroup color={validationState}>
                    {(error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>)}
                </FormGroup>
            }
        </div>
    )
}