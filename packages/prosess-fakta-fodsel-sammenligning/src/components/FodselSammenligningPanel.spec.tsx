import React from 'react';
import { EtikettInfo } from 'nav-frontend-etiketter';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Soknad } from '@fpsak-frontend/types';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FodselSammenligningPanel from './FodselSammenligningPanel';
import FodselSammenligningOtherPanel from './FodselSammenligningOtherPanel';
import FodselSammenligningRevurderingPanel from './FodselSammenligningRevurderingPanel';
import messages from '../../i18n/nb_NO.json';

describe('<FodselSammenligningPanel>', () => {
  const soknad = {
    fodselsdatoer: { 1: '2019-01-01' } as {[key: number]: string},
    termindato: '2019-01-01',
    antallBarn: 1,
    utstedtdato: '2019-01-01',
  } as Soknad;

  it('skal rendre korrekt ved førstegangssøknad', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke={43}
      termindato="2019-01-01"
    />, messages);

    expect(wrapper.find(FodselSammenligningOtherPanel)).toHaveLength(1);
    expect(wrapper.find(FodselSammenligningRevurderingPanel)).toHaveLength(0);
  });

  it('skal rendre korrekt ved revurdering', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      behandlingsTypeKode={behandlingType.REVURDERING}
      avklartBarn={[{ fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke={43}
      termindato="2019-01-01"
    />, messages);

    expect(wrapper.find(FodselSammenligningOtherPanel)).toHaveLength(0);
    expect(wrapper.find(FodselSammenligningRevurderingPanel)).toHaveLength(1);
  });

  it('skal rendre fødsel fra tps', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke={43}
      termindato="2019-01-01"
    />, messages);

    expect(wrapper.find('Normaltekst').at(0).children().text()).toBe('15.05.2017');
  });

  it('skal rendre default verdier når tpsfodsel ikke finnes', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke={43}
      termindato="2019-01-01"
    />, messages);

    expect(wrapper.find('Normaltekst')).toHaveLength(1);
  });

  it('skal vise etikkett når minst ett av barna er dødfødte', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }, { fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={1}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke={43}
      termindato="2019-01-01"
    />, messages);

    expect(wrapper.find(EtikettInfo)).toHaveLength(1);
  });

  it('skal ikke vise etikkett når ingen av barna er dødfødte', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }, { fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke={43}
      termindato="2019-01-01"
    />, messages);

    expect(wrapper.find(EtikettInfo)).toHaveLength(0);
  });
});
