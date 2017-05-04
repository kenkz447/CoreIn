const keys = require('./keys');

module.exports = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};