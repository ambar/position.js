import position from '../src/position'
import {Rect} from '../src/Rect'

const little = {left: 100, top: 100, width: 100, height: 100}
const big = {left: 200, top: 200, width: 200, height: 200}

describe('position', () => {
  it('returns null', () => {
    expect(position(big, little)).toBe(null)
    expect(position(big, little, 'xyz')).toBe(null)
    expect(position(big, little, {})).toBe(null)
    expect(position(big, little, null)).toBe(null)
    expect(position(big, little, {popup: 'bottom', anchor: 'top'})).toBe(null)
  })

  it('positions `top`', () => {
    expect(position(big, little, 'top')).toMatchObject({left: 50, top: -100})
    expect(position(little, big, 'top')).toMatchObject({left: 250, top: 100})
  })

  it('positions `bottom`', () => {
    expect(position(big, little, 'bottom')).toMatchObject({left: 50, top: 200})
    expect(position(little, big, 'bottom')).toMatchObject({left: 250, top: 400})
  })

  it('positions `left`', () => {
    expect(position(big, little, 'left')).toMatchObject({left: -100, top: 50})
    expect(position(little, big, 'left')).toMatchObject({left: 100, top: 250})
  })

  it('positions `right`', () => {
    expect(position(big, little, 'right')).toMatchObject({left: 200, top: 50})
    expect(position(little, big, 'right')).toMatchObject({left: 400, top: 250})
  })

  it('positions `center`', () => {
    expect(position(big, little, 'center')).toMatchObject({left: 50, top: 50})
    expect(position(little, big, 'center')).toMatchObject({left: 250, top: 250})
    const center = {popup: 'center-center', anchor: 'center'}
    expect(position(big, little, center)).toMatchObject({left: 50, top: 50})
  })

  it('positions `top-left`', () => {
    expect(position(big, little, 'top-left')).toMatchObject({
      left: 100,
      top: -100,
    })
  })

  it('positions `top-right`', () => {
    expect(position(big, little, 'top-right')).toMatchObject({
      left: 0,
      top: -100,
    })
  })

  it('positions `right-top`', () => {
    expect(position(big, little, 'right-top')).toMatchObject({
      left: 200,
      top: 100,
    })
  })

  it('positions `right-bottom`', () => {
    expect(position(big, little, 'right-bottom')).toMatchObject({
      left: 200,
      top: 0,
    })
  })

  it('positions `bottom-left`', () => {
    expect(position(big, little, 'bottom-left')).toMatchObject({
      left: 100,
      top: 200,
    })
  })

  it('positions `bottom-right`', () => {
    expect(position(big, little, 'bottom-right')).toMatchObject({
      left: 0,
      top: 200,
    })
  })

  it('positions `left-top`', () => {
    expect(position(big, little, 'left-top')).toMatchObject({
      left: -100,
      top: 100,
    })
  })

  it('positions `left-bottom`', () => {
    expect(position(big, little, 'left-bottom')).toMatchObject({
      left: -100,
      top: 0,
    })
  })

  it('positions `left-bottom`', () => {
    expect(
      position(big, little, {popup: 'top-left', anchor: 'top-left'})
    ).toMatchObject({left: 100, top: 100})
  })

  it('matches position info', () => {
    const top = -100
    const left = 50
    expect(position(big, little, 'top')).toMatchObject({
      top,
      left,
      offset: {x: left, y: top},
      popupOffset: {top, left},
      arrowOffset: {top: '100%', left: 100},
    })
  })

  describe('arrow offsets', () => {
    it('calculates top arrow offset', () => {
      expect(position(big, little, 'top').arrowOffset).toMatchObject({
        left: 100,
        top: '100%',
      })
      expect(position(big, little, 'top-left').arrowOffset).toMatchObject({
        left: 50,
        top: '100%',
      })
      expect(position(big, little, 'top-right').arrowOffset).toMatchObject({
        left: 150,
        top: '100%',
      })
    })

    it('calculates right arrow offset', () => {
      expect(position(big, little, 'right').arrowOffset).toMatchObject({
        left: 0,
        top: 100,
      })
      expect(position(big, little, 'right-top').arrowOffset).toMatchObject({
        left: 0,
        top: 50,
      })
      expect(position(big, little, 'right-bottom').arrowOffset).toMatchObject({
        left: 0,
        top: 150,
      })
    })

    it('calculates bottom arrow offset', () => {
      expect(position(big, little, 'bottom').arrowOffset).toMatchObject({
        left: 100,
        top: 0,
      })
      expect(position(big, little, 'bottom-left').arrowOffset).toMatchObject({
        left: 50,
        top: 0,
      })
      expect(position(big, little, 'bottom-right').arrowOffset).toMatchObject({
        left: 150,
        top: 0,
      })
    })

    it('calculates left arrow offset', () => {
      expect(position(big, little, 'left').arrowOffset).toMatchObject({
        left: '100%',
        top: 100,
      })
      expect(position(big, little, 'left-top').arrowOffset).toMatchObject({
        left: '100%',
        top: 50,
      })
      expect(position(big, little, 'left-bottom').arrowOffset).toMatchObject({
        left: '100%',
        top: 150,
      })
    })

    it('calculates center arrow offset', () => {
      expect(position(big, little, 'center').arrowOffset).toMatchObject({
        left: 0,
        top: 0,
      })
    })

    it('do not calculate combos', () => {
      expect(
        position(big, little, {popup: 'bottom-right', anchor: 'top-right'})
          .arrowOffset
      ).toMatchObject({left: 0, top: 0})
    })
  })

  describe('adjustXY option', () => {
    const fromViewport = Rect.fromViewport
    const bounds = new Rect(0, 0, 1000, 1000)
    let anchor = null
    let popup = null

    beforeEach(() => {
      Rect.fromViewport = () => bounds
      anchor = {left: 100, top: 100, width: 100, height: 100}
      popup = {left: 200, top: 200, width: 200, height: 200}
    })

    afterEach(() => {
      Rect.fromViewport = fromViewport
    })

    describe('horizontally OR vertically', () => {
      const options = {adjustXY: 'auto'}

      it('adjusts correctly', () => {
        expect(position(popup, anchor, 'bottom', options)).toMatchObject({
          left: 50,
          top: 200,
          placement: 'bottom',
        })

        expect(position(popup, anchor, 'top', options)).toMatchObject({
          left: 50,
          top: 200,
          placement: 'bottom',
        })

        expect(position(popup, anchor, 'left', options)).toMatchObject({
          left: 200,
          top: 50,
          placement: 'right',
        })
      })

      it('only transposes main direction', () => {
        expect(position(popup, anchor, 'top-left', options)).toMatchObject({
          left: 100,
          top: 200,
          placement: 'bottom-left',
        })

        expect(position(popup, anchor, 'top-right', options)).toMatchObject({
          left: 0,
          top: 200,
          placement: 'bottom-right',
        })
      })

      it('handles combos', () => {
        expect(position(popup, anchor, 'top-left', options).offset).toEqual(
          position(
            popup,
            anchor,
            {popup: 'bottom-left', anchor: 'top-left'},
            options
          ).offset
        )
      })
    })

    describe('horizontally AND vertically', () => {
      const options = {adjustXY: 'both'}

      it('prefers opposite direction', () => {
        expect(position(popup, anchor, 'top-left', options)).toMatchObject({
          left: 0,
          top: 200,
          placement: 'bottom-right',
        })
      })

      it('adjusts `top` to `left`', () => {
        Object.assign(anchor, {left: bounds.width - anchor.width, top: 500})
        expect(position(popup, anchor, 'top', options)).toMatchObject({
          left: 700,
          top: 450,
          placement: 'left',
        })
      })

      it('adjusts `top-left` to `bottom-right`', () => {
        Object.assign(anchor, {left: bounds.width - anchor.width, top: 500})
        expect(position(popup, anchor, 'top-left', options)).toMatchObject({
          left: 800,
          top: 600,
          placement: 'bottom-right',
        })
      })

      it('adjusts `top-right` to `left-top`', () => {
        Object.assign(anchor, {left: bounds.width - anchor.width / 2, top: 500})
        expect(position(popup, anchor, 'top-right', options)).toMatchObject({
          left: 750,
          top: 500,
          placement: 'left-top',
        })
      })

      it('handles combos', () => {
        expect(position(popup, anchor, 'top-left', options).offset).toEqual(
          position(
            popup,
            anchor,
            {popup: 'top-right', anchor: 'bottom-right'},
            options
          ).offset
        )
      })
    })

    it('accepts array of placements', () => {
      expect(position(popup, anchor, ['top-left', 'top'])).toMatchObject({
        left: 100,
        top: -100,
        placement: 'top-left',
      })

      expect(position(popup, anchor, [null, 'top'])).toMatchObject({
        left: 50,
        top: -100,
        placement: 'top',
      })

      expect(position(popup, anchor, [null, ''])).toBe(null)
    })
  })
})
