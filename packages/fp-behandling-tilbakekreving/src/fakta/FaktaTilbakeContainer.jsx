import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex, parseFaktaParam, paramsAreEqual } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import {
  getOpenInfoPanels, resetFakta, resolveFaktaAksjonspunkter, setOpenInfoPanels,
} from './duckFaktaTilbake';
import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';

/**
 * FaktaTilbakeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet for Tilbakekreving.
 */
export const FaktaTilbakeContainer = ({
  location,
  behandlingIdentifier,
  behandlingVersjon,
  openInfoPanels,
}) => (
  <CommonFaktaIndex
    location={location}
    behandlingIdentifier={behandlingIdentifier}
    behandlingVersjon={behandlingVersjon}
    openInfoPanels={openInfoPanels}
    resetFakta={resetFakta}
    resolveFaktaAksjonspunkter={resolveFaktaAksjonspunkter}
    render={(submitFakta, toggleInfoPanel, shouldOpenDefaultInfoPanels) => (
      <TilbakekrevingFaktaPanel
        submitCallback={submitFakta}
        toggleInfoPanelCallback={toggleInfoPanel}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      />
    )}
  />
);

FaktaTilbakeContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
  resetFakta,
  resolveFaktaAksjonspunkter,
});


const TrackRouteParamFaktaIndex = trackRouteParam({
  paramName: 'fakta',
  parse: parseFaktaParam,
  paramPropType: PropTypes.arrayOf(PropTypes.string),
  storeParam: setOpenInfoPanels,
  getParamFromStore: getOpenInfoPanels,
  isQueryParam: true,
  paramsAreEqual,
})(connect(mapStateToProps)(FaktaTilbakeContainer));

export default TrackRouteParamFaktaIndex;
