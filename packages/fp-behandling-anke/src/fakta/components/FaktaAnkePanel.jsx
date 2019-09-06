import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PersonIndex } from '@fpsak-frontend/fp-felles';

import { getFagsakPerson } from 'behandlingAnke/src/duckBehandlingAnke';

import styles from './faktaAnkePanel.less';

/**
 * FaktaAnkePanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const FaktaAnkePanel = ({
  fagsakPerson,
}) => (
  <div className={styles.personContainer}>
    <PersonIndex medPanel person={fagsakPerson} />
  </div>
);

FaktaAnkePanel.propTypes = {
  fagsakPerson: PropTypes.shape().isRequired,
};

const mapStateToProps = (state) => ({
  fagsakPerson: getFagsakPerson(state),
});

export default connect(mapStateToProps)(FaktaAnkePanel);
