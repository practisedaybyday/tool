// Cron 表达式各字段的选项配置

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  label: i.toString().padStart(2, '0')
}))

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: `${i.toString().padStart(2, '0')} 时`
}))

export const DAY_OF_MONTH_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1} 日`
}))

export const MONTH_OPTIONS = [
  { value: '1', label: '一月' },
  { value: '2', label: '二月' },
  { value: '3', label: '三月' },
  { value: '4', label: '四月' },
  { value: '5', label: '五月' },
  { value: '6', label: '六月' },
  { value: '7', label: '七月' },
  { value: '8', label: '八月' },
  { value: '9', label: '九月' },
  { value: '10', label: '十月' },
  { value: '11', label: '十一月' },
  { value: '12', label: '十二月' },
]

export const DAY_OF_WEEK_OPTIONS = [
  { value: '0', label: '周日' },
  { value: '1', label: '周一' },
  { value: '2', label: '周二' },
  { value: '3', label: '周三' },
  { value: '4', label: '周四' },
  { value: '5', label: '周五' },
  { value: '6', label: '周六' },
]

export type CronType = 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom'

export interface CronConfig {
  type: CronType
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export interface CronTemplate {
  name: string
  expression: string
  description: string
}

// 常用 Cron 表达式模板
export const CRON_TEMPLATES: CronTemplate[] = [
  { name: '每分钟', expression: '* * * * *', description: '每分钟执行一次' },
  { name: '每小时', expression: '0 * * * *', description: '每小时整点执行' },
  { name: '每天凌晨', expression: '0 0 * * *', description: '每天凌晨 0 点执行' },
  { name: '每天早上8点', expression: '0 8 * * *', description: '每天早上 8 点执行' },
  { name: '每天中午12点', expression: '0 12 * * *', description: '每天中午 12 点执行' },
  { name: '每天下午6点', expression: '0 18 * * *', description: '每天下午 6 点执行' },
  { name: '每周一凌晨', expression: '0 0 * * 1', description: '每周一凌晨执行' },
  { name: '每月1号凌晨', expression: '0 0 1 * *', description: '每月 1 号凌晨执行' },
  { name: '工作日早8点', expression: '0 8 * * 1-5', description: '周一到周五早 8 点执行' },
  { name: '每5分钟', expression: '*/5 * * * *', description: '每 5 分钟执行一次' },
  { name: '每30分钟', expression: '*/30 * * * *', description: '每 30 分钟执行一次' },
  { name: '每2小时', expression: '0 */2 * * *', description: '每 2 小时执行一次' },
]

// 根据 CronConfig 生成 Cron 表达式
export function generateCronExpression(config: CronConfig): string {
  const { type, minute, hour, dayOfMonth, month, dayOfWeek } = config

  switch (type) {
    case 'minute':
      return '* * * * *'
    case 'hourly':
      return `${minute} * * * *`
    case 'daily':
      return `${minute} ${hour} * * *`
    case 'weekly':
      return `${minute} ${hour} * * ${dayOfWeek}`
    case 'monthly':
      return `${minute} ${hour} ${dayOfMonth} * *`
    case 'custom':
    default:
      return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
  }
}

// API 调用
export async function parseCron(expression: string) {
  const response = await fetch('/api/cron/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  })
  return response.json()
}

export async function getNextRuns(expression: string, count: number = 5) {
  const response = await fetch('/api/cron/next-runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression, count })
  })
  return response.json()
}