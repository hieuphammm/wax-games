// ==UserScript==
// @name         WAX Auto Accept Login
// @namespace    wax.io
// @version      1.0.0
// @description  Auto Accept Login for WAX.io
// @author       Hieu Pham
// @match        http*://all-access.wax.io/cloud-wallet/login/
// @grant        none
// ==/UserScript==

(function() {
  // Allow the popup accepted all requests
  const ALLOW_ACCEPT_ALL = false;

  var WaitForReady = setInterval(function() {
    var tags_i = document.getElementsByTagName("button");
    var contractName = document.getElementsByClassName("origin-app")[0];
    if (ALLOW_ACCEPT_ALL ||
      (contractName && contractName.outerText.includes("Unknown URL"))) {
      for (var i = 0; i < tags_i.length; i++) {
        if (tags_i[i].textContent == "Approve"
           && !tags_i[i].hasAttribute('disabled')) {
          var tags_j = document.getElementsByTagName("input");
          for (var j = 0; j < tags_j.length; j++) {
            if (tags_j[j].value == "remember") {
              break;
            }
          }
          tags_i[i].click();
          clearInterval(WaitForReady);
          break;
        }
      }
    }
  }, 100);
})();
