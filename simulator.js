const platinumTier = "platinum"
const goldTier     = "gold"
const silverTier   = "silver"

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

    if (tier === silverTier) {
        silverHandler();
    } else if (tier == goldTier) {
        goldHandler();
    } else {
        platinumHandler();
        console.log("plt")
    }

}

function silverHandler () {
    
    // First do all the restrictions of the tiers above it
    platinumHandler();
    goldHandler();
    alert("silver")
}

function goldHandler () {
    alert("gold");
}

/* 
 *  Does nothing.
 *  The idea of the platinum tier is that you browse the Internet as it stands today.
 */
function platinumHandler () {
    return;
}






















