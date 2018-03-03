const platinumTier = "platinum"
const goldTier     = "gold"
const silverTier   = "silver"

const platinumDelay = 0
const goldDelay     = 3000  // 3 seconds
const silverDelay   = 7000 // 7 seconds

const platinumSiteLimit = Number.MAX_SAFE_INTEGER // Basically no limit for platinum
const goldSiteLimit     = 200  // 200 page loads a day
const silverSiteLimit   = 25 // 25 page loads a day

const silverCensorList = ["Comcast", "Xfinity", "Spectrum", "Verizon"] // Block all sites that contain these words

var beginRedactText = "<span style='color: black; background-color: black; white-space:nowrap; border:1px dotted #555; background: -moz-linear-gradient(180deg, #000, #222);'>"
var endRedactText = "</span>"

getTier(tierHandler);

/*
 * Get the tier and select it on the radio buttons.
 * If it doesn't exist yet (first time user) then make it platinum
 */
function getTier (callback) {

    chrome.storage.sync.get("tier", function (obj) { 
                                        var tier;
                                        if (obj == undefined) {
                                            chrome.storage.sync.set({ "tier" : "platinum" }, function () {});
                                            tier = "platinum";
                                            chrome.storage.sync.set({ "siteCount" : 1}, function () {});
                                        } else {
                                            tier = obj["tier"]
                                        }
                                        callback(tier);
                                    });
}

/*
 * Handles what should happen for each and every tier.
 */
function tierHandler (tier) {

	if (tier == platinumTier) {
		platinumHandler();
		return;
	}

    if (tier === silverTier) {
        silverHandler();
    } else if (tier == goldTier) {
        goldHandler();
    }

}

/*
 * "Slows a page down" based on what tier you have. 
 * What this really does is change the entire body of the HTML, and then 
 * set it back to the original after a certain amount of time.
 */
function slowPage (tier) {

	var body = document.body.cloneNode(true);

	document.body.innerHTML = '<h1 style="padding-top: 100px; text-align: center; font-size: 60px;"> Loading... </h1>' + '<p style="padding: 50px; text-align: center; font-size: 30px;">To increase speeds, please upgrade to a faster tier.</p>'

	setTimeout(function () {
		document.body = body
	}, tierDelay(tier));
}

/*
 * Returns the appropriate delay based on the passed tier.
 */
function tierDelay (tier) {
	if (tier == silverTier) {
		return silverDelay;
	} else if (tier == goldTier) {
		return goldDelay;
	} else {
		return platinumDelay;
	}

}

/*
 * Handles the silver tier
 */
function silverHandler () {
    
	slowPage(silverTier);

	setTimeout(function() {
		dataCapper(silverTier);
	}, 1);

	censorHandler(silverTier);
}

/*
 * Handles the gold tier
 */
function goldHandler () {
	slowPage(goldTier);

	setTimeout(function() {
		dataCapper(goldTier);
	}, 1);
}

/* 
 *  Does nothing.
 *  The idea of the platinum tier is that you browse the Internet as it stands today.
 */
function platinumHandler () {
    return;
}

/*
 * Limits a user to a certain number of sites per day. 
 */
function dataCapper (tier) {

    chrome.storage.sync.get("siteCount", function (obj) { 
                                        var count;
                                        if (obj == undefined) {
                                            chrome.storage.sync.set({ "siteCount" : 1}, function () {});
                                            count = 1;
                                        } else {
                                            count = obj["siteCount"]
                                            chrome.storage.sync.set({ "siteCount" : (count + 1)}, function () {});
                                        }

                                        if (reachedLimit(count, tier)) {
                                        	blockSiteForDataCap();
                                        }
                                        
                                    });	
}

/*
 * Blocks the site, and warns the user that they have reached their data limit
 * for the day. 
 * Note: I reset the site count back to 0 so that users can actually play around 
 * with this extension and aren't actually stuck for the rest of the day.
 */
function blockSiteForDataCap() {
	document.body.innerHTML = '<h1 style="padding-top: 100px; text-align: center; font-size: 60px;"> Data Cap Reached</h1>' + '<p style="padding: 50px; text-align: center; font-size: 30px;">You have reached your daily data cap. Please upgrade your tier to get more data.</p>'
    chrome.storage.sync.set({ "siteCount" : 0}, function () {});
}

function blockSiteForCensorship() {
	document.body.innerHTML = '<h1 style="padding-top: 100px; text-align: center; font-size: 60px; color: red"> This site is blocked</h1>' + '<p style="padding: 50px; padding-bottom: 20px; text-align: center; font-size: 30px;">This site contains content that violates our user agreement.</p>' + '<p style="text-align: center; font-size: 30px;">Please upgrade your tier for unrestriced Internet access.</p>'
}

/*
 * Returns true if a user has reached their data limit based on their tier, and
 * false if otherwise.
 */
function reachedLimit (count, tier) {
	if ((tier == silverTier) && (count >= silverSiteLimit)) {
		return true;
	} else if ((tier == goldTier) && (count >= goldSiteLimit)) {
		return true;
	} else {
		return false;
	}
}

/* 
 * Censors webpage AFTER the loading screen goes away.
 */ 
function censorHandler(tier) {
	setTimeout(function () {	
		censor(document.body, silverCensorList)	
	}, tierDelay(tier) + 10);
}

/* Blocks the site for censorship if a word is found on the webpage that
 * is contained in the censorList
 */
function censor(node, censorList) {
	if (node.nodeType == 3) {
		for (var i = 0; i < censorList.length; i++)
			if (node.data.indexOf(censorList[i]) >= 0) {
				blockSiteForCensorship();
			}
  	}
  	if (node.nodeType == 1 && node.nodeName != "SCRIPT") {
    	for (var i = 0; i < node.childNodes.length; i++) {
      		censor(node.childNodes[i], censorList);
    	}
  	}
}



	





