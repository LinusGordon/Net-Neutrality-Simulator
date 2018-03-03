document.addEventListener('DOMContentLoaded', function() {
    
    chrome.storage.sync.get("tier", function (obj) { 
                                        var tier;
                                        if (obj == undefined) {
                                            chrome.storage.sync.set({ "tier" : "platinum" }, function () {});
                                            tier = "platinum";
                                        } else {
                                            tier = obj["tier"]
                                        }
                                        document.getElementById(tier).checked = true;
                                    });
    setTier();

});
    
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