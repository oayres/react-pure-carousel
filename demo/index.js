(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
	typeof define === 'function' && define.amd ? define(['react'], factory) :
	(global['react-pure-carousel'] = factory(global.React));
}(this, (function (React) { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

var React__default = 'default' in React ? React['default'] : React;

var addEvent = function addEvent(elem, type, eventHandle) {
  if (elem === null || typeof elem === 'undefined') {
    return;
  }
  if (elem.addEventListener) {
    elem.addEventListener(type, eventHandle, false);
  } else if (elem.attachEvent) {
    elem.attachEvent('on' + type, eventHandle);
  } else {
    elem['on' + type] = eventHandle;
  }
};

var removeEvent = function removeEvent(elem, type, eventHandle) {
  if (elem === null || typeof elem === 'undefined') {
    return;
  }
  if (elem.removeEventListener) {
    elem.removeEventListener(type, eventHandle, false);
  } else if (elem.detachEvent) {
    elem.detachEvent('on' + type, eventHandle);
  } else {
    elem['on' + type] = null;
  }
};

var mouseEvents = function mouseEvents(carousel) {
  return {
    onMouseOver: function onMouseOver() {
      carousel.handleMouseOver();
    },
    onMouseOut: function onMouseOut() {
      carousel.handleMouseOut();
    },
    onMouseDown: function onMouseDown(e) {
      var start = new Date();
      carousel.touchObject = {
        startX: e.clientX,
        startY: e.clientY,
        time: start
      };

      carousel.setState({
        dragging: true
      });
    },
    onMouseMove: function onMouseMove(e) {
      if (!carousel.state.dragging) {
        return;
      }

      var direction = carousel.swipeDirection(carousel.touchObject.startX, e.clientX, carousel.touchObject.startY, e.clientY);

      // carousel.dist = carousel.swipeDistance(carousel.touchObject.startX, e.clientX)

      if (direction !== 0) {
        e.preventDefault();
      }

      var length = void 0;

      if (carousel.props.vertical) {
        length = Math.round(Math.sqrt(Math.pow(e.clientY - carousel.touchObject.startY, 2)));
      } else {
        length = Math.round(Math.sqrt(Math.pow(e.clientX - carousel.touchObject.startX, 2)));
      }

      carousel.touchObject = {
        startX: carousel.touchObject.startX,
        startY: carousel.touchObject.startY,
        endX: e.clientX,
        endY: e.clientY,
        length: length,
        direction: direction,
        time: carousel.touchObject.time
      };

      carousel.setState({
        left: carousel.props.vertical ? 0 : carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction),
        top: carousel.props.vertical ? carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction) : 0
      });
    },
    onMouseUp: function onMouseUp(e) {
      if (!carousel.state.dragging) {
        return;
      }

      var distance = carousel.touchObject.startX - carousel.touchObject.endX;
      var end = new Date();
      var time = carousel.touchObject.time - end;
      var velocity = Math.abs(Math.round(distance / time));
      console.log('Velocity ', velocity);
      carousel.handleSwipe(e, velocity, distance);
    },
    onMouseLeave: function onMouseLeave(e) {
      if (!carousel.state.dragging) {
        return;
      }

      carousel.handleSwipe(e);
    }
  };
};

var touchEvents = function touchEvents(carousel) {
  return {
    onTouchStart: function onTouchStart(e) {
      var start = new Date();
      carousel.touchObject = {
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY,
        time: start
      };
      carousel.handleMouseOver();
    },
    onTouchMove: function onTouchMove(e) {
      var direction = carousel.swipeDirection(carousel.touchObject.startX, e.touches[0].pageX, carousel.touchObject.startY, e.touches[0].pageY);

      if (direction !== 0) {
        e.preventDefault();
      }

      var length = carousel.props.vertical ? Math.round(Math.sqrt(Math.pow(e.touches[0].pageY - carousel.touchObject.startY, 2))) : Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - carousel.touchObject.startX, 2)));

      carousel.touchObject = {
        startX: carousel.touchObject.startX,
        startY: carousel.touchObject.startY,
        endX: e.touches[0].pageX,
        endY: e.touches[0].pageY,
        length: length,
        direction: direction,
        time: carousel.touchObject.time
      };

      carousel.setState({
        left: carousel.props.vertical ? 0 : carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction),
        top: carousel.props.vertical ? carousel.getTargetLeft(carousel.touchObject.length * carousel.touchObject.direction) : 0
      });
    },
    onTouchEnd: function onTouchEnd(e) {
      // carousel.handleSwipe(e)
      // carousel.handleMouseOut()
      var distance = carousel.touchObject.startX - carousel.touchObject.endX;
      var end = new Date();
      var time = carousel.touchObject.time - end;
      var velocity = Math.abs(Math.round(distance / time));
      console.log('Velocity ', velocity);
      carousel.handleSwipe(e, velocity);
    },
    onTouchCancel: function onTouchCancel(e) {
      carousel.handleSwipe(e);
    }
  };
};

