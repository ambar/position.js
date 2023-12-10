export type DOMLike = {getBoundingClientRect: () => DOMRectLike}
export type DOMRectLike =
  | {x: number; y: number; width: number; height: number}
  | {left: number; top: number; width: number; height: number}
export type ElementLike = DOMLike | DOMRectLike

/** user preset */
export type Placement =
  | 'center'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'right-top'
  | 'bottom-right'
  | 'left-bottom'
  | 'top-right'
  | 'right-bottom'
  | 'bottom-left'
  | 'left-top'

export type Placement4 = 'top' | 'right' | 'bottom' | 'left'
export type Placement5 = 'center' | Placement4
export type PlacementPair = `${Placement5}-${Placement5}`
export type PlacementAll = Placement5 | PlacementPair

export type PlacementCombo = {
  popup: PlacementAll
  anchor: PlacementAll
}

export type Scroller = ElementLike & {scrollLeft: number; scrollTop: number}

export type Options = {
  offsetParent?: Scroller
  adjustXY?: 'auto' | 'both' | 'none'
  fixed?: boolean
}
