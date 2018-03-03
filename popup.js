document.addEventListener('DOMContentLoaded', function() {
    
    checkRadio();
    setTier();
});
    
/* 
 * Get the tier and select it on the radio buttons.
 * If it doesn't exist yet (first time user) then make it platinum
 */
function checkRadio () {

    chrome.storage.sync.get("tier", function (obj) { 
                                        var tier;
                                        if (obj == undefined) {
                                            chrome.storage.sync.set({ "tier" : "platinum" }, function () {});
                                            chrome.storage.sync.set({ "siteCount" : 1}, function () {});
                                            tier = "platinum";
                                        } else {
                                            tier = obj["tier"]
                                        }
                                        document.getElementById(tier).checked = true;
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