import { useState } from 'react'
import CronBuilder from './components/CronBuilder'
import CronParser from './components/CronParser'
import CronTemplates from './components/CronTemplates'
import { CronTemplate } from './utils/cron'

function App() {
  const [expression, setExpression] = useState('0 8 * * *')

  const handleTemplateSelect = (template: CronTemplate) => {
    setExpression(template.expression)
  }

  const handleBuilderChange = (newExpression: string) => {
    setExpression(newExpression)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden />
            Cron tool
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Cron 表达式生成器
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            可视化配置、常用模板与解析说明，一站完成标准五段式 Cron 的编写与校验。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-8">
            <CronBuilder onExpressionChange={handleBuilderChange} />
            <CronTemplates onSelect={handleTemplateSelect} />
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <CronParser expression={expression} onExpressionChange={setExpression} />
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-slate-200/80 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-600">Cron 表达式格式：分 时 日 月 周</p>
          <p className="mt-2 leading-relaxed">
            支持标准 5 字段格式，例如 <span className="font-mono text-slate-700">0 8 * * *</span>{' '}
            表示每天早上 8 点执行。
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
