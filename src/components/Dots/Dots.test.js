import Dots from './Dots'

describe('The Dots component', () => {
  const minProps = {
    goToSlide: jest.fn()
  }

  it('renders without exploding', () => {
    const wrapper = shallow(<Dots {...minProps} />)
    expect(wrapper.length).toEqual(1)
    expect(snapshot(wrapper)).toMatchSnapshot()
  })
})
