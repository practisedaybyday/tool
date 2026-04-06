import { useState, useEffect } from 'react'
import { parseCron, getNextRuns } from '../utils/cron'

interface CronParserProps {
  expression: string
  onExpressionChange: (expression: string) => void
}

interface ParsedResult {
  expression: string
  description: string
  fields?: {
    second?: string
    minute: string
    hour: string
    dayOfMonth: string
    month: string
    dayOfWeek: string
    year?: string
  }
}

interface NextRun {
  date: string
  formatted: string
}

export default function CronParser({ expression, onExpressionChange }: CronParserProps) {
  const [inputValue, setInputValue] = useState(expression)
  const [parsed, setParsed] = useState<ParsedResult | null>(null)
  const [nextRuns, setNextRuns] = useState<NextRun[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setInputValue(expression)
  }, [expression])

  useEffect(() => {
    if (inputValue) {
      parseExpression(inputValue)
    }
  }, [inputValue])

  const parseExpression = async (expr: string) => {
    setLoading(true)
    setError(null)

    try {
      const [parseResult, runsResult] = await Promise.all([
        parseCron(expr),
        getNextRuns(expr, 10),
      ])

      if (parseResult.error) {
        setError(parseResult.error)
        setParsed(null)
        setNextRuns([])
      } else {
        setParsed(parseResult)
        setNextRuns(runsResult.nextRuns || [])
      }
    } catch {
      setError('解析失败，请检查表达式格式')
      setParsed(null)
      setNextRuns([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    onExpressionChange(value)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inputValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  return (
    <div className="space-y-8">
      <div className="cron-card">
        <h2 className="cron-section-title">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </span>
          Cron 表达式
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="例如: 0 8 * * *"
            className="cron-input-mono min-w-0 flex-1 py-3"
          />
          <button type="button" onClick={copyToClipboard} className="cron-btn-secondary shrink-0 sm:py-3">
            {copied ? (
              <>
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700">已复制</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>复制</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            解析中…
          </div>
        )}

        {parsed && !error && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50/80 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600/80">执行说明</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{parsed.description}</div>
            </div>

            {parsed.fields && (
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="cron-chip">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">分钟</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-slate-800">{parsed.fields.minute}</div>
                </div>
                <div className="cron-chip">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">小时</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-slate-800">{parsed.fields.hour}</div>
                </div>
                <div className="cron-chip">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">日</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-slate-800">{parsed.fields.dayOfMonth}</div>
                </div>
                <div className="cron-chip">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">月</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-slate-800">{parsed.fields.month}</div>
                </div>
                <div className="cron-chip">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">星期</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-slate-800">{parsed.fields.dayOfWeek}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {nextRuns.length > 0 && (
        <div className="cron-card">
          <h2 className="cron-section-title">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            接下来的执行时间
          </h2>
          <ul className="space-y-2">
            {nextRuns.map((run, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                  {index + 1}
                </span>
                <span className="font-mono text-sm text-slate-800">{run.formatted}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
