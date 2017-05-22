const calculateFromVelocity = (velocity, sum, distance, endLimit) => {
  if (velocity >= 3) {
    if (distance > window.innerWidth * 0.35) {
      sum = endLimit
    } else {
      sum = (sum + 4) > (endLimit) ? endLimit : sum + 4
    }
  } else if (velocity === 2) {
    if (distance > window.innerWidth * 0.65) {
      if (sum + 3 <= endLimit) {
        sum += 3
      } else if ((sum + 2) <= (endLimit)) {
        sum += 2
      }
    } else {
      sum = (sum + 2) <= (endLimit) ? sum + 2 : endLimit
    }
  } else if (velocity === 1) {
    if (distance > window.innerWidth * 0.60) {
      sum = (sum + 2) <= (endLimit) ? sum + 2 : endLimit
    } else {
      sum = (sum + 1) <= (endLimit) ? sum + 1 : endLimit
    }
  } else if (velocity === 0 && distance > window.innerWidth * 0.60) {
    sum = (sum + 1) <= (endLimit) ? sum + 1 : endLimit
  }

  return sum
}

const identifyNextSlide = (numberOfSlides, currentSlide, slidesToShow, slidesToScroll, velocity, distance, direction) => {
  let sum = currentSlide + slidesToScroll
  const adj = slidesToShow - slidesToScroll

  if (numberOfSlides - sum < slidesToShow) {
    const diff = numberOfSlides - sum - adj
    sum = currentSlide + diff
  } else {
    const endLimit = numberOfSlides - slidesToShow
    sum = calculateFromVelocity(velocity, sum, distance, endLimit)
  }

  return sum
}

export default identifyNextSlide
