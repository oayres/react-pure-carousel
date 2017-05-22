import React, { Component } from 'react'
const requestAnimationFrame = require('raf')
import {
  DEFAULT_DELAY,
  DEFAULT_DURATION,
  DEFAULT_EASING,
  DEFAULT_STACK_BEHAVIOR,
  stackBehavior
} from '../../constants'

const decorator = (DecoratedComponent, name, descriptor) => {
  console.log(DecoratedComponent)
  console.log(name)
  console.log(descriptor)

  return class Tween extends Component {
    constructor () {
      super()
      this._rafID = null
      this.state = {
        tweenQueue: []
      }
    }

    componentWillUnmount = () => {
      requestAnimationFrame.cancel(this._rafID)
      this._rafID = -1
    }

    tweenState = (path, {easing, duration, delay, beginValue, endValue, onEnd, stackBehavior: configSB}) => {
      this.setState(state => {
        console.log('setting state in tweenState', state)
        let cursor = state
        let stateName, pathHash
        // see comment below on pash hash

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

        // see the reasoning for these defaults at the top of file
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

        // we store path hash, so that during value retrieval we can use hash
        // comparison to find the path. See the kind of shitty thing you have to
        // do when you don't have value comparison for collections?
        newTweenQueue.push({
          pathHash: pathHash,
          config: newConfig,
          initTime: Date.now() + newConfig.delay
        })

        // sorry for mutating. For perf reasons we don't want to deep clone.
        // guys, can we please all start using persistent collections so that
        // we can stop worrying about nonesense like this
        cursor[stateName] = newConfig.endValue

        if (newTweenQueue.length === 1) {
          this._rafID = requestAnimationFrame(this._rafCb)
        }

        console.log('got a tween queue', newTweenQueue)

        // this will also include the above mutated update
        return {
          tweenQueue: newTweenQueue
        }
      })
    }

    getTweeningValue = (path) => {
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

    _rafCb = () => {
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

      // onEnd might trigger a parent callback that removes this component
      // -1 means we've canceled it in componentWillUnmount
      if (this._rafID === -1) {
        return
      }

      this.setState({
        tweenQueue: newTweenQueue
      })

      this._rafID = requestAnimationFrame(this._rafCb)
    }

    // render () {
    //   return (
    //     <DecoratedComponent
    //       {...this.props}
    //       getTweeningValue={this.getTweeningValue}
    //       tweenState={this.tweenState} />
    //   )
    // }
  }
}

export default decorator
