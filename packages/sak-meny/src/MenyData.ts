import { ReactNode } from 'react';

class MenyData {
  erSynlig: boolean;

  tekst: string;

  // eslint-disable-next-line class-methods-use-this
  modal: (lukkModal: () => void) => ReactNode = () => undefined;

  constructor(erSynlig: boolean | undefined, tekst: string) {
    this.erSynlig = !!erSynlig;
    this.tekst = tekst;
  }

  medModal = (modal: (lukkModal: () => void) => ReactNode) => {
    this.modal = modal;
    return this;
  };

  getErSynlig = () => this.erSynlig;

  getTekst = () => this.tekst;

  getModal = () => this.modal;
}

export default MenyData;
