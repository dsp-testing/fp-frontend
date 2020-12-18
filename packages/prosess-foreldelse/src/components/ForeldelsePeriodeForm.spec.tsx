import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { RadioOption } from '@fpsak-frontend/form';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';

import { ForeldelsePeriodeFormImpl } from './ForeldelsePeriodeForm';
import ForeldelsesresultatActivity from '../types/foreldelsesresultatActivitytsType';

describe('<ForeldelsePeriodeForm>', () => {
  it('skal rendre komponent korrekt', () => {
    const periode = {} as ForeldelsesresultatActivity;
    const wrapper = shallow(
      <ForeldelsePeriodeFormImpl
        periode={periode}
        behandlingFormPrefix="form"
        skjulPeriode={sinon.spy()}
        readOnly={false}
        foreldelseVurderingTyper={[{
          kode: foreldelseVurderingType.IKKE_VURDERT,
          navn: 'IKKE_VURDERT',
          kodeverk: '',
        }, {
          kode: foreldelseVurderingType.FORELDET,
          navn: 'FORELDET',
          kodeverk: '',
        }, {
          kode: foreldelseVurderingType.IKKE_FORELDET,
          navn: 'IKKE_FORELDET',
          kodeverk: '',
        }, {
          kode: foreldelseVurderingType.TILLEGGSFRIST,
          navn: 'TILLEGGSFRIST',
          kodeverk: '',
        }]}
        setNestePeriode={sinon.spy()}
        setForrigePeriode={sinon.spy()}
        oppdaterSplittedePerioder={sinon.spy()}
        behandlingId={1}
        behandlingVersjon={2}
        beregnBelop={sinon.spy()}
        alleKodeverk={{}}
        oppdaterPeriode={sinon.spy()}
        {...reduxFormPropsMock}
        initialValues={{
          ...periode,
          foreldet: null,
        }}
        onSubmit={sinon.spy()}
      />,
    );

    const options = wrapper.find(RadioOption);
    expect(options).toHaveLength(4);
    expect(options.first().prop('value')).toEqual(foreldelseVurderingType.IKKE_VURDERT);
    expect(options.at(1).prop('value')).toEqual(foreldelseVurderingType.FORELDET);
    expect(options.at(2).prop('value')).toEqual(foreldelseVurderingType.IKKE_FORELDET);
    expect(options.last().prop('value')).toEqual(foreldelseVurderingType.TILLEGGSFRIST);
  });
});
