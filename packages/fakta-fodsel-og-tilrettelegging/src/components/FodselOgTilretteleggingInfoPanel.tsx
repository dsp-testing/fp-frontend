import React, { FunctionComponent } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';

import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  Aksjonspunkt, Arbeidsforhold, ArbeidsgiverOpplysningerPerId, KodeverkMedNavn, FodselOgTilrettelegging,
} from '@fpsak-frontend/types';

import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  svangerskapspengerTilrettelegging: FodselOgTilrettelegging;
  aksjonspunkter: Aksjonspunkt[];
  iayArbeidsforhold: Arbeidsforhold[];
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  submitCallback?: (aksjonspunktData: { kode: string }) => Promise<any>
  submittable: boolean;
  erOverstyrer: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  uttakArbeidTyper: KodeverkMedNavn[],
  intl: IntlShape;
}

/**
 * Svangerskapspenger
 * Fakta om Fødsel og tilrettelegging
 */
const FodselOgTilretteleggingInfoPanel: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  svangerskapspengerTilrettelegging,
  aksjonspunkter,
  iayArbeidsforhold,
  readOnly,
  hasOpenAksjonspunkter,
  submitCallback,
  submittable,
  erOverstyrer,
  arbeidsgiverOpplysningerPerId,
  uttakArbeidTyper,
  intl,
}) => (
  <>
    <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {[<FormattedMessage id="FodselOgTilretteleggingInfoPanel.Aksjonspunkt" key="svangerskapspengerAp" />]}
    </AksjonspunktHelpTextTemp>
    <VerticalSpacer eightPx />
    <FodselOgTilretteleggingFaktaForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={aksjonspunkter}
      iayArbeidsforhold={iayArbeidsforhold}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      submittable={submittable}
      erOverstyrer={erOverstyrer}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      uttakArbeidTyper={uttakArbeidTyper}
      intl={intl}
    />
  </>
);

export default FodselOgTilretteleggingInfoPanel;
