// Generic add / remove / reorder list editor used by every repeatable section.
export default function ListEditor({ items, itemLabel, onChange, template, renderItem }) {
  const set = (idx, next) => {
    const copy = items.slice();
    copy[idx] = next;
    onChange(copy);
  };
  const add = () => onChange([...items, JSON.parse(JSON.stringify(template))]);
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[idx], copy[j]] = [copy[j], copy[idx]];
    onChange(copy);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-xs text-slate-400">{itemLabel} {i + 1}</strong>
            <div className="flex gap-1.5">
              <button onClick={() => move(i, -1)} className="grid h-7 w-7 place-items-center rounded bg-slate-700 text-slate-200 hover:bg-slate-600" title="Up">↑</button>
              <button onClick={() => move(i, 1)} className="grid h-7 w-7 place-items-center rounded bg-slate-700 text-slate-200 hover:bg-slate-600" title="Down">↓</button>
              <button onClick={() => remove(i)} className="grid h-7 w-7 place-items-center rounded bg-slate-700 text-slate-200 hover:bg-rose-500 hover:text-white" title="Remove">✕</button>
            </div>
          </div>
          {renderItem(item, (next) => set(i, next))}
        </div>
      ))}
      <button onClick={add} className="rounded-xl border border-dashed border-slate-600 bg-slate-800/50 py-3 text-sm text-slate-300 hover:border-accent hover:text-white">
        + Add {itemLabel}
      </button>
    </div>
  );
}
