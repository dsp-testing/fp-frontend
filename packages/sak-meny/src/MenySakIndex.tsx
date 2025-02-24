import React, {
  useRef, useEffect, useState, useCallback, FunctionComponent,
} from 'react';
import {
  FormattedMessage, RawIntlProvider,
} from 'react-intl';
import { Popover, BoxedListWithSelection } from '@navikt/fp-react-components';
import { Knapp } from 'nav-frontend-knapper';

import { createIntl } from '@fpsak-frontend/utils';
import { Image } from '@fpsak-frontend/shared-components';
import openImage from '@fpsak-frontend/assets/images/pil_opp.svg';
import closedImage from '@fpsak-frontend/assets/images/pil_ned.svg';

import MenyData from './MenyData';

import messages from '../i18n/nb_NO.json';

const intl = createIntl(messages);

interface OwnProps {
  data: MenyData[];
}

const MenySakIndex: FunctionComponent<OwnProps> = ({
  data,
}) => {
  const filtrertData = data.filter((d) => d.erSynlig);

  const [visMenySomApen, setVisMenyTilApen] = useState(false);
  const toggleMenyVisning = useCallback(() => setVisMenyTilApen(!visMenySomApen), [visMenySomApen]);

  const [valgtModal, setValgtModal] = useState(-1);

  const menyRef = useRef<any>(null);
  const handleClickOutside = (event: Event) => {
    if (menyRef.current && !menyRef.current.contains(event.target)) {
      toggleMenyVisning();
    }
  };
  useEffect(() => {
    if (visMenySomApen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visMenySomApen]);

  return (
    <RawIntlProvider value={intl}>
      <div ref={menyRef}>
        <Popover
          popperIsVisible={visMenySomApen}
          renderArrowElement={false}
          customPopperStyles={{ top: '2px', zIndex: 1 }}
          popperProps={{
            children: () => (
              <BoxedListWithSelection
                items={filtrertData.map((d) => ({
                  name: d.tekst,
                }))}
                onClick={(index) => { setValgtModal(index); toggleMenyVisning(); }}
              />
            ),
            placement: 'bottom-start',
            strategy: 'absolute',
          }}
          referenceProps={{
            children: ({ ref }) => (
              <div ref={ref}>
                <Knapp mini kompakt onClick={toggleMenyVisning}>
                  <FormattedMessage id="MenySakIndex.Behandlingsmeny" />
                  <span style={{ marginLeft: '5px' }}>
                    <Image src={visMenySomApen ? openImage : closedImage} />
                  </span>
                </Knapp>
              </div>
            ),
          }}
        />
      </div>
      {valgtModal !== -1 && filtrertData[valgtModal].modal(() => setValgtModal(-1))}
    </RawIntlProvider>
  );
};

export default MenySakIndex;
