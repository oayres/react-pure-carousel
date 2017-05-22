const easingTypes = require('tween-functions')
const easeInOutQuad = easingTypes.easeInOutQuad
const DEFAULT_STACK_BEHAVIOR = 'ADDITIVE'
const DEFAULT_EASING = easeInOutQuad
const DEFAULT_DURATION = 300
const DEFAULT_DELAY = 0

const stackBehavior = {
  ADDITIVE: 'ADDITIVE',
  DESTRUCTIVE: 'DESTRUCTIVE'
}

export {
  DEFAULT_DELAY,
  DEFAULT_DURATION,
  DEFAULT_EASING,
  DEFAULT_STACK_BEHAVIOR,
  stackBehavior
}
