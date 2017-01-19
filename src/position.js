import Rect from './Rect'
import Point from './Point'
import presets from './presets'
import {
  parseCorner,
  getOppositePlacement,
  getClockwisePlacement,
  getScrollerBoundsAndOffset,
} from './helpers'

const canUseDOM = typeof window === 'object' && typeof document === 'object'

const defaults = {
  // use fixed or absolute position
  fixed: false,
  // any scroller element
  offsetParent: canUseDOM ? document.body : null,
  // 'auto': adjusts horizontally or vertically, 'both': adjusts horizontally and vertically, defaults to 'none'
  adjustXY: 'none',
}

const calculatePosition = (popup, anchor, placement, options) => {
  const anchorRect = Rect.fromBoundingClientRect(anchor)
  const popupRect = Rect.fromBoundingClientRect(popup).setLocation(Point.Zero)

  let corners = placement
  if (typeof placement === 'string') {
    corners = presets[placement]
  }

  if (!corners) {
    return null
  }

  const popupCorner = parseCorner(popupRect, corners.popup)
  const anchorCorner = parseCorner(anchorRect, corners.anchor)

  if (!popupCorner || !anchorCorner) {
    return null
  }

  const offset = anchorCorner.subtract(popupCorner).subtract(getScrollerBoundsAndOffset(options).offset)

  return {
    offset,
    placement,
    anchorRect,
    popupRect: popupRect.translate(offset),
    // compatible with v0.0.1
    left: offset.x,
    top: offset.y,
  }
}

const calculateVisibleAreaRatio = (rect, bounds) => {
  const intersectionRect = Rect.intersect(rect, bounds)
  return intersectionRect ? intersectionRect.area / rect.area : 0
}

const findProperPosition = (popup, anchor, placements, options) => {
  const {bounds} = getScrollerBoundsAndOffset(options)
  const popupRect = Rect.fromBoundingClientRect(popup).setLocation(Point.Zero)
  const positionInfos = []
  for (const placement of placements) {
    const positionInfo = calculatePosition(popup, anchor, placement, options)
    if (!positionInfo) {
      continue
    }

    const positionedPopupRect = popupRect.translate(positionInfo.offset)
    if (bounds.contains(positionedPopupRect)) {
      return positionInfo
    }

    const visibleAreaRatio = calculateVisibleAreaRatio(positionedPopupRect, bounds)
    positionInfos.push(Object.assign(
      positionInfo,
      visibleAreaRatio && {visibleAreaRatio}
    ))
  }
  return positionInfos.filter(Boolean).sort((a, b) => b.visibleAreaRatio - a.visibleAreaRatio)[0] || null
}

const position = (popup, anchor, placement, options) => {
  options = Object.assign({}, defaults, options)

  if (Array.isArray(placement)) {
    return findProperPosition(popup, anchor, placement, options)
  }

  const {adjustXY} = options
  const adjustsHorizontallyOrVertically = adjustXY === 'auto'
  const adjustsHorizontallyAndVertically = adjustXY === 'both'
  if (placement !== 'center' && (adjustsHorizontallyOrVertically || adjustsHorizontallyAndVertically)) {
    let placements = []

    if (adjustsHorizontallyOrVertically) {
      placements = [
        placement,
        getOppositePlacement(placement),
      ]
    } else if (adjustsHorizontallyAndVertically) {
      const oppositePlacement = getOppositePlacement(placement, true)
      placements = [
        placement,
        oppositePlacement,
        getClockwisePlacement(placement),
        getClockwisePlacement(oppositePlacement),
      ]
    }

    return findProperPosition(popup, anchor, placements, options)
  }

  return calculatePosition(popup, anchor, placement, options)
}

export {presets}
export default position
