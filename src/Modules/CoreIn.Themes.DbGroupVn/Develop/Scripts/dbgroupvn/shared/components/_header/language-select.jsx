const { Input } = require('reactstrap');

module.exports = (props) => {
    return (
        <Input className="text-uppercase border-0 p-0" type="select">
            <option value="en-US">english</option>
            <option value="vi-vn">vietnam</option>
        </Input>
        );
}