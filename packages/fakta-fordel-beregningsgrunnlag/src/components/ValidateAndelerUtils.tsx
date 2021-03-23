import { IntlShape } from 'react-intl';

import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import AktivitetStatus, { aktivitetstatusTilAndeltypeMap } from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  dateIsAfter, formatCurrencyNoKr, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';

import { ArbeidsgiverOpplysningerPerId, Kodeverk } from '@fpsak-frontend/types';
import { GRADERING_RANGE_DENOMINATOR, mapToBelop } from './BgFordelingUtils';
import { createVisningsnavnForAktivitetFordeling } from './util/visningsnavnHelper';

const convertToNumber = (n) => (n == null || undefined ? null : Number(removeSpacesFromNumber(n)));

export const compareAndeler = (andel1, andel2) => {
  if (andel1.andelsinfo === andel2.andelsinfo) {
    if (andel1.inntektskategori === andel2.inntektskategori) {
      return 0;
    }
    return andel1.inntektskategori > andel2.inntektskategori ? 1 : -1;
  }
  return andel1.andelsinfo > andel2.andelsinfo ? 1 : -1;
};

const mapAndelToSortedObject = (value, andelList) => {
  const {
    nyAndel, andel, inntektskategori, aktivitetStatus, arbeidsforholdId,
  } = value;
  if (nyAndel) {
    if (!Number.isNaN(Number(andel))) {
      const matchendeAndelFraListe = andelList.filter((andelValue) => andelValue.andelsnr === parseFloat(andel));
      if (matchendeAndelFraListe.length > 0) {
        return { andelsinfo: matchendeAndelFraListe[0].andel + arbeidsforholdId, inntektskategori };
      }
    }
    if (beregningsgrunnlagAndeltyper[andel]) {
      return { andelsinfo: andel, inntektskategori };
    }
    return { andelsinfo: andel + arbeidsforholdId, inntektskategori };
  }
  if (aktivitetstatusTilAndeltypeMap[aktivitetStatus]) {
    return { andelsinfo: aktivitetstatusTilAndeltypeMap[aktivitetStatus], inntektskategori };
  }
  return { andelsinfo: andel + arbeidsforholdId, inntektskategori };
};

export const ulikeAndelerErrorMessage = () => ([{ id: 'BeregningInfoPanel.FordelBG.Validation.UlikeAndeler' }]);

const erAndelerLike = (andel1, andel2) => andel2.andelsinfo === andel1.andelsinfo && andel2.inntektskategori === andel1.inntektskategori;

export const validateUlikeAndelerWithGroupingFunction = (andelList, mapToSort) => {
  const mappedAndeler = andelList.map((value) => (mapToSort(value, andelList)));
  const sortedAndeler = mappedAndeler.slice().sort((andel1, andel2) => compareAndeler(andel1, andel2));
  for (let i = 0; i < sortedAndeler.length - 1; i += 1) {
    if (erAndelerLike(sortedAndeler[i], sortedAndeler[i + 1])) {
      return ulikeAndelerErrorMessage();
    }
  }
  return null;
};

export const validateUlikeAndeler = (andelList) => validateUlikeAndelerWithGroupingFunction(andelList, mapAndelToSortedObject);

const finnArbeidsforholdRefusjonsinfoListe = (andelList) => {
  const andelerMedArbeidsforhold = andelList.filter((andel) => andel.arbeidsforholdId !== '');
  const arbeidsforholdRefusjonsbelop = [];
  andelerMedArbeidsforhold.forEach((andel) => {
    const infoIndex = arbeidsforholdRefusjonsbelop
      .findIndex(({ arbeidsforholdId, arbeidsgiverId }) => arbeidsforholdId === andel.arbeidsforholdId && arbeidsgiverId === andel.arbeidsgiverId);
    if (infoIndex >= 0) {
      const belopsInfo = arbeidsforholdRefusjonsbelop[infoIndex];
      if (belopsInfo.refusjonskravFraInntektsmelding < andel.refusjonskravFraInntektsmelding) {
        arbeidsforholdRefusjonsbelop[infoIndex].refusjonskravFraInntektsmelding = andel.refusjonskravFraInntektsmelding;
      }
      if (andel.refusjonskrav !== null && andel.refusjonskrav !== undefined) {
        arbeidsforholdRefusjonsbelop[infoIndex].totalRefusjon = belopsInfo.totalRefusjon + Number(removeSpacesFromNumber(andel.refusjonskrav));
      }
    } else {
      const {
        refusjonskravFraInntektsmelding, arbeidsforholdId,
        arbeidsgiverNavn, arbeidsgiverId, eksternArbeidsforholdId,
      } = andel;
      let totalRefusjon = 0;
      if (andel.refusjonskrav !== null && andel.refusjonskrav !== undefined) {
        totalRefusjon = Number(removeSpacesFromNumber(andel.refusjonskrav));
      }
      arbeidsforholdRefusjonsbelop.push({
        arbeidsforholdId,
        eksternArbeidsforholdId,
        arbeidsgiverNavn,
        arbeidsgiverId,
        refusjonskravFraInntektsmelding,
        totalRefusjon,
      });
    }
  });
  return arbeidsforholdRefusjonsbelop;
};

