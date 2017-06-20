(
    function () {
        var background = chrome.extension.getBackgroundPage();
        chrome.storage.sync.get(function (result) {
            try {
                background.newTabUrl = result["newtab"];
                url = background.newTabUrl;
            }
            catch (err) {
                url = result["newtab"];
            }
            if (typeof (url) == 'undefined' || url.indexOf("undefined") > -1) {
                chrome.tabs.create({ "url": "http://search.searchytdvta.com?&ap=nocache&i_id=brandedtab_" + chrome.app.getDetails().version + "&page=browseraction&" });
            } else {
                chrome.tabs.create({ "url": url + "&i_id=brandedtab_" + chrome.app.getDetails().version + "&page=browseraction&" });
            }
        });
    }
)();