import { useEffect, useMemo, useState } from "react"

export default function ExpenseForm({ categories, methods, editing, onCancelEdit, onSubmit, selectedMonth }) {
    const defaultDate = useMemo(() => `${selectedMonth}-01`, [selectedMonth])

    const [form, setForm] = useState({
        id: null,
        type: "expense",
        title: "",
        amount: "",
        category: categories[0] || "Other",
        method: methods[0] || "Cash",
        date: defaultDate,
        note: ""
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (editing) {
            setForm({
                id: editing.id,
                type: editing.type,
                title: editing.title || "",
                amount: String(editing.amount ?? ""),
                category: editing.category || (categories[0] || "Other"),
                method: editing.method || (methods[0] || "Cash"),
                date: editing.date || defaultDate,
                note: editing.note || ""
            })
            setErrors({})
        } else {
            setForm(f => ({ ...f, id: null, date: defaultDate }))
        }
    }, [editing, categories, methods, defaultDate])

    function setField(k, v) {
        setForm(prev => ({ ...prev, [k]: v }))
    }

    function validate() {
        const e = {}
        if (!form.title.trim()) e.title = "Title is required"
        const amt = Number(form.amount)
        if (!form.amount || Number.isNaN(amt) || amt <= 0) e.amount = "Amount must be > 0"
        if (!form.date) e.date = "Date is required"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        onSubmit(form)
        setForm({
            id: null,
            type: "expense",
            title: "",
            amount: "",
            category: categories[0] || "Other",
            method: methods[0] || "Cash",
            date: defaultDate,
            note: ""
        })
    }

    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">{editing ? "Edit Transaction" : "Add Transaction"}</div>
                {editing ? (
                    <button onClick={onCancelEdit} className="text-xs text-slate-500 underline">
                        Cancel
                    </button>
                ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setField("type", "expense")}
                        className={`rounded-lg border px-3 py-2 text-sm ${form.type === "expense" ? "bg-slate-900 text-white" : ""}`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setField("type", "income")}
                        className={`rounded-lg border px-3 py-2 text-sm ${form.type === "income" ? "bg-slate-900 text-white" : ""}`}
                    >
                        Income
                    </button>
                </div>

                <div>
                    <label className="text-xs text-slate-600">Title</label>
                    <input
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder="e.g., Groceries"
                    />
                    {errors.title ? <div className="mt-1 text-xs text-red-600">{errors.title}</div> : null}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-600">Amount</label>
                        <input
                            inputMode="decimal"
                            value={form.amount}
                            onChange={(e) => setField("amount", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                            placeholder="0.00"
                        />
                        {errors.amount ? <div className="mt-1 text-xs text-red-600">{errors.amount}</div> : null}
                    </div>
                    <div>
                        <label className="text-xs text-slate-600">Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setField("date", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        />
                        {errors.date ? <div className="mt-1 text-xs text-red-600">{errors.date}</div> : null}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-600">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setField("category", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-600">Method</label>
                        <select
                            value={form.method}
                            onChange={(e) => setField("method", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            {methods.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-slate-600">Note (optional)</label>
                    <textarea
                        value={form.note}
                        onChange={(e) => setField("note", e.target.value)}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        rows={3}
                        placeholder="e.g., bought snacks too"
                    />
                </div>

                <button type="submit" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
                    {editing ? "Save Changes" : "Add Transaction"}
                </button>
            </form>
        </div>
    )
}
