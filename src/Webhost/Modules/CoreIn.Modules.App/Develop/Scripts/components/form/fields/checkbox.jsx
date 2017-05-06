var {Input, FormGroup, Label} = require('reactstrap');

module.exports = function(props) {
    const {input, display: {id, title, placeholder}} = props;
    return (
        <FormGroup check>
            <Label check>
                <Input {...input} id={id} type="checkbox" checked={input.value} />
                {' ' + title}
            </Label>
        </FormGroup>
    );
};