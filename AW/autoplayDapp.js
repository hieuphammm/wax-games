// ==UserScript==
// @name         auto click mining AW dapp
// @namespace    GodYakuza
// @version      0.1
// @description  GodYakuza
// @author        GodYakuza
// @match        http*://wax-dapps.site/alienworlds/mining
// @icon         https://www.google.com/s2/favicons?domain=wax-dapps.site
// @grant        none
// @updateURL
// @downloadURL
// ==/UserScript==

(function () {
    // Time
	var delayTime = 630000;
    var mineTime = 4000;
    var claimTime = mineTime + 8000;
    var errorTime = claimTime + 10000;
    var timeToReload = claimTime + delayTime + 10000;
    // click mine after reload page
    setTimeout(function() {
        var mine = document.getElementById("mine-button");
        mine.click();
        console.log('Click Mine');
        console.log(new Date().toLocaleString());
    }, mineTime);

    setTimeout(function() {
        var claim = document.getElementById("claim-button");
        claim.click();
        console.log('Click Claim');
        console.log(new Date().toLocaleString());
    }, claimTime);

    // Reload if get error
    setTimeout(function() {
        var notification = document.getElementById("notification");
        if (notification.textContent.toLowerCase().toString().match('error'))
        {
            location.reload();
        }
        else
        {
            console.log('Wait for next mining reload');
            console.log(new Date().toLocaleString());
        }
    }, errorTime);

    // set time to reload the page
    setTimeout(function() {
        location.reload();
    }, timeToReload);
})();
