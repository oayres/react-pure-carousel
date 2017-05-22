import { addEvent, removeEvent } from './events/events'
import mouseEvents from './events/mouseEvents'
import touchEvents from './events/touchEvents'
import getTallestSlide from './getTallestSlide/getTallestSlide'
import Tweenable from './Tweenable/Tweenable'
import swipeAngle from './swipeAngle/swipeAngle'
import identifyNextSlide from './identifyNextSlide/identifyNextSlide'
import identifyPreviousSlide from './identifyPreviousSlide/identifyPreviousSlide'

export {
  getTallestSlide,
  addEvent,
  removeEvent,
  mouseEvents,
  touchEvents,
  Tweenable,
  swipeAngle,
  identifyNextSlide,
  identifyPreviousSlide
}
