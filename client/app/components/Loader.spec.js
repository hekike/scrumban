import React from 'react'
import { shallow } from 'reagent'
import { expect } from 'chai'

import Loader from './Loader'

describe('<Loader />', () => {
  it('should render an `.sk-child`', () => {
    const wrapper = shallow(<Loader />)
    expect(wrapper.find('.sk-child')).to.have.length(2)
  })
})
