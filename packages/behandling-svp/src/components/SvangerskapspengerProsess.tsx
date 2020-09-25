import React, {
  FunctionComponent, useState, useCallback, useMemo,
} from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  FagsakInfo, Rettigheter, ProsessStegPanel, prosessStegHooks, IverksetterVedtakStatusModal,
  FatterVedtakStatusModal, ProsessStegContainer, useSetBehandlingVedEndring,
} from '@fpsak-frontend/behandling-felles';
import { KodeverkMedNavn, Behandling } from '@fpsak-frontend/types';

import { restApiSvpHooks, SvpBehandlingApiKeys } from '../data/svpBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegSvpPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

const forhandsvis = (data) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string};
  setBehandling: (behandling: Behandling) => void;
}

const getForhandsvisCallback = (forhandsvisMelding, fagsak, behandling) => (data) => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };
  return forhandsvisMelding(brevData).then((response) => forhandsvis(response));
};

const getForhandsvisFptilbakeCallback = (forhandsvisTilbakekrevingMelding, fagsak, behandling) => (mottaker, brevmalkode, fritekst, saksnummer) => {
  const data = {
    behandlingUuid: behandling.uuid,
    fagsakYtelseType: fagsak.fagsakYtelseType,
    varseltekst: fritekst || '',
    mottaker,
    brevmalkode,
    saksnummer,
  };
  return forhandsvisTilbakekrevingMelding(data).then((response) => forhandsvis(response));
};

const getLagringSideeffekter = (toggleIverksetterVedtakModal, toggleFatterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside) => (aksjonspunktModels) => {
  // Kjøres før lagring av aksjonspunkt(er)
  const erRevurderingsaksjonspunkt = aksjonspunktModels.some((apModel) => ((apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL
    || apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apModel.sendVarsel));
  const visIverksetterVedtakModal = aksjonspunktModels[0].isVedtakSubmission
    && [aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL, aksjonspunktCodes.FATTER_VEDTAK].includes(aksjonspunktModels[0].kode);
  const visFatterVedtakModal = aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;
  const isVedtakAp = aksjonspunktModels.some((a) => a.isVedtakSubmission);

  if (visIverksetterVedtakModal || visFatterVedtakModal || erRevurderingsaksjonspunkt || isVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    } else if (erRevurderingsaksjonspunkt) {
      opneSokeside();
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const SvangerskapspengerProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  valgtFaktaSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  apentFaktaPanelInfo,
  setBehandling,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiSvpHooks
    .useRestApiRunner<Behandling>(SvpBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } = restApiSvpHooks
    .useRestApiRunner<Behandling>(SvpBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);
  const { startRequest: forhandsvisMelding } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.PREVIEW_MESSAGE);
  const { startRequest: forhandsvisTilbakekrevingMelding } = restApiSvpHooks
    .useRestApiRunner<Behandling>(SvpBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE);

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvSvpPaneler = {
    previewCallback: useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, behandling), [behandling.versjon]),
    previewFptilbakeCallback: useCallback(getForhandsvisFptilbakeCallback(forhandsvisTilbakekrevingMelding, fagsak, behandling), [behandling.versjon]),
    alleKodeverk,
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(prosessStegPanelDefinisjoner,
    dataTilUtledingAvSvpPaneler, fagsak, rettigheter, behandling, data.aksjonspunkter, data.vilkar, hasFetchError, valgtProsessSteg, apentFaktaPanelInfo);

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(toggleIverksetterVedtakModal, toggleFatterVedtakModal, toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl, opneSokeside);

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(prosessStegPaneler, valgtFaktaSteg, behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, valgtPanel);

  const fatterVedtakTextCode = useMemo(() => (valgtPanel && valgtPanel.getStatus() === vilkarUtfallType.OPPFYLT
    ? 'FatterVedtakStatusModal.SendtBeslutter' : 'FatterVedtakStatusModal.ModalDescriptionSVP'),
  [behandling.versjon]);

  return (
    <>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={useCallback(() => { toggleIverksetterVedtakModal(false); opneSokeside(); }, [])}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status.kode === behandlingStatus.FATTER_VEDTAK}
        lukkModal={useCallback(() => { toggleFatterVedtakModal(false); opneSokeside(); }, [])}
        tekstkode={fatterVedtakTextCode}
      />
      <ProsessStegContainer
        formaterteProsessStegPaneler={formaterteProsessStegPaneler}
        velgProsessStegPanelCallback={velgProsessStegPanelCallback}
      >
        <ProsessStegPanel
          valgtProsessSteg={valgtPanel}
          fagsak={fagsak}
          behandling={behandling}
          alleKodeverk={alleKodeverk}
          apentFaktaPanelInfo={apentFaktaPanelInfo}
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          lagreAksjonspunkter={lagreAksjonspunkter}
          lagreOverstyrteAksjonspunkter={lagreOverstyrteAksjonspunkter}
          useMultipleRestApi={restApiSvpHooks.useMultipleRestApi}
        />
      </ProsessStegContainer>
    </>
  );
};

export default SvangerskapspengerProsess;
