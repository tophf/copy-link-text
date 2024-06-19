'use strict';

/** To close the offscreen document before terminating the background script. */
let timeout;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'run',
    type: 'normal',
    contexts: ['link'],
    title: 'Copy link te&xt',
    documentUrlPatterns: ['*://*/*', 'file://*/*'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  clearTimeout(timeout);
  const tabId = tab.id;
  const {frameUrl, frameId} = info;
  const isCrossOrigin = frameId &&
    new URL(frameUrl).origin !== new URL(tab.url).origin;

  if (isCrossOrigin && !await chrome.permissions.request({origins: [frameUrl]}))
    return;

  const [{message: err, result}] = await chrome.scripting.executeScript({
    target: {tabId, frameIds: [frameId]},
    injectImmediately: true,
    func: findLink,
  }).catch(e => [e]);

  chrome.action.setTitle({
    tabId,
    title: result ? '' : `${err}`,
  });
  if (isCrossOrigin)
    chrome.permissions.remove({origins: [frameUrl]});
  if (!err) {
    await initOffscreen();
    chrome.runtime.sendMessage(result);
  }
  timeout = setTimeout(chrome.offscreen.closeDocument, 25e3);
});

function findLink() {
  let el;
  let root = document;
  while (
    (el = root.activeElement) &&
    (root = el.shadowRoot || chrome.dom.openOrClosedShadowRoot(el))
  ) {/*nop*/}
  return el.innerText;
}

async function initOffscreen() {
  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'Write to clipboard',
    });
  } catch (err) {
    if (!err.message.startsWith('Only a single offscreen')) throw err;
  }
}
