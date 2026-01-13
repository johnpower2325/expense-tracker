import { money } from "../lib/utils"
import { Pencil, Trash2, Eye } from "lucide-react"

function Badge({ children }) {
    return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{children}</span>
}

export default function ExpenseTable({ records, onView, onEdit, onDelete }) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
                <div className="text-sm font-semibold">Transactions</div>
                <div className="text-xs text-slate-500">{records.length} items</div>
            </div>

            {records.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No transactions found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white">
                            <tr className="border-b text-left text-xs text-slate-500">
                                <th className="p-3">Date</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Method</th>
                                <th className="p-3 text-right">Amount</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(r => (
                                <tr key={r.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3">{r.date}</td>
                                    <td className="p-3">
                                        <div className="font-medium">{r.title}</div>
                                        {r.note ? <div className="text-xs text-slate-500">{r.note}</div> : null}
                                    </td>
                                    <td className="p-3"><Badge>{r.type}</Badge></td>
                                    <td className="p-3"><Badge>{r.category}</Badge></td>
                                    <td className="p-3"><Badge>{r.method}</Badge></td>
                                    <td className="p-3 text-right font-semibold">{money(r.amount)}</td>
                                    <td className="p-3">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onView(r)} className="rounded-lg border p-2" title="View">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => onEdit(r)} className="rounded-lg border p-2" title="Edit">
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Delete this transaction?")) onDelete(r.id)
                                                }}
                                                className="rounded-lg border p-2"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
