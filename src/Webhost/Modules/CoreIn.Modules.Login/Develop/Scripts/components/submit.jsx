var $ = require('jquery');
var {SubmissionError} = require('redux-form');

const loginRequest = data => new Promise((resolve, reject) =>
    $.ajax({
        url: 'login',
        method: 'POST',
        data: data,
        success: (response) => {
            if (response.result === "success") {
                resolve(response);
            } else {
                reject(response);
            }
        },
        error: (response) => {
            reject(response);
        }
    })
);

function loginSubmit(values) {
    return loginRequest(values)
        .then((response) => {
            window.location.href = response.returnUrl;
        })
        .catch((response) => {
            if (response.result && response.result === "error") {
                throw new SubmissionError(response.errors);
            } else {
                throw new SubmissionError({ _error: 'Login failed!' });
            }
        });
}

module.exports = {
    loginSubmit: loginSubmit
}