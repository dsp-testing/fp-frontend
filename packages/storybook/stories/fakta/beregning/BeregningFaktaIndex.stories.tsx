import React from 'react';
import { action } from '@storybook/addon-actions';

import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import {
  Kodeverk, Behandling, Beregningsgrunnlag, BeregningAktivitet, FaktaOmBeregning, AndelForFaktaOmBeregning, FaktaOmBeregningAndel,
} from '@fpsak-frontend/types';

import alleKodeverkMock from '../../mocks/alleKodeverk.json';
import { beregningsgrunnlag as bgMedArbeidOgDagpenger, aksjonspunkt as aksjonspunktArbeidOgDagpenger } from './scenario/ArbeidMedDagpengerIOpptjeningsperioden';

const behandling = {
  uuid: '1',
  versjon: 1,
} as Behandling;

const {
  VURDER_MOTTAR_YTELSE,
  VURDER_BESTEBEREGNING,
  VURDER_LONNSENDRING,
  VURDER_NYOPPSTARTET_FL,
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
  VURDER_MILITÆR_SIVILTJENESTE,
  VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
  VURDER_ETTERLONN_SLUTTPAKKE,
  FASTSETT_BG_KUN_YTELSE,
  VURDER_SN_NY_I_ARBEIDSLIVET,
} = faktaOmBeregningTilfelle;

const lagBeregningsgrunnlagAvklarAktiviteter = (
  aktiviteter: BeregningAktivitet[],
): Beregningsgrunnlag => ({
  faktaOmBeregning: {
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01.01.2020',
          aktiviteter,
        },
      ],
    },
    andelerForFaktaOmBeregning: [],
  },
} as Beregningsgrunnlag);

const lagBeregningsgrunnlag = (
  andeler: FaktaOmBeregningAndel[],
  faktaOmBeregning: FaktaOmBeregning,
): Beregningsgrunnlag => ({
  skjaeringstidspunktBeregning: null,
  dekningsgrad: null,
  grunnbeløp: null,
  erOverstyrtInntekt: null,
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map((andel) => (
        {
          andelsnr: andel.andelsnr,
          aktivitetStatus: andel.aktivitetStatus,
          inntektskategori: andel.inntektskategori,
        }
      )),
    },
  ],
  faktaOmBeregning,
} as Beregningsgrunnlag);

const mapTilKodeliste = (arrayOfCodes: string[]): Kodeverk[] => arrayOfCodes.map((kode) => ({ kode, kodeverk: '' }));

const lagAndel = (andelsnr: number, aktivitetStatus: string, inntektskategori: string): FaktaOmBeregningAndel => (
  {
    andelsnr,
    aktivitetStatus: {
      kode: aktivitetStatus,
      kodeverk: 'AKTIVITET_STATUS',
    },
    inntektskategori: {
      kode: inntektskategori,
      kodeverk: 'INNTEKTSKATEGORI',
    },
  }
);

