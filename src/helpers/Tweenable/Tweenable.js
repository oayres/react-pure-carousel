const requestAnimationFrame = require('raf')
import {
  DEFAULT_DELAY,
  DEFAULT_DURATION,
  DEFAULT_EASING,
  DEFAULT_STACK_BEHAVIOR,
  stackBehavior
} from '../../constants'

const decorator = (DecoratedComponent) => {
  DecoratedComponent.prototype.componentWillUnmount = function () {
    requestAnimationFrame.cancel(this._rafID)
    this._rafID = -1
  }

  DecoratedComponent.prototype.tweenState = function (path, {easing, duration, delay, beginValue, endValue, onEnd, stackBehavior: configSB}) {
    this.setState(state => {
      let cursor = state
      let stateName, pathHash

      if (typeof path === 'string') {
        stateName = path
        pathHash = path
      } else {
        for (let i = 0; i < path.length - 1; i++) {
          cursor = cursor[path[i]]
        }

        stateName = path[path.length - 1]
        pathHash = path.join('|')
      }

      const newConfig = {
        easing: easing || DEFAULT_EASING,
        duration: duration == null ? DEFAULT_DURATION : duration,
        delay: delay == null ? DEFAULT_DELAY : delay,
        beginValue: beginValue == null ? cursor[stateName] : beginValue,
        endValue: endValue,
        onEnd: onEnd,
        stackBehavior: configSB || DEFAULT_STACK_BEHAVIOR
      }

      let newTweenQueue = state.tweenQueue

      if (newConfig.stackBehavior === stackBehavior.DESTRUCTIVE) {
        newTweenQueue = state.tweenQueue.filter(item => item.pathHash !== pathHash)
      }

      newTweenQueue.push({
        pathHash: pathHash,
        config: newConfig,
        initTime: Date.now() + newConfig.delay
      })

      cursor[stateName] = newConfig.endValue

      if (newTweenQueue.length === 1) {
        this._rafID = requestAnimationFrame(this._rafCb.bind(this))
      }

      return {
        tweenQueue: newTweenQueue
      }
    })
  }

  DecoratedComponent.prototype.getTweeningValue = function (path) {
    const state = this.state
    const now = Date.now()
    let tweeningValue, pathHash

    if (typeof path === 'string') {
      tweeningValue = state[path]
      pathHash = path
    } else {
      tweeningValue = state
      for (let i = 0; i < path.length; i++) {
        tweeningValue = tweeningValue[path[i]]
      }
      pathHash = path.join('|')
    }

    for (let i = 0; i < state.tweenQueue.length; i++) {
      const { pathHash: itemPathHash, initTime, config } = state.tweenQueue[i]

      if (itemPathHash !== pathHash) {
        continue
      }

      const progressTime = now - initTime > config.duration
        ? config.duration
        : Math.max(0, now - initTime)

      const easeValue = config.duration === 0 ? config.endValue : config.easing(
        progressTime,
        config.beginValue,
        config.endValue,
        config.duration
      )

      const contrib = easeValue - config.endValue
      tweeningValue += contrib
    }

    return tweeningValue
  }

  DecoratedComponent.prototype._rafCb = function () {
    const state = this.state

    if (state.tweenQueue.length === 0) {
      return
    }

    const now = Date.now()
    const newTweenQueue = []

    for (let i = 0; i < state.tweenQueue.length; i++) {
      const item = state.tweenQueue[i]
      const {initTime, config} = item

      if (now - initTime < config.duration) {
        newTweenQueue.push(item)
      } else {
        config.onEnd && config.onEnd()
      }
    }

    if (this._rafID === -1) {
      return
    }

    this.setState({
      tweenQueue: newTweenQueue
    })

    this._rafID = requestAnimationFrame(this._rafCb.bind(this))
  }
}

export default decorator
