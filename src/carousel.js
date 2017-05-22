import React, { Component } from 'react'
const PropTypes = require('prop-types')
const assign = require('object-assign')
const ExecutionEnvironment = require('exenv')
const easingTypes = require('tween-functions')
import {
  addEvent,
  removeEvent,
  getTallestSlide,
  mouseEvents,
  touchEvents,
  Tweenable,
  swipeAngle,
  identifyNextSlide,
  identifyPreviousSlide
} from './helpers'
import './styles/global.css'
import { decorators } from './constants'
import styles from './carousel.css'

@Tweenable
class Carousel extends Component {
  constructor (props) {
    super(props)
    this.clickSafe = true
    this.touchObject = {}
    this.state = {
      currentSlide: props.slideIndex,
      dragging: false,
      frameWidth: 0,
      left: 0,
      slideCount: 0,
      slidesToScroll: props.slidesToScroll,
      slideWidth: 0,
      top: 0,
      tweenQueue: []
    }

    this._rafID = null
  }

  componentWillMount () {
    this.setInitialDimensions()
  }

  componentDidMount () {
    this.setDimensions()
    this.bindEvents()
    this.setExternalData()

    if (this.props.autoplay) {
      this.startAutoplay()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      slideCount: nextProps.children.length
    })

    this.setDimensions(nextProps)

    if (this.props.slideIndex !== nextProps.slideIndex && nextProps.slideIndex !== this.state.currentSlide) {
      this.goToSlide(nextProps.slideIndex)
    }

