const $ = require('jquery');
const {Input, FormGroup, Label} = require('reactstrap');

module.exports = function(props) {
    const {input, display: {id, title, placeholder}, values} = props;
    return (
        <FormGroup check>
            <Label>{title}</Label>

            <Label check>
                <Input {...input} type="select">
                    {
                        $.map(values, (key) => {
                            <option value={key}>{values[key]}</option>
                        })
                    }
                </Input>
            </Label>
        </FormGroup>
    );
};