import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { bindActionCreators } from 'redux';

import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import { toggleBehandlingspunktOverstyring } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/duckBpForstegangOgRev';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import { getFeatureToggles, getFagsakInfo } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import CheckPersonStatusForm from './saksopplysninger/CheckPersonStatusForm';
import TilkjentYtelsePanel from './tilkjentYtelse/TilkjentYtelsePanel';
import UttakPanel from './uttak/UttakPanel';
import VedtakPanels from './vedtak/VedtakPanels';
import VilkarPanels from './vilkar/VilkarPanels';
import BeregningFP from './beregningsgrunnlag/BeregningFP';
import VarselOmRevurderingForm from './revurdering/VarselOmRevurderingForm';
import VurderSoknadsfristForeldrepengerForm from './soknadsfrist/VurderSoknadsfristForeldrepengerForm';
import DataFetcherWithCache from '../DataFetcherWithCache';

import styles from './behandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

const avregningData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.SIMULERING_RESULTAT, fpsakApi.TILBAKEKREVINGVALG];
const beregningsresultatData = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGRESULTAT_ENGANGSSTONAD];


/*
 * PunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  submitCallback,
  previewCallback,
  previewFptilbakeCallback,
  dispatchSubmitFailed,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
  fagsakInfo,
  featureToggles,
  overrideReadOnly,
  kanOverstyreAccess,
  behandlingspunktAksjonspunkter,
  toggleOverstyring,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <VilkarPanels
        aksjonspunktCodes={apCodes}
        behandlingspunkt={selectedBehandlingspunkt}
        isAksjonspunktOpen={openAksjonspunkt}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        submitCallback={submitCallback}
      />
      <VedtakPanels
        behandlingspunkt={selectedBehandlingspunkt}
        readOnly={readOnly}
        previewCallback={previewCallback}
        submitCallback={submitCallback}
      />

      {selectedBehandlingspunkt === behandlingspunktCodes.BEREGNING && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={beregningsresultatData}
          render={(props) => (
            <BeregningsresultatProsessIndex
              submitCallback={submitCallback}
              overrideReadOnly={overrideReadOnly}
              kanOverstyreAccess={kanOverstyreAccess}
              aksjonspunkter={behandlingspunktAksjonspunkter}
              toggleOverstyring={toggleOverstyring}
              {...props}
            />
          )}
        />
      )}

      {CheckPersonStatusForm.supports(apCodes)
      && <CheckPersonStatusForm submitCallback={submitCallback} readOnly={readOnly} readOnlySubmitButton={readOnlySubmitButton} />}
      {VarselOmRevurderingForm.supports(apCodes)
      && (
      <VarselOmRevurderingForm
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        dispatchSubmitFailed={dispatchSubmitFailed}
        readOnly={readOnly}
      />
      )}
      {BeregningFP.supports(selectedBehandlingspunkt)
      && (
      <BeregningFP
        readOnly={readOnly}
        submitCallback={submitCallback}
        apCodes={apCodes}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
      {TilkjentYtelsePanel.supports(selectedBehandlingspunkt)
      && (
      <TilkjentYtelsePanel
        readOnly={readOnly}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
      {UttakPanel.supports(selectedBehandlingspunkt, apCodes)
      && (
      <UttakPanel
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        apCodes={apCodes}
        isApOpen={openAksjonspunkt}
      />
      )}
      {selectedBehandlingspunkt === behandlingspunktCodes.AVREGNING && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={avregningData}
          render={(props) => (
            <AvregningProsessIndex
              fagsak={fagsakInfo}
              featureToggles={featureToggles}
              submitCallback={submitCallback}
              readOnly={readOnly}
              readOnlySubmitButton={readOnlySubmitButton}
              apCodes={apCodes}
              isApOpen={openAksjonspunkt}
              previewCallback={previewFptilbakeCallback}
              {...props}
            />
          )}
        />
      )}
      {VurderSoknadsfristForeldrepengerForm.supports(apCodes)
      && (
      <VurderSoknadsfristForeldrepengerForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isApOpen={openAksjonspunkt}
      />
      )}
    </div>
  </div>
);

BehandlingspunktInfoPanel.propTypes = {
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewFptilbakeCallback: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
  fagsakInfo: PropTypes.shape().isRequired,
  featureToggles: PropTypes.shape().isRequired,
  kanOverstyreAccess: PropTypes.shape().isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
};

BehandlingspunktInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  selectedBehandlingspunkt: behandlingsprosessSelectors.getSelectedBehandlingspunkt(state),
  behandlingspunktAksjonspunkter: behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingsprosessSelectors.getNotAcceptedByBeslutter(state),
  overrideReadOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktOverrideReadOnly(state),
  kanOverstyreAccess: behandlingSelectors.getRettigheter(state).kanOverstyreAccess,
  fagsakInfo: getFagsakInfo(state),
  featureToggles: getFeatureToggles(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleBehandlingspunktOverstyring,
  }, dispatch),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  toggleOverstyring: () => dispatchProps.toggleBehandlingspunktOverstyring(
    ownProps.selectedBehandlingspunkt,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingspunktInfoPanel);
