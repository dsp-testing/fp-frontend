import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import { faktaPanelCodes, FaktaEkspandertpanel } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { MedlemskapInfoPanel } from './MedlemskapInfoPanel';
import StartdatoForForeldrepengerperiodenForm from './startdatoForPeriode/StartdatoForForeldrepengerperiodenForm';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

describe('<MedlemskapInfoPanel>', () => {
  it('skal vise ekspanderbart panel', () => {
    const wrapper = shallowWithIntl(<MedlemskapInfoPanel
      intl={intlMock}
      aksjonspunkter={[]}
      aksjonspunkterMinusAvklarStartDato={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
      behandlingType={{
        kode: 'TEst',
      }}
      soknad={{}}
      inntektArbeidYtelse={{}}
      alleKodeverk={{}}
      medlemskap={{}}
      medlemskapV2={{}}
      fagsakPerson={{}}
      behandlingPaaVent={false}
      readOnlyBehandling={false}
    />);

    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel).has.length(1);
    expect(panel.prop('title')).to.eql('MedlemskapInfoPanel.Medlemskap');
    expect(panel.prop('hasOpenAksjonspunkter')).is.false;
    expect(panel.prop('isInfoPanelOpen')).is.false;
    expect(panel.prop('faktaId')).to.eql(faktaPanelCodes.MEDLEMSKAPSVILKARET);
    expect(panel.prop('readOnly')).is.true;
  });

  it('skal vise form for startdato for foreldrepengerperioden når en har aksjonspunktet for dette', () => {
    const avklarStartdatoAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<MedlemskapInfoPanel
      intl={intlMock}
      aksjonspunkter={[avklarStartdatoAksjonspunkt]}
      aksjonspunkterMinusAvklarStartDato={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
      behandlingType={{
        kode: 'TEst',
      }}
      soknad={{}}
      inntektArbeidYtelse={{}}
      alleKodeverk={{}}
      medlemskap={{}}
      medlemskapV2={{}}
      fagsakPerson={{}}
      behandlingPaaVent={false}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(1);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(0);
  });

  it('skal vise form for startdato for foreldrepengerperioden når en har overstyr-aksjonspunktet for dette', () => {
    const avklarStartdatoAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<MedlemskapInfoPanel
      intl={intlMock}
      aksjonspunkter={[avklarStartdatoAksjonspunkt]}
      aksjonspunkterMinusAvklarStartDato={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
      behandlingType={{
        kode: 'TEst',
      }}
      soknad={{}}
      inntektArbeidYtelse={{}}
      alleKodeverk={{}}
      medlemskap={{}}
      medlemskapV2={{}}
      fagsakPerson={{}}
      behandlingPaaVent={false}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(1);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(0);
  });

  it('skal vise begge medlemskapsformer når aksjonspunkt for startdato for foreldrepengerperioden er avklart', () => {
    const avklarStartdatoAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: false,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<MedlemskapInfoPanel
      intl={intlMock}
      aksjonspunkter={[avklarStartdatoAksjonspunkt]}
      aksjonspunkterMinusAvklarStartDato={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
      behandlingType={{
        kode: 'TEst',
      }}
      soknad={{}}
      inntektArbeidYtelse={{}}
      alleKodeverk={{}}
      medlemskap={{}}
      medlemskapV2={{}}
      fagsakPerson={{}}
      behandlingPaaVent={false}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(1);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(1);
  });

  it('skal vise panel for avklaring av startdato for foreldrepengerperioden, for å tilate manuell korrigering selvom aksjonspunktet ikke finnes', () => {
    const wrapper = shallowWithIntl(<MedlemskapInfoPanel
      intl={intlMock}
      aksjonspunkter={[]}
      aksjonspunkterMinusAvklarStartDato={[]}
      openInfoPanels={['medlemskapsvilkaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
      behandlingType={{
        kode: 'TEst',
      }}
      soknad={{}}
      inntektArbeidYtelse={{}}
      alleKodeverk={{}}
      medlemskap={{}}
      medlemskapV2={{}}
      fagsakPerson={{}}
      behandlingPaaVent={false}
      readOnlyBehandling={false}
    />);

    expect(wrapper.find(StartdatoForForeldrepengerperiodenForm)).has.length(1);
    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(1);
  });
});
