const requestData = (url, pageSize, page, sorted, filtering, taxonomies, additionalFields, callback) => {
    $.ajax({
        url,
        method: "POST",
        data: { pageSize, page, sorted, filtering, taxonomies, additionalFields },
        success: callback
    });
}

module.exports = requestData
