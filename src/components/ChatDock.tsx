/**
 * Chat dock Golmar (L2+) — resta dock/float custom, non Dialog shadcn:
 * deve convivere con ChartModal e restare `no-print`.
 * Composer e CTA usano Button/Input shadcn per coerenza brand.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mockChatClient } from '../chat/MockChatClient'
import { useDemo } from '../context/DemoContext'
import { NewFeatureBadge } from './NewFeatureBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AnchorIcon,
  CloseIcon,
  IconAction,
  TableIcon,
} from './icons/AnimatedIcon'

/** Sopravvive al remount Strict Mode. */
const handledUserMessages = new Set<string>()

function ChatComposer({
  onSend,
  autofocus,
  placeholder = 'Interroga i risultati…',
  compact = false,
}: {
  onSend: (text: string) => void
  autofocus?: boolean
  placeholder?: string
  /** Altezza allineata a IconAction (h-11). */
  compact?: boolean
}) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autofocus) inputRef.current?.focus()
  }, [autofocus])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const text = draft.trim()
        if (!text) return
        onSend(text)
        setDraft('')
      }}
      className={
        compact
          ? 'flex h-11 items-center gap-2 rounded-sm border border-ink bg-bg-elevated py-0 pr-1 pl-3'
          : 'flex items-center gap-2 rounded-sm border border-ink bg-bg-elevated p-2'
      }
    >
      <Input
        ref={inputRef}
        className={
          compact
            ? 'h-9 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0'
            : 'h-9 min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0'
        }
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label="Messaggio chat"
      />
      <Button type="submit" variant="outline" size={compact ? 'sm' : 'default'}>
        Invia
      </Button>
    </form>
  )
}

/** Unica istanza: evita doppie risposte se float + panel sono entrambi montati. */
export function ChatReplyBridge({
  csvContext,
  onBusy,
}: {
  csvContext?: string | null
  onBusy?: (busy: boolean) => void
}) {
  const { feature, chatMessages, pushChat, chatContextLabel, level } = useDemo()
  const ctxRef = useRef({ chatContextLabel, csvContext, level, pushChat })
  ctxRef.current = { chatContextLabel, csvContext, level, pushChat }

  useEffect(() => {
    if (!feature('chat')) return
    const last = chatMessages.at(-1)
    if (!last || last.role !== 'user') return
    if (handledUserMessages.has(last.id)) return
    handledUserMessages.add(last.id)
    const snapshot = chatMessages
    const {
      chatContextLabel: label,
      csvContext: csv,
      level: lv,
      pushChat: push,
    } = ctxRef.current

    ;(async () => {
      onBusy?.(true)
      try {
        const reply = await mockChatClient.ask(snapshot, {
          label,
          csvSnippet: csv,
          level: lv,
        })
        push({ role: 'assistant', content: reply.content })
      } finally {
        onBusy?.(false)
      }
    })()
  }, [chatMessages, feature, onBusy])

  return null
}

export function ChatBar() {
  const {
    feature,
    chatOpen,
    setChatOpen,
    setChatDocked,
    setChatPeek,
    pushChat,
  } = useDemo()

  if (!feature('chat') || chatOpen) return null

  return (
    <div className="chat-bar no-print fixed bottom-3 left-1/2 z-[60] w-[min(32rem,calc(100%-1.5rem))] -translate-x-1/2">
      <div className="flex h-11 items-stretch gap-1.5 rounded-sm border border-ink bg-bg-elevated p-0.5 shadow-md">
        <div className="min-w-0 flex-1">
          <ChatComposer
            compact
            onSend={(text) => {
              setChatPeek(null)
              setChatDocked(false)
              pushChat({ role: 'user', content: text })
              setChatOpen(true)
            }}
          />
        </div>
        <IconAction
          label="Apri chat a destra"
          onClick={() => {
            setChatPeek(null)
            setChatDocked(true)
            setChatOpen(true)
          }}
        >
          <AnchorIcon animateOnHover size={18} />
        </IconAction>
      </div>
    </div>
  )
}

const PEEK_W = 320