var getTallestSlide = function getTallestSlide(slideHeight, slides) {
  if (slides && slides.length) {
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];

      if (s.offsetHeight > slideHeight) {
        slideHeight = s.offsetHeight;
      }
    }
  }

  return slideHeight;
};

var styles = __$styleInject("._list_1rbgs_1{position:relative;margin:0;top:-10px;padding:0}._item_1rbgs_8{list-style:none;display:inline-block}._button_1rbgs_13{border:0;background:transparent;color:#000;cursor:pointer;padding:10px;outline:0;font-size:24px;opacity:.5}._active_1rbgs_24{opacity:1}", { "list": "_list_1rbgs_1", "item": "_item_1rbgs_8", "button": "_button_1rbgs_13", "active": "_active_1rbgs_24" });

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var PropTypes$1 = require('prop-types');
var Dots = function (_React$Component) {
  inherits(Dots, _React$Component);

  function Dots() {
    classCallCheck(this, Dots);
    return possibleConstructorReturn(this, (Dots.__proto__ || Object.getPrototypeOf(Dots)).apply(this, arguments));
  }

  createClass(Dots, [{
    key: 'getIndexes',
    value: function getIndexes(count, inc) {
      var arr = [];

      for (var i = 0; i < count; i += inc) {
        arr.push(i);
      }

      return arr;
    }
  }, {
    key: 'renderDots',
    value: function renderDots(items, currentSlide, clickHandler) {
      var dots = [];

      items.map(function (index) {
        var classes = [styles.button];

        if (currentSlide === index) {
          classes.push(styles.active);
        }

        dots.push(React__default.createElement(
          'li',
          { className: styles.item, key: index },
          React__default.createElement(
            'button',
            { className: classes.join(' '), onClick: clickHandler.bind(null, index) },
            '\u2022'
          )
        ));
      });

      return dots;
    }
  }, {
    key: 'render',
    value: function render() {
      var indexes = this.getIndexes(this.props.slideCount, this.props.slidesToScroll);

      return React__default.createElement(
        'ul',
        { className: styles.list },
        this.renderDots(indexes, this.props.currentSlide, this.props.goToSlide)
      );
    }
  }]);
  return Dots;
}(React__default.Component);

Dots.PropTypes = {
  slideCount: PropTypes$1.number,
  slidesToScroll: PropTypes$1.number,
  currentSlide: PropTypes$1.number,
  goToSlide: PropTypes$1.func.isRequired
};

Dots.defaultProps = {
  slideCount: 1,
  slidesToScroll: 1
};

