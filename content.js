'use strict';

{
  let el;
  let root = document;
  while ((el = root.activeElement) && (root = el.shadowRoot)) {}
  const text = el.innerText;
  const {clipboard} = navigator;
  if (clipboard) {
    clipboard.writeText(text);
  } else {
    const sel = getSelection();
    const {anchorNode, anchorOffset, focusNode, focusOffset} = sel;
    const el = document.createElement('textarea');
    el.style.cssText = 'all:revert; position:fixed; top: 0; left: 0; visibility:hidden;'
      .replace(/;/g, '!important');
    el.value = text;
    document.body.appendChild(el);
    el.focus({preventScroll: true});
    el.select();
    document.execCommand('copy');
    el.remove();
    sel.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  }
}
