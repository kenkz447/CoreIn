const $ = require('jquery');

const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

function fieldValidate(fields, values) {
    const errors = {};

    
    for (var field in fields) {
        if (!values)
            values = {};

        const fieldObj = fields[field];

        var fieldName = fieldObj.name;
        var isArray = fieldObj.display && fieldObj.display.renderType != 'Image' && fieldObj.childFields;
        if (isArray && values[fieldName].length) {
            for (var index in values[fieldName]) {
                var validateResult = fieldValidate(fieldObj.childFields, values[fieldName][index]);
                if (validateResult) {
                    if (!errors[fieldName])
                        errors[fieldName] = [];
                    errors[fieldName].push(validateResult);
                }
            }
        }

        const validate = fieldObj.fieldValidate;

        if (!validate)
            continue;

        var hasRequired = validate.required;
        var typeRequired = validate.type;
        var minLengthRequired = validate.minLength;
        var maxLengthRequired = validate.maxLength;
        var hasCompare = validate.compare;

        var hasContainLowercase = validate.containLower;
        var hasContainUppercase = validate.containUpper;
        var hasContainNumber = validate.containNumber;
        var hasContainSpecialChar = validate.containSpecial;

        if (hasRequired && !values[fieldName] || (Array.isArray(values[fieldName]) && !values[fieldName].length)) {
            errors[fieldName] = !isArray ? hasRequired : { _error: hasRequired };
        }
        else if (typeRequired && !isType(values[fieldName], typeRequired.value)) {
            errors[fieldName] = typeRequired.error;
        }
        else if (minLengthRequired && values[fieldName] && values[fieldName].length < minLengthRequired.value) {
            errors[fieldName] = minLengthRequired.error;
        }
        else if (hasCompare && values[fieldName] != values[hasCompare.value]) {
            errors[fieldName] = hasCompare.error;
        }
        else if (hasContainLowercase && !/(?=.*[a-z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainLowercase.error;
        }
        else if (hasContainUppercase && !/(?=.*[A-Z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainUppercase.error;
        }
        else if (hasContainNumber && !/(?=.*[0-9])/.test(values[fieldName])) {
            errors[fieldName] = hasContainNumber.error;
        }
        else if (hasContainSpecialChar && !/(?=.*[!@#$%^&*])/.test(values[fieldName])) {
            errors[fieldName] = hasContainSpecialChar.error;
        }
    }
    return $.isEmptyObject(errors) ? undefined : errors;
}

const validator = fieldGroups => values => {
    const errors = {};

    for (var fieldGroup in fieldGroups) {
        errors[fieldGroup] = fieldValidate(fieldGroups[fieldGroup], values[fieldGroup]);
    }

    return errors;
}

module.exports = validator