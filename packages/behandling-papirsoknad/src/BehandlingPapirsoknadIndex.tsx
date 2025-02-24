import React, {
  FunctionComponent,
} from 'react';
import { RawIntlProvider } from 'react-intl';

import {
  StandardBehandlingProps, useBehandling, useInitBehandlingHandlinger, useInitRequestApi, useLagreAksjonspunkt,
} from '@fpsak-frontend/behandling-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { createIntl } from '@fpsak-frontend/utils';

import RegistrerPapirsoknad from './components/RegistrerPapirsoknad';
import { requestPapirsoknadApi, PapirsoknadApiKeys } from './data/papirsoknadApi';
import messages from '../i18n/nb_NO.json';

const intl = createIntl(messages);

interface OwnProps {
  fagsakPersonnummer: string;
}

const BehandlingPapirsoknadIndex: FunctionComponent<OwnProps & StandardBehandlingProps> = ({
  behandlingEventHandler,
  behandlingUuid,
  kodeverk,
  fagsak,
  fagsakPersonnummer,
  rettigheter,
  setRequestPendingMessage,
}) => {
  useInitRequestApi(requestPapirsoknadApi, setRequestPendingMessage);

  const {
    behandling, hentBehandling, setBehandling,
  } = useBehandling(
    requestPapirsoknadApi, PapirsoknadApiKeys.BEHANDLING_PAPIRSOKNAD, behandlingUuid,
  );

  const { lagreAksjonspunkter } = useLagreAksjonspunkt(
    requestPapirsoknadApi, setBehandling, PapirsoknadApiKeys.SAVE_AKSJONSPUNKT,
  );

  useInitBehandlingHandlinger(requestPapirsoknadApi, PapirsoknadApiKeys, behandlingEventHandler, hentBehandling, setBehandling, behandling);

  if (!behandling) {
    return <LoadingPanel />;
  }

  return (
    <RawIntlProvider value={intl}>
      <RegistrerPapirsoknad
        behandling={behandling}
        fagsak={fagsak}
        fagsakPersonnummer={fagsakPersonnummer}
        kodeverk={kodeverk}
        rettigheter={rettigheter}
        hentBehandling={hentBehandling}
        lagreAksjonspunkt={lagreAksjonspunkter}
      />
    </RawIntlProvider>
  );
};

export default BehandlingPapirsoknadIndex;
