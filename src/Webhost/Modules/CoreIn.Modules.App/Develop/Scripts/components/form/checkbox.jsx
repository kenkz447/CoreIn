var {Input, FormGroup, Label} = require('reactstrap');

const RenderCheckBox = (props) => {
    const {input, display: {id, title, placeholder}} = props;
    return (
        <FormGroup check>
            <Label check>
                <Input {...input} id={id} type="checkbox" checked={input.value} />
                {' ' + (title ? title : placeholder)}
            </Label>
        </FormGroup>
    );
}

module.exports = RenderCheckBox;