    if (this.props.autoplay !== nextProps.autoplay) {
      if (nextProps.autoplay) {
        this.startAutoplay()
      } else {
        this.stopAutoplay()
      }
    }
  }

  componentWillUnmount () {
    this.unbindEvents()
    this.stopAutoplay()
  }

  renderDecorators (decorators) {
    if (decorators) {
      const items = []

      decorators.map((Decorator, index) => {
        items.push(
          <div
            style={Decorator.style}
            className={'slider-decorator-' + index + ' ' + (styles[Decorator.position] || styles.default)}
            key={index}>
            <Decorator.component
              currentSlide={this.state.currentSlide}
              slideCount={this.state.slideCount}
              frameWidth={this.state.frameWidth}
              slideWidth={this.state.slideWidth}
              slidesToScroll={this.state.slidesToScroll}
              cellSpacing={this.props.cellSpacing}
              slidesToShow={this.props.slidesToShow}
              wrapAround={this.props.wrapAround}
              nextSlide={this.nextSlide}
              previousSlide={this.previousSlide}
              goToSlide={this.goToSlide} />
          </div>
        )
      })

      return items
    }

    return null
  }

  render () {
    var children = React.Children.count(this.props.children) > 1 ? this.formatChildren(this.props.children) : this.props.children

    return (
      <div className={['slider', this.props.className || ''].join(' ')} ref='slider' style={assign(this.getSliderStyles(), this.props.style || {})}>
        <div className='slider-frame'
          ref='frame'
          style={this.getFrameStyles()}
          {...this.getTouchEvents()}
          {...this.getMouseEvents()}
          onClick={this.handleClick}>

          <ul className='slider-list' ref='list' style={this.getListStyles()}>
            {children}
          </ul>
        </div>

        { this.renderDecorators(decorators) }
      </div>
    )
  }

  getTouchEvents () {
    if (this.props.swiping === false) {
      return null
    }

    return touchEvents(this)
  }

  getMouseEvents () {
    if (this.props.dragging === false) {
      return null
    }

    return mouseEvents(this)
  }

  handleMouseOver () {
    if (this.props.autoplay) {
      this.autoplayPaused = true
      this.stopAutoplay()
    }
  }

  handleMouseOut () {
    if (this.props.autoplay && this.autoplayPaused) {
      this.startAutoplay()
      this.autoplayPaused = null
    }
  }

  handleClick = (e) => {
    if (this.clickSafe) {
      e.preventDefault()
      e.stopPropagation()

      if (e.nativeEvent) {
        e.nativeEvent.stopPropagation()
      }
    }
  }

  handleSwipe = (e, velocity, distance) => {
    velocity = velocity || 0
    distance = distance || 0
    this.clickSafe = typeof (this.touchObject.length) !== 'undefined' && this.touchObject.length > 44
    let slidesToShow = this.props.slidesToShow

    if (this.props.slidesToScroll === 'auto') {
      slidesToShow = this.state.slidesToScroll
    }

    const isSwiping = this.touchObject.length > (this.state.slideWidth / slidesToShow) / 5

    if (isSwiping) {
      const swipingForwards = this.touchObject.direction === 1
      const swipingBackwards = this.touchObject.direction === -1
      this.identifySwipeAction(swipingForwards, swipingBackwards, slidesToShow, velocity, distance)
    } else {
      this.goToSlide(this.state.currentSlide)
    }

    this.touchObject = {}
    this.setState({
      dragging: false
    })
  }

  identifySwipeAction (swipingForwards, swipingBackwards, slidesToShow, velocity, distance) {
    if (swipingForwards) {
      if (
        this.state.currentSlide >= React.Children.count(this.props.children) - slidesToShow &&
        !this.props.wrapAround
      ) {
        this.animateSlide(easingTypes[this.props.edgeEasing])
      } else {
        this.nextSlide(velocity, distance)
      }
    } else if (swipingBackwards) {
      if (this.state.currentSlide <= 0 && !this.props.wrapAround) {
        this.animateSlide(easingTypes[this.props.edgeEasing])
      } else {
        this.previousSlide(velocity, distance)
      }
    }
  }

  swipeDirection (x1, x2, y1, y2) {
    const xDist = x1 - x2
    const yDist = y1 - y2
    return swipeAngle(xDist, yDist, this.props.vertical)
  }

  autoplayIterator () {
    if (this.props.wrapAround) {
      return this.nextSlide()
    }

    if (this.state.currentSlide !== this.state.slideCount - this.state.slidesToShow) {
      this.nextSlide()
    } else {
      this.stopAutoplay()
    }
  }

  startAutoplay () {
    this.autoplayID = setInterval(this.autoplayIterator, this.props.autoplayInterval)
  }

  resetAutoplay () {
    if (this.props.autoplay && !this.autoplayPaused) {
      this.stopAutoplay()
      this.startAutoplay()
    }
  }

  stopAutoplay () {
    this.autoplayID && clearInterval(this.autoplayID)
  }

  goToSlide = (index) => {
    if ((index >= React.Children.count(this.props.children) || index < 0)) {
      if (!this.props.wrapAround) {
        return
      }

      if (index >= React.Children.count(this.props.children)) {
        this.props.beforeSlide(this.state.currentSlide, 0)

        return this.setState({
          currentSlide: 0
        }, () => {
          this.animateSlide(null, null, this.getTargetLeft(null, index), () => {
            this.animateSlide(null, 0.01)
            this.props.afterSlide(0)
            this.resetAutoplay()
            this.setExternalData()
          })
        })
      } else {
        const endSlide = React.Children.count(this.props.children) - this.state.slidesToScroll
        this.props.beforeSlide(this.state.currentSlide, endSlide)

        return this.setState({
          currentSlide: endSlide
        }, () => {
          this.animateSlide(null, null, this.getTargetLeft(null, index), () => {
            this.animateSlide(null, 0.01)
            this.props.afterSlide(endSlide)
            this.resetAutoplay()
            this.setExternalData()
          })
        })
      }
    }

    this.props.beforeSlide(this.state.currentSlide, index)

    this.setState({
      currentSlide: index
    }, () => {
      this.animateSlide()
      this.props.afterSlide(index)
      this.resetAutoplay()
      this.setExternalData()
    })
  }

  nextSlide = (velocity, distance) => {
    if (this.state.currentSlide + this.props.slidesToScroll >= this.props.children.length) {
      return
    }

    const sum = identifyNextSlide(
      this.props.children.length,
      this.state.currentSlide,
      this.props.slidesToShow,
      this.props.slidesToScroll,
      velocity,
      distance
    )

    this.setState({
      currentSlide: sum
    }, () => {
      this.animateSlide()
      this.setExternalData()
    })
  }

  previousSlide = (velocity, distance) => {
    const difference = this.state.currentSlide - this.props.slidesToScroll

    if (difference >= 0) {
      const slide = identifyPreviousSlide(velocity, distance, difference, this.props.slidesToScroll)

      this.setState({
        currentSlide: slide
      }, () => {
        this.animateSlide()
        this.setExternalData()
      })
    }
  }

  animateSlide (easing, duration, endValue, callback) {
    this.tweenState(this.props.vertical ? 'top' : 'left', {
      easing: easing || easingTypes[this.props.easing],
      duration: duration || this.props.speed,
      endValue: endValue || this.getTargetLeft(),
      onEnd: callback || null
    })
  }

  getOffset (cellAlign, cellSpacing, target, frameWidth, slideWidth) {
    let offset

    if (cellAlign === 'left') {
      offset = 0
      offset -= cellSpacing * target
    } else if (cellAlign === 'center') {
      offset = (frameWidth - slideWidth) / 2
      offset -= cellSpacing * target
    } else if (cellAlign === 'right') {
      offset = frameWidth - slideWidth
      offset -= cellSpacing * target
    }

    return offset
  }

  getTargetLeft (touchOffset, slide) {
    const { cellAlign, cellSpacing } = this.props
    const { frameWidth, slideWidth, currentSlide } = this.state
    const target = slide || currentSlide
    let offset = this.getOffset(cellAlign, cellSpacing, target, frameWidth, slideWidth)

    let left = this.state.slideWidth * target
    const lastSlide = this.state.currentSlide > 0 && target + this.state.slidesToScroll >= this.state.slideCount

    if (lastSlide && this.props.slideWidth !== 1 && !this.props.wrapAround && this.props.slidesToScroll === 'auto') {
      left = (this.state.slideWidth * this.state.slideCount) - this.state.frameWidth
      offset = 0
      offset -= this.props.cellSpacing * (this.state.slideCount - 1)
    }

    offset -= touchOffset || 0

    return (left - offset) * -1
  }

  bindEvents () {
    if (ExecutionEnvironment.canUseDOM) {
      addEvent(window, 'resize', this.setDimensions.bind(this, null))
      addEvent(document, 'readystatechange', this.setDimensions.bind(this, null))
    }
  }

  unbindEvents () {
    if (ExecutionEnvironment.canUseDOM) {
      removeEvent(window, 'resize', this.setDimensions.bind(this, null))
      removeEvent(document, 'readystatechange', this.setDimensions.bind(this, null))
    }
  }

  formatChildren (children) {
    var positionValue = this.props.vertical ? this.getTweeningValue('top') : this.getTweeningValue('left')
    return React.Children.map(children, (child, index) => {
      return <li className='slider-slide' style={this.getSlideStyles(index, positionValue)} key={index}>{child}</li>
    })
  }

  setInitialDimensions () {
    const slideWidth = this.props.vertical ? (this.props.initialSlideHeight || 0) : (this.props.initialSlideWidth || 0)
    const slideHeight = this.props.initialSlideHeight ? this.props.initialSlideHeight * this.props.slidesToShow : 0
    const frameHeight = slideHeight + (this.props.cellSpacing * (this.props.slidesToShow - 1))

    this.setState({
      slideHeight: slideHeight,
      frameWidth: this.props.vertical ? frameHeight : '100%',
      slideCount: React.Children.count(this.props.children),
      slideWidth: slideWidth
    }, () => {
      this.setLeft()
      this.setExternalData()
    })
  }

  setDimensions (props) {
    props = props || this.props
    let slideWidth, frameWidth, frameHeight, slideHeight
    let slidesToScroll = props.slidesToScroll
    const frame = this.refs.frame
    const slides = frame.childNodes[0].childNodes

    if (props.vertical) {
      if (slides && slides.length) {
        slides[0].style.height = 'auto'
        slideHeight = slides[0].offsetHeight * props.slidesToShow
      } else {
        slideHeight = 100
      }
    } else {
      slideHeight = this.state.slideHeight || props.initialSlideHeight || 0

      if (props.heightMode === 'max') {
        slideHeight = getTallestSlide(slideHeight, slides)
      }
    }

    if (typeof props.slideWidth !== 'number') {
      slideWidth = parseInt(props.slideWidth)
    } else {
      if (props.vertical) {
        slideWidth = (slideHeight / props.slidesToShow) * props.slideWidth
      } else {
        slideWidth = (frame.offsetWidth / props.slidesToShow) * props.slideWidth
      }
    }

    if (!props.vertical) {
      slideWidth -= props.cellSpacing * ((100 - (100 / props.slidesToShow)) / 100)
    }

    frameHeight = slideHeight + (props.cellSpacing * (props.slidesToShow - 1))
    frameWidth = props.vertical ? frameHeight : frame.offsetWidth

    if (props.slidesToScroll === 'auto') {
      slidesToScroll = Math.floor(frameWidth / (slideWidth + props.cellSpacing))
    }

    this.setState({
      slideHeight: slideHeight,
      frameWidth: frameWidth,
      slideWidth: slideWidth,
      slidesToScroll: slidesToScroll,
      left: props.vertical ? 0 : this.getTargetLeft(),
      top: props.vertical ? this.getTargetLeft() : 0
    }, () => {
      this.setLeft()
    })
  }

  setLeft () {
    this.setState({
      left: this.props.vertical ? 0 : this.getTargetLeft(),
      top: this.props.vertical ? this.getTargetLeft() : 0
    })
  }

  setExternalData () {
    if (this.props.data) {
      this.props.data()
    }
  }

  getListStyles () {
    const listWidth = this.state.slideWidth * React.Children.count(this.props.children)
    const spacingOffset = this.props.cellSpacing * React.Children.count(this.props.children)
    const transform = `translate3d(${this.getTweeningValue('left')}px, ${this.getTweeningValue('top')}px, 0)`

    return {
      transform,
      WebkitTransform: transform,
      msTransform: 'translate(' +
        this.getTweeningValue('left') + 'px, ' +
        this.getTweeningValue('top') + 'px)',
      margin: this.props.vertical ? (this.props.cellSpacing / 2) * -1 + 'px 0px'
                                  : '0px ' + (this.props.cellSpacing / 2) * -1 + 'px',
      height: this.props.vertical ? listWidth + spacingOffset : this.state.slideHeight,
      width: this.props.vertical ? 'auto' : listWidth + spacingOffset,
      cursor: this.state.dragging === true ? 'pointer' : 'inherit'
    }
  }

  getFrameStyles () {
    return {
      overflow: this.props.frameOverflow,
      height: this.props.vertical ? this.state.frameWidth || 'initial' : 'auto',
      margin: this.props.framePadding
    }
  }

  getSlideStyles (index, positionValue) {
    var targetPosition = this.getSlideTargetPosition(index, positionValue)
    return {
      position: 'absolute',
      left: this.props.vertical ? 0 : targetPosition,
      top: this.props.vertical ? targetPosition : 0,
      display: this.props.vertical ? 'block' : 'inline-block',
      listStyleType: 'none',
      verticalAlign: 'top',
      width: this.props.vertical ? '100%' : this.state.slideWidth,
      height: 'auto',
      boxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      marginLeft: this.props.vertical ? 'auto' : this.props.cellSpacing / 2,
      marginRight: this.props.vertical ? 'auto' : this.props.cellSpacing / 2,
      marginTop: this.props.vertical ? this.props.cellSpacing / 2 : 'auto',
      marginBottom: this.props.vertical ? this.props.cellSpacing / 2 : 'auto'
    }
  }

  getSlideTargetPosition (index, positionValue) {
    var slidesToShow = (this.state.frameWidth / this.state.slideWidth)
    var targetPosition = (this.state.slideWidth + this.props.cellSpacing) * index
    var end = ((this.state.slideWidth + this.props.cellSpacing) * slidesToShow) * -1

    if (this.props.wrapAround) {
      var slidesBefore = Math.ceil(positionValue / (this.state.slideWidth))
      if (this.state.slideCount - slidesBefore <= index) {
        return (this.state.slideWidth + this.props.cellSpacing) *
          (this.state.slideCount - index) * -1
      }

      var slidesAfter = Math.ceil((Math.abs(positionValue) - Math.abs(end)) / this.state.slideWidth)

      if (this.state.slideWidth !== 1) {
        slidesAfter = Math.ceil((Math.abs(positionValue) - (this.state.slideWidth)) / this.state.slideWidth)
      }

      if (index <= slidesAfter - 1) {
        return (this.state.slideWidth + this.props.cellSpacing) * (this.state.slideCount + index)
      }
    }

    return targetPosition
  }

  getSliderStyles () {
    return {
      width: this.props.width,
      visibility: this.state.slideWidth ? 'visible' : 'hidden'
    }
  }
}

