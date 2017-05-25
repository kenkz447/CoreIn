const $ = require('jquery');
const {Card, CardBlock, CardHeader, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const renderFieldType = require('./render-field-type');

module.exports = (props) => {
    const { fields, childFields, display: { title }, fileManagerModalToggle, executeFormAction } = props;

    return (
        <div>
            <div>
                <label>{title}</label>
            </div>
            
            <div className="form-array-container">
                {
                    fields.map((field, index) => {
                        return (
                            <Card key={index} className="form-array-item">
                                <span className="dot"/>
                                <CardHeader>
                                    Member #{index + 1}
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
        </div>
    )
}