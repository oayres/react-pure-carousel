const calculateSlide = (slide, velocity, distance) => {
  if (velocity >= 3) {
    if (distance > window.innerWidth * 0.35) {
      slide = 0
    } else {
      slide = (slide - 4) < 0 ? 0 : slide - 4
    }
  } else if (velocity === 2) {
    if (distance > window.innerWidth * 0.65) {
      slide = (slide - 3) < 0 ? 0 : slide - 3
    } else {
      slide = (slide - 2) < 0 ? 0 : slide - 1
    }
  } else if (velocity === 1) {
    if (distance > window.innerWidth * 0.35) {
      slide = (slide - 2) < 0 ? 0 : slide - 2
    } else {
      slide = (slide - 1) < 0 ? 0 : slide - 1
    }
  } else if (velocity === 0 && distance > window.innerWidth * 0.60) {
    slide = (slide - 1) < 0 ? 0 : slide - 1
  }

  return slide
}

const identifyPreviousSlide = (velocity, distance, difference, slidesToScroll) => {
  let slide = (difference < slidesToScroll) ? difference + 1 : difference

  if (difference === 0) {
    slide = 0
  } else {
    slide = calculateSlide(slide, velocity, distance)
  }

  return slide
}

export default identifyPreviousSlide
