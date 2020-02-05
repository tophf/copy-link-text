'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'run',
    type: 'normal',
    contexts: ['link'],
    title: 'Copy link te&xt',
    documentUrlPatterns: ['*://*/*', 'file://*/*'],
  }, () => chrome.runtime.lastError);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.executeScript(tab.id, {
    frameId: info.frameId,
    runAt: 'document_start',
    code: `(${pierceShadow})()`,
  }, ([text]) => {
    if (!chrome.runtime.lastError && text)
      copyToClipboard(text);
  });
});

function pierceShadow() {
  let el;
  let root = document;
  while ((el = root.activeElement) && (root = el.shadowRoot)) {}
  return el.innerText;
}

function copyToClipboard(text) {
  const el = document.createElement('textarea');
  document.body.appendChild(el);
  el.value = text;
  el.select();
  document.execCommand('copy');
  el.remove();
}
