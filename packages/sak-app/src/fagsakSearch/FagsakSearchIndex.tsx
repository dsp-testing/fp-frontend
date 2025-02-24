import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  errorOfType, ErrorTypes, getErrorResponseData,
} from '@fpsak-frontend/rest-api';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';
import { Fagsak } from '@fpsak-frontend/types';

import { pathToFagsak } from '../app/paths';
import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';

const EMPTY_ARRAY = [] as Fagsak[];

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex: FunctionComponent = () => {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData(FpsakApiKeys.KODEVERK);

  const navigate = useNavigate();
  const goToFagsak = (saksnummer: string) => {
    navigate(pathToFagsak(saksnummer));
  };

  const {
    startRequest: searchFagsaker, data: fagsaker = EMPTY_ARRAY, state: sokeStatus, error,
  } = restApiHooks.useRestApiRunner(FpsakApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied = useMemo(() => (errorOfType(ErrorTypes.MANGLER_TILGANG_FEIL, error)
    ? getErrorResponseData(error)
    : undefined), [error]);

  const sokFerdig = sokeStatus === RestApiState.SUCCESS;

  useEffect(() => {
    if (sokFerdig && fagsaker.length === 1) {
      goToFagsak(fagsaker[0].saksnummer);
    }
  }, [sokFerdig, fagsaker]);

  return (
    <FagsakSokSakIndex
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsaker}
      searchResultReceived={sokFerdig}
      selectFagsakCallback={(e: React.SyntheticEvent, saksnummer?: string) => goToFagsak(saksnummer)}
      searchStarted={sokeStatus === RestApiState.LOADING}
      searchResultAccessDenied={searchResultAccessDenied}
      alleKodeverk={alleKodeverk}
    />
  );
};

export default FagsakSearchIndex;
