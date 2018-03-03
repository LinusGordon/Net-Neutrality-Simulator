document.addEventListener('DOMContentLoaded', function() {
    
    getTier(tierHandler);
    setTier();
});
    
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
                                        document.getElementById(tier).checked = true;
                                        callback(tier);
                                    });
}

/* 
 * Sets the tier based off of the user input and stores it in sync storage 
 * so that is persists throughout sessions.
 */
function setTier () {
    
    var rad = document.tierSystem.tier;
    var prev = null;
    for(var i = 0; i < rad.length; i++) {
        rad[i].onclick = function() {
            if(this !== prev) {
                prev = this;
            }
            tier = (this.value)
            chrome.storage.sync.set({ "tier" : tier }, function () {});

        };
    }
}

function tierHandler (tier) {
    console.log(tier);
}