export const skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding = (arbeidsgiver) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.IkkjeHogereRefusjonEnnInntektsmelding' },
    { arbeidsgiver }]);

export const validateTotalRefusjonPrArbeidsforhold = (andelList,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId) => {
  const arbeidsforholdRefusjonsinfo = finnArbeidsforholdRefusjonsinfoListe(andelList);
  const arbeidsforholdMedForHogRefusjon = arbeidsforholdRefusjonsinfo
    .filter((refusjonsInfo) => refusjonsInfo.totalRefusjon > refusjonsInfo.refusjonskravFraInntektsmelding);
  if (arbeidsforholdMedForHogRefusjon.length > 0) {
    const agOpplysninger = arbeidsgiverOpplysningerPerId[arbeidsforholdMedForHogRefusjon[0].arbeidsgiverId];
    let arbeidsgiverString;
    if (!agOpplysninger) {
      arbeidsgiverString = arbeidsforholdMedForHogRefusjon[0].arbeidsforholdType ? getKodeverknavn(arbeidsforholdMedForHogRefusjon[0].arbeidsforholdType) : '';
    } else {
      arbeidsgiverString = createVisningsnavnForAktivitetFordeling(agOpplysninger, arbeidsforholdMedForHogRefusjon[0].eksternArbeidsforholdId);
    }
    return skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverString);
  }
  return null;
};

export const skalVereLikFordelingMessage = (fordeling) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.LikFordeling' },
    { fordeling }]);

export const kanIkkjeHaNullBeregningsgrunnlagError = (intl: IntlShape): string => intl
  .formatMessage({ id: 'FordelBeregningsgrunnlag.Validation.KanIkkeHaNullIBeregningsgrunnlag' });

export const totalRefusjonMåVereLavereEnn = (seksG) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.TotalRefusjonSkalIkkeOverstige' }, { seksG }]);

const totalRefusjonSkalVereLavereEnn = (
  value, seksG,
) => ((value >= Math.round(seksG)) ? totalRefusjonMåVereLavereEnn(formatCurrencyNoKr(seksG)) : undefined);

export const totalFordelingForMåVæreLavereEnn = (seksG: number, andelsliste: string) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.TotalFordelingLavereEnn' }, { seksG, andelsliste }]);

const totalFordelingSkalVereLavereEnn = (
  value, seksG, beskrivendeString, errorMessage,
) => ((value >= Math.round(seksG)) ? errorMessage(formatCurrencyNoKr(seksG), beskrivendeString) : undefined);

export const likFordeling = (
  value, fordeling,
) => ((value !== Math.round(fordeling)) ? skalVereLikFordelingMessage(formatCurrencyNoKr(Math.round(fordeling))) : null);

export const validateRefusjonsbelop = (refusjonskrav, skalKunneEndreRefusjon): string | undefined => {
  let refusjonskravError;
  if (skalKunneEndreRefusjon) {
    refusjonskravError = required(refusjonskrav);
  }
  return refusjonskravError;
};

const validateFordelingForGradertAndel = (intl: IntlShape, andel, periodeDato): string | null => {
  const arbeidsforholdIkkeOpphørt = !andel.arbeidsperiodeTom || dateIsAfter(andel.arbeidsperiodeTom, periodeDato.fom);
  if (!andel.andelIArbeid || !arbeidsforholdIkkeOpphørt) {
    return null;
  }
  if (!Number.isNaN(Number(andel.andelIArbeid))) {
    const arbeidsprosent = Number(andel.andelIArbeid);
    if (arbeidsprosent > 0 && Number(andel.fastsattBelop) === 0) {
      return kanIkkjeHaNullBeregningsgrunnlagError(intl);
    }
  }
  const arbeidsprosenter = andel.andelIArbeid.split(GRADERING_RANGE_DENOMINATOR);
  const arbeidsprosenterOverNull = arbeidsprosenter.filter((val) => val > 0);
  if (arbeidsprosenterOverNull.length > 0 && Number(andel.fastsattBelop) === 0) {
    return kanIkkjeHaNullBeregningsgrunnlagError(intl);
  }
  return null;
};

export const validateFastsattBelop = (intl: IntlShape, andelFieldValues, periodeDato): string | null => {
  let fastsattBelopError = required(andelFieldValues.fastsattBelop);
  if (!fastsattBelopError) {
    fastsattBelopError = validateFordelingForGradertAndel(intl, andelFieldValues, periodeDato);
  }
  return fastsattBelopError;
};

export const hasFieldErrors = (fieldErrors) => (fieldErrors.refusjonskrav || fieldErrors.andel
  || fieldErrors.fastsattBelop || fieldErrors.inntektskategori);

