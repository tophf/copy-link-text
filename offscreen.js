'use strict';

chrome.runtime.onMessage.addListener(msg => {
  const el = document.querySelector('textarea');
  el.value = msg;
  el.focus();
  el.select();
  document.execCommand('copy');
});
