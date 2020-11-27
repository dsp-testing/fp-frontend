import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import { Arbeidsforhold } from '@fpsak-frontend/types';

import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';

describe('<PersonNyttEllerErstattArbeidsforholdPanel>', () => {
  const arbeidsgiverOpplysningerPerId = {
    123456789: {
      erPrivatPerson: false,
      identifikator: '123456789',
      navn: 'Svendsen Eksos',
    },
  };

  it('skal vise dropdown med tidligere arbeidsforhold når en har valgt å erstatte gammelt med nytt', () => {
    const wrapper = shallowWithIntl(<PersonNyttEllerErstattArbeidsforholdPanel.WrappedComponent
      intl={intlMock}
      readOnly
      isErstattArbeidsforhold
      arbeidsforholdList={[{
        id: '1',
        arbeidsgiverReferanse: '123456789',
        arbeidsforholdId: '1234-1232',
        fomDato: '2019-10-10',
      }] as Arbeidsforhold[]}
      formName="form"
      behandlingId={1}
      behandlingVersjon={1}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />);

    const select = wrapper.find(SelectField);
    expect(select).has.length(1);
    expect(select.prop('selectValues').map((v: any) => v.props.children)).to.eql(['Svendsen Eksos(123456789)...1232']);
  });

  it('skal ikke vise dropdown når en ikke har valgt å erstatte gammelt med nytt', () => {
    const wrapper = shallowWithIntl(<PersonNyttEllerErstattArbeidsforholdPanel.WrappedComponent
      intl={intlMock}
      readOnly
      isErstattArbeidsforhold={false}
      arbeidsforholdList={[{
        id: '1',
        arbeidsgiverReferanse: '123456789',
        arbeidsforholdId: '1234-1232',
        fomDato: '2019-10-10',
      }] as Arbeidsforhold[]}
      formName="form"
      behandlingId={1}
      behandlingVersjon={1}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />);
    expect(wrapper.find(SelectField)).has.length(0);
  });
});
