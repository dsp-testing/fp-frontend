import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { createSelector } from 'reselect';
import { InjectedFormProps } from 'redux-form';

import { omit } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { ProsessStegSubmitButton } from '@fpsak-frontend/prosess-felles';
import {
  behandlingForm,
  isBehandlingFormSubmitting,
  isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType,
  getBehandlingFormValues,
} from '@fpsak-frontend/form';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import underavsnittType from '../kodeverk/avsnittType';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';
import VedtaksbrevAvsnitt from '../types/vedtaksbrevAvsnittTsType';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const formatVedtakData = (values: any) => {
  const perioder = omit(values, underavsnittType.OPPSUMMERING);
  return {
    oppsummeringstekst: values[underavsnittType.OPPSUMMERING],
    perioderMedTekst: Object.keys(perioder).map((key) => ({
      fom: key.split('_')[0],
      tom: key.split('_')[1],
      faktaAvsnitt: perioder[key][underavsnittType.FAKTA],
      foreldelseAvsnitt: perioder[key][underavsnittType.FORELDELSE],
      vilkaarAvsnitt: perioder[key][underavsnittType.VILKAR],
      saerligeGrunnerAvsnitt: perioder[key][underavsnittType.SARLIGEGRUNNER],
      saerligeGrunnerAnnetAvsnitt: perioder[key][underavsnittType.SARLIGEGRUNNER_ANNET],
    })),
  };
};

const fetchPreview = (fetchPreviewVedtaksbrev: (data: any) => Promise<any>, uuid: string, formVerdier: any) => (e: any) => {
  fetchPreviewVedtaksbrev({
    uuid,
    ...formatVedtakData(formVerdier),
  });
  e.preventDefault();
};

interface OwnProps {
  readOnly: boolean;
  fetchPreviewVedtaksbrev: (data: any) => Promise<any>;
  vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[];
  formVerdier: any;
  behandlingId: number;
  behandlingUuid: string;
  behandlingVersjon: number;
  perioderSomIkkeHarUtfyltObligatoriskVerdi: string[];
  erRevurderingTilbakekrevingKlage?: boolean;
  erRevurderingTilbakekrevingFeilBeløpBortfalt?: boolean;
  fritekstOppsummeringPakrevdMenIkkeUtfylt?: boolean;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
}

export const TilbakekrevingVedtakFormImpl: FunctionComponent<OwnProps & InjectedFormProps> = ({
  readOnly,
  fetchPreviewVedtaksbrev,
  vedtaksbrevAvsnitt,
  formVerdier,
  behandlingId,
  behandlingUuid,
  behandlingVersjon,
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  erRevurderingTilbakekrevingKlage,
  erRevurderingTilbakekrevingFeilBeløpBortfalt,
  fritekstOppsummeringPakrevdMenIkkeUtfylt,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <TilbakekrevingEditerVedtaksbrevPanel
      vedtaksbrevAvsnitt={vedtaksbrevAvsnitt}
      formName={formName}
      readOnly={readOnly}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={perioderSomIkkeHarUtfyltObligatoriskVerdi}
      fritekstOppsummeringPakrevdMenIkkeUtfylt={fritekstOppsummeringPakrevdMenIkkeUtfylt}
      erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
    />
    <VerticalSpacer twentyPx />
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <ProsessStegSubmitButton
            textCode="TilbakekrevingVedtakForm.TilGodkjenning"
            formName={formName}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0 && !fritekstOppsummeringPakrevdMenIkkeUtfylt}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
        </FlexColumn>
        { perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0 && (
          <FlexColumn>
            <div className={styles.padding}>
              <a
                href=""
                onClick={fetchPreview(fetchPreviewVedtaksbrev, behandlingUuid, formVerdier)}
                onKeyDown={(e) => (e.keyCode === 13 ? fetchPreview(fetchPreviewVedtaksbrev, behandlingUuid, formVerdier)(e) : null)}
                className={classNames(styles.buttonLink, 'lenke lenke--frittstaende')}
              >
                <FormattedMessage id="TilbakekrevingVedtakForm.ForhandvisBrev" />
              </a>
            </div>
          </FlexColumn>
        )}
        { erRevurderingTilbakekrevingKlage && (
          <FlexColumn className={classNames(styles.infoTextContainer)}>
            <FlexRow>
              <FlexColumn className={classNames(styles.padding, styles.infoTextIconColumn)}>
                <Image className={styles.infoTextIcon} src={advarselIcon} />
              </FlexColumn>
              <FlexColumn className={classNames(styles.infotextColumn)}>
                <FormattedMessage id="TilbakekrevingVedtakForm.Infotekst.Klage" />
              </FlexColumn>
            </FlexRow>
          </FlexColumn>
        )}
      </FlexRow>
    </FlexContainer>
  </form>
);

