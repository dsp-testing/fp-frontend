import React, {
  FunctionComponent, useCallback, useState,
} from 'react';

import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { ProsessStegCode } from '@fpsak-frontend/konstanter';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import {
  Aksjonspunkt, Behandling, Behandlingsresultat, Beregningsgrunnlag, BeregningsresultatFp, Fagsak, Medlemskap, SimuleringResultat, TilbakekrevingValg, Vilkar,
} from '@fpsak-frontend/types';
import {
  ProsessDefaultInitPanel, IverksetterVedtakStatusModal, FatterVedtakStatusModal, ProsessPanelInitProps, useStandardProsessPanelProps,
} from '@fpsak-frontend/behandling-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { createIntl, forhandsvisDokument } from '@fpsak-frontend/utils';

import messages from '../../i18n/nb_NO.json';
import { restApiSvpHooks, requestSvpApi, SvpBehandlingApiKeys } from '../data/svpBehandlingApi';

const intl = createIntl(messages);

const hasOnlyClosedAps = (aksjonspunkter: Aksjonspunkt[], vedtakAksjonspunkter: Aksjonspunkt[]): boolean => aksjonspunkter
  .filter((ap) => !vedtakAksjonspunkter.some((vap) => vap.definisjon.kode === ap.definisjon.kode))
  .every((ap) => !isAksjonspunktOpen(ap.status.kode));

const hasAksjonspunkt = (ap: Aksjonspunkt): boolean => (ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING
  || ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG
  || ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG
  || ap.definisjon.kode === aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER);

const isAksjonspunktOpenAndOfType = (ap: Aksjonspunkt): boolean => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status.kode);

const findStatusForVedtak = (
  vilkar: Vilkar[],
  aksjonspunkter: Aksjonspunkt[],
  vedtakAksjonspunkter: Aksjonspunkt[],
  behandlingsresultat?: Behandlingsresultat,
): string => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) && vilkar.some((v) => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (vilkar.some((v) => v.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT) || aksjonspunkter.some(isAksjonspunktOpenAndOfType)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (!hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (behandlingsresultat && isAvslag(behandlingsresultat.type.kode)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};

const getForhandsvisCallback = (
  forhandsvisMelding: (params?: any, keepData?: boolean) => Promise<unknown>,
  fagsak: Fagsak,
  behandling: Behandling,
) => (data: any) => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };

  return forhandsvisMelding(brevData).then((response) => forhandsvisDokument(response));
};

const IVERKSETTER_VEDTAK_AKSJONSPUNKT_KODER = [
  aksjonspunktCodes.FATTER_VEDTAK,
  aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
  aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
  aksjonspunktCodes.VURDERE_DOKUMENT,
  aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
  aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
];
const FATTER_VEDTAK_AKSJONSPUNKT_KODER = [
  aksjonspunktCodes.FORESLA_VEDTAK,
  aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
];

const getLagringSideeffekter = (
  toggleIverksetterVedtakModal: (visIverksetterModal: boolean) => void,
  toggleFatterVedtakModal: (skalFatterModal: boolean) => void,
  toggleOppdatereFagsakContext: (skalHenteFagsak: boolean) => void,
) => (aksjonspunktModels: { kode: string }[]) => {
  toggleOppdatereFagsakContext(false);

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (FATTER_VEDTAK_AKSJONSPUNKT_KODER.some((kode) => kode === aksjonspunktModels[0].kode)) {
      toggleFatterVedtakModal(true);
    } else {
      toggleIverksetterVedtakModal(true);
    }
  };
};

const AKSJONSPUNKT_KODER = [
  ...IVERKSETTER_VEDTAK_AKSJONSPUNKT_KODER,
  ...FATTER_VEDTAK_AKSJONSPUNKT_KODER,
];

const ENDEPUNKTER_INIT_DATA = [SvpBehandlingApiKeys.AKSJONSPUNKTER, SvpBehandlingApiKeys.VILKAR];
type EndepunktInitData = {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
}

