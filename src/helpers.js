import Rect from './Rect'
import Point from './Point'

const oppositeDirections = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  center: 'center',
}

const clockwiseDirections = {
  top: 'right',
  right: 'bottom',
  bottom: 'left',
  left: 'top',
  center: 'center',
}

export const toCamelCase = s => (
  s.replace(/([-_])([a-z])/g, (s, a, b) => b.toUpperCase())
)

export const parseCorner = (rect, placement) => {
  if (!placement || typeof placement !== 'string') {
    return null
  }

  const point = rect[toCamelCase(placement)]
  return point instanceof Point ? point : null
}

const parsePlacementPair = (placement) => {
  if (typeof placement === 'string') {
    return placement.split('-')
  }

  return []
}

const joinDirection = (main, sub) => sub ? `${main}-${sub}` : main

// 水平或垂直翻转，只需要倒转主方向；顺时针旋转两次，等同于同时倒转主次方向
export const getOppositePlacement = (placement, all=false) => {
  if (!placement) {
    return null
  }

  if (typeof placement === 'object') {
    return {
      popup: getOppositePlacement(placement.popup, all),
      anchor: getOppositePlacement(placement.anchor, all),
    }
  }

  const [main, sub] = parsePlacementPair(placement)
  return joinDirection(oppositeDirections[main], all ? oppositeDirections[sub] : sub)
}

export const getClockwisePlacement = (placement) => {
  if (!placement) {
    return null
  }

  if (typeof placement === 'object') {
    return {
      popup: getClockwisePlacement(placement.popup),
      anchor: getClockwisePlacement(placement.anchor),
    }
  }

  const [main, sub] = parsePlacementPair(placement)
  return joinDirection(clockwiseDirections[main], clockwiseDirections[sub])
}

const getNativeScrollerOffset = (scroller) => {
  const {scrollLeft, scrollTop} = scroller
  if (!isNaN(scrollLeft) && !isNaN(scrollTop)) {
    return new Point(scrollLeft, scrollTop)
  }

  return Point.Zero
}

export const getScrollerBoundsAndOffset = ({fixed, offsetParent}) => {
  // 固定定位始终使用视口坐标
  if (fixed || !offsetParent) {
    return {
      offset: Point.Zero,
      bounds: Rect.fromViewport(),
    }
  }

  const nativeOffset = getNativeScrollerOffset(offsetParent)
  // 以窗口滚动的绝对定位，把坐标转换到文档顶部
  const useWindowAsScroller = offsetParent === document.body
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