Carousel.propTypes = {
  afterSlide: PropTypes.func,
  autoplay: PropTypes.bool,
  autoplayInterval: PropTypes.number,
  beforeSlide: PropTypes.func,
  cellAlign: PropTypes.oneOf(['left', 'center', 'right']),
  cellSpacing: PropTypes.number,
  data: PropTypes.func,
  decorators: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.func,
      position: PropTypes.oneOf([
        'TopLeft',
        'TopCenter',
        'TopRight',
        'CenterLeft',
        'CenterCenter',
        'CenterRight',
        'BottomLeft',
        'BottomCenter',
        'BottomRight'
      ]),
      style: PropTypes.object
    })
  ),
  dragging: PropTypes.bool,
  easing: PropTypes.string,
  edgeEasing: PropTypes.string,
  framePadding: PropTypes.string,
  frameOverflow: PropTypes.string,
  heightMode: React.PropTypes.oneOf(['max', 'adaptive']).isRequired,
  initialSlideHeight: PropTypes.number,
  initialSlideWidth: PropTypes.number,
  slideIndex: PropTypes.number,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['auto'])
  ]),
  slideWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  speed: PropTypes.number,
  swiping: PropTypes.bool,
  vertical: PropTypes.bool,
  width: PropTypes.string,
  wrapAround: PropTypes.bool
}

Carousel.defaultProps = {
  afterSlide: () => { /* default */ },
  autoplay: false,
  autoplayInterval: 3000,
  beforeSlide: () => { /* default */ },
  cellAlign: 'left',
  cellSpacing: 0,
  data: () => { /* default */ },
  decorators: decorators,
  dragging: true,
  easing: 'easeOutCirc',
  edgeEasing: 'easeOutElastic',
  framePadding: '0px',
  frameOverflow: 'hidden',
  heightMode: 'max',
  slideIndex: 0,
  slidesToScroll: 1,
  slidesToShow: 1,
  slideWidth: 1,
  speed: 500,
  swiping: true,
  vertical: false,
  width: '100%',
  wrapAround: false
}

export default Carousel
