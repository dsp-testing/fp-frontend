import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import { behandlingFormValueSelector, behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import {
  PeriodpickerField, SelectField, CheckboxField, RadioGroupField, RadioOption, TextAreaField, DecimalField,
} from '@fpsak-frontend/form';
import {
  hasValidDate,
  requiredIfNotPristine,
  required,
  hasValidDecimal,
  hasValidPeriod,
  maxValue, minLength, maxLength, hasValidText, guid,
  ISO_DATE_FORMAT,
  calcDaysAndWeeks,
  lagVisningsNavn,
} from '@fpsak-frontend/utils';
import uttakArbeidType from '@fpsak-frontend/kodeverk/src/uttakArbeidType';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import moment from 'moment';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { getPersonopplysning, getFaktaArbeidsforhold } from 'behandlingFpsak/src/behandlingSelectors';
import {
  FlexContainer, FlexRow, FlexColumn, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import uttakPeriodeType from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import utsettelseArsakCodes from '@fpsak-frontend/kodeverk/src/utsettelseArsakCodes';
import overforingArsak from '@fpsak-frontend/kodeverk/src/overforingArsak';
import styles from './uttakNyPeriode.less';

const maxValue100 = maxValue(100);
const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

const gyldigeUttakperioder = [
  uttakPeriodeType.FELLESPERIODE,
  uttakPeriodeType.FEDREKVOTE,
  uttakPeriodeType.FORELDREPENGER_FOR_FODSEL,
  uttakPeriodeType.FORELDREPENGER,
  uttakPeriodeType.MODREKVOTE];

const gyldigeOverføringÅrsaker = [
  overforingArsak.INSTITUSJONSOPPHOLD_ANNEN_FORELDER,
  overforingArsak.SYKDOM_ANNEN_FORELDER,
];

const mapPeriodeTyper = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapOverføringÅrsaker = typer => typer
  .filter(({ kode }) => gyldigeOverføringÅrsaker.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapUtsettelseÅrsaker = typer => typer
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapArbeidsforhold = andeler => andeler.map((andel) => {
  const { arbeidType, arbeidsgiver } = andel;

  let periodeArbeidsforhold = '';
  if (arbeidType && arbeidType.kode !== uttakArbeidType.ORDINÆRT_ARBEID) {
    periodeArbeidsforhold = arbeidType.navn;
  } else {
    periodeArbeidsforhold = lagVisningsNavn(arbeidsgiver);
  }

  const identifikator = (arbeidsgiver || []).identifikator || '-';
  const navn = (arbeidsgiver || []).navn || arbeidType.navn;
  const fixedAktørId = (arbeidsgiver || []).aktørId || '-';
  const virksomhet = (arbeidsgiver || []).virksomhet || '-';

  return (
    <option value={`${identifikator}|${navn}|${fixedAktørId}|${virksomhet}|${arbeidType.kode}`} key={guid()}>{periodeArbeidsforhold}</option>
  );
});

const periodeTypeTrengerArsak = (sokerKjonn, periodeType) => (
  (sokerKjonn === navBrukerKjonn.MANN && periodeType === uttakPeriodeType.MODREKVOTE)
  || (sokerKjonn === navBrukerKjonn.KVINNE && periodeType === uttakPeriodeType.FEDREKVOTE)
);

export const UttakNyPeriode = ({
  newPeriodeCallback,
  newPeriodeResetCallback,
  periodeTyper,
  utsettelseÅrsaker,
  overføringÅrsaker,
  nyPeriode,
  sokerKjonn,
  nyPeriodeDisabledDaysFom,
  andeler,
  ...formProps
}) => {
  const inlineStyle = {
    arrowBox: {
      marginTop: nyPeriode.typeUttak === 'utsettelse' ? 80 : 0,
    },
  };
  const numberOfDaysAndWeeks = calcDaysAndWeeks(nyPeriode.fom, nyPeriode.tom, ISO_DATE_FORMAT);
  return (
    <div>
      <Row>
        <Column>
          <div className={styles.periodeContainer}>
            <div className={styles.periodeType}>
              <div className={styles.headerWrapper}>
                <Element><FormattedMessage id="UttakInfoPanel.NyPeriode" /></Element>
              </div>
            </div>
            <div className={styles.periodeInnhold}>
              <VerticalSpacer eightPx />
              <FlexContainer fluid wrap>
                <FlexRow wrap>
                  <FlexColumn>
                    <FlexRow>
                      <FlexColumn>
                        <PeriodpickerField
                          names={['fom', 'tom']}
                          label={{ id: 'UttakInfoPanel.Periode' }}
                          validate={[required, hasValidDate]}
                          disabledDays={{ before: moment(nyPeriodeDisabledDaysFom).toDate() }}
                        />
                      </FlexColumn>
                      <FlexColumn className={styles.suffix}>
                        <div id="antallDager">
                          {nyPeriode.fom
                          && (
                          <FormattedMessage
                            id={numberOfDaysAndWeeks.id.toString()}
                            values={{
                              weeks: numberOfDaysAndWeeks.weeks.toString(),
                              days: numberOfDaysAndWeeks.days.toString(),
                            }}
                          />
                          )}
                        </div>
                      </FlexColumn>
                    </FlexRow>
                    <FlexColumn>
                      <FlexRow wrap>
                        <FlexColumn>
                          <FlexRow>
                            <SelectField
                              label={{ id: 'UttakInfoPanel.StonadsKonto' }}
                              bredde="m"
                              name="periodeType"
                              validate={nyPeriode.typeUttak !== 'utsettelse' ? [required] : []}
                              selectValues={mapPeriodeTyper(periodeTyper)}
                            />
                          </FlexRow>
                        </FlexColumn>
                        <FlexColumn className={styles.alignRightHorizontalBottom}>
                          <CheckboxField
                            name="flerbarnsdager"
                            label={<FormattedMessage id="UttakInfoPanel.Flerbarnsdager" />}
                          />
                          <CheckboxField
                            id="samtidigUttak_nyperiode"
                            name="samtidigUttak"
                            label={<FormattedMessage id="UttakInfoPanel.SamtidigUttak" />}
                          />
                          {nyPeriode.samtidigUttak && (
                            <FlexColumn>
                              <FlexRow>
                                <FlexColumn>
                                  <DecimalField
                                    className={styles.fieldHorizontal}
                                    name="samtidigUttaksprosent"
                                    bredde="XS"
                                    label={{ id: 'UttakInfoPanel.SamtidigUttakProsentandel' }}
                                    validate={[required, maxValue100, hasValidDecimal]}
                                    normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                                    inputClassName={styles.textAlignRight}
                                  />
                                </FlexColumn>
                                <FlexColumn className={styles.suffixAligAuto}>%</FlexColumn>
                              </FlexRow>
                            </FlexColumn>
                          )}
                        </FlexColumn>
                      </FlexRow>
                    </FlexColumn>
                    <FlexColumn>
                      {periodeTypeTrengerArsak(sokerKjonn, nyPeriode.periodeType) && (
                      <FlexRow>
                        <SelectField
                          label={{ id: 'UttakInfoPanel.AngiArsakforOverforing' }}
                          bredde="m"
                          name="periodeOverforingArsak"
                          selectValues={mapOverføringÅrsaker(overføringÅrsaker)}
                          validate={[required]}
                        />
                      </FlexRow>
                      )}
                    </FlexColumn>
                  </FlexColumn>
                </FlexRow>
                <FlexRow wrap className={styles.typeUttakStyle}>
                  <FlexColumn>
                    <div>
                      <Undertekst><FormattedMessage id="UttakInfoPanel.TypeUttak" /></Undertekst>
                      <VerticalSpacer eightPx />
                    </div>
                    <div>
                      <RadioGroupField name="typeUttak" validate={[required]} direction="vertical">
                        <RadioOption label={<FormattedMessage id="UttakInfoPanel.FulltUttak" />} value="fullt" />
                        <RadioOption label={<FormattedMessage id="UttakInfoPanel.GradertUttak" />} value="gradert" />
                        <RadioOption label={<FormattedMessage id="UttakInfoPanel.Utsettelse" />} value="utsettelse" />
                      </RadioGroupField>
                    </div>
                  </FlexColumn>
                  <FlexColumn>
                    {nyPeriode.typeUttak !== null
                      && nyPeriode.typeUttak !== 'fullt'
                      && (
                      <div className={styles.arrowBox} style={inlineStyle.arrowBox}>
                        {nyPeriode.typeUttak === 'gradert' && (
                        <div>
                          <div>
                            <SelectField
                              label={{ id: 'UttakInfoPanel.Aktivitet' }}
                              bredde="xl"
                              name="arbeidsForhold"
                              validate={[requiredIfNotPristine, required]}
                              selectValues={mapArbeidsforhold(andeler)}
                            />
                          </div>
                          <FlexRow>
                            <FlexColumn>
                              <DecimalField
                                name="arbeidstidprosent"
                                label={{ id: 'UttakInfoPanel.AndelIArbeid' }}
                                bredde="XS"
                                validate={[required, maxValue100, hasValidDecimal]}
                                normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                                inputClassName={styles.textAlignRight}
                              />
                            </FlexColumn>
                            <FlexColumn className={styles.suffix}>%</FlexColumn>
                          </FlexRow>
                        </div>
                        )}

                        {nyPeriode.typeUttak === 'utsettelse' && (
                        <SelectField
                          label={{ id: 'UttakInfoPanel.ArsakUtsettelse' }}
                          bredde="xl"
                          name="periodeArsak"
                          selectValues={mapUtsettelseÅrsaker(utsettelseÅrsaker)}
                          validate={[required]}
                        />
                        )}
                      </div>
                      )}
                  </FlexColumn>
                </FlexRow>
                <FlexRow>
                  <FlexColumn>
                    <div className={styles.textAreaStyle}>
                      <TextAreaField
                        name="begrunnelse"
                        label={{ id: 'UttakInfoPanel.BegrunnEndringene' }}
                        validate={[required, minLength3, maxLength4000, hasValidText]}
                        maxLength={4000}
                      />
                    </div>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
              <div>
                <VerticalSpacer twentyPx />
                <Hovedknapp
                  className={styles.oppdaterMargin}
                  htmlType="button"
                  mini
                  onClick={formProps.handleSubmit}
                  spinner={formProps.submitting}
                >
                  <FormattedMessage id="UttakInfoPanel.Oppdater" />
                </Hovedknapp>
                <Knapp
                  htmlType="button"
                  mini
                  onClick={newPeriodeResetCallback}
                >
                  <FormattedMessage id="UttakInfoPanel.Avbryt" />
                </Knapp>
              </div>
            </div>
          </div>
        </Column>
      </Row>
    </div>
  );
};

UttakNyPeriode.propTypes = {
  newPeriodeCallback: PropTypes.func.isRequired,
  newPeriodeResetCallback: PropTypes.func.isRequired,
  periodeTyper: PropTypes.arrayOf(PropTypes.shape()),
  utsettelseÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  overføringÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  andeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  nyPeriode: PropTypes.shape().isRequired,
  sokerKjonn: PropTypes.string.isRequired,
  nyPeriodeDisabledDaysFom: PropTypes.string.isRequired,
};

UttakNyPeriode.defaultProps = {
  periodeTyper: null,
};

const getPeriodeData = (periode, periodeArray) => periodeArray
  .filter(({ kode }) => kode === periode);

const getResultat = (utsettelseÅrsak, uttakPeriodeVurderingTyper) => {
  if ([utsettelseArsakCodes.INSTITUSJONSOPPHOLD_SØKER, utsettelseArsakCodes.INSTITUSJONSOPPHOLD_BARNET, utsettelseArsakCodes.SYKDOM]
    .some(årsak => årsak === utsettelseÅrsak.kode)) {
    return uttakPeriodeVurderingTyper.find(type => type.kode === uttakPeriodeVurdering.PERIODE_OK);
  }
  return uttakPeriodeVurderingTyper.find(type => type.kode === uttakPeriodeVurdering.PERIODE_IKKE_VURDERT);
};


const transformValues = (values, periodeTyper, utsettelseÅrsaker, overføringÅrsaker, uttakPeriodeVurderingTyper) => {
  const periodeObjekt = getPeriodeData(values.periodeType, periodeTyper)[0] || null;
  const utsettelseÅrsakObjekt = getPeriodeData(values.periodeArsak, utsettelseÅrsaker)[0];
  const overføringÅrsakObjekt = getPeriodeData(values.periodeOverforingArsak, overføringÅrsaker)[0];

  const utsettelseÅrsak = utsettelseÅrsakObjekt !== undefined ? {
    kode: utsettelseÅrsakObjekt.kode,
    kodeverk: utsettelseÅrsakObjekt.kodeverk,
    navn: utsettelseÅrsakObjekt.navn,
  } : {
    kode: utsettelseArsakCodes.UDEFINERT,
  };
  const overføringÅrsak = overføringÅrsakObjekt !== undefined ? {
    kode: overføringÅrsakObjekt.kode,
    kodeverk: overføringÅrsakObjekt.kodeverk,
    navn: overføringÅrsakObjekt.navn,
  } : {
    kode: overforingArsak.UDEFINERT,
  };

  const resultat = getResultat(utsettelseÅrsak, uttakPeriodeVurderingTyper);
  const arbeidsForhold = values.arbeidsForhold ? values.arbeidsForhold.split('|') : null;

  const arbeidsgiver = arbeidsForhold && (arbeidsForhold[0] !== '-' || arbeidsForhold[2] !== '-') ? {
    identifikator: arbeidsForhold[0] !== '-' ? arbeidsForhold[0] : undefined,
    navn: arbeidsForhold[1] ? arbeidsForhold[1] : undefined,
    aktørId: arbeidsForhold[2] !== '-' ? arbeidsForhold[2] : undefined,
    virksomhet: arbeidsForhold[3] !== '-',
    arbeidType: arbeidsForhold[4],
  } : null;

  return {
    id: guid(),
    arbeidstidsprosent: values.arbeidstidprosent ? +values.arbeidstidprosent : null,
    updated: false,
    bekreftet: true,
    openForm: false,
    samtidigUttak: values.samtidigUttak,
    samtidigUttaksprosent: values.samtidigUttaksprosent,
    flerbarnsdager: values.flerbarnsdager,
    erArbeidstaker: arbeidsForhold && arbeidsForhold[4] === uttakArbeidType.ORDINÆRT_ARBEID,
    fom: values.fom,
    tom: values.tom,
    isFromSøknad: false,
    begrunnelse: values.begrunnelse,
    saksebehandlersBegrunnelse: values.begrunnelse,
    uttakPeriodeType: periodeObjekt ? {
      kode: periodeObjekt.kode,
      kodeverk: periodeObjekt.kodeverk,
      navn: periodeObjekt.navn,
    } : { kode: '-' },
    arbeidsgiver,
    utsettelseÅrsak,
    overføringÅrsak,
    resultat,
  };
};

const validateNyPeriodeForm = (values) => {
  const errors = {};

  const invalid = required(values.fom) || hasValidPeriod(values.fom, values.tom);

  if (invalid) {
    errors.fom = invalid;
  }

  return errors;
};

const mapStateToProps = (state, ownProps) => {
  const periodeTyper = getKodeverk(kodeverkTyper.UTTAK_PERIODE_TYPE)(state) || null;
  const utsettelseÅrsaker = getKodeverk(kodeverkTyper.UTSETTELSE_ARSAK)(state);
  const overføringÅrsaker = getKodeverk(kodeverkTyper.OVERFOERING_AARSAK_TYPE)(state);
  const personopplysninger = getPersonopplysning(state);
  const andeler = getFaktaArbeidsforhold(state) || [];

  return {
    periodeTyper,
    utsettelseÅrsaker,
    overføringÅrsaker,
    andeler,
    sokerKjonn: personopplysninger.navBrukerKjonn.kode,
    initialValues: {
      fom: null,
      tom: null,
      periodeType: null,
      periodeOverforingArsak: null,
      periodeArsak: null,
      arbeidsForhold: null,
      arbeidstidprosent: null,
      typeUttak: null,
      flerbarnsdager: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
    },
    nyPeriode: behandlingFormValueSelector('nyPeriodeForm')(
      state,
      'fom',
      'tom',
      'periodeType',
      'periodeOverforingArsak',
      'periodeArsak',
      'samtidigUttak',
      'arbeidsForhold',
      'arbeidstidprosent',
      'typeUttak',
    ),

    onSubmit: values => ownProps.newPeriodeCallback(
      transformValues(values, periodeTyper, utsettelseÅrsaker, overføringÅrsaker, ownProps.uttakPeriodeVurderingTyper),
    ),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'nyPeriodeForm',
  validate: values => validateNyPeriodeForm(values),
  enableReinitialize: true,
})(UttakNyPeriode));
