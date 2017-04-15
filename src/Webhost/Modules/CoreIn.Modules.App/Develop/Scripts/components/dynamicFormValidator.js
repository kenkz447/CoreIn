const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

const validator = validating => values => {
    const errors = {};
    for (var propertyGroup in validating)
    {
        errors[propertyGroup] = {};
        if (!values[propertyGroup])
            values[propertyGroup] = {};

        for (var property in validating[propertyGroup]) {

            if (!validating[propertyGroup][property].validate)
                continue;

            var fieldName = validating[propertyGroup][property].input.name;

            var hasRequired = validating[propertyGroup][property].validate.required;
            var typeRequired = validating[propertyGroup][property].validate.type;
            var minLengthRequired = validating[propertyGroup][property].validate.minLength;
            var maxLengthRequired = validating[propertyGroup][property].validate.maxLength;
            var hasCompare = validating[propertyGroup][property].validate.compare;

            var hasContainLowercase = validating[propertyGroup][property].validate.containLower;
            var hasContainUppercase = validating[propertyGroup][property].validate.containUpper;
            var hasContainNumber = validating[propertyGroup][property].validate.containNumber;
            var hasContainSpecialChar = validating[propertyGroup][property].validate.containSpecial;

            if (hasRequired && hasRequired.value && !values[propertyGroup][fieldName]) {
                errors[propertyGroup][fieldName] = hasRequired.error;
            }
            else if (typeRequired && !isType(values[propertyGroup][fieldName], typeRequired.value)) {
                errors[propertyGroup][fieldName] = typeRequired.error;
            }
            else if (minLengthRequired && values[propertyGroup][fieldName] && values[propertyGroup][fieldName].length < minLengthRequired.value) {
                errors[propertyGroup][fieldName] = minLengthRequired.error;
            }
            else if (hasCompare && values[propertyGroup][fieldName] != values[hasCompare.value]) {
                errors[propertyGroup][fieldName] = hasCompare.error;
            }
            else if (hasContainLowercase && !/(?=.*[a-z])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainLowercase.error;
            }
            else if (hasContainUppercase && !/(?=.*[A-Z])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainUppercase.error;
            }
            else if (hasContainNumber && !/(?=.*[0-9])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainNumber.error;
            }
            else if (hasContainSpecialChar && !/(?=.*[!@#$%^&*])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainSpecialChar.error;
            }
        }
    }
    

    return errors;
}

module.exports = validator