const ENDEPUNKTER_PANEL_DATA = [
  SvpBehandlingApiKeys.TILBAKEKREVINGVALG,
  SvpBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING,
  SvpBehandlingApiKeys.MEDLEMSKAP,
  SvpBehandlingApiKeys.SIMULERING_RESULTAT,
  SvpBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER,
  SvpBehandlingApiKeys.BEREGNINGSGRUNNLAG,
];
type EndepunktPanelData = {
  tilbakekrevingvalg?: TilbakekrevingValg;
  beregningsresultatOriginalBehandling?: {
    'beregningsresultat-foreldrepenger'?: BeregningsresultatFp;
  };
  medlemskap: Medlemskap;
  simuleringResultat: SimuleringResultat;
  beregningresultatForeldrepenger?: BeregningsresultatFp;
  beregningsgrunnlag?: Beregningsgrunnlag;
}

interface OwnProps {
  toggleOppdatereFagsakContext: (skalHenteFagsak: boolean) => void,
  fagsak: Fagsak;
  opneSokeside: () => void;
}

const VedtakProsessStegInitPanel: FunctionComponent<OwnProps & ProsessPanelInitProps> = ({
  toggleOppdatereFagsakContext,
  fagsak,
  opneSokeside,
  ...props
}) => {
  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideEffekter = getLagringSideeffekter(toggleIverksetterVedtakModal, toggleFatterVedtakModal,
    toggleOppdatereFagsakContext);

  const standardPanelProps = useStandardProsessPanelProps();

  const { startRequest: forhandsvisMelding } = restApiSvpHooks.useRestApiRunner(SvpBehandlingApiKeys.PREVIEW_MESSAGE);
  const previewCallback = useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, standardPanelProps.behandling),
    [standardPanelProps.behandling.versjon]);

  const lukkIverksetterModal = useCallback(() => { toggleIverksetterVedtakModal(false); opneSokeside(); }, []);
  const lukkFatterModal = useCallback(() => { toggleFatterVedtakModal(false); opneSokeside(); }, []);

  return (
    <ProsessDefaultInitPanel<EndepunktInitData, EndepunktPanelData>
      {...props}
      requestApi={requestSvpApi}
      initEndepunkter={ENDEPUNKTER_INIT_DATA}
      panelEndepunkter={ENDEPUNKTER_PANEL_DATA}
      aksjonspunktKoder={AKSJONSPUNKT_KODER}
      prosessPanelKode={ProsessStegCode.VEDTAK}
      prosessPanelMenyTekst={intl.formatMessage({ id: 'Behandlingspunkt.Vedtak' })}
      skalPanelVisesIMeny={(_data, initState) => initState === RestApiState.SUCCESS}
      hentOverstyrtStatus={(initData, standardData) => findStatusForVedtak(
        initData.vilkar || [], initData.aksjonspunkter || [], standardData.aksjonspunkter, standardData.behandling.behandlingsresultat,
      )}
      lagringSideEffekter={lagringSideEffekter}
      hentSkalMarkeresSomAktiv={(initData, standardData) => findStatusForVedtak(
        initData.vilkar || [], initData.aksjonspunkter || [], standardData.aksjonspunkter, standardData.behandling.behandlingsresultat,
      ) !== vilkarUtfallType.IKKE_VURDERT}
      renderPanel={(data, initData) => (
        <>
          <IverksetterVedtakStatusModal
            visModal={visIverksetterVedtakModal}
            lukkModal={lukkIverksetterModal}
            behandlingsresultat={data.behandling.behandlingsresultat}
          />
          <FatterVedtakStatusModal
            visModal={visFatterVedtakModal}
            lukkModal={lukkFatterModal}
            tekst={intl.formatMessage({ id: 'FatterVedtakStatusModal.SendtBeslutter' })}
          />
          <VedtakProsessIndex
            ytelseTypeKode={fagsakYtelseType.SVANGERSKAPSPENGER}
            previewCallback={previewCallback}
            {...data}
            aksjonspunkter={initData.aksjonspunkter}
            vilkar={initData.vilkar}
          />
        </>
      )}
    />
  );
};

export default VedtakProsessStegInitPanel;
