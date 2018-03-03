const platinumTier = "platinum"
const goldTier     = "gold"
const silverTier   = "silver"

const platinumDelay = 0
const goldDelay     = 3000  // 3 seconds
const silverDelay   = 7000 // 7 seconds

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
                                        } else {
                                            tier = obj["tier"]
                                        }
                                        console.log(tier)
                                        callback(tier);
                                    });
}

function tierHandler (tier) {

	slowPage(tier);
    
    if (tier === silverTier) {
        silverHandler();
    } else if (tier == goldTier) {
        goldHandler();
    } else {
        platinumHandler();
        console.log("plt")
    }

}


function slowPage (tier) {

	var body = document.body.cloneNode(true);

	document.body.innerHTML = '<h1 style="padding-top: 100px; text-align: center; font-size: 60px;"> Loading... </h1>' + '<p style="padding: 50px; text-align: center; font-size: 30px;">To increase speeds, please upgrade to a faster tier.</p>'

	setTimeout(function () {
		document.body = body
	}, tierToSeconds(tier));
}

function tierToSeconds (tier) {
	if (tier == silverTier) {
		return silverDelay;
	} else if (tier == goldTier) {
		return goldDelay;
	} else {
		return platinumDelay;
	}

}

function silverHandler () {
    

    // First do all the restrictions of the tiers above it
    platinumHandler();
    goldHandler();
    console.log("silver");
}

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






















