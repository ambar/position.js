# position.js

😉

## Demo

[position.js](http://ambar.li/position.js/)

## Usage

Positions a popup element to an anchor element:

```js
const {left, top, placement, offset, popupRect, anchorRect} = position(popup, anchor, 'top', {adjustXY: 'auto'})
// => {left: 200, top: 200, placement: 'bottom', offset: Point, popupRect: Rect, anchorRect: Rect}
Object.assign(popup.style, {left: `${left}px`, top: `${top}px`})
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
