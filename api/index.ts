import express, { Request, Response } from 'express'
import cors from 'cors'
import cronstrue from 'cronstrue'
import { CronExpressionParser } from 'cron-parser'

const app = express()

app.use(cors())
app.use(express.json())

interface ParseRequest {
  expression: string
}

interface NextRunsRequest {
  expression: string
  count?: number
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.post('/api/cron/parse', (req: Request, res: Response) => {
  try {
    const { expression } = req.body as ParseRequest

    if (!expression) {
      return res.status(400).json({ error: '请提供 Cron 表达式' })
    }

    const parts = expression.trim().split(/\s+/)
    if (parts.length < 5 || parts.length > 7) {
      return res.status(400).json({ error: 'Cron 表达式格式错误，需要 5-7 个字段' })
    }

    let description: string
    try {
      description = cronstrue.toString(expression, { locale: 'zh_CN' })
    } catch {
      try {
        description = cronstrue.toString(expression)
      } catch {
        return res.status(400).json({ error: '无法解析 Cron 表达式' })
      }
    }

    return res.json({
      expression,
      description,
      fields: {
        second: parts.length === 6 || parts.length === 7 ? parts[0] : undefined,
        minute: parts.length === 6 || parts.length === 7 ? parts[1] : parts[0],
        hour: parts.length === 6 || parts.length === 7 ? parts[2] : parts[1],
        dayOfMonth: parts.length === 6 || parts.length === 7 ? parts[3] : parts[2],
        month: parts.length === 6 || parts.length === 7 ? parts[4] : parts[3],
        dayOfWeek: parts.length === 6 || parts.length === 7 ? parts[5] : parts[4],
        year: parts.length === 7 ? parts[6] : undefined,
      },
    })
  } catch {
    return res.status(500).json({ error: '服务器错误' })
  }
})

app.post('/api/cron/next-runs', (req: Request, res: Response) => {
  try {
    const { expression, count = 5 } = req.body as NextRunsRequest

    if (!expression) {
      return res.status(400).json({ error: '请提供 Cron 表达式' })
    }

    const runCount = Math.min(Math.max(count, 1), 20)
    const nextRuns: Date[] = []

    try {
      const interval = CronExpressionParser.parse(expression)
      for (let i = 0; i < runCount; i++) {
        const next = interval.next()
        nextRuns.push(next.toDate())
      }
    } catch {
      return res.status(400).json({ error: '无效的 Cron 表达式' })
    }

    return res.json({
      expression,
      nextRuns: nextRuns.map((date) => ({
        date: date.toISOString(),
        formatted: formatDateTime(date),
      })),
    })
  } catch {
    return res.status(500).json({ error: '服务器错误' })
  }
})

function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[date.getDay()]

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekDay}`
}

export default app
