window.onload = userData;
function userData() {
    //Stores the redirect
    var uc;
    var baseUrl;
    var finalUrl;
    var background;
    try {
        background = chrome.extension.getBackgroundPage();
        baseUrl = background.newTabUrl;
        if (typeof (background.firstShow) != 'undefined' && background.firstShow == true) {
            background.firstShow = false;
            return FirstNewTab(background.newTabUrl);
        }
        uc = background.uc;
    } catch (err) { }
    var geturl = false;
    if (!baseUrl || baseUrl.indexOf("undefined") > -1) {
        geturl = true;
        chrome.storage.sync.get(function (result) {
            try {
                background.newTabUrl = result["newtab"];
                background.uc = result["userclass"];
                baseUrl = background.newTabUrl;
                uc = background.uc;
            }
            catch (err) {
                baseUrl = result["newtab"];
            }

            if (typeof (baseUrl) == 'undefined' || baseUrl.indexOf("undefined") > -1) {
                finalUrl = "http://search.searchytdvta.com?&ap=nocache&i_id=brandedtab_" + chrome.app.getDetails().version + "&page=newtab&";
            } else {
                finalUrl = baseUrl + "&i_id=brandedtab_" + chrome.app.getDetails().version + "&page=newtab&";
            }

            createNewTab(finalUrl, uc);
        });
    }

    if (geturl === false) {
        finalUrl = baseUrl + "&i_id=brandedtab_" + chrome.app.getDetails().version + "&page=newtab&";
        createNewTab(finalUrl, uc);
    }
}

function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
}

function FirstNewTab(newTabUrl) {
    var iframe = document.createElement('iframe');
    iframe.src = newTabUrl + "&i_id=brandedtab_" + chrome.app.getDetails().version + "&page=newtab&";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    document.body.appendChild(iframe);
}
function createNewTab(newTabUrl, uc) {
    chrome.tabs.query({}, function (array_of_Tabs) {
        //console.log(array_of_Tabs.length);
        if (array_of_Tabs.length === 1) {
            var iframe = document.createElement('iframe');
            iframe.src = newTabUrl;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            document.body.appendChild(iframe);
        }
        else {
            window.location.href = newTabUrl;
        }
    });
}