export function uid() {
    return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)
}

export function formatISODate(d) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export function money(n) {
    const v = Number(n || 0)
    return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function monthLabel(yyyyMM) {
    const [y, m] = yyyyMM.split("-").map(Number)
    const d = new Date(y, m - 1, 1)
    return d.toLocaleString(undefined, { month: "long", year: "numeric" })
}
