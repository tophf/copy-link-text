'use strict';

/** @type {chrome.runtime.Port} */
let port;

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
    if (!port) await initOffscreen();
    port.postMessage(result);
  }
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
  port = chrome.runtime.connect();
  port.onDisconnect.addListener(onOffscreenClosed);
}

/** Fired if the offscreen document was killed or closed */
function onOffscreenClosed() {
  port = null;
}
