import toJson from 'enzyme-to-json'
import * as enzyme from 'enzyme'
import * as React from 'react'
import { expect } from 'chai'

global.expect = expect
global.React = React
global.enzyme = enzyme
global.mount = enzyme.mount
global.shallow = enzyme.shallow
global.render = enzyme.render
global.snapshot = toJson
