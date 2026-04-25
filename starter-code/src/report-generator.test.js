const { generateReport } = require('./report-generator')

describe('generateReport — input validation', () => {
  it('returns null for missing type', () => expect(generateReport(null, {})).toBeNull())
  it('returns null for unknown type', () => expect(generateReport('unknown', {})).toBeNull())
  it('returns null for missing data', () => expect(generateReport('sales', null)).toBeNull())
})

describe('generateReport — sales', () => {
  const transactions = [
    { id: 1, amount: 100, date: '2026-01-01', status: 'completed' },
    { id: 2, amount: 50, date: '2026-01-02', status: 'completed' },
    { id: 3, amount: 200, date: '2026-01-03', status: 'cancelled' },
  ]
  it('sums only completed transactions', () => {
    const r = generateReport('sales', { transactions })
    expect(r.total).toBe(150)
    expect(r.rows).toHaveLength(2)
  })
  it('sorts by amount', () => {
    const r = generateReport('sales', { transactions }, { sortBy: 'amount' })
    expect(r.rows[0].amount).toBe(100)
  })
  it('applies limit', () => {
    const r = generateReport('sales', { transactions }, { limit: 1 })
    expect(r.rows).toHaveLength(1)
  })
})

describe('generateReport — inventory', () => {
  const items = [
    { id: 'A', name: 'Widget', quantity: 3, reserved: 0 },
    { id: 'B', name: 'Gadget', quantity: 20, reserved: 2 },
  ]
  it('counts low-stock items', () => {
    const r = generateReport('inventory', { items })
    expect(r.lowStockCount).toBe(1)
  })
  it('uses custom threshold', () => {
    const r = generateReport('inventory', { items }, { lowStockThreshold: 20 })
    expect(r.lowStockCount).toBe(2)
  })
})

describe('generateReport — financial', () => {
  const entries = [
    { id: 1, type: 'income', amount: 1000, date: '2026-01-01' },
    { id: 2, type: 'expense', amount: 300, date: '2026-01-02' },
  ]
  it('calculates balance', () => {
    const r = generateReport('financial', { entries })
    expect(r.income).toBe(1000)
    expect(r.expenses).toBe(300)
    expect(r.balance).toBe(700)
  })
})
