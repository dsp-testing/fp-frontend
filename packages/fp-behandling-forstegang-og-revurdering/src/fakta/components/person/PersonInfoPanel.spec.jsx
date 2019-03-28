import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Hovedknapp } from 'nav-frontend-knapper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './panelBody/FullPersonInfo';
import { fjernIdFraArbeidsforholdLagtTilAvSaksbehandler, PersonInfoPanelImpl as PersonInfoPanel } from './PersonInfoPanel';

describe('<PersonInfoPanel>', () => {
  const personopplysninger = {
    navn: 'Parent 1',
    fnr: '26041150695',
    fodselsdato: '2011-04-15',
    navBrukerKjonn: {
      kode: navBrukerKjonn.KVINNE,
      navn: 'kvinne',
    },
    diskresjonskode: {
      kode: 'TEST',
      navn: 'test',
    },
    personstatus: {
      kode: 'Ukjent',
      navn: 'ukjent',
    },
    annenPart: {
      navn: 'Parent 2',
      fnr: '26041250525',
      erKvinne: false,
      fodselsdato: '2012-04-26',
      navBrukerKjonn: {
        kode: navBrukerKjonn.MANN,
        navn: 'kvinne',
      },
      diskresjonskode: {
        kode: 'TEST',
        navn: 'test',
      },
      personstatus: {
        kode: 'Ukjent',
        navn: 'ukjent',
      },
    },
  };

  const personstatusTypes = [
    {
      kode: personstatusType.UFULLSTENDIGFNR,
      navn: 'Ufullstendig fnr',
    },
    {
      kode: personstatusType.UTVANDRET,
      navn: 'Utvandret',
    },
    {
      kode: personstatusType.BOSATT,
      navn: 'Bosatt',
    },
  ];

  const sivilstandTypes = [
    {
      kode: sivilstandType.GIFTLEVERADSKILT,
      navn: 'Gift, lever adskilt',
    },
    {
      kode: sivilstandType.SKILT,
      navn: 'Skilt',
    },
  ];

  const relatertYtelseTypes = [];
  const relatertYtelseStatus = [];

  it('skal ikke vise åpent panel når ingen av foreldrene er valgt', () => {
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={sinon.spy()}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    const panel = wrapper.find(EkspanderbartPersonPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('primaryParent')).to.eql(personopplysninger);
    expect(panel.prop('secondaryParent')).to.eql(personopplysninger.annenPart);
    expect(wrapper.find(FullPersonInfo)).to.have.length(0);
  });

  it('skal ikke vise åpent panel når ingen av foreldrene er valgt', () => {
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={sinon.spy()}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    const panel = wrapper.find(EkspanderbartPersonPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('primaryParent')).to.eql(personopplysninger);
    expect(panel.prop('secondaryParent')).to.eql(personopplysninger.annenPart);
    expect(wrapper.find(FullPersonInfo)).to.have.length(0);
  });

  it('skal vise søkerpanel automatisk når dette er markert i URL (openInfoPanels)', () => {
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={sinon.spy()}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.state('selected')).is.null;
    wrapper.setProps({ openInfoPanels: [faktaPanelCodes.PERSON] });
    expect(wrapper.state('selected')).is.eql(personopplysninger);

    expect(wrapper.find(EkspanderbartPersonPanel)).to.have.length(1);
    const infoPanel = wrapper.find(FullPersonInfo);
    expect(infoPanel).to.have.length(1);
    expect(infoPanel.prop('personopplysning')).to.eql(personopplysninger);
    expect(infoPanel.prop('isPrimaryParent')).is.true;

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal vise knapp for bekreftelse av aksjonspunkt når en har aksjonspunkt AVKLAR_ARBEIDSFORHOLD og har valgt hovedsøker', () => {
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        navn: 'Avklar arbeidsforhold',
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      aksjonspunktType: {
        navn: 'MANUELL',
        kode: aksjonspunktType.MANUELL,
      },
      erAktivt: true,
    },
    ];
    const wrapper = shallow(<PersonInfoPanel
      personopplysninger={personopplysninger}
      relatertTilgrensendeYtelserForSoker={[]}
      relatertTilgrensendeYtelserForAnnenForelder={[]}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      sprakkode={{}}
      readOnly={false}
      isBekreftButtonReadOnly
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
      personstatusTypes={personstatusTypes}
      sivilstandTypes={sivilstandTypes}
      aksjonspunkter={aksjonspunkter}
      {...reduxFormPropsMock}
    />);

    wrapper.setProps({ openInfoPanels: [faktaPanelCodes.PERSON] });

    expect(wrapper.find(Hovedknapp)).to.have.length(1);
  });

  it('skal ikke vise knapp for bekreftelse av aksjonspunkt når en har aksjonspunkt som ikke er AVKLAR_ARBEIDSFORHOLD', () => {
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        navn: 'Søknadsfrist',
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      aksjonspunktType: {
        navn: 'AUTOPUNKT',
        kode: aksjonspunktType.AUTOPUNKT,
      },
      erAktivt: true,
    },
    ];
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={sinon.spy()}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={aksjonspunkter}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setProps({ openInfoPanels: [faktaPanelCodes.PERSON] });

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal ikke vise knapp for bekreftelse av aksjonspunkt når en har aksjonspunkt men annen part er valgt', () => {
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        navn: 'Søknadsfrist',
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      aksjonspunktType: {
        navn: 'AUTOPUNKT',
        kode: aksjonspunktType.AUTOPUNKT,
      },
      erAktivt: true,
    },
    ];
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={sinon.spy()}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={aksjonspunkter}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setState({ selected: personopplysninger.annenPart });

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal velge hovedsøker og legge denne i url ved klikk på hovedsøker i panel-header ', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.null;
    panel.prop('setSelected')(personopplysninger);

    expect(wrapper.state('selected')).is.eql(personopplysninger);

    expect(toggleInfoPanelCallback.calledOnce).to.be.true;
    const { args } = toggleInfoPanelCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(faktaPanelCodes.PERSON);
  });

  it('skal ikke fjerna personmarkering i url ved bytte fra hovedsøker til annen part', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setState({ selected: personopplysninger });

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
    panel.prop('setSelected')(personopplysninger.annenPart);

    expect(wrapper.state('selected')).is.eql(personopplysninger.annenPart);

    expect(toggleInfoPanelCallback.calledOnce).to.be.false;
  });

  it('skal fjerne valgt hovedsøker ved nytt klikk på denne i panel-header ', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallow(
      <PersonInfoPanel
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={[]}
        relatertTilgrensendeYtelserForAnnenForelder={[]}
        openInfoPanels={[]}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        hasOpenAksjonspunkter
        sprakkode={{}}
        readOnly={false}
        isBekreftButtonReadOnly
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        aksjonspunkter={[]}
        {...reduxFormPropsMock}
      />,
    );

    wrapper.setState({ selected: personopplysninger });

    const panel = wrapper.find(EkspanderbartPersonPanel);

    expect(wrapper.state('selected')).is.eql(personopplysninger);
    panel.prop('setSelected')(personopplysninger);

    expect(wrapper.state('selected')).is.null;

    expect(toggleInfoPanelCallback.calledOnce).to.be.true;
    const { args } = toggleInfoPanelCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(faktaPanelCodes.PERSON);
  });

  it('skal fjerne ID fra arbeidsforhold som er lagt til av saksbehandler, men ikke fra andre', () => {
    const arbeidsforhold = [
      {
        id: 1,
        lagtTilAvSaksbehandler: true,
      },
      {
        id: 2,
        lagtTilAvSaksbehandler: false,
      },
    ];
    const result = fjernIdFraArbeidsforholdLagtTilAvSaksbehandler(arbeidsforhold);
    expect(result[0].id).to.eql(null);
    expect(result[0].lagtTilAvSaksbehandler).to.eql(true);
    expect(result[1].id).to.eql(2);
    expect(result[1].lagtTilAvSaksbehandler).to.eql(false);
  });
});
