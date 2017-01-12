# position.js

😉

## Usage

Positions a popup element to an anchor element:

```js
const {left, top} = position(popup, anchor, 'top')
Object.assign(popup.style, {left: `${left}px`, top: `${top}px`})
```

## API

`position(popup, anchor, preset, options)`

### Options

```js
{
  // use fixed or absolute position, defaults to false
  fixed: false,
  // any scroller element, defaults to document.body
  offsetParent: document.body,
}
```


### Presets

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


### Combos

```
position(popup, anchor, {popup: 'left-top', anchor: 'right-top'})
// same as `right-top` preset
position(popup, anchor, 'right-top')
```
