import {Rect} from './Rect'
import {Point} from './Point'
import {presets} from './presets'
import {
  parseCorner,
  getOppositePlacement,
  getClockwisePlacement,
  getScrollerBoundsAndOffset,
  getArrowOffset,
  getDocumentScrollingElement,
} from './helpers'
import type {
  ElementLike,
  Placement,
  PlacementCombo,
  Options,
  PlacementPair,
} from './types'

const defaults = {
  // use fixed or absolute position
  fixed: false,
  // any scroller element
  offsetParent: getDocumentScrollingElement(),
  // 'auto': adjusts horizontally or vertically, 'both': adjusts horizontally and vertically, defaults to 'none'
  adjustXY: 'none',
}

const calculatePosition = (
  popup: ElementLike,
  anchor: ElementLike,
  placement: Placement | PlacementCombo,
  options: Partial<Options> = {}
) => {
  const anchorRect = Rect.fromBoundingClientRect(anchor)
  const popupRect = Rect.fromBoundingClientRect(popup).setLocation(Point.Zero)

  let corners: PlacementCombo = placement as PlacementCombo
  if (typeof placement === 'string') {
    corners = presets[placement as Placement]
  }

  if (!corners) {
    return null
  }

  const popupCorner = parseCorner(popupRect, corners.popup)
  const anchorCorner = parseCorner(anchorRect, corners.anchor)

  if (!popupCorner || !anchorCorner) {
    return null
  }

  // relative to viewport
  const fixedOffset = anchorCorner.subtract(popupCorner)
  // relative to viewport
  const fixedPopupRect = popupRect.translate(fixedOffset)
  // relative to scroller
  const offset = fixedOffset.subtract(
    getScrollerBoundsAndOffset(options).offset
  )

  return {
    offset,
    placement,
    anchorRect,
    popupRect: fixedPopupRect,
    popupOffset: {left: offset.x, top: offset.y},
    arrowOffset: getArrowOffset(
      fixedPopupRect,
      anchorRect,
      placement as PlacementPair
    ),
    // compatible with v0.0.1
    left: offset.x,
    top: offset.y,
  }
}

const calculateVisibleAreaRatio = (rect: Rect, bounds: Rect) => {
  const intersectionRect = Rect.intersect(rect, bounds)
  return intersectionRect ? intersectionRect.area / rect.area : 0
}

type PositionInfo = ReturnType<typeof calculatePosition>

const findProperPosition = (
  popup: ElementLike,
  anchor: ElementLike,
  placements: (Placement | PlacementCombo)[],
  options: Partial<Options> = {}
) => {
  const {bounds} = getScrollerBoundsAndOffset(options)
  const positionInfos: (PositionInfo & {visibleAreaRatio?: number})[] = []
  for (const placement of placements) {
    const positionInfo = calculatePosition(popup, anchor, placement, options)
    if (!positionInfo) {
      continue
    }

    // relative to scroller
    const positionedPopupRect = positionInfo.popupRect.translate(
      positionInfo.offset
    )
    if (bounds.contains(positionedPopupRect)) {
      return positionInfo
    }

    const visibleAreaRatio = calculateVisibleAreaRatio(
      positionedPopupRect,
      bounds
    )
    positionInfos.push(
      Object.assign(positionInfo, visibleAreaRatio && {visibleAreaRatio})
    )
  }
  return (
    positionInfos
      .filter(Boolean)
      // @ts-expect-error possibly 'undefined'.
      .sort((a, b) => b.visibleAreaRatio - a.visibleAreaRatio)[0] || null
  )
}

const position = (
  popup: ElementLike,
  anchor: ElementLike,
  placement: Placement | PlacementCombo,
  options: Partial<Options> = {}
) => {
  options = Object.assign({}, defaults, options)

  if (Array.isArray(placement)) {
    return findProperPosition(popup, anchor, placement, options)
  }

  const {adjustXY} = options
  const adjustsHorizontallyOrVertically = adjustXY === 'auto'
  const adjustsHorizontallyAndVertically = adjustXY === 'both'
  if (
    placement !== 'center' &&
    (adjustsHorizontallyOrVertically || adjustsHorizontallyAndVertically)
  ) {
    let placements: Placement[] = []

    if (adjustsHorizontallyOrVertically) {
      placements = [placement, getOppositePlacement(placement)]
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

export default position
