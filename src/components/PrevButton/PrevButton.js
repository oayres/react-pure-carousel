import React, { Component } from 'react'

class PrevButton extends Component {
  render () {
    return (
      <button
        style={this.getButtonStyles(this.props.currentSlide === 0 && !this.props.wrapAround)}
        onClick={this.handleClick}>PREV</button>
    )
  }

  handleClick (e) {
    e.preventDefault()
    this.props.previousSlide()
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
}

export default PrevButton
