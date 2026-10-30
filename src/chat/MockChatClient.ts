import type { ChatMessage } from '../data/types'

export type ChatContext = {
  label?: string | null
  csvSnippet?: string | null
  level: number
}

export type ChatClient = {
  ask: (
    messages: ChatMessage[],
    context: ChatContext,
  ) => Promise<{ content: string }>
}

/** Mock locale — sostituibile con chiamata API reale. */
export const mockChatClient: ChatClient = {
  async ask(messages, context) {
    await new Promise((r) => setTimeout(r, 450))
    const last = messages.filter((m) => m.role === 'user').at(-1)?.content ?? ''
    const q = last.toLowerCase()
    const ctx = context.label ? ` (contesto: ${context.label})` : ''

    if (q.includes('enps') || q.includes('engagement')) {
      return {
        content: `Engagement è espresso come eNPS (scala −100…+100)${ctx}. Nella baseline 2026: dipendenti −24, agenti −10, totale circa −15. Clima e Collaborazione non entrano nell’indice (sono in Performance Enablement).`,
      }
    }
    if (q.includes('trust') || q.includes('fiducia')) {
      return {
        content: `Trust è separato in management centrale e responsabili diretti${ctx}. Nella baseline 2026: centrale ~58, diretti ~68.`,
      }
    }
    if (q.includes('csv') || q.includes('dato') || q.includes('approfond')) {
      const preview = context.csvSnippet
        ? `\n\nAnteprima CSV:\n\`\`\`\n${context.csvSnippet.slice(0, 500)}\n\`\`\``
        : ''
      return {
        content: `Posso ragionare sui dati del grafico aperto${ctx}. Le risposte usano i dati del report e i guardrail della piattaforma.${preview}`,
      }
    }
    if (q.includes('livello') || q.includes('proposta')) {
      return {
        content: `Livello 1 = piattaforma + baseline 2026. Livello 2 aggiunge survey in autonomia, storico e chat. Livello 3 aggiunge CRUD KPI e generazione questionario. Ogni livello include i precedenti.`,
      }
    }
    return {
      content: `Ho ricevuto la domanda${ctx}. Posso approfondire Engagement (eNPS), Trust, i dati CSV del grafico o i livelli della proposta.`,
    }
  },
}
