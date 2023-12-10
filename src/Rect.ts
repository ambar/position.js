import {Point} from './Point'
import {DOMLike, DOMRectLike, ElementLike} from './types'

const {max, min} = Math

// prettier-ignore
export class Rect {
  static fromBoundingClientRect(bcr: ElementLike) {
    if ((bcr as DOMLike).getBoundingClientRect) {
      bcr = (bcr as DOMLike).getBoundingClientRect()
    }
    // @ts-ignore
    return new Rect(bcr.x ?? bcr.left, bcr.y ?? bcr.top, bcr.width, bcr.height)
  }

  static fromRect(r: DOMRectLike) {
    return new Rect(r.x ?? 0, r.y ?? 0, r.width ?? 0, r.height ?? 0)
  }

  static intersect(a: Rect, b: Rect) {
    const top = max(a.top, b.top)
    const right = min(a.right, b.right)
    const bottom = min(a.bottom, b.bottom)
    const left = max(a.left, b.left)
    const width = right - left
    const height = bottom - top

    if (width < 0 || height < 0) {
      return null
    }

    return new Rect(left, top, width, height)
  }

  static fromViewport() {
    const width = window.innerWidth
    const height = window.innerHeight

    return new Rect(0, 0, width, height)
  }

  x: number
  y: number
  width: number
  height: number

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  setLocation(point: Point) {
    this.x = point.x
    this.y = point.y
    return this
  }

  contains(rect: Rect) {
    return (
      this.left <= rect.left &&
      this.top <= rect.top &&
      this.right >= rect.right &&
      this.bottom > rect.bottom
    )
  }

  translate(offset: Point | Rect) {
    return new Rect(offset.x, offset.y, this.width, this.height)
  }

  // prettier-ignore
  get area() { return this.width * this.height }
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

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    }
  }
}
