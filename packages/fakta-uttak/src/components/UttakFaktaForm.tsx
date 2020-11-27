import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { InjectedFormProps } from 'redux-form';

import { dateFormat, guid, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  Aksjonspunkt, ArbeidsgiverOpplysningerPerId, FaktaArbeidsforhold, FamilieHendelseSamling, Kodeverk,
  KodeverkMedNavn, Personopplysninger, UttakKontrollerFaktaPerioder, Ytelsefordeling,
} from '@fpsak-frontend/types';

import UttakPerioder from './UttakPerioder';
import {
  sjekkArbeidsprosentOver100,
  sjekkEndretFørsteUttaksdato,
  sjekkOmfaktaOmUttakAksjonspunkt,
  sjekkOverlappendePerioder,
} from './utils/uttakPeriodeValidering';
import CustomUttakKontrollerFaktaPerioder from '../CustomUttakKontrollerFaktaPerioderTsType';

type FormValues = {
  førsteUttaksdato?: string;
  endringsdato?: string;
  perioder?: CustomUttakKontrollerFaktaPerioder[];
  faktaUttakManuellOverstyring?: boolean;
  slettedePerioder?: CustomUttakKontrollerFaktaPerioder[];
}

interface PureOwnProps {
  uttakPerioder: UttakKontrollerFaktaPerioder[];
  ytelsefordeling: Ytelsefordeling;
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (...args: any[]) => any;
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  kanOverstyre: boolean;
  faktaArbeidsforhold: FaktaArbeidsforhold[];
  personopplysninger: Personopplysninger;
  behandlingStatus: Kodeverk;
  familiehendelse: FamilieHendelseSamling;
  vilkarForSykdomExists: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  initialValues: FormValues;
  behandlingFormPrefix: string;
  hasRevurderingOvertyringAp: boolean;
  validate: (values: FormValues) => any;
  warn: (values: FormValues) => any;
  onSubmit: (...args: any[]) => any;
}

export const UttakFaktaForm: FunctionComponent<PureOwnProps & MappedOwnProps & InjectedFormProps> = ({
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  hasRevurderingOvertyringAp,
  behandlingId,
  behandlingVersjon,
  kanOverstyre,
  faktaArbeidsforhold,
  alleKodeverk,
  personopplysninger,
  behandlingStatus,
  familiehendelse,
  vilkarForSykdomExists,
  arbeidsgiverOpplysningerPerId,
  ...formProps
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <form onSubmit={formProps.handleSubmit}>
      {formProps.warning
        && (
          <span>
            {formProps.warning}
          </span>
        )}
      <UttakPerioder
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        aksjonspunkter={aksjonspunkter}
        submitting={formProps.submitting}
        hasRevurderingOvertyringAp={hasRevurderingOvertyringAp}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={alleKodeverk}
        kanOverstyre={kanOverstyre}
        getKodeverknavn={getKodeverknavn}
        faktaArbeidsforhold={faktaArbeidsforhold}
        personopplysninger={personopplysninger}
        behandlingStatus={behandlingStatus}
        familiehendelse={familiehendelse}
        vilkarForSykdomExists={vilkarForSykdomExists}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
      {formProps.error
        && (
          <span>
            {formProps.error}
          </span>
        )}
    </form>
  );
};

const warningsUttakForm = (values: FormValues) => {
  const warnings = {};
  const { førsteUttaksdato, endringsdato } = values;

  // hvis endringsdato er etter førsteuttakdato
  if (endringsdato && moment(endringsdato).isAfter(førsteUttaksdato)) {
    return {
      perioder: {
        _warning: <FormattedMessage
          id="UttakInfoPanel.PeriodeMellomFørsteuttaksdatoOgEndringsdato"
          values={{ endringsdato: dateFormat(endringsdato) }}
        />,
      },
    };
  }
  return warnings;
};

const validateUttakForm = (values: FormValues, aksjonspunkter: Aksjonspunkt[]): any => { // NOSONAR må ha disse sjekkene
  const errors = {};
  if (!values.perioder) {
    return errors;
  }

  if (sjekkOmfaktaOmUttakAksjonspunkt(aksjonspunkter) || values.faktaUttakManuellOverstyring) {
    const nyStartDato = values.perioder && values.perioder.length > 0 ? values.perioder[0].fom : undefined;
    const { førsteUttaksdato } = values;

    if (values.perioder.length === 0) {
      return {
        perioder: {
          _error: <FormattedMessage id="UttakInfoPanel.IngenPerioder" />,
        },
      };
    }

    values.perioder.forEach((periode: CustomUttakKontrollerFaktaPerioder, index: number) => {
      const forrigePeriode = values.perioder[index - 1];
      const nestePeriode = periode;

      if (sjekkArbeidsprosentOver100(periode)) {
        return {
          perioder: {
            _error: <FormattedMessage id="UttakInfoPanel.ForHoyArbeidstidsprosent" />,
          },
        };
      }

      if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
        return {
          perioder: {
            _error: <FormattedMessage id="UttakInfoPanel.OverlappendePerioder" />,
          },
        };
      }
      return {};
    });
    // todo, denne skal bort
    if (sjekkEndretFørsteUttaksdato(nyStartDato, førsteUttaksdato)) {
      return {
        perioder: {
          _error: <FormattedMessage
            id="UttakInfoPanel.periodeFørFørsteuttaksdato"
            values={{ nyStartDato: dateFormat(nyStartDato), førsteUttaksdato: dateFormat(førsteUttaksdato) }}
          />,
        },
      };
    }
  }

  return errors;
};

