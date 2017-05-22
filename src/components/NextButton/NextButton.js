import React, { Component } from 'react'

class NextButton extends Component {
  handleClick = (e) => {
    e.preventDefault()
    this.props.nextSlide()
  }

  getButtonStyles (disabled) {
    return {
      border: 0,
      background: 'rgba(0,0,0,0.4)',
      color: 'white',
      padding: 10,
      outline: 0,
      opacity: disabled ? 0.3 : 1,
      cursor: 'pointer'
    }
  }

  render () {
    const disabled = this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround

    return (
      <button
        style={this.getButtonStyles(disabled)}
        onClick={this.handleClick}>NEXT</button>
    )
  }
}

export default NextButton
