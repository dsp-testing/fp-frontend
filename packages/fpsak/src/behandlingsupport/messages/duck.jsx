import { updateFagsakInfo } from 'fagsak/duck';
import behandlingUpdater from 'behandling/BehandlingUpdater';
import fpsakApi from 'data/fpsakApi';

export const resetSubmitMessageActionCreator = (behandlingIdentifier) => (dispatch) => {
  dispatch(fpsakApi.SUBMIT_MESSAGE.resetRestApi());
  // TODO (TOR) Er det nødvendig å hente opp fagsakinfo og behandling på nytt? Nok med historikk?
  return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier));
};

export const previewMessageActionCreator = (params) => (dispatch) => behandlingUpdater.previewMessage(dispatch, params);
export const submitMessageActionCreator = (params) => (dispatch) => (dispatch(fpsakApi.SUBMIT_MESSAGE.makeRestApiRequest()(params)));