var NextButton = function (_Component) {
  inherits(NextButton, _Component);

  function NextButton() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, NextButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = NextButton.__proto__ || Object.getPrototypeOf(NextButton)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (e) {
      e.preventDefault();
      _this.props.nextSlide();
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(NextButton, [{
    key: 'getButtonStyles',
    value: function getButtonStyles(disabled) {
      return {
        border: 0,
        background: 'rgba(0,0,0,0.4)',
        color: 'white',
        padding: 10,
        outline: 0,
        opacity: disabled ? 0.3 : 1,
        cursor: 'pointer'
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var disabled = this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround;

      return React__default.createElement(
        'button',
        {
          style: this.getButtonStyles(disabled),
          onClick: this.handleClick },
        'NEXT'
      );
    }
  }]);
  return NextButton;
}(React.Component);

var PrevButton = function (_Component) {
  inherits(PrevButton, _Component);

  function PrevButton() {
    classCallCheck(this, PrevButton);
    return possibleConstructorReturn(this, (PrevButton.__proto__ || Object.getPrototypeOf(PrevButton)).apply(this, arguments));
  }

  createClass(PrevButton, [{
    key: 'render',
    value: function render() {
      return React__default.createElement(
        'button',
        {
          style: this.getButtonStyles(this.props.currentSlide === 0 && !this.props.wrapAround),
          onClick: this.handleClick },
        'PREV'
      );
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      this.props.previousSlide();
    }
  }, {
    key: 'getButtonStyles',
    value: function getButtonStyles(disabled) {
      return {
        border: 0,
        background: 'rgba(0,0,0,0.4)',
        color: 'white',
        padding: 10,
        outline: 0,
        opacity: disabled ? 0.3 : 1,
        cursor: 'pointer'
      };
    }
  }]);
  return PrevButton;
}(React.Component);

var DefaultDecorators = [{
  component: PrevButton,
  position: 'CenterLeft'
}, {
  component: NextButton,
  position: 'CenterRight'
}, {
  component: Dots,
  position: 'BottomCenter'
}];

var easingTypes$1 = require('tween-functions');
var easeInOutQuad = easingTypes$1.easeInOutQuad;

var DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
var DEFAULT_EASING = easeInOutQuad;
var DEFAULT_DURATION = 300;
var DEFAULT_DELAY = 0;

var stackBehavior = {
  ADDITIVE: 'ADDITIVE',
  DESTRUCTIVE: 'DESTRUCTIVE'
};

__$styleInject(".slider-slide>img{width:100%;display:block}", {});

var PropTypes = require('prop-types');
var assign = require('object-assign');
var ExecutionEnvironment = require('exenv');
var easingTypes = require('tween-functions');
var requestAnimationFrame = require('raf');
var Carousel = function (_Component) {
  inherits(Carousel, _Component);

  function Carousel(props) {
    classCallCheck(this, Carousel);

    var _this = possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

    _this.handleClick = function (e) {
      if (_this.clickSafe === true) {
        e.preventDefault();
        e.stopPropagation();

        if (e.nativeEvent) {
          e.nativeEvent.stopPropagation();
        }
      }
    };

    _this.handleSwipe = function (e, velocity, distance) {
      velocity = velocity || 0;
      distance = distance || 0;

      if (typeof _this.touchObject.length !== 'undefined' && _this.touchObject.length > 44) {
        _this.clickSafe = true;
      } else {
        _this.clickSafe = false;
      }

      var slidesToShow = _this.props.slidesToShow;
      if (_this.props.slidesToScroll === 'auto') {
        slidesToShow = _this.state.slidesToScroll;
      }

      if (_this.touchObject.length > _this.state.slideWidth / slidesToShow / 5) {
        if (_this.touchObject.direction === 1) {
          if (_this.state.currentSlide >= React__default.Children.count(_this.props.children) - slidesToShow && !_this.props.wrapAround) {
            _this.animateSlide(easingTypes[_this.props.edgeEasing]);
          } else {
            _this.nextSlide(velocity, distance);
          }
        } else if (_this.touchObject.direction === -1) {
          if (_this.state.currentSlide <= 0 && !_this.props.wrapAround) {
            _this.animateSlide(easingTypes[_this.props.edgeEasing]);
          } else {
            _this.previousSlide(velocity, distance);
          }
        }
      } else {
        _this.goToSlide(_this.state.currentSlide);
      }

      _this.touchObject = {};

      _this.setState({
        dragging: false
      });
    };

    _this.goToSlide = function (index) {
      var self = _this;

      if (index >= React__default.Children.count(_this.props.children) || index < 0) {
        if (!_this.props.wrapAround) {
          return;
        }

        if (index >= React__default.Children.count(_this.props.children)) {
          _this.props.beforeSlide(_this.state.currentSlide, 0);
          return _this.setState({
            currentSlide: 0
          }, function () {
            self.animateSlide(null, null, self.getTargetLeft(null, index), function () {
              self.animateSlide(null, 0.01);
              self.props.afterSlide(0);
              self.resetAutoplay();
              self.setExternalData();
            });
          });
        } else {
          var endSlide = React__default.Children.count(_this.props.children) - _this.state.slidesToScroll;
          _this.props.beforeSlide(_this.state.currentSlide, endSlide);
          return _this.setState({
            currentSlide: endSlide
          }, function () {
            self.animateSlide(null, null, self.getTargetLeft(null, index), function () {
              self.animateSlide(null, 0.01);
              self.props.afterSlide(endSlide);
              self.resetAutoplay();
              self.setExternalData();
            });
          });
        }
      }

      _this.props.beforeSlide(_this.state.currentSlide, index);

      _this.setState({
        currentSlide: index
      }, function () {
        self.animateSlide();
        this.props.afterSlide(index);
        self.resetAutoplay();
        self.setExternalData();
      });
    };

    _this.nextSlide = function (velocity, distance) {
      console.log('Got velocity inside nextSlide', velocity);
      // var childrenCount = React.Children.count(this.props.children)
      // var slidesToShow = this.props.slidesToShow

      var sum = _this.state.currentSlide + _this.props.slidesToScroll;

      if (_this.props.children.length - sum < 3) {
        _this.diff = _this.props.children.length - sum - 2;
        sum = _this.state.currentSlide + _this.diff;
      } else {
        if (velocity >= 3) {
          if (distance > window.innerWidth * 0.8) {
            sum = 0;
          } else {
            sum = _this.props.children.length - _this.props.slidesToShow;
          }
        } else if (velocity === 2) {
          if (distance > window.innerWidth * 0.65) {
            sum = sum + 3 <= _this.props.children.length - _this.props.slidesToShow ? sum + 3 : sum;
          } else {
            sum = sum + 3 <= _this.props.children.length - _this.props.slidesToShow ? sum + 2 : sum;
          }
        } else if (velocity === 1) {
          sum = sum + 2 <= _this.props.children.length - _this.props.slidesToShow ? sum + 2 : sum;
        } else {
          console.log('same to same');
        }
      }

      _this.setState({
        currentSlide: sum
      }, function () {
        _this.animateSlide();
        _this.setExternalData();
      });

      // if (this.props.slidesToScroll === 'auto') {
      //   slidesToShow = this.state.slidesToScroll
      // }

      // if (this.state.currentSlide >= childrenCount - slidesToShow && !this.props.wrapAround) {
      //   return
      // }

      // if (this.props.wrapAround) {
      //   this.goToSlide(this.state.currentSlide + this.state.slidesToScroll)
      // } else {
      //   if (this.props.slideWidth !== 1) {
      //     return this.goToSlide(this.state.currentSlide + this.state.slidesToScroll)
      //   }

      //   this.goToSlide(
      //     Math.min(this.state.currentSlide + this.state.slidesToScroll, childrenCount - slidesToShow)
      //   )
      // }
    };

    _this.previousSlide = function (velocity, distance) {
      // if (this.state.currentSlide <= 0 && !this.props.wrapAround) {
      //   return
      // }
      console.log('Got distance inside previousSlide', velocity);
      var difference = _this.state.currentSlide - _this.props.slidesToScroll;

      if (difference < 0) {
        return;
      }

      var slide = difference < _this.props.slidesToScroll ? difference + 1 : difference;

      if (difference === 0) {
        slide = 0;
      } else {
        if (velocity >= 3) {
          if (distance > window.innerWidth * 0.8) {
            slide = 0;
          } else {
            slide = slide - 3 < 1 ? 0 : slide - 3;
          }
        } else if (velocity === 2) {
          if (distance > window.innerWidth * 0.65) {
            slide = slide - 2 < 1 ? 0 : slide - 2;
          } else {
            slide = slide - 2 < 1 ? 0 : slide - 1;
          }
        } else if (velocity === 1) {
          slide = slide - 1 < 1 ? 0 : slide - 1;
        } else {
          console.log('same to same');
        }
      }

      _this.setState({
        currentSlide: slide
      }, function () {
        _this.animateSlide();
        _this.setExternalData();
      });

      // if (this.props.wrapAround) {
      //   this.goToSlide(this.state.currentSlide - this.state.slidesToScroll)
      // } else {
      //   this.goToSlide(Math.max(0, this.state.currentSlide - this.state.slidesToScroll))
      // }
    };

    _this.displayName = 'Carousel';
    _this.clickSafe = true;
    _this.touchObject = {};
    _this._rafID = null;
    _this.state = {
      currentSlide: props.slideIndex,
      dragging: false,
      frameWidth: 0,
      left: 0,
      slideCount: 0,
      slidesToScroll: props.slidesToScroll,
      slideWidth: 0,
      top: 0,
      tweenQueue: []
    };
    return _this;
  }

  createClass(Carousel, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setInitialDimensions();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setDimensions();
      this.bindEvents();
      this.setExternalData();

      if (this.props.autoplay) {
        this.startAutoplay();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        slideCount: nextProps.children.length
      });

      this.setDimensions(nextProps);

      if (this.props.slideIndex !== nextProps.slideIndex && nextProps.slideIndex !== this.state.currentSlide) {
        this.goToSlide(nextProps.slideIndex);
      }

      if (this.props.autoplay !== nextProps.autoplay) {
        if (nextProps.autoplay) {
          this.startAutoplay();
        } else {
          this.stopAutoplay();
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      requestAnimationFrame.cancel(this._rafID);
      this._rafID = -1;
      this.unbindEvents();
      this.stopAutoplay();
    }
  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var children = React__default.Children.count(this.props.children) > 1 ? this.formatChildren(this.props.children) : this.props.children;
      return React__default.createElement(
        'div',
        { className: ['slider', this.props.className || ''].join(' '), ref: 'slider', style: assign(this.getSliderStyles(), this.props.style || {}) },
        React__default.createElement(
          'div',
          _extends({ className: 'slider-frame',
            ref: 'frame',
            style: this.getFrameStyles()
          }, this.getTouchEvents(), this.getMouseEvents(), {
            onClick: this.handleClick }),
          React__default.createElement(
            'ul',
            { className: 'slider-list', ref: 'list', style: this.getListStyles() },
            children
          )
        ),
        this.props.decorators ? this.props.decorators.map(function (Decorator, index) {
          return React__default.createElement(
            'div',
            {
              style: assign(self.getDecoratorStyles(Decorator.position), Decorator.style || {}),
              className: 'slider-decorator-' + index,
              key: index },
            React__default.createElement(Decorator.component, {
              currentSlide: self.state.currentSlide,
              slideCount: self.state.slideCount,
              frameWidth: self.state.frameWidth,
              slideWidth: self.state.slideWidth,
              slidesToScroll: self.state.slidesToScroll,
              cellSpacing: self.props.cellSpacing,
              slidesToShow: self.props.slidesToShow,
              wrapAround: self.props.wrapAround,
              nextSlide: self.nextSlide,
              previousSlide: self.previousSlide,
              goToSlide: self.goToSlide })
          );
        }) : null
      );
    }

    // Touch Events

  }, {
    key: 'getTouchEvents',
    value: function getTouchEvents() {
      if (this.props.swiping === false) {
        return null;
      }

      return touchEvents(this);
    }
  }, {
    key: 'getMouseEvents',
    value: function getMouseEvents() {
      if (this.props.dragging === false) {
        return null;
      }

      return mouseEvents(this);
    }
  }, {
    key: 'handleMouseOver',
    value: function handleMouseOver() {
      if (this.props.autoplay) {
        this.autoplayPaused = true;
        this.stopAutoplay();
      }
    }
  }, {
    key: 'handleMouseOut',
    value: function handleMouseOut() {
      if (this.props.autoplay && this.autoplayPaused) {
        this.startAutoplay();
        this.autoplayPaused = null;
      }
    }
  }, {
    key: 'swipeDirection',
    value: function swipeDirection(x1, x2, y1, y2) {
      var xDist, yDist, r, swipeAngle;

      xDist = x1 - x2;
      yDist = y1 - y2;
      r = Math.atan2(yDist, xDist);

      swipeAngle = Math.round(r * 180 / Math.PI);

      if (swipeAngle < 0) {
        swipeAngle = 360 - Math.abs(swipeAngle);
      }

      if (swipeAngle <= 45 && swipeAngle >= 0) {
        return 1;
      }

      if (swipeAngle <= 360 && swipeAngle >= 315) {
        return 1;
      }

      if (swipeAngle >= 135 && swipeAngle <= 225) {
        return -1;
      }

      if (this.props.vertical === true) {
        if (swipeAngle >= 35 && swipeAngle <= 135) {
          return 1;
        } else {
          return -1;
        }
      }

      return 0;
    }
  }, {
    key: 'autoplayIterator',
    value: function autoplayIterator() {
      if (this.props.wrapAround) {
        return this.nextSlide();
      }

      if (this.state.currentSlide !== this.state.slideCount - this.state.slidesToShow) {
        this.nextSlide();
      } else {
        this.stopAutoplay();
      }
    }
  }, {
    key: 'startAutoplay',
    value: function startAutoplay() {
      this.autoplayID = setInterval(this.autoplayIterator, this.props.autoplayInterval);
    }
  }, {
    key: 'resetAutoplay',
    value: function resetAutoplay() {
      if (this.props.autoplay && !this.autoplayPaused) {
        this.stopAutoplay();
        this.startAutoplay();
      }
    }
  }, {
    key: 'stopAutoplay',
    value: function stopAutoplay() {
      this.autoplayID && clearInterval(this.autoplayID);
    }

    // Action Methods

  }, {
    key: 'animateSlide',


    // Animation

    value: function animateSlide(easing, duration, endValue, callback) {
      this.tweenState(this.props.vertical ? 'top' : 'left', {
        easing: easing || easingTypes[this.props.easing],
        duration: duration || this.props.speed,
        endValue: endValue || this.getTargetLeft(),
        onEnd: callback || null
      });
    }
  }, {
    key: 'getTargetLeft',
    value: function getTargetLeft(touchOffset, slide) {
      var offset;
      var target = slide || this.state.currentSlide;

      switch (this.props.cellAlign) {
        case 'left':
          {
            offset = 0;
            offset -= this.props.cellSpacing * target;
            break;
          }
        case 'center':
          {
            offset = (this.state.frameWidth - this.state.slideWidth) / 2;
            offset -= this.props.cellSpacing * target;
            break;
          }
        case 'right':
          {
            offset = this.state.frameWidth - this.state.slideWidth;
            offset -= this.props.cellSpacing * target;
            break;
          }
      }

      var left = this.state.slideWidth * target;

      var lastSlide = this.state.currentSlide > 0 && target + this.state.slidesToScroll >= this.state.slideCount;

      if (lastSlide && this.props.slideWidth !== 1 && !this.props.wrapAround && this.props.slidesToScroll === 'auto') {
        left = this.state.slideWidth * this.state.slideCount - this.state.frameWidth;
        offset = 0;
        offset -= this.props.cellSpacing * (this.state.slideCount - 1);
      }

      offset -= touchOffset || 0;

      return (left - offset) * -1;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      if (ExecutionEnvironment.canUseDOM) {
        addEvent(window, 'resize', this.setDimensions.bind(this, null));
        addEvent(document, 'readystatechange', this.setDimensions.bind(this, null));
      }
    }
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', this.setDimensions.bind(this, null));
        removeEvent(document, 'readystatechange', this.setDimensions.bind(this, null));
      }
    }
  }, {
    key: 'formatChildren',
    value: function formatChildren(children) {
      var self = this;
      var positionValue = this.props.vertical ? this.getTweeningValue('top') : this.getTweeningValue('left');
      return React__default.Children.map(children, function (child, index) {
        return React__default.createElement(
          'li',
          { className: 'slider-slide', style: self.getSlideStyles(index, positionValue), key: index },
          child
        );
      });
    }
  }, {
    key: 'setInitialDimensions',
    value: function setInitialDimensions() {
      var self = this,
          slideWidth,
          frameHeight,
          slideHeight;

      slideWidth = this.props.vertical ? this.props.initialSlideHeight || 0 : this.props.initialSlideWidth || 0;
      slideHeight = this.props.initialSlideHeight ? this.props.initialSlideHeight * this.props.slidesToShow : 0;

      frameHeight = slideHeight + this.props.cellSpacing * (this.props.slidesToShow - 1);

      this.setState({
        slideHeight: slideHeight,
        frameWidth: this.props.vertical ? frameHeight : '100%',
        slideCount: React__default.Children.count(this.props.children),
        slideWidth: slideWidth
      }, function () {
        self.setLeft();
        self.setExternalData();
      });
    }
  }, {
    key: 'setDimensions',
    value: function setDimensions(props) {
      props = props || this.props;

      var self = this;
      var slideWidth, slidesToScroll, frame, frameWidth, frameHeight, slideHeight;

      slidesToScroll = props.slidesToScroll;
      frame = this.refs.frame;
      var slides = frame.childNodes[0].childNodes;

      if (props.vertical) {
        if (slides && slides.length) {
          slides[0].style.height = 'auto';
          slideHeight = slides[0].offsetHeight * props.slidesToShow;
        } else {
          slideHeight = 100;
        }
      } else {
        slideHeight = self.state.slideHeight || props.initialSlideHeight || 0;

        if (props.heightMode === 'max') {
          slideHeight = getTallestSlide(slideHeight, slides);
        }
      }

      if (typeof props.slideWidth !== 'number') {
        slideWidth = parseInt(props.slideWidth);
      } else {
        if (props.vertical) {
          slideWidth = slideHeight / props.slidesToShow * props.slideWidth;
        } else {
          slideWidth = frame.offsetWidth / props.slidesToShow * props.slideWidth;
        }
      }

      if (!props.vertical) {
        slideWidth -= props.cellSpacing * ((100 - 100 / props.slidesToShow) / 100);
      }

      frameHeight = slideHeight + props.cellSpacing * (props.slidesToShow - 1);
      frameWidth = props.vertical ? frameHeight : frame.offsetWidth;

      if (props.slidesToScroll === 'auto') {
        slidesToScroll = Math.floor(frameWidth / (slideWidth + props.cellSpacing));
      }

      this.setState({
        slideHeight: slideHeight,
        frameWidth: frameWidth,
        slideWidth: slideWidth,
        slidesToScroll: slidesToScroll,
        left: props.vertical ? 0 : this.getTargetLeft(),
        top: props.vertical ? this.getTargetLeft() : 0
      }, function () {
        self.setLeft();
      });
    }
  }, {
    key: 'setLeft',
    value: function setLeft() {
      this.setState({
        left: this.props.vertical ? 0 : this.getTargetLeft(),
        top: this.props.vertical ? this.getTargetLeft() : 0
      });
    }

    // Data

  }, {
    key: 'setExternalData',
    value: function setExternalData() {
      if (this.props.data) {
        this.props.data();
      }
    }

    // Styles

  }, {
    key: 'getListStyles',
    value: function getListStyles() {
      var listWidth = this.state.slideWidth * React__default.Children.count(this.props.children);
      var spacingOffset = this.props.cellSpacing * React__default.Children.count(this.props.children);
      var transform = 'translate3d(' + this.getTweeningValue('left') + 'px, ' + this.getTweeningValue('top') + 'px, 0)';
      return {
        transform: transform,
        WebkitTransform: transform,
        msTransform: 'translate(' + this.getTweeningValue('left') + 'px, ' + this.getTweeningValue('top') + 'px)',
        position: 'relative',
        display: 'block',
        margin: this.props.vertical ? this.props.cellSpacing / 2 * -1 + 'px 0px' : '0px ' + this.props.cellSpacing / 2 * -1 + 'px',
        padding: 0,
        height: this.props.vertical ? listWidth + spacingOffset : this.state.slideHeight,
        width: this.props.vertical ? 'auto' : listWidth + spacingOffset,
        cursor: this.state.dragging === true ? 'pointer' : 'inherit',
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box'
      };
    }
  }, {
    key: 'getFrameStyles',
    value: function getFrameStyles() {
      return {
        position: 'relative',
        display: 'block',
        overflow: this.props.frameOverflow,
        height: this.props.vertical ? this.state.frameWidth || 'initial' : 'auto',
        margin: this.props.framePadding,
        padding: 0,
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        msTransform: 'translate(0, 0)',
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box'
      };
    }
  }, {
    key: 'getSlideStyles',
    value: function getSlideStyles(index, positionValue) {
      var targetPosition = this.getSlideTargetPosition(index, positionValue);
      return {
        position: 'absolute',
        left: this.props.vertical ? 0 : targetPosition,
        top: this.props.vertical ? targetPosition : 0,
        display: this.props.vertical ? 'block' : 'inline-block',
        listStyleType: 'none',
        verticalAlign: 'top',
        width: this.props.vertical ? '100%' : this.state.slideWidth,
        height: 'auto',
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        marginLeft: this.props.vertical ? 'auto' : this.props.cellSpacing / 2,
        marginRight: this.props.vertical ? 'auto' : this.props.cellSpacing / 2,
        marginTop: this.props.vertical ? this.props.cellSpacing / 2 : 'auto',
        marginBottom: this.props.vertical ? this.props.cellSpacing / 2 : 'auto'
      };
    }
  }, {
    key: 'getSlideTargetPosition',
    value: function getSlideTargetPosition(index, positionValue) {
      var slidesToShow = this.state.frameWidth / this.state.slideWidth;
      var targetPosition = (this.state.slideWidth + this.props.cellSpacing) * index;
      var end = (this.state.slideWidth + this.props.cellSpacing) * slidesToShow * -1;

      if (this.props.wrapAround) {
        var slidesBefore = Math.ceil(positionValue / this.state.slideWidth);
        if (this.state.slideCount - slidesBefore <= index) {
          return (this.state.slideWidth + this.props.cellSpacing) * (this.state.slideCount - index) * -1;
        }

        var slidesAfter = Math.ceil((Math.abs(positionValue) - Math.abs(end)) / this.state.slideWidth);

        if (this.state.slideWidth !== 1) {
          slidesAfter = Math.ceil((Math.abs(positionValue) - this.state.slideWidth) / this.state.slideWidth);
        }

        if (index <= slidesAfter - 1) {
          return (this.state.slideWidth + this.props.cellSpacing) * (this.state.slideCount + index);
        }
      }

      return targetPosition;
    }
  }, {
    key: 'getSliderStyles',
    value: function getSliderStyles() {
      return {
        position: 'relative',
        display: 'block',
        width: this.props.width,
        height: 'auto',
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        visibility: this.state.slideWidth ? 'visible' : 'hidden'
      };
    }
  }, {
    key: 'getDecoratorStyles',
    value: function getDecoratorStyles(position) {
      switch (position) {
        case 'TopLeft':
          {
            return {
              position: 'absolute',
              top: 0,
              left: 0
            };
          }
        case 'TopCenter':
          {
            return {
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              WebkitTransform: 'translateX(-50%)',
              msTransform: 'translateX(-50%)'
            };
          }
        case 'TopRight':
          {
            return {
              position: 'absolute',
              top: 0,
              right: 0
            };
          }
        case 'CenterLeft':
          {
            return {
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              WebkitTransform: 'translateY(-50%)',
              msTransform: 'translateY(-50%)'
            };
          }
        case 'CenterCenter':
          {
            return {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              WebkitTransform: 'translate(-50%, -50%)',
              msTransform: 'translate(-50%, -50%)'
            };
          }
        case 'CenterRight':
          {
            return {
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              WebkitTransform: 'translateY(-50%)',
              msTransform: 'translateY(-50%)'
            };
          }
        case 'BottomLeft':
          {
            return {
              position: 'absolute',
              bottom: 0,
              left: 0
            };
          }
        case 'BottomCenter':
          {
            return {
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              WebkitTransform: 'translateX(-50%)',
              msTransform: 'translateX(-50%)'
            };
          }
        case 'BottomRight':
          {
            return {
              position: 'absolute',
              bottom: 0,
              right: 0
            };
          }
        default:
          {
            return {
              position: 'absolute',
              top: 0,
              left: 0
            };
          }
      }
    }
  }, {
    key: 'tweenState',
    value: function tweenState(path, _ref) {
      var _this2 = this;

      var easing = _ref.easing,
          duration = _ref.duration,
          delay = _ref.delay,
          beginValue = _ref.beginValue,
          endValue = _ref.endValue,
          onEnd = _ref.onEnd,
          configSB = _ref.stackBehavior;

      this.setState(function (state) {
        var cursor = state;
        var stateName = void 0,
            pathHash = void 0;
        // see comment below on pash hash

        if (typeof path === 'string') {
          stateName = path;
          pathHash = path;
        } else {
          for (var i = 0; i < path.length - 1; i++) {
            cursor = cursor[path[i]];
          }

          stateName = path[path.length - 1];
          pathHash = path.join('|');
        }

        // see the reasoning for these defaults at the top of file
        var newConfig = {
          easing: easing || DEFAULT_EASING,
          duration: duration == null ? DEFAULT_DURATION : duration,
          delay: delay == null ? DEFAULT_DELAY : delay,
          beginValue: beginValue == null ? cursor[stateName] : beginValue,
          endValue: endValue,
          onEnd: onEnd,
          stackBehavior: configSB || DEFAULT_STACK_BEHAVIOR
        };

        var newTweenQueue = state.tweenQueue;
        if (newConfig.stackBehavior === stackBehavior.DESTRUCTIVE) {
          newTweenQueue = state.tweenQueue.filter(function (item) {
            return item.pathHash !== pathHash;
          });
        }

        // we store path hash, so that during value retrieval we can use hash
        // comparison to find the path. See the kind of shitty thing you have to
        // do when you don't have value comparison for collections?
        newTweenQueue.push({
          pathHash: pathHash,
          config: newConfig,
          initTime: Date.now() + newConfig.delay
        });

        // sorry for mutating. For perf reasons we don't want to deep clone.
        // guys, can we please all start using persistent collections so that
        // we can stop worrying about nonesense like this
        cursor[stateName] = newConfig.endValue;
        if (newTweenQueue.length === 1) {
          _this2._rafID = requestAnimationFrame(_this2._rafCb.bind(_this2));
        }

        // this will also include the above mutated update
        return {
          tweenQueue: newTweenQueue
        };
      });
    }
  }, {
    key: 'getTweeningValue',
    value: function getTweeningValue(path) {
      var state = this.state;
      var tweeningValue = void 0,
          pathHash = void 0;

      if (typeof path === 'string') {
        tweeningValue = state[path];
        pathHash = path;
      } else {
        tweeningValue = state;
        for (var i = 0; i < path.length; i++) {
          tweeningValue = tweeningValue[path[i]];
        }
        pathHash = path.join('|');
      }

      var now = Date.now();

      for (var _i = 0; _i < state.tweenQueue.length; _i++) {
        var _state$tweenQueue$_i = state.tweenQueue[_i],
            itemPathHash = _state$tweenQueue$_i.pathHash,
            initTime = _state$tweenQueue$_i.initTime,
            config = _state$tweenQueue$_i.config;

        if (itemPathHash !== pathHash) {
          continue;
        }

        var progressTime = now - initTime > config.duration ? config.duration : Math.max(0, now - initTime);
        // `now - initTime` can be negative if initTime is scheduled in the
        // future by a delay. In this case we take 0

        // if duration is 0, consider that as jumping to endValue directly. This
        // is needed because the easing functino might have undefined behavior for
        // duration = 0
        var easeValue = config.duration === 0 ? config.endValue : config.easing(progressTime, config.beginValue, config.endValue, config.duration);
        var contrib = easeValue - config.endValue;
        tweeningValue += contrib;
      }

      return tweeningValue;
    }
  }, {
    key: '_rafCb',
    value: function _rafCb() {
      var state = this.state;
      if (state.tweenQueue.length === 0) {
        return;
      }

      var now = Date.now();
      var newTweenQueue = [];

      for (var i = 0; i < state.tweenQueue.length; i++) {
        var item = state.tweenQueue[i];
        var initTime = item.initTime,
            config = item.config;

        if (now - initTime < config.duration) {
          newTweenQueue.push(item);
        } else {
          config.onEnd && config.onEnd();
        }
      }

      // onEnd might trigger a parent callback that removes this component
      // -1 means we've canceled it in componentWillUnmount
      if (this._rafID === -1) {
        return;
      }

      this.setState({
        tweenQueue: newTweenQueue
      });

      this._rafID = requestAnimationFrame(this._rafCb.bind(this));
    }
  }]);
  return Carousel;
}(React.Component);

