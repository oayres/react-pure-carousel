import React from 'react'
const PropTypes = require('prop-types')
import styles from './Dots.css'

class Dots extends React.Component {
  getIndexes (count, inc) {
    const arr = []

    for (let i = 0; i < count; i += inc) {
      arr.push(i)
    }

    return arr
  }

  renderDots (items, currentSlide, clickHandler) {
    const dots = []

    items.map(index => {
      const classes = [styles.button]

      if (currentSlide === index) {
        classes.push(styles.active)
      }

      dots.push(
        <li className={styles.item} key={index}>
          <button className={classes.join(' ')} onClick={clickHandler.bind(null, index)}>
            &bull;
          </button>
        </li>
      )
    })

    return dots
  }

  render () {
    const indexes = this.getIndexes(this.props.slideCount, this.props.slidesToScroll)

    return (
      <ul className={styles.list}>
        { this.renderDots(indexes, this.props.currentSlide, this.props.goToSlide) }
      </ul>
    )
  }
}

Dots.PropTypes = {
  slideCount: PropTypes.number,
  slidesToScroll: PropTypes.number,
  currentSlide: PropTypes.number,
  goToSlide: PropTypes.func.isRequired
}

Dots.defaultProps = {
  slideCount: 1,
  slidesToScroll: 1
}

export default Dots
