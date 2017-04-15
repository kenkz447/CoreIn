var $ = require('jquery');
var {SubmissionError} = require('redux-form');

const registerRequest = data => new Promise((resolve, reject) =>
    $.ajax({
        url: 'register',
        method: 'POST',
        data: data,
        success: (response) => {
            if (response.result === "success") {
                resolve(response);
            }
            else {
                reject(response);
            }
        },
        error: (response) => {
            reject(response);
        }
    })
)
function registerSubmit(values) {
    return registerRequest(values)
        .then((response) => {
            global.registerSuccessReturnUrl = response.returnUrl;
        })
        .catch((response) => {
            if (response.result && response.result === "error") {
                throw new SubmissionError(response.errors);
            } else {
                throw new SubmissionError({ _error: 'Login failed!' })
            }
        });
}

module.exports = {
    registerSubmit: registerSubmit
}