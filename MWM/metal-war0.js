// ==UserScript==
// @name         Auto Bot For MWM
// @namespace    game2.metal-war.com
// @version      1.0.0
// @description  Auto Script FOR MWM
// @author       HieuPham
// @match        http*://game2.metal-war.com
// @icon         https://game2.metal-war.com/_nuxt/img/ant.5cc4b20.png
// @updateURL    https://raw.githubusercontent.com/phamvochihieu/alienworlds/main/metal-war.js
// @downloadURL  https://raw.githubusercontent.com/phamvochihieu/alienworlds/main/metal-war.js
// @grant        none
// ==/UserScript==

(function init() {

  const RAID = 2; // Raiding time

  const MILISECOND = 1000;
  const SECOND = 60;
  const DELAY = 30; // delay time for reparing
  const SLEEP = 20;
  const DEFAULT_TIMEOUT = 1 * MILISECOND;
  const LOG_COLOR = 'color: pink; background: black';
  const LOG_COLOR_ERROR = 'color: red; background: black';

  var raidTimes = [new Date()];

  // Mining - excute every minutes
  setInterval(() => {
    let tanks_container = document.getElementsByClassName('tanks_container')[0];
    if (!tanks_container) {
      console.log(`%c ${new Date().toLocaleString()} - Can't find the tanks_container`, LOG_COLOR_ERROR);
      return;
    }
    let tanks = tanks_container.children;
    // Loop all tanks
    for (let i = 0; i < tanks.length; i++) {
      doMining(tanks, i);
    }
  }, RAID * SECOND * MILISECOND);

  function doMining(tanks, i) {
    setTimeout(() => {
      let item = tanks[i];
      setTimeout(() => {
        // 1.  Select the tank
        if (!item.style.getPropertyValue("transform").toString().includes("scale(1)")) {
          console.log(`%c Select tank #${i+1}`, LOG_COLOR);
          item.click();
        } else {
          console.log(`%c Tank #${i+1} selected`, LOG_COLOR);
        }
      }, 1000);
      setTimeout(() => {
        // 2. Check remaining time - Click perform the rading
        let timer = document.getElementsByClassName('timer')[0];
        let remainSeconds = 0;
        if (timer) {
          let timerEl = timer.innerHTML.split(':');
          remainSeconds = Number(timerEl[0]) * 60 + Number(timerEl[1]);
        }

        if (raidTimes.length < i + 1) {
          raidTimes.push(new Date());
        }
        let raidTime_i = raidTimes[i];

        if (!timer ||
          remainSeconds < 100 ||
          (new Date() - raidTime_i) > 59 * SECOND * MILISECOND) {

          let raid_buttons = document.getElementsByClassName('button raid');
          if (raid_buttons) {
            let raid_button = null;
            raid_buttons.forEach((button, i) => {
              if (button.outerText == "RAID") {
                raid_button = button;
                return;
              }
            });

            if (raid_button) {
              raid_button.click();
              raidTime_i = new Date();
              console.log(`%c ${new Date().toLocaleString()} - Click raid for tanks #${i+1}`, LOG_COLOR);
            } else {
              console.log(`%c ${new Date().toLocaleString()} - Tank #${i+1} mining inprogress`, LOG_COLOR);
            }
          } else {
            console.log(`%c ${new Date().toLocaleString()}- Cannot find raid_buttons`, LOG_COLOR_ERROR);
          }
        } else {
          console.log(`%c ${new Date().toLocaleString()} - Tank #${i+1}, remaining time ${timer.outerText} (${remainSeconds})`, LOG_COLOR);
        }

        // 3. Check HP- Repair the tool
        let hp_text = item.getElementsByClassName('hp_text')[0];
        if (!hp_text) {
          return
        };
        let needRepair = hp_text.innerText.startsWith("0/");
        if (needRepair) {
          let button = document.getElementsByClassName('repair_price')[0];
          if (button) {
            button.click();
            console.log(`%c ${new Date().toLocaleString()} - Tank #${i+1} reparing ......`, LOG_COLOR);
          } else {
            console.log(`%c ${new Date().toLocaleString()} - Tank #${i+1} - An error occurred`, LOG_COLOR_ERROR);
          }
        } else {
          console.log(`%c ${new Date().toLocaleString()} - Tank #${i+1} HP: ${hp_text.innerText}`, LOG_COLOR);
        }
      }, 3 * MILISECOND);
    }, ((i + 1) * 30) * MILISECOND);
  }
})();
