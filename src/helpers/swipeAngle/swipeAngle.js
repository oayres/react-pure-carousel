const normaliseAngle = (swipeAngle) => {
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle)
  }

  return swipeAngle
}

const mapAngleToDirection = (swipeAngle, vertical) => {
  let direction = 0

  if (swipeAngle <= 45 || swipeAngle >= 315) {
    direction = 1
  } else if (swipeAngle >= 135 && swipeAngle <= 225) {
    direction = -1
  } else if (vertical) {
    if (swipeAngle >= 35 && swipeAngle <= 135) {
      direction = 1
    } else {
      direction = -1
    }
  }

  return direction
}

const swipeAngle = (xDist, yDist, vertical) => {
  const radius = Math.atan2(yDist, xDist)
  let swipeAngle = Math.round(radius * 180 / Math.PI)
  swipeAngle = normaliseAngle(swipeAngle)
  return mapAngleToDirection(swipeAngle, vertical)
}

export default swipeAngle
