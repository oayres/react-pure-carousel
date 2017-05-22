const getTallestSlide = (slideHeight, slides) => {
  if (slides && slides.length) {
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i]

      if (s.offsetHeight > slideHeight) {
        slideHeight = s.offsetHeight
      }
    }
  }

  return slideHeight
}

export default getTallestSlide