const standardFaktaArbeidstakerAndel = {
  ...lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften',
    arbeidsgiverId: '12345678',
    arbeidsgiverIdent: '12345678',
    startdato: '01.01.2019',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const standardFaktaArbeidstakerAndel2 = {
  ...lagAndel(4, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften2',
    arbeidsgiverId: '12345679',
    arbeidsgiverIdent: '12345679',
    startdato: '01.01.2019',
    opphoersdato: '01.01.2020',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const tidsbegrensetFaktaArbeidstakerAndel = {
  ...lagAndel(6, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften3',
    arbeidsgiverId: '12345671',
    arbeidsgiverIdent: '12345671',
    startdato: '01.09.2019',
    opphoersdato: '01.01.2020',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const etterlønnSluttpakkeFaktaArbeidstakerAndel = {
  ...lagAndel(7, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften4',
    arbeidsgiverId: '795349533',
    arbeidsgiverIdent: '795349533',
    startdato: '01.09.2019',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ETTERLONN_SLUTTPAKKE, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const standardFaktaDagpengerAndel = {
  ...lagAndel(3, aktivitetStatuser.DAGPENGER, inntektskategorier.DAGPENGER),
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaFrilansAndel = {
  ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaMilitærAndel = {
  ...lagAndel(5, aktivitetStatuser.MILITAER_ELLER_SIVIL, inntektskategorier.ARBEIDSTAKER),
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaYtelseAndel = {
  ...lagAndel(8, aktivitetStatuser.KUN_YTELSE, inntektskategorier.UDEFINERT),
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaNæringAndel = {
  ...lagAndel(9, aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, inntektskategorier.SELVSTENDIG_NÆRINGSDRIVENDE),
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaAAPAndel = {
  ...lagAndel(10, aktivitetStatuser.ARBEIDSAVKLARINGSPENGER, inntektskategorier.ARBEIDSAVKLARINGSPENGER),
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-beregning',
  component: BeregningFaktaIndex,
};

const agOpplysninger = {
  12345678: {
    navn: 'Bedriften',
    identifikator: '12345678',
    erPrivatPerson: false,
  },
  12345679: {
    navn: 'Bedriften2',
    identifikator: '12345679',
    erPrivatPerson: false,
  },
  12345671: {
    navn: 'Bedriften3',
    identifikator: '12345671',
    erPrivatPerson: false,
  },
  795349533: {
    navn: 'Bedriften4',
    identifikator: '795349533',
    erPrivatPerson: false,
  },
  910909088: {
    navn: 'BEDRIFT AS',
    identifikator: '910909088',
    erPrivatPerson: false,
  },
};

export const ArbeidOgDagpenger = () => (
  <BeregningFaktaIndex
    behandling={behandling}
    beregningsgrunnlag={bgMedArbeidOgDagpenger}
    aksjonspunkter={aksjonspunktArbeidOgDagpenger}
    erOverstyrer
    alleKodeverk={alleKodeverkMock as any}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
    }}
    submitCallback={action('button-click') as (data: any) => Promise<any>}
    readOnly={false}
    harApneAksjonspunkter
    submittable
    arbeidsgiverOpplysningerPerId={agOpplysninger}
    setFormData={() => undefined}
  />
);

export const AvklarAktiviteterFullAAPOgAndreAktiviteter = () => {
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
  ];
  const beregningsgrunnlag = lagBeregningsgrunnlagAvklarAktiviteter(aktiviteter);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const AvklartAktiviteterMedAksjonspunktIFaktaAvklaring = () => {
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
  ];
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  } as FaktaOmBeregningAndel;
  const aapBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaAAPAndel.andelsnr,
    aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
    inntektskategori: standardFaktaAAPAndel.inntektskategori,
  } as FaktaOmBeregningAndel;
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    aapBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaAAPAndel,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverIdent: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsgiverIdent,
    },
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
    refusjonskravSomKommerForSentListe,
    andelerForFaktaOmBeregning,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
          kodeverk: 'test',
        },
        begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const FrilansOgArbeidsforholdMedLønnendringOgNyoppstartet = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansInntektPrMnd: 20000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_LONNSENDRING, VURDER_NYOPPSTARTET_FL, VURDER_MOTTAR_YTELSE]),
    arbeidsforholdMedLønnsendringUtenIM: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const DagpengerOgArbeidstakerMedVurderingAvBesteberegning = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const dagpengerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaDagpengerAndel.andelsnr,
    aktivitetStatus: {
      kode: standardFaktaDagpengerAndel.aktivitetStatus ? standardFaktaDagpengerAndel.aktivitetStatus.kode : '',
      kodeverk: 'AKTIVITET_STATUS',
    },
    inntektskategori: {
      kode: standardFaktaDagpengerAndel.inntektskategori ? standardFaktaDagpengerAndel.inntektskategori.kode : '',
      kodeverk: 'INNTEKTSKATEGORI',
    },
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    dagpengerBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaDagpengerAndel,
  ];
  const vurderBesteberegning = {
    andeler: [standardFaktaDagpengerAndel, standardFaktaArbeidstakerAndel],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_BESTEBEREGNING]),
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const KunArbeidstakerMedVurderingAvBesteberegning = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const vurderBesteberegning = {
    andeler: [standardFaktaArbeidstakerAndel2, standardFaktaArbeidstakerAndel],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_BESTEBEREGNING]),
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const KunArbeidstakerMedVurderingSentRefusjonskrav = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverIdent: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsgiverIdent,
    },
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
    refusjonskravSomKommerForSentListe,
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const FrilansOgArbeidsforholdISammeOrganisasjon = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: standardFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE]),
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const VurderingAvMilitær = () => {
  const arbeidstakerMilitærAndel = {
    andelsnr: standardFaktaMilitærAndel.andelsnr,
    aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
    inntektskategori: standardFaktaMilitærAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerMilitærAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaMilitærAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_MILITÆR_SIVILTJENESTE]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const FrilansOgTidsbegrensetArbeidsforholdISammeOrganisasjon = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  } as AndelForFaktaOmBeregning;
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    tidsbegrensetFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE, VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
    kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const KunTidsbegrensetArbeidsforhold = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    tidsbegrensetFaktaArbeidstakerAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
    kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
    andelerForFaktaOmBeregning,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const VurderingAvEtterlønnSluttpakke = () => {
  const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
    andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const andeler = [
    etterlønnSluttpakkeBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    etterlønnSluttpakkeFaktaArbeidstakerAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_ETTERLONN_SLUTTPAKKE]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const FastsettingAvBeregningsgrunnlagForKunYtelse = () => {
  const beregningsgrunnlagYtelseAndel = {
    andelsnr: standardFaktaYtelseAndel.andelsnr,
    aktivitetStatus: standardFaktaYtelseAndel.aktivitetStatus,
    inntektskategori: standardFaktaYtelseAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagYtelseAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaYtelseAndel,
  ];
  const kunYtelse = {
    fodendeKvinneMedDP: false,
    andeler,
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([FASTSETT_BG_KUN_YTELSE]),
    andelerForFaktaOmBeregning,
    kunYtelse,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const SelvstendigNæringNyIArbeidslivet = () => {
  const beregningsgrunnlagNæringAndel = {
    andelsnr: standardFaktaNæringAndel.andelsnr,
    aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
    inntektskategori: standardFaktaNæringAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagNæringAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaNæringAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_SN_NY_I_ARBEIDSLIVET]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const KombinasjonstestForFaktapanel = () => {
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const arbeidsAktivitet2 = {
    ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const tidsbegrensetarbeidsAktivitet = {
    ...tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const næringAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.NARING, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const etterlonnSluttpakkeAktivitet = {
    ...etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const frilansAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.FRILANS, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const militærAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.MILITAR_ELLER_SIVILTJENESTE, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
    arbeidsAktivitet2,
    næringAktivitet,
    tidsbegrensetarbeidsAktivitet,
    etterlonnSluttpakkeAktivitet,
    frilansAktivitet,
    militærAktivitet,
  ];
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
    arbeidsforhold: standardFaktaArbeidstakerAndel2.arbeidsforhold,

  };
  const tidsbegrensetarbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    lagtTilAvSaksbehandler: false,
  };
  const beregningsgrunnlagNæringAndel = {
    andelsnr: standardFaktaNæringAndel.andelsnr,
    aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
    inntektskategori: standardFaktaNæringAndel.inntektskategori,
  };
  const aapBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaAAPAndel.andelsnr,
    aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
    inntektskategori: standardFaktaAAPAndel.inntektskategori,
  };
  const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
    andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const militærBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaMilitærAndel.andelsnr,
    aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
    inntektskategori: standardFaktaMilitærAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
    tidsbegrensetarbeidstakerBeregningsgrunnlagAndel,
    beregningsgrunnlagNæringAndel,
    aapBeregningsgrunnlagAndel,
    etterlønnSluttpakkeBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
    militærBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
    tidsbegrensetFaktaArbeidstakerAndel,
    standardFaktaNæringAndel,
    standardFaktaAAPAndel,
    etterlønnSluttpakkeFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
    standardFaktaMilitærAndel,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverIdent: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsgiverIdent,
    },
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [standardFaktaArbeidstakerAndel2],
  };
  const vurderBesteberegning = {
    andeler: andelerForFaktaOmBeregning,
  };

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT, VURDER_SN_NY_I_ARBEIDSLIVET, VURDER_NYOPPSTARTET_FL,
      VURDER_ETTERLONN_SLUTTPAKKE, VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, VURDER_BESTEBEREGNING, VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE,
      VURDER_MILITÆR_SIVILTJENESTE]),
    refusjonskravSomKommerForSentListe,
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel2],
    kortvarigeArbeidsforhold: [tidsbegrensetarbeidstakerBeregningsgrunnlagAndel],
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
    vurderMottarYtelse,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
          kodeverk: 'test',
        },
        begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const OverstyringAvInntekt = () => {
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const arbeidsAktivitet2 = {
    ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    arbeidsAktivitet,
    arbeidsAktivitet2,
  ];

  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [],
    andelerForFaktaOmBeregning,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};

export const VurderKunYtelseBesteberegning = () => {
  const beregningsgrunnlagYtelseAndel = {
    andelsnr: standardFaktaYtelseAndel.andelsnr,
    aktivitetStatus: standardFaktaYtelseAndel.aktivitetStatus,
    inntektskategori: standardFaktaYtelseAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagYtelseAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaYtelseAndel,
  ];
  const kunYtelse = {
    fodendeKvinneMedDP: true,
    andeler,
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([FASTSETT_BG_KUN_YTELSE]),
    andelerForFaktaOmBeregning,
    kunYtelse,
  } as FaktaOmBeregning;
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
          kodeverk: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'test',
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverkMock as any}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: merknaderFraBeslutter,
      }}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      readOnly={false}
      harApneAksjonspunkter
      submittable
      arbeidsgiverOpplysningerPerId={agOpplysninger}
      setFormData={() => undefined}
    />
  );
};
