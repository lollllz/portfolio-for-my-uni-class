// Small controlled field primitives for the admin panel.
const label = "mb-1.5 block text-xs font-semibold text-slate-300";
const input =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-accent";

export function Text({ label: l, value, onChange, placeholder, hint }) {
  return (
    <div className="mb-4">
      {l && <label className={label}>{l}</label>}
      <input className={input} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Area({ label: l, value, onChange, hint, rows = 4 }) {
  return (
    <div className="mb-4">
      {l && <label className={label}>{l}</label>}
      <textarea rows={rows} className={input + " resize-y"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Num({ label: l, value, onChange }) {
  return (
    <div className="mb-4">
      {l && <label className={label}>{l}</label>}
      <input type="number" className={input} value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Color({ label: l, value, onChange }) {
  return (
    <div className="mb-4">
      {l && <label className={label}>{l}</label>}
      <div className="flex items-center gap-2">
        <input type="color" className="h-10 w-14 cursor-pointer rounded border border-slate-700 bg-slate-950" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} />
        <input className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export function Check({ label: l, value, onChange }) {
  return (
    <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-slate-200">
      <input type="checkbox" className="h-4 w-4 accent-[color:var(--admin-accent,#ea580c)]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      {l}
    </label>
  );
}

export function Select({ label: l, value, onChange, options }) {
  return (
    <div className="mb-4">
      {l && <label className={label}>{l}</label>}
      <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
