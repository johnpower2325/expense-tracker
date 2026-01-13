import { money } from "../lib/utils"

function Card({ label, value, hint }) {
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-semibold">{value}</div>
            {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
    )
}

export default function SummaryCards({ records }) {
    const income = records.filter(r => r.type === "income").reduce((s, r) => s + (r.amount || 0), 0)
    const expense = records.filter(r => r.type === "expense").reduce((s, r) => s + (r.amount || 0), 0)
    const net = income - expense

    const byCat = {}
    for (const r of records.filter(r => r.type === "expense")) {
        byCat[r.category] = (byCat[r.category] || 0) + (r.amount || 0)
    }
    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card label="Total Income" value={money(income)} />
            <Card label="Total Expense" value={money(expense)} />
            <Card label="Net Savings" value={money(net)} hint={net >= 0 ? "Positive month" : "Overspent"} />
            <Card label="Top Category" value={topCategory} />
        </div>
    )
}
