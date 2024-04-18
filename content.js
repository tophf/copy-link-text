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
    const t = document.createElement('textarea');
    t.style.cssText = 'all:revert; position:fixed; top: 0; left: 0; visibility:hidden;'
      .replace(/;/g, '!important');
    t.value = text;
    document.body.appendChild(t);
    t.focus({preventScroll: true});
    t.select();
    document.execCommand('copy');
    el.focus();
    t.remove();
    sel.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  }
}
