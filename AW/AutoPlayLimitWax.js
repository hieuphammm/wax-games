// ==UserScript==
// @name         Auto click limitless WAX
// @namespace    limitwax.netlify.app
// @version      1.0.1
// @description  Auto Mine
// @author       miner-team
// @match        http*://limitwax.netlify.app/
// @grant        none
// ==/UserScript==
(function init() {
  const LOG_COLOR_ERROR = 'color: red; background: black';
  var forceReload = false;
  var errorCount = 0;

  // Clear Error message after 20s
  var ClearError = setInterval(function() {
    let error_element = document.getElementById('error');
    let error_text = error_element.innerHTML || '';
    let mineBtn = document.getElementById('mine');

    let isMining = mineBtn && mineBtn.hasAttribute('disabled');

    if (error_text.includes('INVALID_HASH')) {
      forceReload = true;
    }

    if (error_text.includes('does not have signatures for it')) {
      errorCount++;
    }

    if (!isMining &&
      (forceReload || errorCount > 5)) {
      location.reload();
      return;
    }

    let subfix = error_element.innerHTML.split('|')[1];
    if (subfix) {
      let time = error_element.innerHTML.split('|')[0];
      if ((new Date().getTime() - time) < 15000) {
        return;
      }
    }
    error_element.innerHTML = '';
  }, 20000);


  // Auto Login
  var Login = setInterval(function() {
    (function waitMine() {
      let loginBtn = document.getElementById('login');
      if (loginBtn) {
        loginBtn.click();
        console.log(`%c ${new Date().toLocaleString()} - You are login success`);
        clearInterval(Login);

        setTimeout(() => {
          WaitForMining();
          setInterval(WaitForMining, 45000);
        }, 10000);
      }
    })();
  }, 2000);

  // Auto mine
  var WaitForMining = () => {
    (function waitMine() {
      console.log(`%c ${new Date().toLocaleString()} - Mine checking...`, LOG_COLOR_ERROR);
      let mineBtn = document.getElementById('mine');
      if (mineBtn && !mineBtn.hasAttribute('disabled')) {
        mineBtn.click();
        console.log(`%c ${new Date().toLocaleString()} - Mining excuted`, LOG_COLOR_ERROR);
      }
    })();
  };

  var TextHighLight = setInterval(function() {
    (function textHighLight() {
      let mineBtn = document.getElementById('mine');
      if (mineBtn) {
        if (!mineBtn.classList.contains('mine')) {
          mineBtn.classList.add('mine');
        }

        if (mineBtn.hasAttribute('disabled')) {
          mineBtn.classList.add('highlight');
        } else {
          mineBtn.classList.remove('highlight');
        }
      }
    })();
  }, 2000);

})();
