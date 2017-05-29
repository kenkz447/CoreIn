const $ = require('jquery');
const { Field, FieldArray} = require('redux-form');
const { renderField } = require('./render-field');

module.exports = function (prefixName, props) {
    const { name, childFields, display } = props;
    const renderFieldArray = require('./array');

    const newProps = $.extend(true, {}, props,
        {
            name: prefixName ? `${prefixName}.${name}` : name,
            key: name
        });

    if (childFields && !(display && display.renderType == "Image"))
        return <FieldArray {...newProps} component={renderFieldArray} />;

    return <Field {...newProps} component={renderField} />;
}