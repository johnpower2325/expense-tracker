export default function FiltersBar({
    categories,
    methods,
    filters,
    setFilters,
    onClear,
    onExportCSV,
    onImportJSON
}) {
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:flex-1">
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-600">Search</label>
                        <input
                            value={filters.q}
                            onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))}
                            placeholder="Note, title…"
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option>All</option>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">Method</label>
                        <select
                            value={filters.method}
                            onChange={(e) => setFilters(f => ({ ...f, method: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option>All</option>
                            {methods.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">From</label>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">To</label>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">Sort</label>
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="amount_desc">Amount (High)</option>
                            <option value="amount_asc">Amount (Low)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">Min</label>
                        <input
                            inputMode="numeric"
                            value={filters.min}
                            onChange={(e) => setFilters(f => ({ ...f, min: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-600">Max</label>
                        <input
                            inputMode="numeric"
                            value={filters.max}
                            onChange={(e) => setFilters(f => ({ ...f, max: e.target.value }))}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                            placeholder="999"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button onClick={onClear} className="rounded-lg border px-3 py-2 text-sm">
                        Clear
                    </button>

                    <button onClick={onExportCSV} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
                        Export CSV
                    </button>

                    <label className="rounded-lg border px-3 py-2 text-sm cursor-pointer">
                        Import JSON
                        <input
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) onImportJSON(file)
                                e.target.value = ""
                            }}
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}
