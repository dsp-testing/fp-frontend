import React, {
  FunctionComponent, useCallback,
} from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import { ProsessStegCode } from '@fpsak-frontend/konstanter';
import {
  Aksjonspunkt, Behandling, Fagsak, FamilieHendelse, FamilieHendelseSamling, Soknad, Vilkar,
} from '@fpsak-frontend/types';
import {
  ProsessDefaultInitPanel, skalViseProsessPanel, ProsessPanelInitProps, useStandardProsessPanelProps,
} from '@fpsak-frontend/behandling-felles';
import { createIntl, forhandsvisDokument } from '@fpsak-frontend/utils';

import messages from '../../i18n/nb_NO.json';
import { restApiFpHooks, requestFpApi, FpBehandlingApiKeys } from '../data/fpBehandlingApi';

const intl = createIntl(messages);

const getForhandsvisCallback = (
  forhandsvisMelding: (params?: any, keepData?: boolean) => Promise<unknown>,
  fagsak: Fagsak,
  behandling: Behandling,
) => (data: {
  mottaker: string;
  dokumentMal: string;
  fritekst: string;
}) => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };

  return forhandsvisMelding(brevData).then((response) => forhandsvisDokument(response));
};

const getLagringSideeffekter = (
  toggleOppdatereFagsakContext: (skalHenteFagsak: boolean) => void,
  opneSokeside: () => void,
) => () => {
  toggleOppdatereFagsakContext(false);

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt
  return () => {
    opneSokeside();
  };
};

const AKSJONSPUNKT_KODER = [
  aksjonspunktCodes.VARSEL_REVURDERING_MANUELL,
  aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL,
];

const ENDEPUNKTER_INIT_DATA = [FpBehandlingApiKeys.AKSJONSPUNKTER, FpBehandlingApiKeys.VILKAR];
type EndepunktInitData = {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
}

const ENDEPUNKTER_PANEL_DATA = [
  FpBehandlingApiKeys.FAMILIEHENDELSE,
  FpBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
  FpBehandlingApiKeys.SOKNAD,
  FpBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING,
];
type EndepunktPanelData = {
  familiehendelse: FamilieHendelseSamling;
  familiehendelseOriginalBehandling: FamilieHendelse;
  soknad: Soknad;
  soknadOriginalBehandling: Soknad;
}

interface OwnProps {
  toggleSkalOppdatereFagsakContext: (skalHenteFagsak: boolean) => void,
  fagsak: Fagsak;
  opneSokeside: () => void;
}

const VarselProsessStegInitPanel: FunctionComponent<OwnProps & ProsessPanelInitProps> = ({
  toggleSkalOppdatereFagsakContext,
  fagsak,
  opneSokeside,
  ...props
}) => {
  const lagringSideEffekter = getLagringSideeffekter(toggleSkalOppdatereFagsakContext, opneSokeside);

  const { startRequest: forhandsvisMelding } = restApiFpHooks.useRestApiRunner(FpBehandlingApiKeys.PREVIEW_MESSAGE);

  const standardPanelProps = useStandardProsessPanelProps();

  const previewCallback = useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, standardPanelProps.behandling),
    [standardPanelProps.behandling.versjon]);

  return (
    <ProsessDefaultInitPanel<EndepunktInitData, EndepunktPanelData>
      {...props}
      requestApi={requestFpApi}
      initEndepunkter={ENDEPUNKTER_INIT_DATA}
      panelEndepunkter={ENDEPUNKTER_PANEL_DATA}
      aksjonspunktKoder={AKSJONSPUNKT_KODER}
      prosessPanelKode={ProsessStegCode.VARSEL}
      prosessPanelMenyTekst={intl.formatMessage({ id: 'Behandlingspunkt.CheckVarselRevurdering' })}
      skalPanelVisesIMeny={(data) => skalViseProsessPanel(data.aksjonspunkter)}
      lagringSideEffekter={lagringSideEffekter}
      renderPanel={(data) => (
        <VarselOmRevurderingProsessIndex
          previewCallback={previewCallback}
          {...data}
        />
      )}
    />
  );
};

export default VarselProsessStegInitPanel;
