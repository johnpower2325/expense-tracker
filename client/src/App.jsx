import { useEffect, useMemo, useState } from "react"
import Navbar from "./components/Navbar"
import SummaryCards from "./components/SummaryCards.jsx"
import ChartsPanel from "./components/ChartsPanel"
import FiltersBar from "./components/FiltersBar"
import ExpenseTable from "./components/ExpenseTable"
import ExpenseForm from "./components/ExpenseForm"
import ExpenseDrawer from "./components/ExpenseDrawer"
import { loadState, saveState } from "./lib/storage"
import { uid, formatISODate } from "./lib/utils"

const DEFAULT_CATEGORIES = [
  "Food", "Groceries", "Transport", "Rent", "Bills", "Shopping", "Health", "Entertainment", "Other"
]
const DEFAULT_METHODS = ["Cash", "Card", "Online", "Bank Transfer"]

export default function App() {
  // --------------------------------------------
  // STATE: persisted app data (no DB)
  // --------------------------------------------
  const [data, setData] = useState(() => {
    const saved = loadState()
    return saved ?? {
      categories: DEFAULT_CATEGORIES,
      methods: DEFAULT_METHODS,
      records: []
    }
  })

  // --------------------------------------------
  // STATE: UI selections
  // --------------------------------------------
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
  const [filters, setFilters] = useState({
    q: "",
    category: "All",
    method: "All",
    from: "",
    to: "",
    min: "",
    max: "",
    sort: "newest" // newest | oldest | amount_desc | amount_asc
  })
  const [editing, setEditing] = useState(null) // record or null
  const [drawer, setDrawer] = useState({ open: false, record: null })

  // --------------------------------------------
  // PERSIST: save to localStorage on change
  // --------------------------------------------
  useEffect(() => {
    saveState(data)
  }, [data])

  // --------------------------------------------
  // DERIVED: month-scoped records
  // --------------------------------------------
  const monthRecords = useMemo(() => {
    return data.records.filter(r => r.date?.startsWith(selectedMonth))
  }, [data.records, selectedMonth])

  // --------------------------------------------
  // DERIVED: apply filters + sorting
  // --------------------------------------------
  const visibleRecords = useMemo(() => {
    let rows = [...monthRecords]

    // search
    const q = filters.q.trim().toLowerCase()
    if (q) {
      rows = rows.filter(r =>
        (r.title || "").toLowerCase().includes(q) ||
        (r.note || "").toLowerCase().includes(q)
      )
    }

    // category/method
    if (filters.category !== "All") rows = rows.filter(r => r.category === filters.category)
    if (filters.method !== "All") rows = rows.filter(r => r.method === filters.method)

    // date range
    if (filters.from) rows = rows.filter(r => r.date >= filters.from)
    if (filters.to) rows = rows.filter(r => r.date <= filters.to)

    // amount range
    const min = filters.min === "" ? null : Number(filters.min)
    const max = filters.max === "" ? null : Number(filters.max)
    if (min !== null && !Number.isNaN(min)) rows = rows.filter(r => r.amount >= min)
    if (max !== null && !Number.isNaN(max)) rows = rows.filter(r => r.amount <= max)

    // sorting
    if (filters.sort === "newest") rows.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    if (filters.sort === "oldest") rows.sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    if (filters.sort === "amount_desc") rows.sort((a, b) => (b.amount || 0) - (a.amount || 0))
    if (filters.sort === "amount_asc") rows.sort((a, b) => (a.amount || 0) - (b.amount || 0))

    return rows
  }, [monthRecords, filters])

  // --------------------------------------------
  // CRUD: add/update/delete
  // --------------------------------------------
  function upsertRecord(payload) {
    setData(prev => {
      const isEdit = Boolean(payload.id)
      const record = {
        id: payload.id ?? uid(),
        type: payload.type, // "expense" | "income"
        title: payload.title,
        amount: Number(payload.amount),
        category: payload.category,
        method: payload.method,
        date: payload.date || formatISODate(new Date()),
        note: payload.note || ""
      }

      if (!isEdit) return { ...prev, records: [record, ...prev.records] }

      return {
        ...prev,
        records: prev.records.map(r => (r.id === record.id ? record : r))
      }
    })

    setEditing(null)
  }

  function deleteRecord(id) {
    setData(prev => ({ ...prev, records: prev.records.filter(r => r.id !== id) }))
    if (drawer.record?.id === id) setDrawer({ open: false, record: null })
    if (editing?.id === id) setEditing(null)
  }

  // --------------------------------------------
  // EXPORT/IMPORT
  // --------------------------------------------
  function exportCSV() {
    const headers = ["id", "type", "title", "amount", "category", "method", "date", "note"]
    const lines = [
      headers.join(","),
      ...monthRecords.map(r =>
        headers.map(h => JSON.stringify(r[h] ?? "")).join(",")
      )
    ]
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expenses-${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed)) throw new Error("JSON must be an array of records")

        setData(prev => {
          const normalized = parsed.map(r => ({
            id: r.id ?? uid(),
            type: r.type === "income" ? "income" : "expense",
            title: r.title ?? "Untitled",
            amount: Number(r.amount ?? 0),
            category: r.category ?? "Other",
            method: r.method ?? "Cash",
            date: r.date ?? formatISODate(new Date()),
            note: r.note ?? ""
          }))
          return { ...prev, records: [...normalized, ...prev.records] }
        })
      } catch (e) {
        alert(`Import failed: ${e.message}`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Form */}
          <section className="col-span-12 lg:col-span-4">
            <ExpenseForm
              categories={data.categories}
              methods={data.methods}
              editing={editing}
              onCancelEdit={() => setEditing(null)}
              onSubmit={upsertRecord}
              selectedMonth={selectedMonth}
            />
          </section>

          {/* Right: Dashboard */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <SummaryCards records={monthRecords} />
            <ChartsPanel records={monthRecords} />
            <FiltersBar
              categories={data.categories}
              methods={data.methods}
              filters={filters}
              setFilters={setFilters}
              onClear={() =>
                setFilters({ q: "", category: "All", method: "All", from: "", to: "", min: "", max: "", sort: "newest" })
              }
              onExportCSV={exportCSV}
              onImportJSON={importJSON}
            />
            <ExpenseTable
              records={visibleRecords}
              onView={(r) => setDrawer({ open: true, record: r })}
              onEdit={(r) => setEditing(r)}
              onDelete={(id) => deleteRecord(id)}
            />
          </section>
        </div>
      </main>

      <ExpenseDrawer
        open={drawer.open}
        record={drawer.record}
        onClose={() => setDrawer({ open: false, record: null })}
        onEdit={(r) => { setEditing(r); setDrawer({ open: false, record: null }) }}
        onDelete={(id) => deleteRecord(id)}
      />
    </div>
  )
}
