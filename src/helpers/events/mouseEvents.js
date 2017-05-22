const mouseEvents = (carousel) => {
  return {
    onMouseOver () {
      carousel.handleMouseOver()
    },

    onMouseOut () {
      carousel.handleMouseOut()
    },

    onMouseDown (e) {
      const start = new Date()
      carousel.touchObject = {
        startX: e.clientX,
        startY: e.clientY,
        time: start
      }

      carousel.setState({
        dragging: true
      })
    },

    onMouseMove (e) {
      if (!carousel.state.dragging) {
        return
      }

      var direction = carousel.swipeDirection(
        carousel.touchObject.startX,
        e.clientX,
        carousel.touchObject.startY,
        e.clientY
      )

      // carousel.dist = carousel.swipeDistance(carousel.touchObject.startX, e.clientX)

      if (direction !== 0) {
        e.preventDefault()
      }

      let length

      if (carousel.props.vertical) {
        length = Math.round(Math.sqrt(Math.pow(e.clientY - carousel.touchObject.startY, 2)))
      } else {
        length = Math.round(Math.sqrt(Math.pow(e.clientX - carousel.touchObject.startX, 2)))
      }

      carousel.touchObject = {
        startX: carousel.touchObject.startX,
        startY: carousel.touchObject.startY,
        endX: e.clientX,
        endY: e.clientY,
        length: length,
        direction: direction,
        time: carousel.touchObject.time
      }

      carousel.setState({
        left: carousel.props.vertical ? 0 : carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction),
        top: carousel.props.vertical ? carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction) : 0
      })
    },

    onMouseUp (e) {
      if (!carousel.state.dragging) {
        return
      }

      var distance = Math.abs(carousel.touchObject.startX - carousel.touchObject.endX)
      var end = new Date()
      var time = carousel.touchObject.time - end
      var velocity = Math.abs(Math.round(distance / time))
      carousel.handleSwipe(e, velocity, distance)
    },

    onMouseLeave (e) {
      if (!carousel.state.dragging) {
        return
      }

      carousel.handleSwipe(e)
    }
  }
}

export default mouseEvents
