import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { RawIntlProvider } from 'react-intl';
import { Location } from 'history';

import { createIntl } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { skjermlenkeCodes } from '@fpsak-frontend/konstanter';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import {
  BehandlingAppKontekst, Kodeverk, AlleKodeverk, KlageVurdering, TotrinnskontrollSkjermlenkeContext, AlleKodeverkTilbakekreving, KodeverkMedNavn,
} from '@fpsak-frontend/types';
import { FatterVedtakAp } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import TotrinnskontrollBeslutterForm, { FormValues } from './components/TotrinnskontrollBeslutterForm';
import { AksjonspunktGodkjenningData } from './components/AksjonspunktGodkjenningFieldArray';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel';
import messages from '../i18n/nb_NO.json';

const intl = createIntl(messages);

const sorterteSkjermlenkeCodesForTilbakekreving = [
  skjermlenkeCodes.FAKTA_OM_FEILUTBETALING,
  skjermlenkeCodes.FORELDELSE,
  skjermlenkeCodes.TILBAKEKREVING,
  skjermlenkeCodes.VEDTAK,
];

const TOMT_KODEVERK = [] as KodeverkMedNavn[];

const getArsaker = (apData: AksjonspunktGodkjenningData): string[] => {
  const arsaker = [];
  if (apData.feilFakta) {
    arsaker.push(vurderPaNyttArsakType.FEIL_FAKTA);
  }
  if (apData.feilLov) {
    arsaker.push(vurderPaNyttArsakType.FEIL_LOV);
  }
  if (apData.feilRegel) {
    arsaker.push(vurderPaNyttArsakType.FEIL_REGEL);
  }
  if (apData.annet) {
    arsaker.push(vurderPaNyttArsakType.ANNET);
  }
  return arsaker;
};

const finnArbeidsforholdHandlingTyper = (alleKodeverk: AlleKodeverk | AlleKodeverkTilbakekreving) => (kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE in alleKodeverk
  ? (alleKodeverk as AlleKodeverk)[kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE] : TOMT_KODEVERK);
const finnFaktaOmBeregningTilfeller = (alleKodeverk: AlleKodeverk | AlleKodeverkTilbakekreving) => (kodeverkTyper.FAKTA_OM_BEREGNING_TILFELLE in alleKodeverk
  ? (alleKodeverk as AlleKodeverk)[kodeverkTyper.FAKTA_OM_BEREGNING_TILFELLE] : TOMT_KODEVERK);

interface OwnProps {
  behandling: BehandlingAppKontekst;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  location: Location;
  fagsakYtelseType: Kodeverk;
  behandlingKlageVurdering?: KlageVurdering;
  alleKodeverk: AlleKodeverk | AlleKodeverkTilbakekreving;
  readOnly: boolean;
  onSubmit: (data: {
    fatterVedtakAksjonspunktDto: {
      '@type': aksjonspunktCodes.FATTER_VEDTAK | aksjonspunktCodesTilbakekreving.FATTER_VEDTAK;
    } & FatterVedtakAp;
    erAlleAksjonspunktGodkjent: boolean;
  }) => Promise<void>;
  forhandsvisVedtaksbrev: () => void;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location | undefined;
  beslutterFormData?: any;
  setBeslutterForData: (data?: any) => void;
}

