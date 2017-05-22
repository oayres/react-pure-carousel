const touchEvents = (carousel) => {
  return {
    onTouchStart (e) {
      const start = new Date()
      carousel.touchObject = {
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY,
        time: start
      }
      carousel.handleMouseOver()
    },

    onTouchMove (e) {
      var direction = carousel.swipeDirection(
        carousel.touchObject.startX,
        e.touches[0].pageX,
        carousel.touchObject.startY,
        e.touches[0].pageY
      )

      if (direction !== 0) {
        e.preventDefault()
      }

      var length = carousel.props.vertical ? Math.round(Math.sqrt(Math.pow(e.touches[0].pageY - carousel.touchObject.startY, 2)))
                                        : Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - carousel.touchObject.startX, 2)))

      carousel.touchObject = {
        startX: carousel.touchObject.startX,
        startY: carousel.touchObject.startY,
        endX: e.touches[0].pageX,
        endY: e.touches[0].pageY,
        length: length,
        direction: direction,
        time: carousel.touchObject.time
      }

      carousel.setState({
        left: carousel.props.vertical ? 0 : carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction),
        top: carousel.props.vertical ? carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction) : 0
      })
    },

    onTouchEnd (e) {
      // carousel.handleSwipe(e)
      // carousel.handleMouseOut()
      var distance = Math.abs(carousel.touchObject.startX - carousel.touchObject.endX)
      var end = new Date()
      var time = carousel.touchObject.time - end
      var velocity = Math.abs(Math.round(distance / time))
      carousel.handleSwipe(e, velocity)
    },

    onTouchCancel (e) {
      carousel.handleSwipe(e)
    }
  }
}

export default touchEvents
