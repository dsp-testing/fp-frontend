import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import CreateNewBehandlingMenuItem from './CreateNewBehandlingMenuItem';

describe('<CreateNewBehandlingMenuItem>', () => {
  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<CreateNewBehandlingMenuItem
      saksnummer={23}
      submitNyForstegangsBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      opprettNyForstegangsBehandlingEnabled
      push={sinon.spy()}
    />);

    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const wrapper = shallow(<CreateNewBehandlingMenuItem
      saksnummer={23}
      submitNyForstegangsBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      opprettNyForstegangsBehandlingEnabled
      push={sinon.spy()}
    />);

    const button = wrapper.find('MenuButton');
    expect(button).has.length(1);
    expect(button.prop('onMouseDown')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('mousedown');

    expect(wrapper.state('showModal')).is.true;
  });
});