/** Mini-modal composer accanto al mouse; all’invio apre la chat flottante. */
export function ChatPeek() {
  const {
    feature,
    chatPeek,
    setChatPeek,
    setChatOpen,
    setChatDocked,
    pushChat,
    chatContextLabel,
  } = useDemo()
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!chatPeek) {
      setDraft('')
      return
    }
    setDraft(chatPeek.seed ?? '')
  }, [chatPeek])

  useLayoutEffect(() => {
    if (!chatPeek) return
    const pad = 12
    const h = panelRef.current?.offsetHeight ?? 160
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = chatPeek.x + pad
    let top = chatPeek.y + pad
    if (left + PEEK_W > vw - pad) left = Math.max(pad, chatPeek.x - PEEK_W - pad)
    if (top + h > vh - pad) top = Math.max(pad, vh - h - pad)
    setPos({ left, top })
  }, [chatPeek])

  useEffect(() => {
    if (!chatPeek) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChatPeek(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [chatPeek, setChatPeek])

  if (!feature('chat') || !chatPeek) return null

  const send = (text: string) => {
    const msg = text.trim()
    if (!msg) return
    setChatPeek(null)
    setChatDocked(false)
    pushChat({ role: 'user', content: msg })
    setChatOpen(true)
  }

  return createPortal(
    <div className="chat-peek no-print fixed inset-0 z-[110]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-ink/25 backdrop-blur-md"
        aria-label="Chiudi chat"
        onClick={() => setChatPeek(null)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Nuovo messaggio"
        className="absolute w-[min(100%-1.5rem,20rem)] rounded-sm border border-ink bg-bg shadow-lg"
        style={{ left: pos.left, top: pos.top, width: PEEK_W }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-2 border-b border-line bg-bg-elevated px-3 py-2.5">
          <div className="min-w-0">
            <p className="m-0 text-sm font-semibold tracking-tight">
              Nuovo messaggio{' '}
              <span className="font-mono text-meta font-normal uppercase tracking-[0.06em] text-muted">
                · simulata
              </span>
            </p>
            {chatContextLabel ? (
              <p className="m-0 truncate font-mono text-meta text-muted">
                Contesto: {chatContextLabel}
              </p>
            ) : null}
          </div>
          <IconAction label="Chiudi" onClick={() => setChatPeek(null)}>
            <CloseIcon animateOnHover size={16} />
          </IconAction>
        </header>
        <form
          className="space-y-2 p-3"
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
        >
          <textarea
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-20 w-full resize-y rounded-sm border bg-bg-elevated px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Chiedi sui risultati…"
            aria-label="Messaggio"
            autoFocus
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              Invia
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

/** Chat piccola flottante (dopo invio messaggio); ancorabile a destra. */
export function ChatFloat({ busy = false }: { busy?: boolean }) {
  const {
    feature,
    featureNew,
    chatOpen,
    chatDocked,
    setChatOpen,
    setChatDocked,
    chatMessages,
    pushChat,
    clearChat,
    chatContextLabel,
  } = useDemo()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  if (!feature('chat') || !chatOpen || chatDocked) return null

  const closeFloat = () => {
    setChatOpen(false)
    setChatDocked(false)
  }

  return createPortal(
    <div className="chat-float-root no-print fixed inset-0 z-[120]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-ink/25 backdrop-blur-md"
        aria-label="Chiudi chat"
        onClick={closeFloat}
      />
      <aside
        className="absolute right-3 bottom-3 flex h-[min(28rem,55vh)] w-[min(22rem,calc(100%-1.5rem))] flex-col rounded-sm border border-ink bg-bg shadow-lg"
        aria-label="Chat risultati"
        onMouseDown={(e) => e.stopPropagation()}
      >
      <header className="flex items-center justify-between gap-2 border-b border-line bg-bg-elevated px-3 py-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 text-sm font-semibold tracking-tight">Chat</p>
            <span className="font-mono text-meta uppercase tracking-[0.06em] text-muted">
              simulata
            </span>
            {featureNew('chat') ? <NewFeatureBadge level={2} compact /> : null}
          </div>
          {chatContextLabel ? (
            <p className="m-0 truncate font-mono text-meta text-muted">
              Contesto: {chatContextLabel}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <IconAction
            label="Fissa a destra"
            onClick={() => setChatDocked(true)}
          >
            <AnchorIcon animateOnHover size={16} />
          </IconAction>
          <IconAction label="Chiudi chat" onClick={closeFloat}>
            <CloseIcon animateOnHover size={16} />
          </IconAction>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-auto px-3 py-3">
        {chatMessages.length === 0 ? (
          <p className="m-0 text-sm text-muted">Nessun messaggio.</p>
        ) : (
          chatMessages.map((m) => (
            <div
              key={m.id}
              className={`rounded-sm border px-2.5 py-1.5 text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'ml-4 border-ink bg-bg-warm'
                  : 'mr-2 border-line bg-bg-elevated'
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {busy ? (
          <p className="m-0 font-mono text-xs text-muted">Sto elaborando…</p>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-3">
        <div className="mb-2 flex justify-end">
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto px-0 text-accent"
            onClick={() => clearChat()}
          >
            Svuota
          </Button>
        </div>
        <ChatComposer
          autofocus
          onSend={(text) => pushChat({ role: 'user', content: text })}
        />
      </div>
      </aside>
    </div>,
    document.body,
  )
}

/** Pannello laterale quando la chat è ancorata. */
export function ChatPanel({ busy = false }: { busy?: boolean }) {
  const {
    feature,
    featureNew,
    chatOpen,
    chatDocked,
    setChatOpen,
    setChatDocked,
    chatExpanded,
    setChatExpanded,
    chatMessages,
    pushChat,
    clearChat,
    chatContextLabel,
  } = useDemo()
  const [historyOpen, setHistoryOpen] = useState(true)
  const [archives, setArchives] = useState<
    { id: string; label: string; count: number; at: number }[]
  >([])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatOpen])

  if (!feature('chat') || !chatOpen || !chatDocked) return null

  const width = chatExpanded ? 'min(36rem, 45vw)' : 'min(24rem, 100%)'

  const archiveCurrent = () => {
    if (chatMessages.length === 0) return
    setArchives((prev) => [
      {
        id: `a-${Date.now()}`,
        label: chatContextLabel ?? `Chat ${prev.length + 1}`,
        count: chatMessages.length,
        at: Date.now(),
      },
      ...prev,
    ])
    clearChat()
  }

  return (
    <aside
      className="chat-panel no-print flex h-full min-h-0 shrink-0 flex-col border-l border-ink bg-bg"
      style={{ width }}
      aria-label="Chat risultati"
    >
      <header className="flex items-center justify-between gap-2 border-b border-line bg-bg-elevated px-3 py-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 text-sm font-semibold tracking-tight">
              Chat risultati
            </p>
            <span className="font-mono text-meta uppercase tracking-[0.06em] text-muted">
              simulata
            </span>
            {featureNew('chat') ? <NewFeatureBadge level={2} compact /> : null}
          </div>
          {chatContextLabel ? (
            <p className="m-0 truncate font-mono text-meta text-muted">
              Contesto: {chatContextLabel}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <IconAction
            label="Sgancia (flottante)"
            onClick={() => setChatDocked(false)}
          >
            <span className="font-mono text-xs">↗</span>
          </IconAction>
          <IconAction
            label={chatExpanded ? 'Riduci' : 'Espandi'}
            onClick={() => setChatExpanded(!chatExpanded)}
          >
            <span className="font-mono text-xs">{chatExpanded ? '«' : '»'}</span>
          </IconAction>
          <IconAction
            label={historyOpen ? 'Nascondi memoria' : 'Mostra memoria'}
            onClick={() => setHistoryOpen((v) => !v)}
            active={historyOpen}
          >
            <TableIcon animateOnHover size={16} />
          </IconAction>
          <IconAction
            label="Chiudi chat"
            onClick={() => {
              setChatOpen(false)
              setChatDocked(false)
            }}
          >
            <CloseIcon animateOnHover size={16} />
          </IconAction>
        </div>
      </header>

      {historyOpen ? (
        <div className="border-b border-line px-3 py-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted">
              Memoria sessione
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="link"
                size="xs"
                className="h-auto px-0"
                onClick={archiveCurrent}
                disabled={chatMessages.length === 0}
              >
                Archivia
              </Button>
              <Button
                type="button"
                variant="link"
                size="xs"
                className="h-auto px-0 text-accent"
                onClick={() => clearChat()}
              >
                Svuota
              </Button>
            </div>
          </div>
          {archives.length === 0 ? (
            <p className="m-0 font-mono text-[0.625rem] text-muted">
              Nessuna chat archiviata in questa sessione.
            </p>
          ) : (
            <ul className="m-0 max-h-24 list-none space-y-1 overflow-auto p-0">
              {archives.map((a) => (
                <li
                  key={a.id}
                  className="font-mono text-[0.625rem] text-ink-soft"
                >
                  {a.label} · {a.count} msg ·{' '}
                  {new Date(a.at).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-3 overflow-auto px-3 py-3">
        {chatMessages.length === 0 ? (
          <p className="m-0 text-sm text-muted">Nessun messaggio.</p>
        ) : (
          chatMessages.map((m) => (
            <div
              key={m.id}
              className={`rounded-sm border px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'ml-6 border-ink bg-bg-warm'
                  : 'mr-4 border-line bg-bg-elevated'
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {busy ? (
          <p className="m-0 font-mono text-xs text-muted">Sto elaborando…</p>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-2">
        <ChatComposer
          autofocus
          onSend={(text) => pushChat({ role: 'user', content: text })}
        />
      </div>
    </aside>
  )
}
