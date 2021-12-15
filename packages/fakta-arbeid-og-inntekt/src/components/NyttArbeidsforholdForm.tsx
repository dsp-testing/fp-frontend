import React, {
  FunctionComponent, useCallback, useMemo,
} from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useForm, UseFormGetValues } from 'react-hook-form';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp, Flatknapp } from 'nav-frontend-knapper';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Column, Row } from 'nav-frontend-grid';

import binIcon from '@fpsak-frontend/assets/images/bin.svg';
import { AoIArbeidsforhold } from '@fpsak-frontend/types';
import {
  hasValidText, maxLength, minLength, hasValidDate, hasValidInteger, required, minValue, maxValue, dateAfterOrEqual,
} from '@fpsak-frontend/utils';
import {
  TextAreaField, DatepickerField, InputField, Form,
} from '@fpsak-frontend/form-hooks';
import {
  VerticalSpacer, FlexColumn, FlexContainer, FlexRow, Image, FloatRight,
} from '@fpsak-frontend/shared-components';

import ArbeidsforholdOgInntekt from '../types/arbeidsforholdOgInntekt';

import styles from './nyttArbeidsforholdForm.less';

export const MANUELT_ORG_NR = '342352362';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const minValue1 = minValue(1);
const maxValue100 = maxValue(100);

const validerPeriodeRekkefølge = (getValues: UseFormGetValues<any>) => (tom: string) => dateAfterOrEqual(getValues('periodeFra'))(tom);

export type FormValues = {
  arbeidsgiver: string;
  periodeFra: string;
  periodeTil: string;
  stillingsprosent: number;
  begrunnelse: string;
}

interface OwnProps {
  isReadOnly: boolean;
  lagreNyttArbeidsforhold: (formValues: FormValues) => Promise<any>;
  slettNyttArbeidsforhold: () => Promise<any>;
  arbeidsforhold?: AoIArbeidsforhold;
  arbeidsforholdNavn?: string;
  avbrytEditering?: () => void;
  erOverstyrt: boolean;
  oppdaterTabell: React.Dispatch<React.SetStateAction<ArbeidsforholdOgInntekt[]>>
}

