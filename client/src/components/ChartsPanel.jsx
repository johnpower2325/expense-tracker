import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis } from "recharts"

export default function ChartsPanel({ records }) {
    const expenses = records.filter(r => r.type === "expense")

    const byCatMap = {}
    for (const r of expenses) byCatMap[r.category] = (byCatMap[r.category] || 0) + (r.amount || 0)
    const byCat = Object.entries(byCatMap).map(([name, value]) => ({ name, value }))

    const byDayMap = {}
    for (const r of expenses) {
        const day = r.date?.slice(8, 10) ?? "??"
        byDayMap[day] = (byDayMap[day] || 0) + (r.amount || 0)
    }
    const byDay = Object.entries(byDayMap)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([day, value]) => ({ day, value }))

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-3 text-sm font-semibold">Expenses by Category</div>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={byCat} dataKey="value" nameKey="name" outerRadius={80}>
                                {byCat.map((_, i) => <Cell key={i} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-slate-500">Tip: keep categories consistent for nicer charts.</div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-3 text-sm font-semibold">Daily Spend</div>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={byDay}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-slate-500">Shows only expense transactions.</div>
            </div>
        </div>
    )
}
