/* eslint max-len: 0 */
import React from 'react'
import cx from 'classnames'
import Draggable from 'react-draggable'
import Arrow from './Arrow'
import position, {presets} from 'position.js'
import {getOppositePlacement} from '../src/helpers'
import styles from './PositionExample.css'

const placementsKeys = Object.keys(presets)
const combosKeys = [
  'top-left',
  'top-right',
  'top-center',
  'right-top',
  'right-bottom',
  'right-center',
  'bottom-left',
  'bottom-right',
  'bottom-center',
  'left-top',
  'left-bottom',
  'left-center',
  'center'
]

const stringifyObject = obj => (
  JSON.stringify(obj, null, '  ')
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, `'`)
    .replace(/\n\}$/g, `,\n\}`)
)

const Select = ({className, name, options, value, onChange, inline=false}) => (
  <div
    className={cx(styles.select, className, {
      [styles.isInline]: inline,
    })}
  >
    {options.map(option =>
      <label key={option}>
        <input
          type='radio'
          name={name}
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
        />
        <span>{option}</span>
      </label>
    )}
  </div>
)

class PositionExample extends React.Component {
  state = {
    fixed: false,
    offsetParent: 'document.body',
    adjustXY: 'both',
    placement: 'top',
    actualPlacement: '',
    anchorCorner: '',
    popupCorner: '',
    popupOffset: {left: 0, top: 0},
    arrowOffset: {left: 0, top: 0},
    offset: {x: 0, y: 0},
    dragPosition: null,
    scrollerStatus: {},
  }

