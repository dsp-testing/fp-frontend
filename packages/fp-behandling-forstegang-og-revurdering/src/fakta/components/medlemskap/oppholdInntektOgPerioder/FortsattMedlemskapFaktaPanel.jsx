import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  getBehandlingMedlemEndredeOpplysninger,
  getBehandlingSkjaringstidspunkt,
  getBehandlingStartDatoForPermisjon,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  dateAfterOrEqual, DDMMYYYY_DATE_FORMAT, hasValidDate, ISO_DATE_FORMAT, required,
} from '@fpsak-frontend/utils';

const getParam = (opplysning) => ({ dato: moment(opplysning.fom).format(DDMMYYYY_DATE_FORMAT) });

const customErrorMessage = (limit) => ([{ id: 'FortsattMedlemskapFaktaPanel.DateNotAfterOrEqual' }, { limit }]);

/**
 * FortsattMedklemskapFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 */
export const FortsattMedlemskapFaktaPanelImpl = ({
  readOnly,
  skjaringstidspunkt,
  changedOpplysninger,
}) => (
  <>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="1" />
      <Column xs="5">
        <DatepickerField
          name="fom"
          label={<FormattedMessage id="FortsattMedlemskapFaktaPanel.Fom" />}
          validate={[required, hasValidDate, dateAfterOrEqual(skjaringstidspunkt, customErrorMessage)]}
          readOnly={readOnly}
        />
      </Column>
      <Column xs="6">
        {changedOpplysninger.length > 0
          && <Normaltekst><FormattedMessage id="FortsattMedlemskapFaktaPanel.OpplysningerFraFolkeregisteret" /></Normaltekst>}
        {changedOpplysninger.map((opplysning) => {
          if (opplysning.endretAttributt === 'Personstatus') {
            return <Normaltekst key={1}><FormattedMessage id="FortsattMedlemskapFaktaPanel.EndretPersonstatus" values={getParam(opplysning)} /></Normaltekst>;
          }
          if (opplysning.endretAttributt === 'StatsborgerskapRegion') {
            return (
              <Normaltekst key={2}>
                <FormattedMessage id="FortsattMedlemskapFaktaPanel.EndretStatsborgerskap" values={getParam(opplysning)} />
              </Normaltekst>
            );
          }
          if (opplysning.endretAttributt === 'Adresse') {
            return <Normaltekst key={3}><FormattedMessage id="FortsattMedlemskapFaktaPanel.NyUtlandsadresse" values={getParam(opplysning)} /></Normaltekst>;
          }
          return null;
        })}
      </Column>
    </Row>
  </>
);


FortsattMedlemskapFaktaPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  skjaringstidspunkt: PropTypes.string.isRequired,
  changedOpplysninger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const getFirstDate = (date1, date2) => (moment(date1).isSameOrBefore(moment(date2)) ? date1 : date2);

const mapStateToProps = (state) => ({
  skjaringstidspunkt: getFirstDate(getBehandlingSkjaringstidspunkt(state), getBehandlingStartDatoForPermisjon(state)),
  changedOpplysninger: getBehandlingMedlemEndredeOpplysninger(state),
});

const FortsattMedlemskapFaktaPanel = connect(mapStateToProps)(FortsattMedlemskapFaktaPanelImpl);

FortsattMedlemskapFaktaPanel.buildInitialValues = (gjeldendeFom) => ({
  fom: gjeldendeFom || moment().format(ISO_DATE_FORMAT),
});

FortsattMedlemskapFaktaPanel.transformValues = (values) => ({
  kode: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
  fomDato: values.fom,
});

export default FortsattMedlemskapFaktaPanel;