const NyttArbeidsforholdForm: FunctionComponent<OwnProps> = ({
  isReadOnly,
  lagreNyttArbeidsforhold,
  slettNyttArbeidsforhold,
  arbeidsforhold,
  arbeidsforholdNavn,
  avbrytEditering,
  erOverstyrt,
  oppdaterTabell,
}) => {
  const intl = useIntl();

  const defaultValues = useMemo(() => (arbeidsforhold ? {
    periodeFra: arbeidsforhold.fom,
    periodeTil: arbeidsforhold.tom,
    stillingsprosent: arbeidsforhold.stillingsprosent,
    begrunnelse: arbeidsforhold.begrunnelse,
    arbeidsgiver: arbeidsforholdNavn,
  } : undefined), [arbeidsforhold, arbeidsforholdNavn]);

  const formMethods = useForm<FormValues>({
    defaultValues,
  });

  const avbryt = useCallback(() => {
    avbrytEditering();
    formMethods.reset();
  }, []);

  const lagre = useCallback((formValues: FormValues) => {
    lagreNyttArbeidsforhold(formValues).then(() => {
      oppdaterTabell((oldData) => {
        const index = oldData.findIndex((data) => data.arbeidsforhold?.arbeidsgiverIdent === MANUELT_ORG_NR);

        const af = {
          arbeidsforhold: {
            arbeidsgiverIdent: MANUELT_ORG_NR,
            fom: formValues.periodeFra,
            tom: formValues.periodeTil,
            stillingsprosent: formValues.stillingsprosent,
            begrunnelse: formValues.begrunnelse,
          },
          arbeidsforholdNavn: formValues.arbeidsgiver,
          inntektsmelding: undefined,
          inntektsposter: undefined,
        };

        if (index === -1) {
          return oldData.concat(af);
        }
        return oldData.map((data, i) => {
          if (i === index) {
            return af;
          }
          return data;
        });
      });
      avbryt();
    });
  }, []);

  const slett = useCallback(() => {
    slettNyttArbeidsforhold().then(() => {
      oppdaterTabell((oldData) => oldData.filter((data) => data.arbeidsforhold?.arbeidsgiverIdent !== MANUELT_ORG_NR));
      avbrytEditering();
    });
  }, []);

  return (
    <>
      {!arbeidsforhold && (
        <>
          <Undertittel><FormattedMessage id="LeggTilArbeidsforholdForm.LeggTilArbeidsforhold" /></Undertittel>
          <VerticalSpacer sixteenPx />
          <AlertStripeInfo><FormattedMessage id="LeggTilArbeidsforholdForm.Info" /></AlertStripeInfo>
          <VerticalSpacer thirtyTwoPx />
        </>
      )}
      <Form formMethods={formMethods} onSubmit={(values) => lagre(values)}>
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <InputField
                name="arbeidsgiver"
                label={intl.formatMessage({ id: 'LeggTilArbeidsforholdForm.Arbeidsgiver' })}
                validate={[required]}
                bredde="XXL"
                readOnly={isReadOnly || !erOverstyrt}
              />
            </FlexColumn>
            <FlexColumn>
              <DatepickerField
                name="periodeFra"
                label={<FormattedMessage id="LeggTilArbeidsforholdForm.PeriodeFra" />}
                validate={[required, hasValidDate]}
                readOnly={isReadOnly || !erOverstyrt}
              />
            </FlexColumn>
            <FlexColumn>
              <DatepickerField
                name="periodeTil"
                label={<FormattedMessage id="LeggTilArbeidsforholdForm.PeriodeTil" />}
                validate={[required, hasValidDate, validerPeriodeRekkefølge(formMethods.getValues)]}
                readOnly={isReadOnly || !erOverstyrt}
              />
            </FlexColumn>
            <FlexColumn>
              <InputField
                name="stillingsprosent"
                label={intl.formatMessage({ id: 'LeggTilArbeidsforholdForm.Stillingsprosent' })}
                parse={(value: string) => {
                  const parsedValue = parseInt(value, 10);
                  return Number.isNaN(parsedValue) ? value : parsedValue;
                }}
                validate={[required, hasValidInteger, minValue1, maxValue100]}
                bredde="XS"
                readOnly={isReadOnly || !erOverstyrt}
              />
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer sixteenPx />
        <TextAreaField
          label={<FormattedMessage id="LeggTilArbeidsforholdForm.Begrunn" />}
          name="begrunnelse"
          validate={[required, minLength3, maxLength1500, hasValidText]}
          maxLength={1500}
          readOnly={isReadOnly || !erOverstyrt}
        />
        <VerticalSpacer sixteenPx />
        {erOverstyrt && (
          <Row>
            <Column xs="8">
              <FlexContainer>
                <FlexRow>
                  <FlexColumn>
                    <Knapp
                      mini
                      spinner={formMethods.formState.isSubmitting}
                      disabled={!formMethods.formState.isDirty || formMethods.formState.isSubmitting}
                      htmlType="submit"
                    >
                      <FormattedMessage id="LeggTilArbeidsforholdForm.Lagre" />
                    </Knapp>
                  </FlexColumn>
                  <FlexColumn>
                    <Flatknapp
                      mini
                      spinner={false}
                      disabled={formMethods.formState.isSubmitting}
                      onClick={avbryt}
                      htmlType="button"
                    >
                      <FormattedMessage id="LeggTilArbeidsforholdForm.Avbryt" />
                    </Flatknapp>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
            </Column>
            {arbeidsforhold && (
              <Column xs="4">
                <FloatRight>
                  <Flatknapp
                    mini
                    spinner={false}
                    disabled={formMethods.formState.isSubmitting}
                    onClick={slett}
                    htmlType="button"
                  >
                    <Image src={binIcon} className={styles.buttonImage} />
                    <span><FormattedMessage id="LeggTilArbeidsforholdForm.Slett" /></span>
                  </Flatknapp>
                </FloatRight>
              </Column>
            )}
          </Row>
        )}
      </Form>
    </>
  );
};

export default NyttArbeidsforholdForm;
