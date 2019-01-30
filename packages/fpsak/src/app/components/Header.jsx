import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Systemtittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';

import logoUrl from '@fpsak-frontend/assets/images/nav.svg';
import navAnsattIkonUrl from '@fpsak-frontend/assets/images/nav_ansatt.svg';
import rettskildeneIkonUrl from '@fpsak-frontend/assets/images/rettskildene.svg';
import systemrutineIkonUrl from '@fpsak-frontend/assets/images/rutine.svg';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from 'data/eksterneLenker';

import ErrorMessagePanel from './ErrorMessagePanel';
import styles from './header.less';

/**
 * Header
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const Header = ({
  navAnsattName,
  removeErrorMessage,
  queryStrings,
}) => (
  <header className={styles.container}>
    <FlexContainer>
      <FlexRow className={styles.dekorator} role="banner">
        <FlexColumn className={styles.logo}>
          <Link to="/">
            <Image
              className={styles.headerIkon}
              src={logoUrl}
              altCode="Header.LinkToMainPage"
              titleCode="Header.LinkToMainPage"
            />
          </Link>
        </FlexColumn>

        <Systemtittel><FormattedMessage id="Header.Foreldrepenger" /></Systemtittel>
        <FlexColumn className="justifyItemsToFlexEnd">
          <FlexRow className="justifyItemsToFlexEnd">
            <FlexColumn>
              <Image
                className={styles.headerIkon}
                src={systemrutineIkonUrl}
                onMouseDown={() => window.open(SYSTEMRUTINE_URL, '_blank')}
                onKeyDown={() => window.open(SYSTEMRUTINE_URL, '_blank')}
                altCode="Header.Systemrutine"
                titleCode="Header.Systemrutine"
                tabIndex="0"
              />
            </FlexColumn>
            <FlexColumn>
              <Image
                className={styles.headerIkon}
                src={rettskildeneIkonUrl}
                onMouseDown={() => window.open(RETTSKILDE_URL, '_blank')}
                onKeyDown={() => window.open(RETTSKILDE_URL, '_blank')}
                altCode="Header.Rettskilde"
                titleCode="Header.Rettskilde"
                tabIndex="0"
              />
            </FlexColumn>
            <FlexColumn className={styles.navAnsatt}>
              <Image
                className={styles.headerIkon}
                src={navAnsattIkonUrl}
                altCode="Header.NavAnsatt"
                titleCode="Header.NavAnsatt"
              />
              <span>{navAnsattName}</span>
            </FlexColumn>
          </FlexRow>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <ErrorMessagePanel queryStrings={queryStrings} removeErrorMessage={removeErrorMessage} />
  </header>
);

Header.propTypes = {
  queryStrings: PropTypes.shape().isRequired,
  navAnsattName: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
};

export default Header;
