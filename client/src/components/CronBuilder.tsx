import { useState } from 'react'
import {
  CronConfig,
  CronType,
  generateCronExpression,
  MINUTE_OPTIONS,
  HOUR_OPTIONS,
  DAY_OF_MONTH_OPTIONS,
  MONTH_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
} from '../utils/cron'

interface CronBuilderProps {
  onExpressionChange: (expression: string) => void
}

const TYPE_OPTIONS: { value: CronType; label: string }[] = [
  { value: 'minute', label: '每分钟' },
  { value: 'hourly', label: '每小时' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
  { value: 'custom', label: '自定义' },
]

export default function CronBuilder({ onExpressionChange }: CronBuilderProps) {
  const [config, setConfig] = useState<CronConfig>({
    type: 'daily',
    minute: '0',
    hour: '8',
    dayOfMonth: '1',
    month: '*',
    dayOfWeek: '1',
  })

  const updateConfig = (key: keyof CronConfig, value: string) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    const expression = generateCronExpression(newConfig)
    onExpressionChange(expression)
  }

  const handleTypeChange = (type: CronType) => {
    const newConfig = { ...config, type }
    setConfig(newConfig)
    const expression = generateCronExpression(newConfig)
    onExpressionChange(expression)
  }

  const renderTypeSpecificFields = () => {
    switch (config.type) {
      case 'minute':
        return null
      case 'hourly':
        return (
          <div>
            <label className="cron-label">
              分钟
            </label>
            <select
              value={config.minute}
              onChange={(e) => updateConfig('minute', e.target.value)}
              className="cron-field"
            >
              {MINUTE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      case 'daily':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="cron-label">
                小时
              </label>
              <select
                value={config.hour}
                onChange={(e) => updateConfig('hour', e.target.value)}
                className="cron-field"
              >
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                分钟
              </label>
              <select
                value={config.minute}
                onChange={(e) => updateConfig('minute', e.target.value)}
                className="cron-field"
              >
                {MINUTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 'weekly':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="cron-label">
                星期
              </label>
              <select
                value={config.dayOfWeek}
                onChange={(e) => updateConfig('dayOfWeek', e.target.value)}
                className="cron-field"
              >
                {DAY_OF_WEEK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                小时
              </label>
              <select
                value={config.hour}
                onChange={(e) => updateConfig('hour', e.target.value)}
                className="cron-field"
              >
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                分钟
              </label>
              <select
                value={config.minute}
                onChange={(e) => updateConfig('minute', e.target.value)}
                className="cron-field"
              >
                {MINUTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 'monthly':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="cron-label">
                日期
              </label>
              <select
                value={config.dayOfMonth}
                onChange={(e) => updateConfig('dayOfMonth', e.target.value)}
                className="cron-field"
              >
                {DAY_OF_MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                小时
              </label>
              <select
                value={config.hour}
                onChange={(e) => updateConfig('hour', e.target.value)}
                className="cron-field"
              >
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                分钟
              </label>
              <select
                value={config.minute}
                onChange={(e) => updateConfig('minute', e.target.value)}
                className="cron-field"
              >
                {MINUTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 'custom':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="cron-label">
                分钟
              </label>
              <select
                value={config.minute}
                onChange={(e) => updateConfig('minute', e.target.value)}
                className="cron-field"
              >
                <option value="*">每分钟 (*)</option>
                {MINUTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                小时
              </label>
              <select
                value={config.hour}
                onChange={(e) => updateConfig('hour', e.target.value)}
                className="cron-field"
              >
                <option value="*">每小时 (*)</option>
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                日
              </label>
              <select
                value={config.dayOfMonth}
                onChange={(e) => updateConfig('dayOfMonth', e.target.value)}
                className="cron-field"
              >
                <option value="*">每天 (*)</option>
                {DAY_OF_MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                月
              </label>
              <select
                value={config.month}
                onChange={(e) => updateConfig('month', e.target.value)}
                className="cron-field"
              >
                <option value="*">每月 (*)</option>
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cron-label">
                星期
              </label>
              <select
                value={config.dayOfWeek}
                onChange={(e) => updateConfig('dayOfWeek', e.target.value)}
                className="cron-field"
              >
                <option value="*">每天 (*)</option>
                {DAY_OF_WEEK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="cron-card">
      <h2 className="cron-section-title">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </span>
        生成 Cron 表达式
      </h2>

      <div className="space-y-5">
        <div>
          <label className="cron-label">
            执行频率
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTypeChange(opt.value)}
                className={config.type === opt.value ? 'cron-pill cron-pill-active' : 'cron-pill'}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {renderTypeSpecificFields()}
      </div>
    </div>
  )
}