export const validateAndelFields = (intl: IntlShape, andelFieldValues, periodeDato) => {
  const {
    refusjonskrav, skalKunneEndreRefusjon,
    andel, inntektskategori,
  } = andelFieldValues;
  const fieldErrors = {
    refusjonskrav: undefined,
    fastsattBelop: undefined,
    andel: undefined,
    inntektskategori: undefined,
  };
  fieldErrors.refusjonskrav = validateRefusjonsbelop(refusjonskrav, skalKunneEndreRefusjon);
  fieldErrors.fastsattBelop = validateFastsattBelop(intl, andelFieldValues, periodeDato);
  fieldErrors.andel = required(andel);
  fieldErrors.inntektskategori = required(inntektskategori);
  return hasFieldErrors(fieldErrors) ? fieldErrors : null;
};

export const validateAndeler = (intl: IntlShape, values, periodeDato) => {
  if (!values) {
    return null;
  }
  const arrayErrors = values.map((andelFieldValues) => {
    if (!andelFieldValues.skalRedigereInntekt) {
      return null;
    }
    return validateAndelFields(intl, andelFieldValues, periodeDato);
  });
  if (arrayErrors.some((errors) => errors !== null)) {
    return arrayErrors;
  }
  return null;
};

export const validateSumFastsattBelop = (values, fordeling) => {
  const sumFastsattBelop = values.map(mapToBelop)
    .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);
  return fordeling !== undefined && fordeling !== null ? likFordeling(sumFastsattBelop, fordeling) : null;
};

export const validateSumRefusjon = (values, grunnbeløp) => {
  const harGraderingUtenRefusjon = !!values.find((v) => v.andelIArbeid !== '0.00' && convertToNumber(v.refusjonskrav) === 0);
  const sumRefusjon = values.map(({ refusjonskrav }) => convertToNumber(refusjonskrav))
    .reduce((sum, refusjonskrav) => sum + refusjonskrav, 0);
  const seksG = 6 * grunnbeløp;
  return harGraderingUtenRefusjon ? totalRefusjonSkalVereLavereEnn(sumRefusjon, seksG) : null;
};

const lagBeskrivendeStringAvStatuser = (statuser: string[], getKodeverknavn) => {
  const liste = statuser.map((status) => getKodeverknavn({ kode: status, kodeverk: 'AKTIVITET_STATUS' }));
  liste.sort((a, b) => a.localeCompare(b));
  const unikListe = [...new Set(liste)];
  return unikListe.join(', ');
};

const finnFastsattBeløpForStatus = (values: any, statuser: string[]): number => values.filter((v) => statuser.includes(v.aktivitetStatus))
  .map(mapToBelop)
  .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);

const validateSumFastsattArbeidstaker = (values: any, seksG: number, getKodeverknavn: (kodeverk: Kodeverk) => string) => {
  const statuserSomValideres = [AktivitetStatus.ARBEIDSTAKER];
  const sumFastsattBelop = finnFastsattBeløpForStatus(values, statuserSomValideres);
  const beskrivendeString = lagBeskrivendeStringAvStatuser(statuserSomValideres, getKodeverknavn);
  return totalFordelingSkalVereLavereEnn(sumFastsattBelop, seksG, beskrivendeString, totalFordelingForMåVæreLavereEnn);
};

const validateSumFastsattArbeidstakerOgFrilanser = (values, seksG, getKodeverknavn: (kodeverk: Kodeverk) => string) => {
  const statuserSomPrioriteresOverSN = [AktivitetStatus.ARBEIDSTAKER,
    AktivitetStatus.FRILANSER,
    AktivitetStatus.DAGPENGER,
    AktivitetStatus.ARBEIDSAVKLARINGSPENGER];
  const statuserSomValideres = values.filter((v) => statuserSomPrioriteresOverSN.includes(v.aktivitetStatus)).map((v) => v.aktivitetStatus);
  const sumFastsattBelop = finnFastsattBeløpForStatus(values, statuserSomValideres);
  const beskrivendeString = lagBeskrivendeStringAvStatuser(statuserSomValideres, getKodeverknavn);
  return totalFordelingSkalVereLavereEnn(sumFastsattBelop, seksG, beskrivendeString, totalFordelingForMåVæreLavereEnn);
};

export const validateSumFastsattForUgraderteAktiviteter = (values, grunnbeløp, getKodeverknavn) => {
  const skalGradereFL = !!values.find((v) => v.andelIArbeid !== '0.00' && v.aktivitetStatus === AktivitetStatus.FRILANSER);
  const seksG = 6 * grunnbeløp;
  if (skalGradereFL) {
    return validateSumFastsattArbeidstaker(values, seksG, getKodeverknavn);
  }
  const skalGradereSN = !!values.find((v) => v.andelIArbeid !== '0.00' && v.aktivitetStatus === AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  if (skalGradereSN) {
    return validateSumFastsattArbeidstakerOgFrilanser(values, seksG, getKodeverknavn);
  }
  return null;
};