  componentDidMount() {
    this.reposition()
    this.updateScrollerStatus()
    window.addEventListener('resize', this.handleScroll)
    window.addEventListener('scroll', this.handleScroll)
    this.scroller.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScroll)
    window.removeEventListener('scroll', this.handleScroll)
    this.scroller.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    requestAnimationFrame(this.reposition)
    this.updateScrollerStatus()
  }

  handleDrag = (e, {x, y}) => {
    this.setState({dragPosition: {x, y}})
    requestAnimationFrame(this.reposition)
  }

  updateScrollerStatus() {
    const {scrollLeft, scrollTop} = this.scroller
    this.setState({
      scrollerStatus: {scrollLeft, scrollTop}
    })
  }

  reposition = () => {
    const {fixed, offsetParent, adjustXY, placement, popupCorner, anchorCorner} = this.state
    let expectedPlacement
    if (placement) {
      expectedPlacement = placement
    } else if (popupCorner && anchorCorner) {
      expectedPlacement = {popup: popupCorner, anchor: anchorCorner}
    }
    if (expectedPlacement) {
      const offsetParents = {
        'scroller': this.scroller,
        'document.body': document.body,
      }
      const {popupOffset, arrowOffset, placement: actualPlacement} = position(this.popup, this.anchor, expectedPlacement, {
        fixed,
        adjustXY,
        offsetParent: offsetParents[offsetParent],
      })
      this.setState({popupOffset, arrowOffset, actualPlacement})
    }
  }

  handleOptionsChange(state) {
    if (state.offsetParent === 'scroller' && state.offsetParent !== this.state.offsetParent) {
      this.setState({dragPosition: {x: 0, y: 0}}, () => {
        this.scroller.scrollLeft = 200
        this.scroller.scrollTop = 100
        this.updateScrollerStatus()
      })
    }
    this.setState(state, this.reposition)
  }

  handlePlacementChange(state, isCombo=false) {
    if (isCombo) {
      if (!state.popupCorner && !this.state.popupCorner) {
        state.popupCorner = combosKeys[0]
      }
      if (!state.anchorCorner && !this.state.anchorCorner) {
        state.anchorCorner = combosKeys[0]
      }
      this.setState({placement: ''})
    } else {
      this.setState({popupCorner: '', anchorCorner: ''})
    }
    this.setState(state, this.reposition)
  }

  renderDoc() {
    const {
      fixed,
      offsetParent,
      adjustXY,
      placement,
      popupCorner,
      anchorCorner,
    } = this.state

    return (
      <div className={styles.doc}>
        <section className={styles.options}>
          <h2>Options</h2>

          <div>
            <span className={styles.optionName}>fixed:</span>
            <Select
              inline
              name='fixed'
              options={['true', 'false']}
              value={String(fixed)}
              onChange={value => this.handleOptionsChange({fixed: value === 'true'})}
            />
          </div>

          <div>
            <span className={styles.optionName}>offsetParent:</span>
            <Select
              inline
              name='offsetParent'
              options={['document.body', 'scroller']}
              value={offsetParent}
              onChange={value => this.handleOptionsChange({offsetParent: value})}
            />
          </div>

          <div>
            <span className={styles.optionName}>adjustXY:</span>
            <Select
              inline
              name='adjustXY'
              options={['none', 'auto', 'both']}
              value={adjustXY}
              onChange={value => this.handleOptionsChange({adjustXY: value})}
            />
          </div>

          <pre>
            <code>
{`options = {
  // use fixed or absolute position, defaults to false
  fixed: ${fixed},
  // any scroller element, defaults to document.body
  offsetParent: ${offsetParent},
  // 'auto': adjusts horizontally or vertically, 'both': adjusts horizontally and vertically, defaults to 'none'
  adjustXY: '${adjustXY}',
}`}
            </code>
          </pre>
        </section>

        <section>
          <h2>Presets</h2>
          <pre>
            <code>
            {`position(popup, anchor, '${placement || 'top'}', options)`}
            </code>
          </pre>
          <Select
            name='placement'
            options={placementsKeys}
            value={placement}
            onChange={value => this.handlePlacementChange({placement: value})}
          />
        </section>

        <section>
          <h2>Combos</h2>
          <pre>
            <code>
{placement ? `position(popup, anchor, ${stringifyObject(presets[placement])}, options)` :
`position(popup, anchor, {
  popup: '${popupCorner || 'top-left'}',
  anchor: '${anchorCorner || 'top-left'}',
}, options)
`}
            </code>
          </pre>
          <div className={styles.columns}>
            <div>
              <h3>popup</h3>
              <Select
                name='popupCorner'
                options={combosKeys}
                value={popupCorner}
                onChange={value => this.handlePlacementChange({popupCorner: value}, true)}
              />
            </div>
            <div>
              <h3>anchor</h3>
              <Select
                name='anchorCorner'
                options={combosKeys}
                value={anchorCorner}
                onChange={value => this.handlePlacementChange({anchorCorner: value}, true)}
              />
            </div>
          </div>
        </section>
      </div>
    )
  }

  renderDemo() {
    const {
      fixed,
      offsetParent,
      placement,
      actualPlacement,
      popupCorner,
      anchorCorner,
      popupOffset,
      arrowOffset,
      dragPosition,
      scrollerStatus,
    } = this.state

    const shouldRenderScroller = offsetParent === 'scroller'

    return (
      <div className={styles.demo}>
        {shouldRenderScroller &&
          <div>
            Scroller
          </div>
        }
        <div className={styles.status}>
          {`Popup: ${popupOffset.left.toFixed()}, ${popupOffset.top.toFixed()}`}
          {shouldRenderScroller &&
             ` Scroller: ${scrollerStatus.scrollLeft.toFixed()}, ${scrollerStatus.scrollTop.toFixed()}`
          }
        </div>
        <div
          ref={el => this.scroller = el}
          className={cx({
            [styles.scroller]: shouldRenderScroller,
          })}
        >
          <div className={styles.scrollerInner}>
            <Draggable
              position={dragPosition}
              onDrag={this.handleDrag}
              offsetParent={this.scroller}
            >
              <button
                ref={el => this.anchor = el}
                className={styles.anchor}
              >
                <code>anchor[draggable]</code>
              </button>
            </Draggable>

            <div
              ref={el => this.popup = el}
              className={cx(styles.popup, {
                [styles.isFixed]: fixed
              })}
              style={popupOffset}
            >
              {typeof actualPlacement === 'string' &&
                <Arrow
                  offset={arrowOffset}
                  direction={getOppositePlacement(actualPlacement.split('-')[0])}
                  color='#78787b'
                  size={8}
                />
              }
              <h2>Popup</h2>
              <pre>
                {
                  placement
                    ? `expected: '${placement}'\n  actual: '${actualPlacement}'`
                    : `{\n  popup: '${popupCorner}', \n  anchor: '${anchorCorner}',\n}`
                }
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.page}>
        <div className={styles.pageInner}>
          {this.renderDemo()}
          {this.renderDoc()}
        </div>
      </div>
    )
  }
}

export default PositionExample
