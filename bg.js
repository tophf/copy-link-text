'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'run',
    type: 'normal',
    contexts: ['link'],
    title: 'Copy link te&xt',
    documentUrlPatterns: ['*://*/*', 'file://*/*'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id, frameIds: [info.frameId]},
    files: ['content.js'],
    // injectImmediately: true, // TODO: Chrome 102
  }).catch(() => {});
});
