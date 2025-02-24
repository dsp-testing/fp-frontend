import React from 'react';
import { shallow } from 'enzyme';
import { ProcessMenu, ProcessMenuStepType } from '@navikt/fp-react-components';

import ProsessMeny from './ProsessMeny';

describe('<ProsessMeny>', () => {
  it('skal vise data i meny', () => {
    const wrapper = shallow(<ProsessMeny
      menyData={[{
        id: 'id',
        tekst: 'Dette er menylabel',
        erAktiv: true,
        harApentAksjonspunkt: true,
        harHentetInitData: true,
      }]}
      oppdaterProsessPanelIUrl={() => {}}
    />);

    const meny = wrapper.find(ProcessMenu);

    expect(meny).toHaveLength(1);
    expect(meny.props().steps).toEqual([{
      label: 'Dette er menylabel',
      isActive: true,
      isDisabled: false,
      isFinished: false,
      type: ProcessMenuStepType.warning,
    }]);
  });
});
