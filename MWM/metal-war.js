// ==UserScript==
// @name         Auto Bot For MWM
// @namespace    game2.metal-war.com
// @version      1.0.0
// @description  Auto Script FOR MWM
// @author       HieuPham
// @match        http*://game2.metal-war.com
// @updateURL
// @downloadURL  
// @grant        none
// ==/UserScript==

(function init() {

  const RAID = 2; // Raiding time

  const MILISECOND = 1000;
  const SECOND = 60;
  const DELAY = 30; // delay time for reparing
  const SLEEP = 20;
  const DEFAULT_TIMEOUT = 1 * MILISECOND;

  var raidTimes = [new Date()];

  Array.prototype.asyncForEach = async function(callback) {
    for (let index = 0; index < this.length; index++) {
      await callback(this[index], index, this);
    }
  }

  function wait(ms) {
    return new Promise(r => setTimeout(r, ms))
  }

  // Mining - excute every minutes
  setInterval(() => {

    let tanks_container = document.getElementsByClassName('tanks_container')[0];
    if (!tanks_container) {
      console.log(new Date().toLocaleString() + " - Can't find the tanks_container");
      return;
    }
    let tanks = tanks_container.children;
    // Loop all tanks

    (async () => {
      const promises = [];

      tanks.asyncForEach(async (item, i) => {

        // 1.  Select the tank
        if (!item.style.getPropertyValue("transform").toString().includes("scale(1)")) {
          console.log(`Select tank #${i+1}`);
          item.click();
        } else {
          console.log(`Tank #${i+1} selected`);
        }

        // 2. Check remaining time - Click perform the rading
        setTimeout(function() {
          (function Mining() {
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
                  console.log(new Date().toLocaleString() + ` - Click raid for tanks #${i+1}`);
                } else {
                  console.log(new Date().toLocaleString() + `- Tank #${i+1} mining inprogress`);
                }
              } else {
                console.log(new Date().toLocaleString() + `- Cannot find raid_buttons`);
              }
            } else {
              console.log(new Date().toLocaleString() + `- Tank #${i+1}, remaining time ${timer.outerText} (${remainSeconds})`);
            }
          })
        }, 5 * SECOND * MILISECOND);

        // 3. Check HP- Repair the tool
        setTimeout(function() {
          (function Mining() {
            let hp_text = item.getElementsByClassName('hp_text')[0];
            if (!hp_text) {
              return
            };

            let needRepair = hp_text.innerText.startsWith("0/");
            if (needRepair) {
              setTimeout(function() {
                (function Reparing() {
                  let button = document.getElementsByClassName('repair_price')[0];
                  if (button) {
                    button.click();
                    console.log(new Date().toLocaleString() + `- Tank #${i+1} reparing ......`);
                  } else {
                    console.log(new Date().toLocaleString() + `- Tank #${i+1} - An error occurred`);
                  }
                })();
              }, 2 * SECOND * MILISECOND);
            } else {
              console.log(new Date().toLocaleString() + ` - Tank #${i+1} HP: ` + hp_text.innerText);
            }

          }, 5 * SECOND * MILISECOND);
        })();
        console.log(i);
        promises.push(await wait(30000));
      });

      await Promise.all(promises);

    }, RAID * SECOND * MILISECOND);
  })();
})();
