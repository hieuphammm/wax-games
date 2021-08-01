// ==UserScript==
// @name         play.farmersworld.io
// @namespace    play.farmersworld.io
// @version      1.0.0
// @description  Auto Mine & Claim
// @author       Hieu Pham
// @match        http*://play.farmersworld.io
// @updateURL    
// @downloadURL  
// @grant        none
// ==/UserScript==

(function init() {

  const RAID = 1; // Raiding time
  const REPAIR = 10; // repairing time
  const MILISECOND = 1000;
  const SECOND = 60;
  const DELAY = 2; // delay time for reparing

  const LOG_COLOR = 'color: pink; background: black';
  const LOG_COLOR_ERROR = 'color: red; background: black';

  var raidTime = new Date();

  // Mining
  var doMining = () => {
    let timer = document.getElementsByClassName('info-time')[0];
    let remainSeconds = 0;
    if (timer) {
      let timerEl = timer.innerHTML.split(':');
      remainSeconds = Number(timerEl[1]) * 60 + Number(timerEl[2]);
    }

    if (!timer ||
      remainSeconds < 100 ||
      (new Date() - raidTime) > 59 * SECOND * MILISECOND) {

      let buttons = document.getElementsByClassName('plain-button');
      let raid = buttons[0];

      if (raid && !raid.classList.contains('disabled')) {
        raid.click();
        raidTime = new Date();
        console.log(`%c ${new Date().toLocaleString()}, Click raid!`, LOG_COLOR);
      } else {
        console.log(`%c ${new Date().toLocaleString()}, Mining inprogress`, LOG_COLOR);
      }
    } else {
      console.log(`%c ${new Date().toLocaleString()} : ${timer.outerText} - ${remainSeconds}`, LOG_COLOR);
    }
  }

  // Repair the tool
  var doRepairing = () => {
    let hpEl = document.getElementsByClassName('content')[0];
    if (!hpEl) return;
    let needRepair = hpEl.innerText.startsWith("0/");
    if (needRepair) {
      let button = document.getElementsByClassName('plain-button')[1];
      if (button) {
        button.click();
        console.log(`%c ${new Date().toLocaleString()}, reparing ...`, LOG_COLOR);
      } else {
        console.log(`%c ${new Date().toLocaleString()}, Error...`, LOG_COLOR_ERROR);
      }
    } else {
      console.log(`%c ${new Date().toLocaleString()}, HP: ${hpEl.innerText}`, LOG_COLOR);
    }
  }

  // Repair the tool
  var doCloseModal = () => {
    let modalEl = document.getElementsByClassName('modal')[0];
    if (!modalEl) return;
    
      let button = modalEl.getElementsByClassName('plain-button')[0];
      if (button) {
        button.click();
        console.log(`%c ${new Date().toLocaleString()}, Close popup ...`, LOG_COLOR);
      } else {
        
      }
  }

  setTimeout(() => {
    console.log(`%c Script excuted!`, LOG_COLOR);
    setInterval(doRepairing, REPAIR * SECOND * MILISECOND);
    setInterval(doMining, RAID * SECOND * MILISECOND);
    setInterval(doCloseModal, 30 * MILISECOND);
  }, 15 * MILISECOND);

})();
