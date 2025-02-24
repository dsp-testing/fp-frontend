import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { KodeverkMedNavn } from '@fpsak-frontend/types';
import MenyNyBehandlingIndex from './MenyNyBehandlingIndex';

export default {
  title: 'sak/sak-meny-ny-behandling',
  component: MenyNyBehandlingIndex,
};

const behandlingstyper = [{
  kode: behandlingType.FORSTEGANGSSOKNAD,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Førstegangssøknad',
}, {
  kode: behandlingType.REVURDERING,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Revurdering',
}, {
  kode: behandlingType.KLAGE,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Klage',
}, {
  kode: behandlingType.DOKUMENTINNSYN,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Dokumentinnsyn',
}, {
  kode: behandlingType.TILBAKEKREVING,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Tilbakekreving',
}, {
  kode: behandlingType.TILBAKEKREVING_REVURDERING,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Tilbakekreving revurdering',
}, {
  kode: behandlingType.ANKE,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Anke',
}];

const behandlingOppretting = [{
  behandlingType: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: '',
  },
  kanOppretteBehandling: true,
}, {
  behandlingType: {
    kode: behandlingType.REVURDERING,
    kodeverk: '',
  },
  kanOppretteBehandling: true,
}];

const Template: Story<{
  tilbakekrevingRevurderingArsaker: KodeverkMedNavn[];
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  erTilbakekrevingAktivert: boolean;
  lagNyBehandling: () => void;
  lukkModal: () => void;
}> = ({
  tilbakekrevingRevurderingArsaker,
  kanTilbakekrevingOpprettes,
  erTilbakekrevingAktivert,
  lagNyBehandling,
  lukkModal,
}) => (
  <MenyNyBehandlingIndex
    ytelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: 'YTELSE_TYPE',
    }}
    saksnummer="123"
    behandlingUuid="1"
    behandlingVersjon={2}
    behandlingType={{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    }}
    lagNyBehandling={lagNyBehandling}
    behandlingstyper={behandlingstyper}
    tilbakekrevingRevurderingArsaker={tilbakekrevingRevurderingArsaker}
    revurderingArsaker={[{
      kode: behandlingArsakType.KLAGE_U_INNTK,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Klage uten inntekt',
    }, {
      kode: behandlingArsakType.FØDSEL,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Fødsel',
    }]}
    behandlingOppretting={behandlingOppretting}
    kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
    erTilbakekrevingAktivert={erTilbakekrevingAktivert}
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    sjekkOmTilbakekrevingRevurderingKanOpprettes={action('button-click')}
    lukkModal={lukkModal}
  />
);

export const Default = Template.bind({});
Default.args = {
  lagNyBehandling: action('button-click'),
  lukkModal: action('button-click'),
  tilbakekrevingRevurderingArsaker: [],
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: false,
    kanRevurderingOpprettes: false,
  },
  erTilbakekrevingAktivert: false,
};

export const ForTilbakekreving = Template.bind({});
ForTilbakekreving.args = {
  lagNyBehandling: action('button-click'),
  lukkModal: action('button-click'),
  tilbakekrevingRevurderingArsaker: [{
    kode: behandlingArsakType.RE_KLAGE_KA,
    kodeverk: 'BEHANDLING_ARSAK_TYPE',
    navn: 'Klage KA',
  }, {
    kode: behandlingArsakType.RE_KLAGE_NFP,
    kodeverk: 'BEHANDLING_ARSAK_TYPE',
    navn: 'Klage NFP',
  }],
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: true,
    kanRevurderingOpprettes: true,
  },
  erTilbakekrevingAktivert: true,
};
