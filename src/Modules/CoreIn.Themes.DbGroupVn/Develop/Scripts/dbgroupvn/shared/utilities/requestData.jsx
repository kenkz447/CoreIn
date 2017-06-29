const requestData = (url, pageSize, page, sorted, filtering, taxonomies, entityTypeId, additionalFields, callback) => {
    $.ajax({
        url,
        method: "POST",
        error: (xhr, ajaxOptions, thrownError) => {
            console.log('requestData error: ' + xhr.responseText)
            console.log(xhr)
        },
        data: { pageSize, page, sorted, filtering, taxonomies, entityTypeId, additionalFields },
        success: callback
    });
}

module.exports = requestData
