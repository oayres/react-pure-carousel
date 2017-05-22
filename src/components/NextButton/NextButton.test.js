import NextButton from './NextButton'

describe('The NextButton component', () => {
  const minProps = {
    goToSlide: jest.fn()
  }

  it('renders without exploding', () => {
    const wrapper = shallow(<NextButton {...minProps} />)
    expect(wrapper.length).toEqual(1)
    expect(snapshot(wrapper)).toMatchSnapshot()
  })
})
