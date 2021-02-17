import React, {
  FunctionComponent, useEffect, useState, useCallback,
} from 'react';

import {
  Rettigheter, ReduxFormStateCleaner, useSetBehandlingVedEndring,
} from '@fpsak-frontend/behandling-felles';
import {
  KodeverkMedNavn, Behandling, Fagsak, FagsakPerson, ArbeidsgiverOpplysningerWrapper,
} from '@fpsak-frontend/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState, useRestApiErrorDispatcher } from '@fpsak-frontend/rest-api-hooks';

import SvangerskapspengerPaneler from './components/SvangerskapspengerPaneler';
import FetchedData from './types/fetchedDataTsType';
import { restApiSvpHooks, requestSvpApi, SvpBehandlingApiKeys } from './data/svpBehandlingApi';

const svangerskapspengerData = [
  { key: SvpBehandlingApiKeys.AKSJONSPUNKTER },
  { key: SvpBehandlingApiKeys.VILKAR },
  { key: SvpBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: SvpBehandlingApiKeys.SOKNAD },
  { key: SvpBehandlingApiKeys.INNTEKT_ARBEID_YTELSE },
  { key: SvpBehandlingApiKeys.BEREGNINGSGRUNNLAG },
  { key: SvpBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: SvpBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER }];

interface OwnProps {
  behandlingId: number;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  setRequestPendingMessage: (message: string) => void;
  kodeverk?: {[key: string]: KodeverkMedNavn[]};
}

const BehandlingSvangerskapspengerIndex: FunctionComponent<OwnProps> = ({
  behandlingEventHandler,
  behandlingId,
  oppdaterBehandlingVersjon,
  kodeverk,
  fagsak,
  fagsakPerson,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  valgtFaktaSteg,
  opneSokeside,
  setRequestPendingMessage,
}) => {
  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({ current: undefined, previous: undefined });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const setBehandling = useCallback((nyBehandling) => {
    requestSvpApi.resetCache();
    requestSvpApi.setLinks(nyBehandling.links);
    setBehandlinger((prevState) => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const { startRequest: hentBehandling, data: behandlingRes, state: behandlingState } = restApiSvpHooks
    .useRestApiRunner<Behandling>(SvpBehandlingApiKeys.BEHANDLING_SVP);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET);
  const { startRequest: settBehandlingPaVent } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.BEHANDLING_ON_HOLD);
  const { startRequest: taBehandlingAvVent } = restApiSvpHooks.useRestApiRunner<Behandling>(SvpBehandlingApiKeys.RESUME_BEHANDLING);
  const { startRequest: henleggBehandling } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.HENLEGG_BEHANDLING);
  const { startRequest: settPaVent } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.UPDATE_ON_HOLD);
  const { startRequest: opneBehandlingForEndringer } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES);
  const { startRequest: opprettVerge } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.VERGE_OPPRETT);
  const { startRequest: fjernVerge } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.VERGE_FJERN);
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.SAVE_AKSJONSPUNKT);

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => nyBehandlendeEnhet(params)
        .then(() => hentBehandling({ behandlingId }, true)),
      settBehandlingPaVent: (params) => settBehandlingPaVent(params)
        .then(() => hentBehandling({ behandlingId }, true)),
      taBehandlingAvVent: (params) => taBehandlingAvVent(params)
        .then((behandlingResTaAvVent) => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: (params) => henleggBehandling(params),
      opneBehandlingForEndringer: (params) => opneBehandlingForEndringer(params)
        .then((behandlingResOpneForEndring) => setBehandling(behandlingResOpneForEndring)),
      opprettVerge: (params) => opprettVerge(params)
        .then((behandlingResOpprettVerge) => setBehandling(behandlingResOpprettVerge)),
      fjernVerge: (params) => fjernVerge(params)
        .then((behandlingResFjernVerge) => setBehandling(behandlingResFjernVerge)),
      lagreRisikoklassifiseringAksjonspunkt: (params) => lagreRisikoklassifiseringAksjonspunkt(params)
        .then((behandlingEtterRisikoAp) => setBehandling(behandlingEtterRisikoAp)),
    });

    requestSvpApi.setRequestPendingHandler(setRequestPendingMessage);
    requestSvpApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiSvpHooks.useMultipleRestApi<FetchedData>(svangerskapspengerData,
    { keepData: true, updateTriggers: [behandling?.versjon], suspendRequest: !behandling });

  const { data: arbeidsgiverOpplysninger, state: arbeidOppState } = restApiSvpHooks.useRestApi<ArbeidsgiverOpplysningerWrapper>(
    SvpBehandlingApiKeys.ARBEIDSGIVERE_OVERSIKT, {}, {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  const harIkkeHentetBehandlingsdata = state === RestApiState.LOADING || state === RestApiState.NOT_STARTED;
  const harIkkeHentetArbeidsgiverOpplysninger = arbeidOppState === RestApiState.LOADING || arbeidOppState === RestApiState.NOT_STARTED;
  if (!behandling || harIkkeHentetArbeidsgiverOpplysninger || (harIkkeHentetBehandlingsdata && data === undefined)) {
    return <LoadingPanel />;
  }

  return (
    <>
      <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={harIkkeHentetBehandlingsdata ? forrigeBehandling.versjon : behandling.versjon}
      />
      <SvangerskapspengerPaneler
        behandling={harIkkeHentetBehandlingsdata ? forrigeBehandling : behandling}
        fetchedData={data}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        alleKodeverk={kodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
        opneSokeside={opneSokeside}
        hasFetchError={behandlingState === RestApiState.ERROR}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger.arbeidsgivere}
      />
    </>
  );
};

export default BehandlingSvangerskapspengerIndex;
