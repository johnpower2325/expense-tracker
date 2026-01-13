import { monthLabel } from "../lib/utils"

export default function Navbar({ selectedMonth, setSelectedMonth }) {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-900" />
                    <div>
                        <div className="text-lg font-semibold">Expense Tracker</div>
                        <div className="text-xs text-slate-500">{monthLabel(selectedMonth)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600">Month</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="rounded-lg border px-3 py-2 text-sm"
                    />
                </div>
            </div>
        </header>
    )
}
