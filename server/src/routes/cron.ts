import { Router, Request, Response } from 'express'
import cronstrue from 'cronstrue'
import { CronExpressionParser } from 'cron-parser'

const router = Router()

interface ParseRequest {
  expression: string
}

interface NextRunsRequest {
  expression: string
  count?: number
}

// 解析 Cron 表达式，返回人类可读描述
router.post('/parse', (req: Request, res: Response) => {
  try {
    const { expression } = req.body as ParseRequest

    if (!expression) {
      return res.status(400).json({ error: '请提供 Cron 表达式' })
    }

    const parts = expression.trim().split(/\s+/)

    // 验证 Cron 表达式格式
    if (parts.length < 5 || parts.length > 7) {
      return res.status(400).json({ error: 'Cron 表达式格式错误，需要 5-7 个字段' })
    }

    // 转换为人类可读文本
    let description: string
    try {
      description = cronstrue.toString(expression, {
        locale: 'zh_CN'
      })
    } catch {
      // 如果中文失败，尝试英文
      try {
        description = cronstrue.toString(expression)
      } catch (e) {
        return res.status(400).json({ error: '无法解析 Cron 表达式' })
      }
    }

    res.json({
      expression,
      description,
      fields: {
        second: parts.length === 6 || parts.length === 7 ? parts[0] : undefined,
        minute: parts.length === 6 || parts.length === 7 ? parts[1] : parts[0],
        hour: parts.length === 6 || parts.length === 7 ? parts[2] : parts[1],
        dayOfMonth: parts.length === 6 || parts.length === 7 ? parts[3] : parts[2],
        month: parts.length === 6 || parts.length === 7 ? parts[4] : parts[3],
        dayOfWeek: parts.length === 6 || parts.length === 7 ? parts[5] : parts[4],
        year: parts.length === 7 ? parts[6] : undefined
      }
    })
  } catch (error) {
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取接下来的执行时间
router.post('/next-runs', (req: Request, res: Response) => {
  try {
    const { expression, count = 5 } = req.body as NextRunsRequest

    if (!expression) {
      return res.status(400).json({ error: '请提供 Cron 表达式' })
    }

    const runCount = Math.min(Math.max(count, 1), 20) // 限制 1-20 次
    const nextRuns: Date[] = []

    try {
      // 使用 cron-parser 计算接下来的执行时间
      const interval = CronExpressionParser.parse(expression)
      for (let i = 0; i < runCount; i++) {
        const next = interval.next()
        nextRuns.push(next.toDate())
      }
    } catch (e) {
      return res.status(400).json({ error: '无效的 Cron 表达式' })
    }

    res.json({
      expression,
      nextRuns: nextRuns.map(date => ({
        date: date.toISOString(),
        formatted: formatDateTime(date)
      }))
    })
  } catch (error) {
    res.status(500).json({ error: '服务器错误' })
  }
})

// 格式化日期时间
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

export default router