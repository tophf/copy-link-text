'use strict';

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(close);
  port.onMessage.addListener(onMessage);
});

function onMessage(msg) {
  const el = document.querySelector('textarea');
  el.value = msg;
  el.focus();
  el.select();
  document.execCommand('copy');
}
