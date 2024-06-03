"use strict";

chrome.runtime.onMessage.addListener((request) => {
  console.log("Link URL:", request.linkUrl);

  try {
    copyLinkText(request.linkUrl);
  } catch (error) {
    console.error("Failed to copy link text:", error);
  }
});

function copyLinkText(linkUrl) {
  console.log("Copying link text");
  const active = findActiveElement();
  console.log("Active element: ", active);
  const link = findLinkElement(active, linkUrl);
  console.log("Link element: ", link);
  const text = link.innerText;
  writeClipboard(text);
}

function findLinkElement(activeElement, linkUrl) {
  if (activeElement.tagName === "A") {
    return activeElement;
  }

  // Happens in Jira, because of their super complex pages :)
  console.warn("Active element is not a link, finding element based on URL:", linkUrl);
  const links = Array.from(document.querySelectorAll("a"));
  const results = links.filter((link) => link.href === linkUrl);

  if (results.length === 0) throw new Error("Link element not found");

  if (results.length > 1) {
    console.warn("Multiple link elements found, returning first:", results);
  }

  if (!results[0]) throw new Error("Link results found, but first element is falsy");

  return results[0];
}

function findActiveElement() {
  let active;
  let root = document;
  const getRoot = chrome.dom?.openOrClosedShadowRoot;

  active = root.activeElement;
  while (active) {
    root = active.shadowRoot || (getRoot ? getRoot(active) : active.openOrClosedShadowRoot);
    if (!root) break;

    active = root.activeElement;
  }

  return active;
}

function writeClipboard(text) {
  console.log("Writing to clipboard: ", text);
  const { clipboard } = navigator;
  if (!clipboard) throw new Error("Clipboard API not available");
  clipboard.writeText(text);
}