const transformValues = (values: any, apKode: string) => [{
  kode: apKode,
  ...formatVedtakData(values),
}];

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  aksjonspunktKodeForeslaVedtak: string;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  avsnittsliste: VedtaksbrevAvsnitt[];
}

const finnPerioderSomIkkeHarVerdiForObligatoriskFelt = createSelector([
  (ownProps: { vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[] }) => ownProps.vedtaksbrevAvsnitt,
  (ownProps: { formVerdier: any }) => ownProps.formVerdier],
(vedtaksbrevAvsnitt, formVerdier) => vedtaksbrevAvsnitt.reduce((acc: string[], va: VedtaksbrevAvsnitt) => {
  const periode = `${va.fom}_${va.tom}`;
  const friteksterForPeriode = formVerdier[periode];

  const harObligatoriskFaktaTekst = va.underavsnittsliste.some((ua: any) => ua.fritekstPåkrevet && ua.underavsnittstype === underavsnittType.FAKTA);
  if (harObligatoriskFaktaTekst && (!friteksterForPeriode || !friteksterForPeriode[underavsnittType.FAKTA])) {
    return acc.concat(periode);
  }

  const harObligatoriskSarligeGrunnerAnnetTekst = va.underavsnittsliste
    .some((ua: any) => ua.fritekstPåkrevet && ua.underavsnittstype === underavsnittType.SARLIGEGRUNNER_ANNET);
  if (harObligatoriskSarligeGrunnerAnnetTekst && (!friteksterForPeriode || !friteksterForPeriode[underavsnittType.SARLIGEGRUNNER_ANNET])) {
    return acc.concat(periode);
  }
  return acc;
}, []));

const harFritekstOppsummeringPakrevdMenIkkeUtfylt = (vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[]) => vedtaksbrevAvsnitt
  .filter((avsnitt: VedtaksbrevAvsnitt) => avsnitt.avsnittstype === underavsnittType.OPPSUMMERING)
  .some((avsnitt: VedtaksbrevAvsnitt) => avsnitt.underavsnittsliste.some((underAvsnitt: any) => underAvsnitt.fritekstPåkrevet && !underAvsnitt.fritekst));

const lagSubmitFn = createSelector([
  (ownProps: PureOwnProps) => ownProps.submitCallback, (ownProps: PureOwnProps) => ownProps.aksjonspunktKodeForeslaVedtak],
(submitCallback, aksjonspunktKodeForeslaVedtak) => (values: any) => submitCallback(transformValues(values, aksjonspunktKodeForeslaVedtak)));

const mapStateToPropsFactory = (state: any, ownProps: PureOwnProps) => {
  const vedtaksbrevAvsnitt = ownProps.avsnittsliste;
  const initialValues = TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt);
  const formVerdier = getBehandlingFormValues(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state) || {};
  const fritekstOppsummeringPakrevdMenIkkeUtfylt = harFritekstOppsummeringPakrevdMenIkkeUtfylt(vedtaksbrevAvsnitt);
  return {
    initialValues,
    formVerdier,
    vedtaksbrevAvsnitt,
    onSubmit: lagSubmitFn(ownProps),
    perioderSomIkkeHarUtfyltObligatoriskVerdi: finnPerioderSomIkkeHarVerdiForObligatoriskFelt({ vedtaksbrevAvsnitt, formVerdier }),
    fritekstOppsummeringPakrevdMenIkkeUtfylt,
  };
};

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
