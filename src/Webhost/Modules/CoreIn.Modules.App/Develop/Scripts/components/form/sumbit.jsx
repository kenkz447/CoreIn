const $ = require('jquery');
const {SubmissionError} = require('redux-form');

function formAjaxPromise(url, method, data) {
    return new Promise((resolve, reject) =>
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: (response) => {
                if (response.resultState !== 0) {
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
}

function formSubmit(props) {
    const {url, method, successAction, validate} = props;

    return function (values) {
        if (validate) {
            var errors = validate(values);
            var noErrors = (errors.details == undefined && errors.meta == undefined);
            if (!noErrors)
                return new Promise((resolve) => { resolve(); }).then(
                    () => {
                        throw new SubmissionError(errors);
                    })
        }
        return formAjaxPromise(url, method, values)
            .then((response) => {
                successAction(response);
            })
            .catch((response) => {
                if (response.resultState) {
                    throw new SubmissionError(response.Message);
                } else {
                    throw new SubmissionError({ _error: response.statusText });
                }
            });
    }
}

module.exports = formSubmit;