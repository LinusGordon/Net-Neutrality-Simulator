const platinumTier = "platinum"
const goldTier     = "gold"
const silverTier   = "silver"

const platinumDelay = 0
const goldDelay     = 3000  // 3 seconds
const silverDelay   = 7000 // 7 seconds

const platinumSiteLimit = Number.MAX_SAFE_INTEGER // Basically no limit for platinum
const goldSiteLimit     = 200  // 200 page loads a day
const silverSiteLimit   = 25 // 25 page loads a day

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

	slowPage(tier);

	setTimeout(function() {
		dataCapper(tier);
	}, 1);

    if (tier === silverTier) {
        silverHandler();
    } else if (tier == goldTier) {
        goldHandler();
    } else {
        platinumHandler();
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
    

    // First do all the restrictions of the tiers above it
    platinumHandler();
    goldHandler();
    console.log("silver");
}

/*
 * Handles the gold tier
 */
function goldHandler () {
	console.log("gold");
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
                                        	blockSite();
                                        }
                                        
                                    });	
}

/*
 * Blocks the site, and warns the user that they have reached their data limit
 * for the day. 
 * Note: I reset the site count back to 0 so that users can actually play around 
 * with this extension and aren't actually stuck for the rest of the day.
 */
function blockSite() {
	document.body.innerHTML = '<h1 style="padding-top: 100px; text-align: center; font-size: 60px;"> Data Cap Reached</h1>' + '<p style="padding: 50px; text-align: center; font-size: 30px;">You have reached your daily data cap. Please upgrade your tier to get more data.</p>'
    chrome.storage.sync.set({ "siteCount" : 0}, function () {});
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

















