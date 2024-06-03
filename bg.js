"use strict";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "run",
    type: "normal",
    contexts: ["link"],
    title: "Copy link te&xt",
    documentUrlPatterns: ["*://*/*", "file://*/*"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu clicked", { info, tab });

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id, frameIds: [info.frameId] },
      files: ["content.js"],
      // injectImmediately: true, // TODO: Chrome 102
    })
    .then(() => {
      const message = { linkUrl: info.linkUrl };
      console.log("Content script executed, sending message:", message);
      chrome.tabs.sendMessage(tab.id, message);
    })
    .catch((error) => {
      console.error("Failed to execute content script", error);
    });
});
