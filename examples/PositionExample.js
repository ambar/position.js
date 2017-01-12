/* eslint max-len: 0 */
import React from 'react'
import cx from 'classnames'
import position, {presets} from '../src/position'
import styles from './PositionExample.css'

const presetsKeys = Object.keys(presets)
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
          onChange={e => onChange(option)}
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
    preset: 'top',
    anchorCorner: '',
    popupCorner: '',
    popupStyle: {},
  }

  componentDidMount() {
    this.reposition()
    window.addEventListener('resize', this.handleScroll)
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScroll)
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    // this.reposition()
  }

  reposition = () => {
    const {fixed, offsetParent, preset, popupCorner, anchorCorner} = this.state
    let itsPreset
    if (preset) {
      itsPreset = preset
    } else if (popupCorner && anchorCorner) {
      itsPreset = {popup: popupCorner, anchor: anchorCorner}
    }
    if (itsPreset) {
      const offsetParents = {
        scroller: this.scroller,
        'document.body': document.body,
      }
      const popupStyle = position(this.popup, this.anchor, itsPreset, {
        fixed,
        offsetParent: offsetParents[offsetParent],
      })
      this.setState({popupStyle})
    }
  }

  handleOptionsChange(state) {
    this.setState(state, this.reposition)
  }

  handlePresetChange(state, isCombo=false) {
    if (isCombo) {
      if (!state.popupCorner && !this.state.popupCorner) {
        state.popupCorner = combosKeys[0]
      }
      if (!state.anchorCorner && !this.state.anchorCorner) {
        state.anchorCorner = combosKeys[0]
      }
      this.setState({preset: ''})
    } else {
      this.setState({popupCorner: '', anchorCorner: ''})
    }
    this.setState(state, this.reposition)
  }

  renderDoc() {
    const {fixed, offsetParent, preset, popupCorner, anchorCorner} = this.state

    return (
      <div className={styles.doc}>
        <section>
          <h2>Options</h2>

          <div>
            <span>fixed:</span>
            <Select
              inline
              name='fixed'
              options={['true', 'false']}
              value={String(fixed)}
              onChange={value => this.handlePresetChange({fixed: value === 'true'})}
            />
          </div>

          <div>
            <span>offsetParent:</span>
            <Select
              inline
              name='offsetParent'
              options={['document.body', 'scroller']}
              value={offsetParent}
              onChange={value => this.handlePresetChange({offsetParent: value})}
            />
          </div>

          <pre>
            <code>
{`options = {
  // use fixed or absolute position, defaults to false
  fixed: ${fixed},
  // any scroller element, defaults to document.body
  offsetParent: ${offsetParent},
}`}
            </code>
          </pre>
        </section>

        <section>
          <h2>Presets</h2>
          <pre>
            <code>
            {`position(popup, anchor, '${preset || 'top'}', options)`}
            </code>
          </pre>
          <Select
            name='preset'
            options={presetsKeys}
            value={preset}
            onChange={value => this.handlePresetChange({preset: value})}
          />
        </section>

        <section>
          <h2>Combos</h2>
          <pre>
            <code>
{preset ? `position(popup, anchor, ${stringifyObject(presets[preset])}, options)` :
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
                onChange={value => this.handlePresetChange({popupCorner: value}, true)}
              />
            </div>
            <div>
              <h3>anchor</h3>
              <Select
                name='anchorCorner'
                options={combosKeys}
                value={anchorCorner}
                onChange={value => this.handlePresetChange({anchorCorner: value}, true)}
              />
            </div>
          </div>
        </section>
      </div>
    )
  }

  renderDemo() {
    const {fixed, offsetParent, preset, popupCorner, anchorCorner, popupStyle} = this.state

    return (
      <div className={styles.demo}>
        <div
          ref={el => this.scroller = el}
          className={cx({
            [styles.scroller]: offsetParent === 'scroller',
          })}
        >
          <div className={styles.scrollerInner}>
            <button
              ref={el => this.anchor = el}
              className={styles.anchor}
            >
              anchor
            </button>

            <div
              ref={el => this.popup = el}
              className={cx(styles.popup, {
                [styles.isFixed]: fixed
              })}
              style={popupStyle}
            >
              <h2>Popup</h2>
              <pre>
                {
                  preset
                    ? `'${preset}'`
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