Carousel.propTypes = {
  afterSlide: PropTypes.func,
  autoplay: PropTypes.bool,
  autoplayInterval: PropTypes.number,
  beforeSlide: PropTypes.func,
  cellAlign: PropTypes.oneOf(['left', 'center', 'right']),
  cellSpacing: PropTypes.number,
  data: PropTypes.func,
  decorators: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.func,
    position: PropTypes.oneOf(['TopLeft', 'TopCenter', 'TopRight', 'CenterLeft', 'CenterCenter', 'CenterRight', 'BottomLeft', 'BottomCenter', 'BottomRight']),
    style: PropTypes.object
  })),
  dragging: PropTypes.bool,
  easing: PropTypes.string,
  edgeEasing: PropTypes.string,
  framePadding: PropTypes.string,
  frameOverflow: PropTypes.string,
  heightMode: React__default.PropTypes.oneOf(['max', 'adaptive']).isRequired,
  initialSlideHeight: PropTypes.number,
  initialSlideWidth: PropTypes.number,
  slideIndex: PropTypes.number,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  slideWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  speed: PropTypes.number,
  swiping: PropTypes.bool,
  vertical: PropTypes.bool,
  width: PropTypes.string,
  wrapAround: PropTypes.bool
};

Carousel.defaultProps = {
  afterSlide: function afterSlide() {/* default */},
  autoplay: false,
  autoplayInterval: 3000,
  beforeSlide: function beforeSlide() {/* default */},
  cellAlign: 'left',
  cellSpacing: 0,
  data: function data() {/* default */},
  decorators: DefaultDecorators,
  dragging: true,
  easing: 'easeOutCirc',
  edgeEasing: 'easeOutElastic',
  framePadding: '0px',
  frameOverflow: 'hidden',
  heightMode: 'max',
  slideIndex: 0,
  slidesToScroll: 1,
  slidesToShow: 1,
  slideWidth: 1,
  speed: 500,
  swiping: true,
  vertical: false,
  width: '100%',
  wrapAround: false
};

return Carousel;

})));
