// REPORT GENERATOR — Legacy module with intentional quality issues.
// Your task: refactor without changing external behavior.
// All tests in report-generator.test.js must keep passing.

const REPORT_TYPES = ['sales', 'inventory', 'users', 'financial']

function generateReport(type, data, options) {
  if (!type) return null
  if (!data) return null
  if (!REPORT_TYPES.includes(type)) return null

  let report = { type, generatedAt: new Date().toISOString(), rows: [] }

  if (type === 'sales') {
    if (!data.transactions) return null
    if (data.transactions.length === 0) return { ...report, total: 0 }
    let total = 0
    let rows = []
    for (let i = 0; i < data.transactions.length; i++) {
      const t = data.transactions[i]
      if (t.amount > 0 && t.status === 'completed') {
        total = total + t.amount
        rows.push({ id: t.id, amount: t.amount, date: t.date })
      }
    }
    if (options && options.sortBy === 'amount') {
      rows.sort((a, b) => b.amount - a.amount)
    }
    if (options && options.sortBy === 'date') {
      rows.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    if (options && options.limit) {
      rows = rows.slice(0, options.limit)
    }
    report.rows = rows
    report.total = Math.round(total * 100) / 100
  }

  if (type === 'inventory') {
    if (!data.items) return null
    if (data.items.length === 0) return { ...report, lowStockCount: 0 }
    let lowStockCount = 0
    let rows = []
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]
      const available = item.quantity - (item.reserved || 0)
      const isLow = available <= (options && options.lowStockThreshold ? options.lowStockThreshold : 5)
      if (isLow) lowStockCount++
      rows.push({ id: item.id, name: item.name, available, isLow })
    }
    if (options && options.sortBy === 'available') {
      rows.sort((a, b) => a.available - b.available)
    }
    if (options && options.sortBy === 'name') {
      rows.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (options && options.limit) {
      rows = rows.slice(0, options.limit)
    }
    report.rows = rows
    report.lowStockCount = lowStockCount
  }

  if (type === 'users') {
    if (!data.users) return null
    if (data.users.length === 0) return { ...report, activeCount: 0 }
    let activeCount = 0
    let rows = []
    for (let i = 0; i < data.users.length; i++) {
      const user = data.users[i]
      if (user.status === 'active') activeCount++
      rows.push({ id: user.id, name: user.name, status: user.status, role: user.role })
    }
    if (options && options.sortBy === 'name') {
      rows.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (options && options.sortBy === 'role') {
      rows.sort((a, b) => a.role.localeCompare(b.role))
    }
    if (options && options.limit) {
      rows = rows.slice(0, options.limit)
    }
    report.rows = rows
    report.activeCount = activeCount
  }

  if (type === 'financial') {
    if (!data.entries) return null
    if (data.entries.length === 0) return { ...report, balance: 0 }
    let income = 0
    let expenses = 0
    let rows = []
    for (let i = 0; i < data.entries.length; i++) {
      const entry = data.entries[i]
      if (entry.type === 'income' && entry.amount > 0) {
        income = income + entry.amount
        rows.push({ id: entry.id, type: 'income', amount: entry.amount, date: entry.date })
      }
      if (entry.type === 'expense' && entry.amount > 0) {
        expenses = expenses + entry.amount
        rows.push({ id: entry.id, type: 'expense', amount: -entry.amount, date: entry.date })
      }
    }
    if (options && options.sortBy === 'amount') {
      rows.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    }
    if (options && options.sortBy === 'date') {
      rows.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    if (options && options.limit) {
      rows = rows.slice(0, options.limit)
    }
    report.rows = rows
    report.income = Math.round(income * 100) / 100
    report.expenses = Math.round(expenses * 100) / 100
    report.balance = Math.round((income - expenses) * 100) / 100
  }

  return report
}

module.exports = { generateReport }
