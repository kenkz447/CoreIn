const $ = require('jquery');
const {Card, CardBlock, CardHeader, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const renderFieldType = require('./render-field-type');

module.exports = (props) => {
    const { fields, childFields, display: { title }, fileManagerModalToggle, executeFormAction } = props;

    return (
        <div>
            <div className="mb-1">
                <label>{title}</label>
                <Button type="button" className="ml-1" onClick={() => fields.push({})}>+</Button>
            </div>
            
            <div>
                {
                    fields.map((field, index) => {
                        return (
                            <Card key={index}>
                                <CardHeader>
                                    Member #{index + 1}
                                    <div className="card-actions">
                                        <a className="btn-close" onClick={() => fields.remove(index)} href="#"><i className="icon-close"></i></a>
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
            </div>
        </div>
    )
}