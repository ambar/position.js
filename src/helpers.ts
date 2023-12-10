import {Rect} from './Rect'
import {Point} from './Point'
import {oppositeDirections, clockwiseDirections} from './constants'
import type {
  Placement,
  PlacementAll,
  PlacementCombo,
  PlacementPair,
  Options,
  Scroller,
  Placement5,
} from './types'

const canUseDOM = typeof window === 'object' && typeof document === 'object'

const isWebkit = canUseDOM && navigator.userAgent.indexOf('AppleWebKit') > -1

// polyfill for document.scrollingElement
// @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/dom/getDocumentScrollElement.js
export const getDocumentScrollingElement = () => {
  if (!canUseDOM) return null
  if (document.scrollingElement) {
    return document.scrollingElement
  }
  return !isWebkit && document.compatMode === 'CSS1Compat'
    ? document.documentElement
    : document.body
}

export const toCamelCase = (s: string) =>
  s.replace(/([-_])([a-z])/g, (s, a, b) => b.toUpperCase())

export const parseCorner = (rect: Rect, placement: PlacementAll) => {
  if (!placement || typeof placement !== 'string') {
    return null
  }

  const point = rect[toCamelCase(placement) as keyof Rect]
  return point instanceof Point ? point : null
}

const parsePlacementPair = (placement: PlacementPair) => {
  if (typeof placement === 'string') {
    return placement.split('-')
  }

  return []
}

const joinDirection = (main: Placement5, sub: Placement5): PlacementAll =>
  sub ? `${main}-${sub}` : main

// 水平或垂直翻转，只需要倒转主方向；顺时针旋转两次，等同于同时倒转主次方向
// @ts-expect-error
export const getOppositePlacement = (
  placement: Placement | PlacementCombo,
  all = false
) => {
  if (!placement) {
    return null
  }

  if (typeof placement === 'object') {
    return {
      // @ts-expect-error
      popup: getOppositePlacement(placement.popup, all),
      // @ts-expect-error
      anchor: getOppositePlacement(placement.anchor, all),
    }
  }
  // @ts-expect-error
  const [main, sub] = parsePlacementPair(placement)
  return joinDirection(
    // @ts-expect-error
    oppositeDirections[main],
    // @ts-expect-error
    all ? oppositeDirections[sub] : sub
  )
}
// @ts-expect-error
export const getClockwisePlacement = (
  placement: Placement | PlacementCombo
) => {
  if (!placement) {
    return null
  }

  if (typeof placement === 'object') {
    return {
      // @ts-expect-error
      popup: getClockwisePlacement(placement.popup),
      // @ts-expect-error
      anchor: getClockwisePlacement(placement.anchor),
    }
  }

  // @ts-expect-error
  const [main, sub] = parsePlacementPair(placement)
  // @ts-expect-error
  return joinDirection(clockwiseDirections[main], clockwiseDirections[sub])
}

const getNativeScrollerOffset = (scroller: Scroller) => {
  const {scrollLeft, scrollTop} = scroller
  if (!isNaN(scrollLeft) && !isNaN(scrollTop)) {
    return new Point(scrollLeft, scrollTop)
  }

  return Point.Zero
}

export const getScrollerBoundsAndOffset = ({
  fixed,
  offsetParent,
  boundary,
}: Options) => {
  if (boundary) {
    // 固定定位始终使用视口坐标
    return {
      offset: Point.Zero,
      bounds: Rect.fromRect(boundary),
    }
  }
  // 固定定位始终使用视口坐标
  if (fixed || !offsetParent) {
    return {
      offset: Point.Zero,
      bounds: Rect.fromViewport(),
    }
  }

  const nativeOffset = getNativeScrollerOffset(offsetParent)
  // 以窗口滚动的绝对定位，把坐标转换到文档顶部
  const useWindowAsScroller = offsetParent === getDocumentScrollingElement()
  if (useWindowAsScroller) {
    return {
      offset: nativeOffset.negative(),
      bounds: Rect.fromViewport().translate(nativeOffset),
    }
  }

  // 自定义的滚动容器，使用它自身坐标
  const bounds = Rect.fromBoundingClientRect(offsetParent)
  return {
    offset: bounds.topLeft.subtract(nativeOffset),
    bounds: bounds.translate(nativeOffset),
  }
}

/*
 * 箭头属于 popup，始终对齐到 anchor 的中间：
 *
 * // 边对齐，popup 宽于 anchor
 * [       ∨ ] popup
 *       [   ] anchor
 *
 * // 边对齐，popup 窄于 anchor
 * [ ∨ ]       popup
 * [         ] anchor
 *
 * // 非边对齐，popup 窄于 anchor
 *   [   ]      anchor
 * [   ∧     ]  popup
 *
 * // 非边对齐，popup 宽于 anchor
 * [   ∨     ]  popup
 *   [   ]      anchor
 *
 */
export const getArrowOffset = (
  popupRect: Rect,
  anchorRect: Rect,
  placement: PlacementPair
) => {
  const [main] = parsePlacementPair(placement)

  if (main === 'top' || main === 'bottom') {
    const top = main === 'top' ? '100%' : 0
    const narrowerRect =
      popupRect.width <= anchorRect.width ? popupRect : anchorRect
    if (narrowerRect === popupRect) {
      return {left: '50%', top}
    }
    return {
      left: anchorRect.left - popupRect.left + narrowerRect.width / 2,
      top,
    }
  } else if (main === 'left' || main === 'right') {
    const left = main === 'left' ? '100%' : 0
    const shorterRect =
      popupRect.height <= anchorRect.height ? popupRect : anchorRect
    if (shorterRect === popupRect) {
      return {left, top: '50%'}
    }
    return {
      left,
      top: anchorRect.top - popupRect.top + shorterRect.height / 2,
    }
  }

  return {left: 0, top: 0}
}