const TotrinnskontrollSakIndex: FunctionComponent<OwnProps> = ({
  behandling,
  totrinnskontrollSkjermlenkeContext,
  location,
  fagsakYtelseType,
  readOnly,
  onSubmit,
  forhandsvisVedtaksbrev,
  behandlingKlageVurdering,
  alleKodeverk,
  createLocationForSkjermlenke,
  beslutterFormData,
  setBeslutterForData,
}) => {
  const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandling.type.kode || BehandlingType.TILBAKEKREVING_REVURDERING === behandling.type.kode;

  const submitHandler = useCallback((values: FormValues) => {
    const aksjonspunktGodkjenningDtos = values.aksjonspunktGodkjenning
      .map((apData) => ({
        aksjonspunktKode: apData.aksjonspunktKode,
        godkjent: apData.totrinnskontrollGodkjent,
        begrunnelse: apData.besluttersBegrunnelse,
        arsaker: getArsaker(apData),
      }));

    const kode = erTilbakekreving ? aksjonspunktCodesTilbakekreving.FATTER_VEDTAK : aksjonspunktCodes.FATTER_VEDTAK;
    const fatterVedtakAksjonspunktDto = {
      '@type': kode,
      begrunnelse: null,
      aksjonspunktGodkjenningDtos,
    };

    return onSubmit({
      // @ts-ignore Fiks denne!
      fatterVedtakAksjonspunktDto,
      erAlleAksjonspunktGodkjent: values.aksjonspunktGodkjenning.every((ap) => ap.totrinnskontrollGodkjent),
    });
  }, [erTilbakekreving]);

  const erBehandlingEtterKlage = useMemo(() => (behandling ? behandling.behandlingÅrsaker
    .map(({ behandlingArsakType }) => behandlingArsakType)
    .some((bt: Kodeverk) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK) : false),
  [behandling]);

  const sorterteTotrinnskontrollSkjermlenkeContext = useMemo(() => (erTilbakekreving
    ? sorterteSkjermlenkeCodesForTilbakekreving
      .flatMap((s) => {
        const context = totrinnskontrollSkjermlenkeContext.find((el) => el.skjermlenkeType === s.kode);
        return context ? [context] : [];
      })
    : totrinnskontrollSkjermlenkeContext),
  [erTilbakekreving, totrinnskontrollSkjermlenkeContext]);

  const lagLenke = useCallback((skjermlenkeCode: string): Location | undefined => createLocationForSkjermlenke(location, skjermlenkeCode), [location]);

  const erStatusFatterVedtak = behandling.status.kode === BehandlingStatus.FATTER_VEDTAK;
  const skjemalenkeTyper = alleKodeverk[kodeverkTyper.SKJERMLENKE_TYPE];
  const vurderArsaker = alleKodeverk[kodeverkTyper.VURDER_AARSAK];
  const arbeidsforholdHandlingTyper = finnArbeidsforholdHandlingTyper(alleKodeverk);
  const faktaOmBeregningTilfeller = finnFaktaOmBeregningTilfeller(alleKodeverk);

  return (
    <RawIntlProvider value={intl}>
      {erStatusFatterVedtak && (
        <TotrinnskontrollBeslutterForm
          behandling={behandling}
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          readOnly={readOnly}
          onSubmit={submitHandler}
          forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
          erForeldrepengerFagsak={fagsakYtelseType.kode === FagsakYtelseType.FORELDREPENGER}
          behandlingKlageVurdering={behandlingKlageVurdering}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
          skjemalenkeTyper={skjemalenkeTyper}
          erBehandlingEtterKlage={erBehandlingEtterKlage}
          faktaOmBeregningTilfeller={faktaOmBeregningTilfeller}
          erTilbakekreving={erTilbakekreving}
          lagLenke={lagLenke}
          beslutterFormData={beslutterFormData}
          setBeslutterForData={setBeslutterForData}
        />
      )}
      {!erStatusFatterVedtak && (
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          erForeldrepengerFagsak={fagsakYtelseType.kode === FagsakYtelseType.FORELDREPENGER}
          behandlingKlageVurdering={behandlingKlageVurdering}
          behandlingStatus={behandling.status}
          erTilbakekreving={erTilbakekreving}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
          skjemalenkeTyper={skjemalenkeTyper}
          lagLenke={lagLenke}
          vurderArsaker={vurderArsaker}
          faktaOmBeregningTilfeller={faktaOmBeregningTilfeller}
        />
      )}
    </RawIntlProvider>
  );
};

export default TotrinnskontrollSakIndex;
