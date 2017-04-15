var {SubmissionError} = require('redux-form');

const updateFileRequest = data => new Promise((resolve, reject) =>
    global.jQuery.ajax({
        url: '/filemanager/update',
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

function updateFileSubmit(values) {
    return updateFileRequest(values)
        .then((response) => {
            window.location.href = response.returnUrl;
        })
        .catch((response) => {
            if (response.result && response.result === "error") {
                throw new SubmissionError(response.errors);
            } else {
                throw new SubmissionError({ _error: 'Update failed!' });
            }
        });
}

module.exports = {
    updateFileSubmit
}