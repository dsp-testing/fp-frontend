import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Element, Normaltekst, Undertekst,
} from 'nav-frontend-typografi';

import { VerticalSpacer, AvsnittSkiller } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import { Column, Row } from 'nav-frontend-grid';
import { BeregningsgrunnlagAndel, PgiVerdier } from '@fpsak-frontend/types';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';

const createHeaderRow = (): React.ReactNode => (
  <Row key="SNInntektHeader">
    <Column xs="10">
      <Undertekst className={beregningStyles.etikettLiten}>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AarHeader" />
      </Undertekst>
    </Column>
    <Column xs="2" className={beregningStyles.colAarText}>

      <Undertekst className={beregningStyles.etikettLiten}>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotalPensjonsGivende" />
      </Undertekst>
    </Column>
  </Row>
);
const createSumRow = (pgiSnitt: number): React.ReactNode => (
  <>
    <Row key="grunnlagAarsinntektSNLine">
      <Column xs="12" className={beregningStyles.noPaddingRight}>
        <div className={beregningStyles.colDevider} />
      </Column>
    </Row>
    <Row key="grunnlagAarsinntektSN">
      <Column xs="10" className={beregningStyles.rightAlignTextInDiv}>
        <Element>
          <FormattedMessage
            id="Beregningsgrunnlag.AarsinntektPanel.SnittPensjonsGivende"
          />
        </Element>
      </Column>
      <Column xs="2" className={beregningStyles.colAarText}>
        <Element>
          {formatCurrencyNoKr(pgiSnitt)}
        </Element>
      </Column>
    </Row>
  </>
);
const createInntektRows = (pgiVerdier: PgiVerdier[]): React.ReactNode => (
  <>
    {pgiVerdier.map((element) => (
      <Row key={element.årstall}>
        <Column xs="7">
          <Undertekst>
            {element.årstall}
          </Undertekst>
        </Column>
        <Column xs="5" className={beregningStyles.colAarText}>
          <Undertekst>
            {formatCurrencyNoKr(element.beløp)}
          </Undertekst>
        </Column>
      </Row>
    ))}
  </>
);

type OwnProps = {
    alleAndeler: BeregningsgrunnlagAndel[];
};

/**
 * GrunnlagForAarsinntektPanelSN
 *
 * Presentasjonskomponent. Viser PGI-verdier for selvstendig næringsdrivende.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer selvstendig næringsdrivende.
 */
export const GrunnlagForAarsinntektPanelSN: FunctionComponent<OwnProps> = ({ alleAndeler }) => {
  const snAndel = alleAndeler.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  if (!snAndel) {
    return null;
  }
  const { pgiVerdier, pgiSnitt } = snAndel;
  return (
    <>
      <AvsnittSkiller spaceAbove spaceUnder />
      <Element className={beregningStyles.avsnittOverskrift}>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivendeinntekt" />
      </Element>
      <VerticalSpacer eightPx />
      <Row key="SNInntektIngress">
        <Column xs="8">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.SN.sisteTreAar" />
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer fourPx />
      {createHeaderRow()}
      {!!pgiVerdier && (
        <>
          {createInntektRows(pgiVerdier)}
        </>
      )}
      {pgiSnitt !== undefined && (
        <>
          {createSumRow(pgiSnitt)}
        </>
      )}
    </>
  );
};

export default GrunnlagForAarsinntektPanelSN;
