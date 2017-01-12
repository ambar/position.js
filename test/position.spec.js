import position, {presets} from '../src/position'

const little = {left: 100, top: 100, width: 100, height: 100}
const big = {left: 200, top: 200, width: 200, height: 200}

describe('position', () => {
  it('returns null', () => {
    expect(position(big, little)).toBe(null)
    expect(position(big, little, 'xyz')).toBe(null)
    expect(position(big, little, {})).toBe(null)
    expect(position(big, little, {popup: 'bottom', anchor: 'top'})).toBe(null)
  })

  it('positions `top`', () => {
    expect(position(big, little, 'top')).toEqual({left: 50, top: -100})
    expect(position(little, big, 'top')).toEqual({left: 250, top: 100})
  })

  it('positions `bottom`', () => {
    expect(position(big, little, 'bottom')).toEqual({left: 50, top: 200})
    expect(position(little, big, 'bottom')).toEqual({left: 250, top: 400})
  })

  it('positions `left`', () => {
    expect(position(big, little, 'left')).toEqual({left: -100, top: 50})
    expect(position(little, big, 'left')).toEqual({left: 100, top: 250})
  })

  it('positions `right`', () => {
    expect(position(big, little, 'right')).toEqual({left: 200, top: 50})
    expect(position(little, big, 'right')).toEqual({left: 400, top: 250})
  })

  it('positions `center`', () => {
    expect(position(big, little, 'center')).toEqual({left: 50, top: 50})
    expect(position(little, big, 'center')).toEqual({left: 250, top: 250})
    const center = {popup: 'center-center', anchor: ['center']}
    expect(position(big, little, center)).toEqual({left: 50, top: 50})
  })

  it('positions `top-left`', () => {
    expect(position(big, little, 'top-left')).toEqual({left: 100, top: -100})
  })

  it('positions `top-right`', () => {
    expect(position(big, little, 'top-right')).toEqual({left: 0, top: -100})
  })

  it('positions `right-top`', () => {
    expect(position(big, little, 'right-top')).toEqual({left: 200, top: 100})
  })

  it('positions `right-bottom`', () => {
    expect(position(big, little, 'right-bottom')).toEqual({left: 200, top: 0})
  })

  it('positions `bottom-left`', () => {
    expect(position(big, little, 'bottom-left')).toEqual({left: 100, top: 200})
  })

  it('positions `bottom-right`', () => {
    expect(position(big, little, 'bottom-right')).toEqual({left: 0, top: 200})
  })

  it('positions `left-top`', () => {
    expect(position(big, little, 'left-top')).toEqual({left: -100, top: 100})
  })

  it('positions `left-bottom`', () => {
    expect(position(big, little, 'left-bottom')).toEqual({left: -100, top: 0})
  })

  it('positions `left-bottom`', () => {
    expect(position(big, little, {popup: 'top-left', anchor: 'top-left'})).toEqual({left: 100, top: 100})
  })
})
