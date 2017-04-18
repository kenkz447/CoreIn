const $ = require('jquery');
const {SubmissionError} = require('redux-form');
const { parentId } = require('corein').appKeys;

const newTaxonomyRequest = (data) => new Promise((resolve, reject) =>
    $.ajax({
        url: '/taxonomyui/NewTaxonomy',
        method: 'POST',
        data: data,
        success: (response) => {
            if (response.id) {
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

function newTaxonomySubmit(props) {
    const {newTaxonomy} = props;

    return function (formValues) {
        //add parentId to submit data
        if (formValues.meta)
            formValues.meta[parentId] = global.selectedTaxonomyId;

        return newTaxonomyRequest(formValues)
            .then((response) => {
                newTaxonomy(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Something wrong?' });
                }
            });
    }
}

const updateTaxonomyRequest = (data) => new Promise((resolve, reject) =>
    $.ajax({
        url: '/taxonomyui/UpdateTaxonomy',
        method: 'PUT',
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

function updateTaxonomySubmit(props) {

    return function (formValues) {
        const {successAction, currentTaxonomy} = props;

        return updateTaxonomyRequest(formValues)
            .then((response) => {
                successAction(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Something wrong?' });
                }
            });
    }
}

module.exports = {
    newTaxonomySubmit,
    updateTaxonomySubmit
}