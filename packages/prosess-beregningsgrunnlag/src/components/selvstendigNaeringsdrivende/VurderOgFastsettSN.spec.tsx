import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@fpsak-frontend/types';
import VurderOgFastsettSN, { VurderOgFastsettSNImpl } from './VurderOgFastsettSN';
import VurderVarigEndretEllerNyoppstartetSN2,
{
  begrunnelseFieldname as vurderingBegrunnelse, varigEndringRadioname,
}
  from './VurderVarigEndretEllerNyoppstartetSN';
import FastsettSN2, { begrunnelseFieldname as fastsettingBegrunnelse, fastsettInntektFieldname } from './FastsettSN';
import messages from '../../../i18n/nb_NO.json';

const {
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
} = aksjonspunktCodes;

const mockAksjonspunktMedKodeOgStatus = (apKode: string, status: string, begrunnelse?: string): Aksjonspunkt => ({
  definisjon: {
    kode: apKode,
    kodeverk: 'test',
  },
  status: {
    kode: status,
    kodeverk: 'test',
  },
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

describe('<VurderOgFastsettSN>', () => {
  it('Skal vise korrekte komponenter når det er aksjonspunkt for å fastsette inntekt for bruker ny i arbeidslivet', () => {
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering={undefined}
      isAksjonspunktClosed={false}
      erNyArbLivet
      erVarigEndring
      erNyoppstartet={false}
      gjeldendeAksjonspunkter={[mockAksjonspunktMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, 'OPPR')]}
    />, messages);
    expect(wrapper.find(FastsettSN2)).toHaveLength(1);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).toHaveLength(0);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring uten at varig endring er bestemt', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering={undefined}
      isAksjonspunktClosed={false}
      gjeldendeAksjonspunkter={[vurderEndring]}
      erNyArbLivet={false}
      erVarigEndring
      erNyoppstartet={false}
    />, messages);
    expect(wrapper.find(FastsettSN2)).toHaveLength(0);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).toHaveLength(1);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring og det er vurdert at det ikke er varig endring', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering={false}
      isAksjonspunktClosed={false}
      erNyArbLivet={false}
      gjeldendeAksjonspunkter={[vurderEndring]}
      erVarigEndring
      erNyoppstartet={false}
    />, messages);
    expect(wrapper.find(FastsettSN2)).toHaveLength(0);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).toHaveLength(1);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring og det er vurdert at det er varig endring', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering
      isAksjonspunktClosed={false}
      erNyArbLivet={false}
      gjeldendeAksjonspunkter={[vurderEndring]}
      erVarigEndring
      erNyoppstartet={false}
    />, messages);
    expect(wrapper.find(FastsettSN2)).toHaveLength(1);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).toHaveLength(1);
  });

  it('Skal teste at transformValues setter korrekte values når det kun skal fastsettes inntekt for søker ny i arbeidslivet', () => {
    const snNyIArb = mockAksjonspunktMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, 'OPPR');
    const values = {
      [fastsettingBegrunnelse]: 'Ok.',
      [fastsettInntektFieldname]: '360 000',
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [snNyIArb]);
    const expectedTransformedValues = {
      kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      begrunnelse: 'Ok.',
      bruttoBeregningsgrunnlag: 360000,
    };
    expect(transformedValues).toEqual(expectedTransformedValues);
  });

  it('Skal teste at transformValues setter korrekte values når det er vurdert at det ikke er varig endret næring', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'OPPR');
    const values = {
      [vurderingBegrunnelse]: 'Ok.',
      [varigEndringRadioname]: false,
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [vurderEndring]);
    const expectedTransformedValues = {
      kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      begrunnelse: 'Ok.',
      erVarigEndretNaering: false,
      [fastsettInntektFieldname]: undefined,
    };
    expect(transformedValues).toEqual(expectedTransformedValues);
  });

  it('Skal teste at transformValues setter korrekte values når det er vurdert at det er varig endret næring og inntekt er fastsatt', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'OPPR');
    const values = {
      [vurderingBegrunnelse]: 'Ok varig endring.',
      [fastsettingBegrunnelse]: 'Ok fastsatt inntekt.',
      [varigEndringRadioname]: true,
      [fastsettInntektFieldname]: '650 000',
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [vurderEndring]);
    const expectedTransformedValues = {
      kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      begrunnelse: 'Ok varig endring.',
      erVarigEndretNaering: true,
      bruttoBeregningsgrunnlag: 650000,
    };
    expect(transformedValues).toEqual(expectedTransformedValues);
  });
});
