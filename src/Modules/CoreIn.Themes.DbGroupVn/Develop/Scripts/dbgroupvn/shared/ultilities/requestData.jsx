const requestData = (url, pageSize, page, sorted, filtering, taxonomies, callback) => {
    $.ajax({
        url,
        method: "POST",
        data: { pageSize, page, sorted, filtering, taxonomies },
        success: callback
    });
}
module.exports = requestData
