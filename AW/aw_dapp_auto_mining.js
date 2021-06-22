// ==UserScript==
// @name         Auto click wax-dapps.site
// @namespace    wax-dapps.site
// @version      1.0.1
// @description  Auto Mine & Claim
// @author       miner-team
// @match        http*://wax-dapps.site/alienworlds/mining
// @icon         https://www.google.com/s2/favicons?domain=wax-dapps.site
// @grant        none
// @updateURL
// @downloadURL
// ==/UserScript==

(function init() {

  // Your tool delay time in second
  const ToolDelayTimeInSecond = 1620;

  // Constant
  const ON_SOUND = false; // TODO: Set it to enable/disable sound
  const ON_TESTING = true;
  const MILISECOND = 1000;
  const DEFAULT_TIMEOUT = 1 * MILISECOND;
  const LOG_COLOR = 'color: pink; background: black';

  // Time
  const delayTime = ToolDelayTimeInSecond * MILISECOND;
  const mineTime = 4 * MILISECOND;
  const claimTime = mineTime + 5 * MILISECOND;
  const errorTime = claimTime + 30 * MILISECOND;
  const timeToReload = claimTime + delayTime + 10 * MILISECOND;

  // Variable
  var timerEl;
  var remainSeconds = 0;
  var claimingError = true;
  var timeToLogin = 0;

  // Testing
  if (ON_TESTING) {
    document
      .getElementById('notification')
      .insertAdjacentHTML('afterend', `<p id="test" style="${LOG_COLOR}"></p>`);
    let mineTimeTest = mineTime / MILISECOND;
    let claimTimeTest = claimTime / MILISECOND;
    let errorTimeTest = errorTime / MILISECOND;
    let timeToReloadTest = timeToReload / MILISECOND;

    let itv = setInterval(() => {
      document.getElementById('test').innerHTML = `mineTime: ${
        mineTimeTest > 0 ? --mineTimeTest : 0
      }, claimTime: ${claimTimeTest > 0 ? --claimTimeTest : 0}, errorTime: ${
        errorTimeTest > 0 ? --errorTimeTest : 0
      }, timeToReload: ${timeToReloadTest > 0 ? --timeToReloadTest : 0}`;

      if (
        mineTimeTest <= 0 &&
        claimTimeTest <= 0 &&
        errorTimeTest <= 0 &&
        timeToReloadTest <= 0
      ) {
        clearInterval(itv);
      }
    }, MILISECOND);
  }

  // Disable play sound
  if (!ON_SOUND) {
    console.log('%c Sound is disabling...', LOG_COLOR);
    let cbAudio = document.getElementById('checkbox-audio');
    if (!cbAudio.checked) {
      return;
    }
    cbAudio.nextElementSibling.click();
  }

  // Make sure you are loggged in - if not reload the page
  var CheckForLogin = setInterval(function() {
    let loginBtn = document.getElementById('login-button');
    let mineBtn = document.getElementById('mine-button');
    let claimBtn = document.getElementById('claim-button');

    if (!loginBtn.hasAttribute('disabled')) {
      location.reload();
      return;
    }

    if (loginBtn.hasAttribute('disabled') &&
      claimBtn.hasAttribute('disabled') &&
      !mineBtn.hasAttribute('disabled')) {
      location.reload();
      return;
    }
  }, 15 * 60 * MILISECOND);

  // Click login
  setTimeout(function() {
    (function waitLogin() {
      console.log('%c Login...', LOG_COLOR);
      // Check if already login
      if (document.getElementById('header-info').innerHTML != 'Alien Worlds') {
        return;
      }

      // Login
      let loginBtn = document.getElementById('login-button');
      if (!loginBtn.hasAttribute('disabled')) {
        timeToLogin = 10 * MILISECOND;
        loginBtn.click();
        console.log(new Date().toLocaleString() + ' Click Login');
      } else {
        setTimeout(waitLogin, DEFAULT_TIMEOUT);
      }
    })();
  }, mineTime);


  // *** IMPORTANT CODE ***

  // Click mine after reload page
  setTimeout(function() {
    (function waitMine() {
      console.log('%c Mining...', LOG_COLOR);
      let mineBtn = document.getElementById('mine-button');
      if (!mineBtn.hasAttribute('disabled')) {
        mineBtn.click();
        console.log(new Date().toLocaleString() + ' Click Mine');
      }
    })();
  }, mineTime + timeToLogin);

  // Click Claim
  setTimeout(function() {
    (function waitClaim() {

      // Checking timer and set reload page if the mining is in progress
      timerEl = document.getElementById('timer').innerHTML.split(':');
      remainSeconds = Number(timerEl[0]) * 60 + Number(timerEl[1]);

      console.log('timer: ' + remainSeconds);

      if (remainSeconds > 0) {
        claimingError = false;
        console.log('Mining is in progress, reload the page after ' + remainSeconds + 'seconds', LOG_COLOR);
        // Set time to reload the page
        setTimeout(function() {
          (function waitReload() {
            //await delay(remainSeconds);
            location.reload();
          })();
        }, (remainSeconds + 3) * MILISECOND);
      } else {

        console.log('%c Claiming...', LOG_COLOR);
        let claimBtn = document.getElementById('claim-button');
        if (!claimBtn.hasAttribute('disabled')) {
          claimBtn.click();
          console.log(new Date().toLocaleString() + ' Click Claim');
        }
      }
    })();
  }, claimTime + timeToLogin);

  // Reload if get error or can't resolve the popup....
  setTimeout(function() {
    (function waitNextMine() {
      console.log('%c Waiting...', LOG_COLOR);

      let notification = document.getElementById('notification');
      if (notification.textContent.toLowerCase().toString().match('error')) {
        location.reload();
      } else {
        if (notification.textContent.toString().match('ALIEN WORLDS - Mined')) {
          console.log(new Date().toLocaleString() + 'Claim sucess, Wait for next mining reload');
        } else {

          // Can't resolve popup trying reload page
          if (claimingError) {
            location.reload();
          }
        }
        // setTimeout(waitNextMine, DEFAULT_TIMEOUT);
      }
    })();
  }, errorTime + timeToLogin);

  // Set time to reload the page
  setTimeout(function() {
    (function waitReload() {
      console.log('%c Set time to reload the page...', LOG_COLOR);

      location.reload();
      // init();
    })();
  }, timeToReload + timeToLogin);
})();