const buildInitialValues = createSelector(
  [(props: PureOwnProps) => props.uttakPerioder, (props: PureOwnProps) => props.ytelsefordeling],
  (perioder, ytelseFordeling): FormValues | undefined => {
    if (perioder) {
      return {
        førsteUttaksdato: ytelseFordeling && ytelseFordeling.førsteUttaksdato ? ytelseFordeling.førsteUttaksdato : undefined,
        endringsdato: ytelseFordeling && ytelseFordeling.endringsdato ? ytelseFordeling.endringsdato : undefined,
        perioder: perioder.map((periode: UttakKontrollerFaktaPerioder) => ({
          ...periode,
          id: guid(),
          openForm: periode.bekreftet === false,
          updated: false,
          isFromSøknad: true,
        })),
      };
    }

    return undefined;
  },
);

const getOriginalPeriodeId = (origPeriode: CustomUttakKontrollerFaktaPerioder): string | null => {
  if (origPeriode) {
    return origPeriode.id;
  }

  return null;
};

const manueltEllerOverstyring = (manuellOverstyring: boolean, erManuellOverstyrApErOpprettet: boolean): string => (
  manuellOverstyring || erManuellOverstyrApErOpprettet ? aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK : aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK
);

export const transformValues = (values: FormValues, initialValues: FormValues, aksjonspunkter: Aksjonspunkt[]): any => { // NOSONAR
  const overstyringAp = [aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK, aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK];
  const erManuellOverstyrApErOpprettet = aksjonspunkter
    .some((ap) => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK);
  const aksjonspunktUtenOverstyr = aksjonspunkter.filter((ap) => !overstyringAp.includes(ap.definisjon.kode));

  const apCodes = aksjonspunktUtenOverstyr.length
    ? aksjonspunktUtenOverstyr.map((ap) => ap.definisjon.kode)
    : [manueltEllerOverstyring(values.faktaUttakManuellOverstyring, erManuellOverstyrApErOpprettet)];
  return apCodes.map((ap) => ({
    kode: ap,

    bekreftedePerioder: values.perioder.map((periode) => {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id, openForm, updated, isFromSøknad, ...bekreftetPeriode // NOSONAR
      } = periode;
      const origPeriode = initialValues.perioder.filter((p) => p.id === id);
      return {
        bekreftetPeriode,
        orginalFom: origPeriode[0] ? origPeriode[0].fom : null,
        orginalTom: origPeriode[0] ? origPeriode[0].tom : null,
        originalArbeidstidsprosent: origPeriode[0] ? origPeriode[0].arbeidstidsprosent : null,
        originalBegrunnelse: origPeriode[0] ? origPeriode[0].begrunnelse : null,
        originalResultat: origPeriode[0] ? origPeriode[0].resultat : null,
      };
    }),

    slettedePerioder: values.slettedePerioder
      ? values.slettedePerioder.map((periode) => {
        const { id, begrunnelse, ...slettetPeriode } = periode;
        const origPeriode = initialValues.perioder.filter((p) => p.id === id);

        return {
          ...slettetPeriode,
          begrunnelse: id === getOriginalPeriodeId(origPeriode[0]) ? begrunnelse : null,
        };
      })
      : [],

    begrunnelse: '',
  }));
};

const lagSubmitFn = createSelector([
  (ownProps: PureOwnProps) => ownProps.submitCallback,
  buildInitialValues,
  (ownProps: PureOwnProps) => ownProps.aksjonspunkter],
(submitCallback, initialValues, aksjonspunkter) => (values: FormValues) => submitCallback(transformValues(values, initialValues, aksjonspunkter)));

const mapStateToPropsFactory = (_initialState: any, props: PureOwnProps) => {
  const { behandlingId, behandlingVersjon } = props;
  const initialValues = buildInitialValues(props);

  const validate = (values: FormValues) => validateUttakForm(values, props.aksjonspunkter);
  const warn = (values: FormValues) => warningsUttakForm(values);

  return (_state, ownProps: PureOwnProps): MappedOwnProps => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    const hasRevurderingOvertyringAp = props.aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK);
    return {
      initialValues,
      behandlingFormPrefix,
      hasRevurderingOvertyringAp,
      validate,
      warn,
      onSubmit: lagSubmitFn(ownProps),
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'UttakFaktaForm',
  enableReinitialize: true,
})(UttakFaktaForm));
