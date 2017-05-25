var addUrlParam = function (search, key, val) {
    var newParam = key + '=' + val,
        params = '?' + newParam;

    // If the "search" string exists, then build params from it
    if (search) {
        // Try to replace an existance instance
        params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);

        // If nothing was replaced, then add the new param to the end
        if (params === search) {
            params += '&' + newParam;
        }
    }

    return params;
};

var getSearchParams = (url) => {
    let url = new URL(url);
    let searchParams = new URLSearchParams(url.search);
    return searchParams;
}

mudule.exports = {
    addUrlParam,
    getSearchParams
}