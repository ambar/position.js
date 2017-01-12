class Point {
  constructor(x=0, y=0) {
    this.x = x
    this.y = y
  }

  subtract(point) {
    return new Point(this.x - point.x, this.y - point.y)
  }
}

class Rect {
  static fromBoundingClientRect(bcr) {
    if (bcr.getBoundingClientRect) {
      bcr = bcr.getBoundingClientRect()
    }
    return new Rect(bcr.left, bcr.top, bcr.width, bcr.height)
  }

  constructor(x=0, y=0, width=0, height=0) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  resetOrigin() {
    this.x = 0
    this.y = 0
    return this
  }

  get left() { return this.x }
  get top() { return this.y }
  get right() { return this.x + this.width }
  get bottom() { return this.y + this.height }
  get centerX() { return this.x + this.width / 2 }
  get centerY() { return this.y + this.height / 2 }
  get center() { return new Point(this.centerX, this.centerY) }
  get topLeft() { return new Point(this.left, this.top) }
  get topRight() { return new Point(this.right, this.top) }
  get topCenter() { return new Point(this.centerX, this.top) }
  get rightTop() { return this.topRight }
  get rightBottom() { return new Point(this.right, this.bottom) }
  get rightCenter() { return new Point(this.right, this.centerY) }
  get bottomLeft() { return new Point(this.left, this.bottom) }
  get bottomRight() { return this.rightBottom }
  get bottomCenter() { return new Point(this.centerX, this.bottom) }
  get leftTop() { return this.topLeft }
  get leftBottom() { return this.bottomLeft }
  get leftCenter() { return new Point(this.left, this.centerY) }
  get centerTop() { return this.topCenter }
  get centerRight() { return this.rightCenter }
  get centerLeft() { return this.leftCenter }
  get centerBottom() { return this.bottomCenter }
  get centerCenter() { return this.center }
}

const presets = {
  top: {
    popup: 'bottom-center',
    anchor: 'top-center',
  },
  bottom: {
    popup: 'top-center',
    anchor: 'bottom-center',
  },
  left: {
    popup: 'right-center',
    anchor: 'left-center',
  },
  right: {
    popup: 'left-center',
    anchor: 'right-center',
  },
  center: {
    popup: 'center',
    anchor: 'center',
  },
  'top-left': {
    popup: 'bottom-left',
    anchor: 'top-left',
  },
  'top-right': {
    popup: 'bottom-right',
    anchor: 'top-right',
  },
  'right-top': {
    popup: 'left-top',
    anchor: 'right-top',
  },
  'right-bottom': {
    popup: 'left-bottom',
    anchor: 'right-bottom',
  },
  'bottom-left': {
    popup: 'top-left',
    anchor: 'bottom-left',
  },
  'bottom-right': {
    popup: 'top-right',
    anchor: 'bottom-right',
  },
  'left-top': {
    popup: 'right-top',
    anchor: 'left-top',
  },
  'left-bottom': {
    popup: 'right-bottom',
    anchor: 'left-bottom',
  },
}

const toCamelCase = s => (
  s.replace(/([-_])([a-z])/g, (s, a, b) => b.toUpperCase())
)

const getCorner = (rect, corner='') => {
  if (Array.isArray(corner)) {
    corner = corner.join('-')
  }
  const point = rect[toCamelCase(corner)]
  return point instanceof Point ? point : null
}

const getScrollerOffset = ({offsetParent, fixed}) => {
  if (fixed || !offsetParent) {
    return new Point(0, 0)
  }

  let offset = Rect.fromBoundingClientRect(offsetParent).leftTop
  if (offsetParent.getBoundingClientRect && offsetParent !== document.body) {
    const {scrollLeft, scrollTop} = offsetParent
    const bcr = offsetParent.getBoundingClientRect()
    if (!isNaN(scrollLeft) && !isNaN(scrollTop) && (bcr.left !== -scrollLeft || bcr.top !== -scrollTop)) {
      offset = offset.subtract(new Point(scrollLeft, scrollTop))
    }
  }

  return offset
}

const defaults = {
  fixed: false, // use fixed or absolute position
  offsetParent: document.body, // any scroller element
}

const position = (popup, anchor, preset, options) => {
  options = Object.assign({}, defaults, options)
  anchor = Rect.fromBoundingClientRect(anchor)
  popup = Rect.fromBoundingClientRect(popup).resetOrigin()

  if (typeof preset === 'string') {
    preset = presets[preset]
  }

  if (!preset) {
    return null
  }

  const popupCorner = getCorner(popup, preset.popup)
  const anchorCorner = getCorner(anchor, preset.anchor)

  if (!popupCorner || !anchorCorner) {
    return null
  }

  const offset = anchorCorner.subtract(popupCorner).subtract(getScrollerOffset(options))
  return {left: offset.x, top: offset.y}
}

export {presets}
export default position
