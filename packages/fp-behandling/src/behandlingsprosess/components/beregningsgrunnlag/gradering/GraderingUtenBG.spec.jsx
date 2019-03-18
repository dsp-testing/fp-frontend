import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { FormattedMessage } from 'react-intl';
import { RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import { GraderingUtenBG as UnwrappedForm, buildInitialValues } from './GraderingUtenBG';

const mockAksjonspunktMedKodeOgStatus = (apKode, status) => ({
  definisjon: {
    kode: apKode,
  },
  status: {
    kode: status,
  },
  begrunnelse: 'begrunnelse',

});

const atAndelEn = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
    navn: 'Arbeidstaker',
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'arbeidsgiver',
    arbeidsgiverId: '123',
  },
  andelsnr: 1,
};

const atAndelTo = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
    navn: 'Arbeidstaker',
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'arbeidsgiver',
    arbeidsgiverId: '456',
  },
  andelsnr: 2,
};

const snAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    navn: 'Selvstendig næringsdrivende',
  },
  andelsnr: 3,
};

const flAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.FRILANSER,
    navn: 'Frilanser',
  },
  andelsnr: 4,
};

describe('<GraderingUtenBG>', () => {
  it('skal teste at komponent vises riktig gitt en liste arbeidsforhold', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      readOnly={false}
      andelerMedGraderingUtenBG={[atAndelEn, atAndelTo]}
      submitCallback={sinon.spy()}
      aksjonspunkt={mockAksjonspunktMedKodeOgStatus('5050', 'OPPR')}
      {...reduxFormPropsMock}
    />);
    const radioOption = wrapper.find(RadioOption);
    expect(radioOption).to.have.length(2);
    const textfield = wrapper.find(TextAreaField);
    expect(textfield).to.have.length(1);
    const button = wrapper.find(BehandlingspunktSubmitButton);
    expect(button).to.have.length(1);
    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    const formattedmsg = wrapper.find(FormattedMessage);
    expect(formattedmsg).to.have.length(2);
    expect(wrapper.find(FormattedMessage).at(1).prop('values')).to.eql({ arbeidsforholdTekst: 'arbeidsgiver (123) og arbeidsgiver (456)' });
    const element = wrapper.find(Element);
    expect(element).to.have.length(1);
  });

  it('skal teste at komponent vises riktig gitt en liste arbeidsforhold der et eller flere er sn / fl', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      readOnly={false}
      andelerMedGraderingUtenBG={[atAndelEn, snAndel, flAndel]}
      submitCallback={sinon.spy()}
      aksjonspunkt={mockAksjonspunktMedKodeOgStatus('5050', 'OPPR')}
      {...reduxFormPropsMock}
    />);
    const radioOption = wrapper.find(RadioOption);
    expect(radioOption).to.have.length(2);
    const textfield = wrapper.find(TextAreaField);
    expect(textfield).to.have.length(1);
    const button = wrapper.find(BehandlingspunktSubmitButton);
    expect(button).to.have.length(1);
    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    const formattedmsg = wrapper.find(FormattedMessage);
    expect(formattedmsg).to.have.length(2);
    expect(wrapper.find(FormattedMessage).at(1).prop('values')).to.eql({ arbeidsforholdTekst: 'arbeidsgiver (123), selvstendig næringsdrivende og frilanser' });
    const element = wrapper.find(Element);
    expect(element).to.have.length(1);
  });


  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunktet ikke finnes', () => {
    const expectedInitialValues = undefined;

    const actualInitialValues = buildInitialValues.resultFunc([], undefined);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunktet ikke før er løst finnes', () => {
    const expectedInitialValues = undefined;
    const actualInitialValues = buildInitialValues.resultFunc([], undefined);

    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom behandling er på vent', () => {
    const expectedInitialValues = {
      graderingUtenBGSettPaaVent: true,
      begrunnelse: 'begrunnelse',
    };
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus('5050', 'UTFO'), mockAksjonspunktMedKodeOgStatus('7019', 'OPPR')];

    const actualInitialValues = buildInitialValues.resultFunc(aksjonspunkter, venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom behandling ikke er på vent', () => {
    const expectedInitialValues = {
      graderingUtenBGSettPaaVent: false,
      begrunnelse: 'begrunnelse',
    };

    const actualInitialValues = buildInitialValues.resultFunc([mockAksjonspunktMedKodeOgStatus('5050', 'UTFO')], undefined);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });
});
