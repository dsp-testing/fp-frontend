import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  AlleKodeverk,
  Beregningsgrunnlag,
  BeregningsgrunnlagAndel,
  BeregningsgrunnlagArbeidsforhold,
  FaktaOmBeregning,
  FaktaOmBeregningAndel,
} from '@fpsak-frontend/types';
import {
  FaktaForATFLOgSNPanelImpl, transformValues, transformValuesFaktaForATFLOgSN,
} from './FaktaForATFLOgSNPanel';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import { lonnsendringField } from './vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { besteberegningField } from './besteberegningFodendeKvinne/VurderBesteberegningForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';
import { INNTEKT_FIELD_ARRAY_NAME } from './BgFaktaUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const aksjonspunkter = [{
  definisjon:
  {
    kode: VURDER_FAKTA_FOR_ATFL_SN,
    kodeverk: 'test',
  },
  status: { kode: 'OPPR', kodeverk: 'test' },
  kanLoses: true,
  erAktivt: true,
}];

const lagBeregningsgrunnlag = (andeler) => ({
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map((andel) => (
        {
          andelsnr: andel.andelsnr,
          aktivitetStatus: { kode: andel.aktivitetStatus },
          inntektskategori: { kode: andel.inntektskategori },
          erNyoppstartet: andel.erNyoppstartet,
        }
      )),
    },
  ],
} as Beregningsgrunnlag);

