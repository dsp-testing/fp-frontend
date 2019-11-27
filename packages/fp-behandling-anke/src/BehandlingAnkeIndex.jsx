import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { BehandlingGrid, CommonBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/ankeBehandlingSelectors';
import BehandlingsprosessAnkeIndex from './behandlingsprosess/BehandlingsprosessAnkeIndex';
import FaktaAnkeIndex from './fakta/FaktaAnkeIndex';
import {
  fetchBehandling as fetchBehandlingActionCreator,
  getBehandlingIdentifier,
  getKodeverk,
  resetBehandlingFpsakContext,
  setBehandlingInfo as setBehandlingInfoFunc,
  setHasShownBehandlingPaVent as setHasShownBehandlingPaVentFunc,
  getHasShownBehandlingPaVent,
  updateOnHold as updateOnHoldFunc,
  shouldUpdateFagsak as shouldUpdateFagsakSel,
} from './duckBehandlingAnke';
import fpAnkeBehandlingUpdater from './FpAnkeBehandlingUpdater';

// TODO (TOR) Rydd opp i props
/**
 * BehandlingAnkeIndex
 *
 * Bruker CommonBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingAnkeIndex = ({
  behandlingId,
  behandlingIdentifier,
  oppdaterBehandlingVersjon,
  behandlingVersjon,
  fristBehandlingPaaVent,
  behandlingPaaVent,
  venteArsakKode,
  hasManualPaVent,
  ventearsaker,
  isInSync,
  fagsakInfo,
  resetBehandling,
  behandlingUpdater,
  hasShownBehandlingPaVent,
  fetchBehandling,
  updateOnHold,
  setHasShownBehandlingPaVent,
  setBehandlingInfo,
  hasSubmittedPaVentForm,
  shouldUpdateFagsak,
}) => (
  <CommonBehandlingIndex
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    behandlingIdentifier={behandlingIdentifier}
    behandlingPaaVent={behandlingPaaVent}
    fristBehandlingPaaVent={fristBehandlingPaaVent}
    hasShownBehandlingPaVent={hasShownBehandlingPaVent}
    setHasShownBehandlingPaVent={setHasShownBehandlingPaVent}
    updateOnHold={updateOnHold}
    hasSubmittedPaVentForm={hasSubmittedPaVentForm}
    venteArsakKode={venteArsakKode}
    ventearsaker={ventearsaker}
    hasManualPaVent={hasManualPaVent}
    isInSync={isInSync}
    fagsakInfo={fagsakInfo}
    fetchBehandling={fetchBehandling}
    resetBehandlingFpsakContext={resetBehandling}
    setBehandlingInfo={setBehandlingInfo}
    fpBehandlingUpdater={fpAnkeBehandlingUpdater}
    behandlingUpdater={behandlingUpdater}
    oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
    shouldUpdateFagsak={shouldUpdateFagsak}
  >
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessAnkeIndex />}
      faktaContent={<FaktaAnkeIndex />}
    />
  </CommonBehandlingIndex>
);

BehandlingAnkeIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  fristBehandlingPaaVent: PropTypes.string,
  behandlingPaaVent: PropTypes.bool,
  venteArsakKode: PropTypes.string,
  hasManualPaVent: PropTypes.bool.isRequired,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  isInSync: PropTypes.bool.isRequired,
  hasShownBehandlingPaVent: PropTypes.bool.isRequired,
  resetBehandling: PropTypes.func.isRequired,
  setHasShownBehandlingPaVent: PropTypes.func.isRequired,
  fetchBehandling: PropTypes.func.isRequired,
  updateOnHold: PropTypes.func.isRequired,
  setBehandlingInfo: PropTypes.func.isRequired,
  fagsakInfo: PropTypes.shape().isRequired,
  behandlingUpdater: PropTypes.shape().isRequired,
  hasSubmittedPaVentForm: PropTypes.bool.isRequired,
  shouldUpdateFagsak: PropTypes.bool.isRequired,
};

BehandlingAnkeIndex.defaultProps = {
  behandlingVersjon: undefined,
  behandlingIdentifier: undefined,
  fristBehandlingPaaVent: undefined,
  behandlingPaaVent: false,
  venteArsakKode: undefined,
  ventearsaker: [],
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    featureToggles: ownProps.featureToggles,
    kodeverk: ownProps.kodeverk,
    fagsak: ownProps.fagsak,
    navAnsatt: ownProps.navAnsatt,
    fagsakBehandlingerInfo: ownProps.fagsakBehandlingerInfo,
  };
  return (state) => ({
    behandlingIdentifier: getBehandlingIdentifier(state),
    behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
    fristBehandlingPaaVent: behandlingSelectors.getBehandlingOnHoldDate(state),
    behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
    venteArsakKode: behandlingSelectors.getBehandlingVenteArsakKode(state),
    hasManualPaVent: behandlingSelectors.hasBehandlingManualPaVent(state),
    hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
    ventearsaker: getKodeverk(kodeverkTyper.VENT_AARSAK)(state),
    isInSync: behandlingSelectors.isBehandlingInSync(state),
    shouldUpdateFagsak: shouldUpdateFagsakSel(state),
    fagsakInfo,
  });
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setHasShownBehandlingPaVent: setHasShownBehandlingPaVentFunc,
  updateOnHold: updateOnHoldFunc,
  setBehandlingInfo: setBehandlingInfoFunc,
  resetBehandling: resetBehandlingFpsakContext,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToPropsFactory, mapDispatchToProps)(BehandlingAnkeIndex);
