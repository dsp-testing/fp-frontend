import { Beregningsgrunnlag, BeregningsgrunnlagAndel } from '@fpsak-frontend/types';

export const beregningsgrunnlag = {
  skjaeringstidspunktBeregning: '2020-01-13',
  skjæringstidspunkt: '2020-01-13',
  aktivitetStatus: [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }],
  beregningsgrunnlagPeriode: [{
    beregningsgrunnlagPeriodeFom: '2020-01-13',
    beregnetPrAar: 0,
    bruttoPrAar: 0,
    bruttoInkludertBortfaltNaturalytelsePrAar: 0,
    avkortetPrAar: 0,
    periodeAarsaker: [],
    beregningsgrunnlagPrStatusOgAndel: [{
      aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      beregningsperiodeFom: '2019-10-01',
      beregningsperiodeTom: '2019-12-31',
      andelsnr: 1,
      inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
      arbeidsforhold: {
        arbeidsgiverNavn: 'BEDRIFT AS',
        arbeidsgiverId: '910909088',
        arbeidsgiverIdent: '910909088',
        startdato: '2019-02-03',
        opphoersdato: '2020-02-03',
        arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
        belopFraInntektsmeldingPrMnd: 30000.00,
        organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
      },
      fastsattAvSaksbehandler: false,
      lagtTilAvSaksbehandler: false,
      belopPrMndEtterAOrdningen: 10000.0000000000,
      belopPrAarEtterAOrdningen: 120000.000000000000,
      erTilkommetAndel: false,
      skalFastsetteGrunnlag: false,
    } as BeregningsgrunnlagAndel],
  }],
  sammenligningsgrunnlagPrStatus: [],
  ledetekstBrutto: 'Brutto beregningsgrunnlag',
  ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
  ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
  halvG: 49929.0,
  grunnbeløp: 99858,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: [{ kode: 'VURDER_BESTEBEREGNING', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' }],
    avklarAktiviteter: {
      skjæringstidspunktOpptjening: '2020-01-13',
      aktiviteterTomDatoMapping: [{
        tom: '2020-01-13',
        aktiviteter: [{
          arbeidsgiverIdent: '910909088',
          fom: '2019-02-03',
          tom: '2020-02-03',
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
        }],
      }, {
        tom: '2019-11-12',
        aktiviteter: [{
          fom: '2019-02-03',
          tom: '2019-11-11',
          arbeidsforholdType: { kode: 'DAGPENGER', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
        }],
      }],
    },
    vurderBesteberegning: { skalHaBesteberegning: undefined },
    andelerForFaktaOmBeregning: [{
      belopReadOnly: 30000.00,
      inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
      aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      visningsnavn: 'BEDRIFT AS (910909088)',
      arbeidsforhold: {
        arbeidsgiverNavn: 'BEDRIFT AS',
        arbeidsgiverId: '910909088',
        arbeidsgiverIdent: '910909088',
        startdato: '2019-02-03',
        opphoersdato: '2020-02-03',
        arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
        belopFraInntektsmeldingPrMnd: 30000.00,
        organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
      },
      andelsnr: 1,
      skalKunneEndreAktivitet: false,
      lagtTilAvSaksbehandler: false,
    }],
    vurderMilitaer: { harMilitaer: undefined },
  },
  hjemmel: { kode: '-', kodeverk: 'BG_HJEMMEL' },
  årsinntektVisningstall: 0,
  dekningsgrad: 100,
  erOverstyrtInntekt: false,
} as Beregningsgrunnlag;

export const aksjonspunkt = [
  {
    definisjon: { kode: '5058', kodeverk: 'AKSJONSPUNKT_DEF' },
    status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
    toTrinnsBehandling: true,
    aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
    kanLoses: true,
    erAktivt: true,
  }];