describe('<FaktaForATFLOgSNPanel>', () => {
  it('skal vise TidsbegrensetArbeidsforholdForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      isAksjonspunktClosed={false}
      faktaOmBeregning={{} as FaktaOmBeregning}
      beregningsgrunnlag={{} as Beregningsgrunnlag}
      alleKodeverk={{} as AlleKodeverk}
      aksjonspunkter={aksjonspunkter}
      erOverstyrer={false}
      arbeidsgiverOpplysningerPerId={{}}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(TidsbegrensetArbeidsforholdForm);
    expect(tidsbegrensetArbeidsforhold).toHaveLength(1);
  });

  it('skal vise NyIArbeidslivetSNForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      isAksjonspunktClosed={false}
      faktaOmBeregning={{} as FaktaOmBeregning}
      beregningsgrunnlag={{} as Beregningsgrunnlag}
      alleKodeverk={{} as AlleKodeverk}
      aksjonspunkter={aksjonspunkter}
      erOverstyrer={false}
      arbeidsgiverOpplysningerPerId={{}}
    />);
    const nyIArbeidslivet = wrapper.find(NyIArbeidslivetSNForm);
    expect(nyIArbeidslivet).toHaveLength(1);
  });

  it('skal vise NyoppstartetFLForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      isAksjonspunktClosed={false}
      faktaOmBeregning={{} as FaktaOmBeregning}
      beregningsgrunnlag={{} as Beregningsgrunnlag}
      alleKodeverk={{} as AlleKodeverk}
      aksjonspunkter={aksjonspunkter}
      erOverstyrer={false}
      arbeidsgiverOpplysningerPerId={{}}
    />);
    const vurderATFL = wrapper.find(VurderOgFastsettATFL);
    expect(vurderATFL).toHaveLength(1);
  });

  it('skal kunne transform values for kun besteberegning', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    const andel1 = { andelsnr: 1, aktivitetStatus: { kode: 'ATFL', kodeverk: 'test' } } as BeregningsgrunnlagAndel;
    const andel2 = { andelsnr: 2, aktivitetStatus: { kode: 'SN', kodeverk: 'test' } } as BeregningsgrunnlagAndel;
    const faktaOmBeregning = {
      andelerForFaktaOmBeregning: [],
      faktaOmBeregningTilfeller: aktivePaneler.map((kode) => ({ kode, kodeverk: 'test' })),
      besteberegningAndeler: [andel1, andel2],
      vurderBesteberegning: { skalHaBesteberegning: true },
    };
    const beregningsgrunnlag = {
      skjaeringstidspunktBeregning: null,
      dekningsgrad: null,
      grunnbeløp: null,
      erOverstyrtInntekt: null,
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [andel1, andel2],
        },
      ],
    } as Beregningsgrunnlag;
    const values = {
      tilfeller: aktivePaneler,
      vurderMottarYtelse: undefined,
      faktaOmBeregning,
      beregningsgrunnlag,
    };
    values[besteberegningField] = true;
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      {
        fastsattBelop: '10 000', inntektskategori: 'ARBEIDSTAKER', andelsnr: andel1.andelsnr, kanRedigereInntekt: true,
      },
      {
        fastsattBelop: '20 000', inntektskategori: 'SELVSTENDIG_NÆRINGSDRIVENDE', andelsnr: andel2.andelsnr, kanRedigereInntekt: true,
      },
    ];
    const transformedValues = transformValuesFaktaForATFLOgSN(values);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller).toHaveLength(2);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller[1]).toEqual(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller[0]).toEqual(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe).toHaveLength(2);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[0].andelsnr).toEqual(andel1.andelsnr);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.fastsattBeløp).toEqual(10000);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.inntektskategori).toEqual('ARBEIDSTAKER');
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[1].andelsnr).toEqual(andel2.andelsnr);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.fastsattBeløp).toEqual(20000);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.inntektskategori).toEqual('SELVSTENDIG_NÆRINGSDRIVENDE');
  });

  it('skal kunne transform values nyoppstartet fl og lønnsendring', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const forholdMedAtOgFl = {
      andelsnr: 2,
      inntektskategori: {
        kode: 'Arbeidstaker',
        kodeverk: 'test',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      } as BeregningsgrunnlagArbeidsforhold,
    };

    const forholdMedLonnsendringUtenIM = {
      andelsnr: 2,
      inntektskategori: {
        kode: 'ARBEIDSTAKER',
        kodeverk: 'test',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      } as BeregningsgrunnlagArbeidsforhold,
    };

    const frilansAndel = {
      inntektskategori: {
        kode: 'Frilans',
        kodeverk: 'test',
      },
      arbeidsforhold: {
        startdato: '2018-01-01',
        opphoersdato: '2018-06-01',
      } as BeregningsgrunnlagArbeidsforhold,
      andelsnr: 1,
      arbeidsforholdType: {
        navn: 'Frilans',
        kodeverk: 'test',
      },
      aktivitetStatus: { kode: aktivitetStatus.FRILANSER, kodeverk: 'test' },
    } as FaktaOmBeregningAndel;

    const faktaOmBeregning = {
      andelerForFaktaOmBeregning: [],
      faktaOmBeregningTilfeller: aktivePaneler.map((kode) => ({ kode, kodeverk: 'test' })),
      arbeidsforholdMedLønnsendringUtenIM: [forholdMedLonnsendringUtenIM],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [forholdMedAtOgFl],
      frilansAndel,
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag([forholdMedLonnsendringUtenIM, frilansAndel]);
    const values = {
      tilfeller: aktivePaneler,
      vurderMottarYtelse: undefined,
      faktaOmBeregning,
      beregningsgrunnlag,
    };
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      {
        fastsattBelop: '10 000', inntektskategori: 'ARBEIDSTAKER', andelsnr: forholdMedLonnsendringUtenIM.andelsnr, kanRedigereInntekt: true,
      },
      {
        fastsattBelop: '20 000',
        inntektskategori: 'FRILANS',
        andelsnr: frilansAndel.andelsnr,
        aktivitetStatus: aktivitetStatus.FRILANSER,
        kanRedigereInntekt: true,
      },
    ];
    const transformedValues = transformValuesFaktaForATFLOgSN(values);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller).toHaveLength(4);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)).toEqual(true);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller
      .includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)).toEqual(true);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)).toEqual(true);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)).toEqual(true);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe).toHaveLength(1);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe[0].andelsnr).toEqual(2);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe[0].fastsattBeløp).toEqual(10000);
    expect(transformedValues.fakta.fastsettMaanedsinntektFL.maanedsinntekt).toEqual(20000);
  });

  it('skal transform values for nyIArbeidslivet om kun ny i arbeidslivet', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const vurderRefusjonTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      lonnsendringTransform,
      vurderRefusjonTransform)({}, {});
    expect(nyIArbTransform).toHaveProperty('callCount', 1);
    expect(kortvarigTransform).toHaveProperty('callCount', 0);
    expect(lonnsendringTransform).toHaveProperty('callCount', 0);
    expect(vurderRefusjonTransform).toHaveProperty('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet og kortvarig om kun ny i arbeidslivet og kortvarig', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const vurderRefusjonTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET, faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      lonnsendringTransform,
      vurderRefusjonTransform)({}, {});
    expect(nyIArbTransform).toHaveProperty('callCount', 1);
    expect(kortvarigTransform).toHaveProperty('callCount', 1);
    expect(lonnsendringTransform).toHaveProperty('callCount', 0);
    expect(vurderRefusjonTransform).toHaveProperty('callCount', 0);
  });
});
