'use strict';

{
  let el;
  let root = document;
  while ((el = root.activeElement) && (root = el.shadowRoot)) {}
  navigator.clipboard.writeText(el.innerText);
}
