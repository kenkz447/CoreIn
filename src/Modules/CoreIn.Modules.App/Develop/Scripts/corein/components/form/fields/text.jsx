const $ = require('jquery');
const {Input, FormGroup, Label} = require('reactstrap');

module.exports = function (props) {
    const { input: { value }, display: { title } } = props;
    return (
        <div className="mb-h">
            {`${title}: `}
            <strong>{value}</strong>
        </div>
    );
};