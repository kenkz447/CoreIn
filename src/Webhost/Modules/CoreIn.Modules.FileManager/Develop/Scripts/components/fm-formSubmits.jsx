var {SubmissionError} = require('redux-form');

const updateFileRequest = data => new Promise((resolve, reject) =>
    global.jQuery.ajax({
        url: '/filemanager/update',
        method: 'PUT',
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

function updateFileSubmit(props) {
    const { successAction } = props;
    return function (values) {
        return updateFileRequest(values)
            .then((response) => {
                successAction(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Update failed!' });
                }
            });
    }
}

module.exports = {
    updateFileSubmit
}