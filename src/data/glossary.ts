/**
 * Glossario plain-language per acronimi / gergo consulente (tooltip «i»).
 */

export type GlossaryKey =
  | 'aapor'
  | 'rr1'
  | 'enps'
  | 'hay'
  | 'tci'
  | 'enablement'
  | 'proxy'
  | 'participativeSafety'
  | 'vision'

export type GlossaryTerm = {
  label: string
  tip: string
}

export const GLOSSARY: Record<GlossaryKey, GlossaryTerm> = {
  aapor: {
    label: 'AAPOR',
    tip: 'Associazione che definisce come si calcola il tasso di risposta di una survey in modo confrontabile.',
  },
  rr1: {
    label: 'RR1',
    tip: 'Response Rate 1: quante persone hanno completato la survey rispetto a chi poteva rispondere.',
  },
  enps: {
    label: 'eNPS',
    tip: 'Employee Net Promoter Score: quanto le persone raccomanderebbero l’azienda come luogo di lavoro. Va da −100 a +100 (non è una %).',
  },
  hay: {
    label: 'Hay Group',
    tip: 'Modello usato per misurare se ruoli e ambiente di lavoro aiutano le persone a performare.',
  },
  tci: {
    label: 'TCI',
    tip: 'Team Climate for Innovation: come il team percepisce il clima per innovare (visione, sicurezza nel contribuire, ecc.).',
  },
  enablement: {
    label: 'Enablement',
    tip: 'Quanto l’organizzazione mette le persone nelle condizioni di fare bene il proprio lavoro.',
  },
  proxy: {
    label: 'proxy',
    tip: 'Non abbiamo la stessa domanda diretta per questa popolazione: usiamo una domanda correlata come stima.',
  },
  participativeSafety: {
    label: 'Participative safety',
    tip: 'Quanto le persone si sentono libere di proporre idee senza paura di critiche.',
  },
  vision: {
    label: 'Vision',
    tip: 'Quanto è chiara e condivisa la direzione / identità dell’organizzazione.',
  },
}

/** Termini da mostrare accanto alla definizione della slide (per id sezione / KPI). */
export const SLIDE_GLOSSARY: Record<string, GlossaryKey[]> = {
  response: ['aapor', 'rr1'],
  engagement: ['enps'],
  enablement: ['hay', 'enablement'],
  innovation: ['tci', 'vision', 'participativeSafety'],
  'trust-central': [],
  'trust-direct': [],
}
