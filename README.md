# position.js

Positions a popup element to an anchor element 😉

[![npm version](https://badgen.net/npm/v/position.js)](https://www.npmjs.com/package/position.js)
[![minzipped size](https://badgen.net/bundlephobia/minzip/position.js)](https://bundlephobia.com/result?p=position.js)
[![Greenkeeper badge](https://badges.greenkeeper.io/ambar/position.js.svg)](https://greenkeeper.io/)

## Demo

[position.js](http://ambar.li/position.js/)

## Usage

```js
const {
  placement, // actual placement
  popupOffset, // CSS position: {left, top}
  arrowOffset, // CSS position: {left, top}
  popupRect,
  anchorRect,
} = position(popup, anchor, 'top', options)

// DOM
Object.assign(popup.style, popupOffset)

// React
<Popup style={popupOffset} arrowOffset={arrowOffset} placement={placement} />
```

## API

`position(popup, anchor, placement, options)`

### Options

```js
{
  // use fixed or absolute position, defaults to false
  fixed: false,
  // any scroller element, defaults to document.body
  offsetParent: document.body,
  // 'auto': adjusts horizontally or vertically, 'both': adjusts horizontally and vertically, defaults to 'none'
  adjustXY: 'none',
}
```

### Placement Presets

- `top`
- `right`
- `bottom`
- `left`
- `center`
- `top-left`
- `top-right`
- `right-top`
- `right-bottom`
- `bottom-left`
- `bottom-right`
- `left-top`
- `left-bottom`

### Placement Combos

```
position(popup, anchor, {popup: 'left-top', anchor: 'right-top'})
// same as `right-top` placement
position(popup, anchor, 'right-top')
```
