import jQuery from 'jquery';

const GET_SINGLE_ACTION = '/getsingle'
const PAGE_CONTROLLER = '/page'

function fetchSingleEntity(entityName, mvcController) {
    return new Promise((executor, reject) => {
        const requestUrl = `${globa.APP_DOMAIN}${mvcController}${GET_SINGLE_ACTION}`
        $.ajax({
            url: requestUrl,
            data: { entityName },
            method: "GET",
            success: (entityResponse) => {
                executor(entityResponse)
            }
        })
    })
}

function fetchPage(entityName) {
    return new Promise((executor, reject) => {
        const requestUrl = `${globa.APP_DOMAIN}${PAGE_CONTROLLER}${GET_SINGLE_ACTION}`
        $.ajax({
            url: requestUrl,
            data: { entityName },
            method: "GET",
            success: (entityResponse) => {
                executor(entityResponse)
            }
        })
    })
}

export { fetchPage, fetchSingleEntity }