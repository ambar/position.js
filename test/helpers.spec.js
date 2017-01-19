import Rect from '../src/Rect'
import Point from '../src/Point'
import {
  toCamelCase,
  parseCorner,
  getOppositePlacement,
  getClockwisePlacement,
  getScrollerBoundsAndOffset,
} from '../src/helpers'

describe('helpers', () => {
  it('toCamelCase', () => {
    expect(toCamelCase('top-left')).toBe('topLeft')
    expect(toCamelCase('top_left')).toBe('topLeft')
    expect(toCamelCase('topLeft')).toBe('topLeft')
  })

  it('parseCorner', () => {
    const rect = new Rect(10, 10, 10, 10)
    expect(parseCorner(rect, 'right')).toEqual(null)
    expect(parseCorner(rect, 'center')).toEqual({x: 15, y: 15})
    expect(parseCorner(rect, 'left-center')).toEqual({x: 10, y: 15})
    expect(parseCorner(rect, 'right-top')).toEqual({x: 20, y: 10})
    expect(parseCorner(rect, 'left-bottom')).toEqual({x: 10, y: 20})
    expect(parseCorner(rect, 'bottom-right')).toEqual({x: 20, y: 20})
    expect(parseCorner(rect, 'top-left')).toEqual({x: 10, y: 10})
    expect(parseCorner(rect, 'topLeft')).toEqual(parseCorner(rect, 'top-left'))
  })

  it('getOppositePlacement', () => {
    expect(getOppositePlacement('top')).toBe('bottom')
    expect(getOppositePlacement('left')).toBe('right')
    expect(getOppositePlacement('top-left')).toBe('bottom-left')
    expect(getOppositePlacement('top-left', true)).toBe('bottom-right')
  })

  it('getClockwisePlacement', () => {
    expect(getClockwisePlacement('top')).toBe('right')
    expect(getClockwisePlacement('bottom')).toBe('left')
    expect(getClockwisePlacement('left')).toBe('top')
    expect(getClockwisePlacement('top-left')).toBe('right-top')
    expect(getClockwisePlacement('top-right')).toBe('right-bottom')
  })

  describe('getScrollerBoundsAndOffset', () => {
    const fromViewport = Rect.fromViewport
    const getBoundingClientRect = document.body.getBoundingClientRect
    const viewportBounds = new Rect(0, 0, 1000, 1000)
    const bodyBounds = new Rect(0, 0, 1000, 2000)
    const scrollerBounds = new Rect(200, 300, 500, 400)
    const scrollLeft = 100
    const scrollTop = 250
    const scrollOffset = new Point(scrollLeft, scrollTop)
    const zero = new Point(0, 0)
    let fakeScroller = null

    beforeEach(() => {
      Rect.fromViewport = () => viewportBounds
      Object.assign(document.body, {
        scrollLeft,
        scrollTop,
        getBoundingClientRect() {
          return bodyBounds
        },
      })
      fakeScroller = {
        scrollLeft,
        scrollTop,
        getBoundingClientRect() {
          return scrollerBounds
        }
      }
    })

    afterEach(() => {
      Rect.fromViewport = fromViewport
      document.body.scrollLeft = 0
      document.body.scrollTop = 0
      document.body.getBoundingClientRect = getBoundingClientRect
    })

    it('handles document.body with fixed position', () => {
      expect(getScrollerBoundsAndOffset({fixed: true, offsetParent: document.body})).toMatchObject({
        offset: zero,
        bounds: viewportBounds,
      })
    })

    it('handles document.body with absolute position ', () => {
      expect(getScrollerBoundsAndOffset({fixed: false, offsetParent: document.body})).toMatchObject({
        offset: scrollOffset.negative(),
        bounds: viewportBounds.translate(scrollOffset),
      })
    })

    it('handles custom scroller with fixed position ', () => {
      expect(getScrollerBoundsAndOffset({fixed: true, offsetParent: fakeScroller})).toMatchObject({
        offset: zero,
        bounds: viewportBounds,
      })
    })

    it('handles custom scroller with absolute position ', () => {
      expect(getScrollerBoundsAndOffset({fixed: false, offsetParent: fakeScroller})).toMatchObject({
        offset: scrollerBounds.topLeft.subtract(scrollOffset),
        bounds: scrollerBounds.translate(scrollOffset),
      })
    })
  })
})
