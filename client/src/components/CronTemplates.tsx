import { CronTemplate, CRON_TEMPLATES } from '../utils/cron'

interface CronTemplatesProps {
  onSelect: (template: CronTemplate) => void
}

export default function CronTemplates({ onSelect }: CronTemplatesProps) {
  return (
    <div className="cron-card">
      <h2 className="cron-section-title">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </span>
        常用模板
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {CRON_TEMPLATES.map((template) => (
          <button
            key={template.expression}
            type="button"
            onClick={() => onSelect(template)}
            className="group rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-left shadow-sm transition-all hover:border-indigo-200 hover:bg-white hover:shadow-md"
          >
            <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-900">{template.name}</div>
            <div className="mt-1 truncate font-mono text-[11px] text-slate-500">{template.expression}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
