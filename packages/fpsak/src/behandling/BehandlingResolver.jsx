import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BehandlingType from 'kodeverk/behandlingType';
import fpsakApi, { getBehandlingTypeApiKeys } from 'data/fpsakApi';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { getSelectedBehandlingIdentifier, isBehandlingInSync } from './behandlingSelectors';
import { getBehandlingerVersjonMappedById, getBehandlingerTypesMappedById } from './selectors/behandlingerSelectors';
import { fetchBehandling as fetchBehandlingActionCreator } from './duck';

export class BehandlingResolver extends Component {
  constructor(props) {
    super(props);
    this.resolveBehandlingInfo = this.resolveBehandlingInfo.bind(this);

    this.resolveBehandlingInfo();
  }

  resolveBehandlingInfo() {
    const {
      isInSync, fetchBehandling, behandlingIdentifier, behandlingerVersjonMappedById, behandlingerTyperMappedById,
    } = this.props;
    if (!isInSync) {
      // TODO (TOR) Endring av contextPath her er midlertidig kode fram til ein får splitta ut tilbakekreving.
      const contextPath = behandlingerTyperMappedById[behandlingIdentifier.behandlingId] === BehandlingType.TILBAKEKREVING ? 'fptilbake' : 'fpsak';
      fpsakApi.getDataContextModifier()
        .changeContextPath(contextPath, ...getBehandlingTypeApiKeys())
        .update();

      fetchBehandling(behandlingIdentifier, behandlingerVersjonMappedById);
    }
  }

  render() {
    const { isInSync, children } = this.props;
    return isInSync
      ? children
      : <LoadingPanel />;
  }
}

BehandlingResolver.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  fetchBehandling: PropTypes.func.isRequired,
  behandlingerVersjonMappedById: PropTypes.shape().isRequired,
  isInSync: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  behandlingerTyperMappedById: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  behandlingerVersjonMappedById: getBehandlingerVersjonMappedById(state),
  behandlingerTyperMappedById: getBehandlingerTypesMappedById(state),
  isInSync: isBehandlingInSync(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingResolver);
