import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useApp } from '../context/AppContext'
import { todayString, getDayNumber } from '../lib/dates'
import { getDefaultSchedule } from '../lib/schedule'

const API_KEY = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined)?.trim() || undefined

// ── Tool definitions ────────────────────────────────────────
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_schedule',
      description: 'Get the current schedule (custom or default) for a specific date.',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        },
        required: ['date'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_day_log',
      description: 'Get the logged data for a date: habits completed, water, protein, pushups, build hours, workout.',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        },
        required: ['date'],
      },
    },
  },
]

// ── Types ───────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant' | 'tool' | 'system'
  content: string | null
  tool_call_id?: string
  tool_calls?: ToolCall[]
  name?: string
}

interface ToolCall {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  toolsUsed?: string[]
}

function uid() { return Math.random().toString(36).slice(2, 8) }

// ── Main component ──────────────────────────────────────────
export default function Chat() {
  const { state, dispatch } = useApp()
  const today = todayString()
  const dayNum = getDayNumber(today)

  const [display, setDisplay] = useState<DisplayMessage[]>([])
  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toolStatus, setToolStatus] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [display, toolStatus])

  // Build system prompt with current context
  function systemPrompt(): string {
    const log = state.logs[today]
    return `You are a personal assistant for Arav's Summer Lock-In Dashboard — a 77-day monk mode summer from May 30 to Aug 14, 2026.

Today is ${today}${dayNum ? ` (Day ${dayNum}/77)` : ' (pre-summer)'}.

ARAV'S GOALS:
- Ship AI Teacher MVP v1 (voice+avatar, underserved communities) by Aug 14
- AP Calc AB + AP Physics 1 + Spanish 3 — 1hr each daily on Khan Academy
- 50+ gym sessions, 120g+ protein daily, 50 push-ups/day
- Complete Proverbs (1 chapter/day), 70 journal entries, 70 meditation sessions
- 10 weekly speaking videos (2 min each)
- Modern AI Course + AI Agents Course

DAILY SCHEDULE STRUCTURE:
The default schedule runs 6:00am–10:00pm with time blocks typed as:
- build (green): deep work on AI Teacher project
- study (blue): academics
- routine (gray): morning/evening protocol
- gym (orange): workout
- break (dark): meals, transitions

You can read and modify schedules for any date using tools.
When modifying a schedule, always provide the COMPLETE list of blocks for the day.
Times use H:MM format (e.g. "6:00", "14:30").

TODAY'S QUICK STATS:
- Habits done: ${Object.values(log?.habits ?? {}).filter(Boolean).length}/8
- Water: ${log?.waterBottles ?? 0} bottles
- Protein: ${log?.proteinGrams ?? 0}g
- Build hours: ${log?.buildHours ?? 0}h
- Push-ups: ${log?.pushups ?? 0}

Be concise, direct, and practical. When you change a schedule, briefly confirm what you changed.`
  }

  // Execute a tool call and return its result
  function executeTool(toolCall: ToolCall): string {
    const args = JSON.parse(toolCall.function.arguments)
    const name = toolCall.function.name

    if (name === 'get_schedule') {
      const blocks = state.customSchedules?.[args.date] ?? getDefaultSchedule(args.date)
      const isCustom = !!state.customSchedules?.[args.date]
      return JSON.stringify({ date: args.date, type: isCustom ? 'custom' : 'default', blocks })
    }

    if (name === 'get_day_log') {
      const log = state.logs[args.date]
      if (!log) return JSON.stringify({ date: args.date, noData: true })
      return JSON.stringify({
        date: args.date,
        habits: log.habits,
        waterBottles: log.waterBottles ?? 0,
        proteinGrams: log.proteinGrams ?? 0,
        buildHours: log.buildHours ?? 0,
        pushups: log.pushups ?? 0,
        workoutLogged: log.workoutLogged,
        journalEntry: log.journalEntry ? '(logged)' : '(empty)',
      })
    }

    return JSON.stringify({ error: 'unknown tool' })
  }

  async function send() {
    const text = input.trim()
    if (!text || loading || !API_KEY) return
    setInput('')
    setLoading(true)

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newDisplay: DisplayMessage = { role: 'user', content: text }
    setDisplay(d => [...d, newDisplay])

    // Build conversation including system prompt
    const sysMsg: ChatMessage = { role: 'system', content: systemPrompt() }
    let conv: ChatMessage[] = conversation.length === 0
      ? [sysMsg, userMsg]
      : [...conversation, userMsg]

    try {
      let toolsUsed: string[] = []

      // Agentic loop: keep calling until no more tool calls
      while (true) {
        const res = await fetch('/api/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: conv,
            tools: TOOLS,
            tool_choice: 'auto',
          }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error?.message ?? 'OpenAI API error')
        }

        const data = await res.json()
        const msg = data.choices[0].message as ChatMessage
        conv = [...conv, msg]

        if (msg.tool_calls && msg.tool_calls.length > 0) {
          // Execute each tool
          for (const tc of msg.tool_calls) {
            setToolStatus(`Running: ${tc.function.name.replace(/_/g, ' ')}…`)
            toolsUsed.push(tc.function.name)
            const result = executeTool(tc)
            const toolResultMsg: ChatMessage = {
              role: 'tool',
              tool_call_id: tc.id,
              content: result,
            }
            conv = [...conv, toolResultMsg]
          }
          setToolStatus('')
          // Continue loop to get final text response
        } else {
          // Final text response
          const assistantContent = msg.content ?? ''
          setDisplay(d => [...d, { role: 'assistant', content: assistantContent, toolsUsed }])
          setConversation(conv)
          break
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setDisplay(d => [...d, { role: 'assistant', content: `Error: ${message}` }])
    }

    setToolStatus('')
    setLoading(false)
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const noKey = !API_KEY

  return (
    <div className="chat-page">
      <div className="chat-messages" ref={undefined}>
        {display.length === 0 && !noKey && (
          <div className="chat-empty">
            <div className="chat-empty-icon">⚡</div>
            <div className="chat-empty-title">Schedule AI</div>
            <div className="chat-empty-sub">
              Ask me anything about your schedule, progress, or goals.
              <br />Try: "What does my schedule look like next Monday?" or "How am I tracking on habits this week?"
            </div>
          </div>
        )}
        {noKey && (
          <div className="chat-empty">
            <div className="chat-empty-icon">🔑</div>
            <div className="chat-empty-title">API Key Required</div>
            <div className="chat-empty-sub">
              Add your OpenAI key to a <code>.env</code> file in the project root:<br /><br />
              <code>VITE_OPENAI_API_KEY=sk-...</code><br /><br />
              Then restart the dev server.
            </div>
          </div>
        )}
        {display.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrap ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="chat-avatar">AI</div>
            )}
            <div className={`chat-bubble ${msg.role}`}>
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="chat-tools-used">
                  {msg.toolsUsed.map(t => (
                    <span key={t} className="chat-tool-tag">{t.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              )}
              <div className="chat-bubble-text">{msg.content}</div>
            </div>
          </div>
        ))}
        {toolStatus && (
          <div className="chat-bubble-wrap assistant">
            <div className="chat-avatar">AI</div>
            <div className="chat-bubble assistant">
              <div className="chat-tool-status">{toolStatus}</div>
            </div>
          </div>
        )}
        {loading && !toolStatus && (
          <div className="chat-bubble-wrap assistant">
            <div className="chat-avatar">AI</div>
            <div className="chat-bubble assistant">
              <div className="chat-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder={noKey ? 'Add VITE_OPENAI_API_KEY to .env to enable' : 'Ask about your schedule… (Enter to send)'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={loading || noKey}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={send}
          disabled={loading || !input.trim() || noKey}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
