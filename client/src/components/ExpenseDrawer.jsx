import { money } from "../lib/utils"

export default function ExpenseDrawer({ open, record, onClose, onEdit, onDelete }) {
    if (!open || !record) return null

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-4">
                    <div className="text-sm font-semibold">Transaction Details</div>
                    <button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">Close</button>
                </div>

                <div className="space-y-3 p-4 text-sm">
                    <Row label="Type" value={record.type} />
                    <Row label="Title" value={record.title} />
                    <Row label="Amount" value={money(record.amount)} />
                    <Row label="Category" value={record.category} />
                    <Row label="Method" value={record.method} />
                    <Row label="Date" value={record.date} />
                    <Row label="Note" value={record.note || "—"} />
                </div>

                <div className="flex gap-2 border-t p-4">
                    <button
                        onClick={() => onEdit(record)}
                        className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            if (confirm("Delete this transaction?")) onDelete(record.id)
                        }}
                        className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

function Row({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="text-slate-500">{label}</div>
            <div className="text-right font-medium">{value}</div>
        </div>
    )
}
