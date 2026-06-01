import { useState, useEffect, useCallback } from 'react'
import {
  Wheat, Fish, Apple, Carrot, Leaf, Droplets, Package, Utensils, Banana,
  AlertCircle, AlertTriangle, TrendingUp, CheckCircle, Bell, RefreshCw,
  Check, X, Pencil,
} from 'lucide-react'
import styles from './Inventory.module.css'

// ── Icon map for inventory items (keyed by emoji for localStorage compat) ──
const ICON_MAP = {
  '🌾': Wheat, '🥣': Wheat, '🍝': Utensils, '🥫': Package, '🫘': Package,
  '🐟': Fish,  '🥜': Package, '🍎': Apple, '🍌': Banana, '🥕': Carrot,
  '🥬': Leaf,  '🥛': Droplets, '🥚': Package, '🧀': Package, '🫙': Droplets,
  '🧂': Package, '🍅': Apple,
}

// ── Sample seed data ────────────────────────────────────────────────
const SEED = [
  // Grains
  { id: 1,  name: 'White Rice',      category: 'Grains',   unit: 'lbs', qty: 45,  min: 150, max: 600, icon: '🌾' },
  { id: 2,  name: 'Wheat Flour',     category: 'Grains',   unit: 'lbs', qty: 320, min: 100, max: 500, icon: '🌾' },
  { id: 3,  name: 'Rolled Oats',     category: 'Grains',   unit: 'lbs', qty: 680, min: 80,  max: 400, icon: '🥣' },
  { id: 4,  name: 'Pasta',           category: 'Grains',   unit: 'lbs', qty: 210, min: 120, max: 500, icon: '🍝' },
  // Proteins
  { id: 5,  name: 'Canned Beans',    category: 'Proteins', unit: 'cans', qty: 30, min: 200, max: 800, icon: '🥫' },
  { id: 6,  name: 'Lentils',         category: 'Proteins', unit: 'lbs', qty: 95,  min: 80,  max: 350, icon: '🫘' },
  { id: 7,  name: 'Canned Tuna',     category: 'Proteins', unit: 'cans', qty: 540, min: 100, max: 400, icon: '🐟' },
  { id: 8,  name: 'Peanut Butter',   category: 'Proteins', unit: 'jars', qty: 22, min: 60,  max: 250, icon: '🥜' },
  // Produce
  { id: 9,  name: 'Apples',          category: 'Produce',  unit: 'lbs', qty: 180, min: 50,  max: 300, icon: '🍎' },
  { id: 10, name: 'Bananas',         category: 'Produce',  unit: 'lbs', qty: 12,  min: 60,  max: 250, icon: '🍌' },
  { id: 11, name: 'Carrots',         category: 'Produce',  unit: 'lbs', qty: 95,  min: 40,  max: 200, icon: '🥕' },
  { id: 12, name: 'Spinach',         category: 'Produce',  unit: 'lbs', qty: 8,   min: 30,  max: 150, icon: '🥬' },
  // Dairy
  { id: 13, name: 'Milk',            category: 'Dairy',    unit: 'gal', qty: 18,  min: 30,  max: 120, icon: '🥛' },
  { id: 14, name: 'Eggs',            category: 'Dairy',    unit: 'dozen', qty: 45, min: 40, max: 160, icon: '🥚' },
  { id: 15, name: 'Cheese',          category: 'Dairy',    unit: 'lbs', qty: 9,   min: 20,  max: 80,  icon: '🧀' },
  // Pantry
  { id: 16, name: 'Cooking Oil',     category: 'Pantry',   unit: 'btls', qty: 60, min: 30,  max: 120, icon: '🫙' },
  { id: 17, name: 'Salt',            category: 'Pantry',   unit: 'lbs', qty: 88,  min: 20,  max: 80,  icon: '🧂' },
  { id: 18, name: 'Canned Tomatoes', category: 'Pantry',   unit: 'cans', qty: 95, min: 80,  max: 350, icon: '🍅' },
]

// ── Status helpers ───────────────────────────────────────────────────
function getStatus(item) {
  const { qty, min, max } = item
  if (qty <= min * 0.4)  return 'critical'
  if (qty < min)         return 'low'
  if (qty > max)         return 'oversupply'
  return 'normal'
}

const STATUS_META = {
  critical:   { label: 'Critical',   color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  low:        { label: 'Low Stock',  color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  oversupply: { label: 'Oversupply', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  normal:     { label: 'Normal',     color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
}

// ── Distribution suggestion engine ──────────────────────────────────
function buildSuggestions(items) {
  const suggestions = []

  const critical   = items.filter(i => getStatus(i) === 'critical')
  const low        = items.filter(i => getStatus(i) === 'low')
  const oversupply = items.filter(i => getStatus(i) === 'oversupply')

  critical.forEach(i => {
    suggestions.push({
      severity: 'critical',
      Icon: AlertCircle,
      title: `Emergency restock: ${i.name}`,
      body: `Only ${i.qty} ${i.unit} remaining — ${Math.round((i.qty / i.min) * 100)}% of minimum. Contact donor network immediately and pause distributions involving ${i.name} until restocked.`,
    })
  })

  oversupply.forEach(i => {
    const surplus = i.qty - i.max
    suggestions.push({
      severity: 'oversupply',
      Icon: Package,
      title: `Redistribute surplus: ${i.name}`,
      body: `${surplus} ${i.unit} above maximum threshold. Schedule an extra distribution event, reach out to partner shelters, and feature ${i.name} prominently in this week's community kitchen menu.`,
    })
  })

  low.forEach(i => {
    suggestions.push({
      severity: 'low',
      Icon: AlertTriangle,
      title: `Restock soon: ${i.name}`,
      body: `${i.qty} ${i.unit} remaining — approaching minimum. Alert volunteers to prioritize ${i.name} pickup from donor partners on the next food rescue run.`,
    })
  })

  if (oversupply.length > 0 && (critical.length > 0 || low.length > 0)) {
    const haveItems  = oversupply.map(i => i.name).join(', ')
    const needItems  = [...critical, ...low].map(i => i.name).slice(0, 3).join(', ')
    suggestions.push({
      severity: 'info',
      Icon: RefreshCw,
      title: 'Rebalance distribution routes',
      body: `You have surplus in ${haveItems} and shortages in ${needItems}. Consider adjusting this week's distribution routes so overstocked items offset shortage items across locations.`,
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      severity: 'normal',
      Icon: CheckCircle,
      title: 'Inventory looks healthy',
      body: 'All items are within normal thresholds. Keep up the great work — continue regular food rescue pickups to maintain stock levels.',
    })
  }

  return suggestions
}

// ── Load / save to localStorage ──────────────────────────────────────
const LS_KEY = 'annaseva_inventory'

function loadItems() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : SEED
  } catch { return SEED }
}

function saveItems(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

// ── Component ────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Grains', 'Proteins', 'Produce', 'Dairy', 'Pantry']

export default function Inventory() {
  const [items,       setItems]       = useState(loadItems)
  const [catFilter,   setCatFilter]   = useState('All')
  const [statFilter,  setStatFilter]  = useState('All')
  const [search,      setSearch]      = useState('')
  const [editId,      setEditId]      = useState(null)   // item being edited
  const [editQty,     setEditQty]     = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [flash,       setFlash]       = useState(null)   // id of recently changed item

  // Persist whenever items change
  useEffect(() => { saveItems(items) }, [items])

  // ── Derived data ──
  const withStatus = items.map(i => ({ ...i, status: getStatus(i) }))

  const filtered = withStatus.filter(i => {
    if (catFilter  !== 'All' && i.category !== catFilter) return false
    if (statFilter !== 'All' && i.status   !== statFilter) return false
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const alertCount   = withStatus.filter(i => i.status === 'critical' || i.status === 'low').length
  const surplusCount = withStatus.filter(i => i.status === 'oversupply').length
  const suggestions  = buildSuggestions(withStatus)

  // ── Helpers ──
  function flashItem(id) {
    setFlash(id)
    setTimeout(() => setFlash(null), 1200)
  }

  function commitEdit(id) {
    const val = parseFloat(editQty)
    if (isNaN(val) || val < 0) { setEditId(null); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.round(val) } : i))
    setLastUpdated(new Date())
    flashItem(id)
    setEditId(null)
  }

  function adjustQty(id, delta) {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
    ))
    setLastUpdated(new Date())
    flashItem(id)
  }

  // Simulate a random incoming donation
  function simulateDonation() {
    const idx = Math.floor(Math.random() * items.length)
    const bump = Math.floor(Math.random() * 80) + 20
    setItems(prev => prev.map((i, n) => n === idx ? { ...i, qty: i.qty + bump } : i))
    setLastUpdated(new Date())
    flashItem(items[idx].id)
  }

  // Simulate a random distribution run
  function simulateDistribution() {
    const eligible = items.filter(i => i.qty > 0)
    if (!eligible.length) return
    const target = eligible[Math.floor(Math.random() * eligible.length)]
    const draw   = Math.min(target.qty, Math.floor(Math.random() * 50) + 10)
    setItems(prev => prev.map(i => i.id === target.id ? { ...i, qty: Math.max(0, i.qty - draw) } : i))
    setLastUpdated(new Date())
    flashItem(target.id)
  }

  function resetData() {
    if (window.confirm('Reset all inventory to sample data?')) {
      setItems(SEED)
      setLastUpdated(new Date())
    }
  }

  const pct = (qty, min, max) => {
    const clamp = Math.min(qty, max * 1.2)
    return Math.round((clamp / (max * 1.2)) * 100)
  }

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Inventory Dashboard</h1>
          <p className={styles.subtitle}>
            Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSim} onClick={simulateDonation}    title="Simulate a donation coming in">+ Simulate Donation</button>
          <button className={styles.btnSim} onClick={simulateDistribution} title="Simulate a distribution run">− Simulate Distribution</button>
          <button className={styles.btnReset} onClick={resetData}>Reset Data</button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}><Package size={24} /></span>
          <div>
            <div className={styles.summaryNum}>{items.length}</div>
            <div className={styles.summaryLabel}>Total Items</div>
          </div>
        </div>
        <div className={`${styles.summaryCard} ${alertCount > 0 ? styles.summaryDanger : ''}`}>
          <span className={styles.summaryIcon}><AlertCircle size={24} /></span>
          <div>
            <div className={styles.summaryNum}>{alertCount}</div>
            <div className={styles.summaryLabel}>Shortage Alerts</div>
          </div>
        </div>
        <div className={`${styles.summaryCard} ${surplusCount > 0 ? styles.summaryWarning : ''}`}>
          <span className={styles.summaryIcon}><TrendingUp size={24} /></span>
          <div>
            <div className={styles.summaryNum}>{surplusCount}</div>
            <div className={styles.summaryLabel}>Oversupply Items</div>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}><CheckCircle size={24} /></span>
          <div>
            <div className={styles.summaryNum}>
              {withStatus.filter(i => i.status === 'normal').length}
            </div>
            <div className={styles.summaryLabel}>Normal Stock</div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className={styles.mainGrid}>

        {/* ── Left: inventory table ── */}
        <div className={styles.tablePanel}>

          {/* Filters */}
          <div className={styles.filterBar}>
            <input
              className={styles.search}
              placeholder="Search items…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className={styles.catTabs}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`${styles.catTab} ${catFilter === c ? styles.catTabActive : ''}`}
                  onClick={() => setCatFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <select
              className={styles.statSelect}
              value={statFilter}
              onChange={e => setStatFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="critical">Critical</option>
              <option value="low">Low Stock</option>
              <option value="oversupply">Oversupply</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className={styles.emptyRow}>No items match your filters.</td></tr>
                )}
                {filtered.map(item => {
                  const meta     = STATUS_META[item.status]
                  const bar      = pct(item.qty, item.min, item.max)
                  const isEditing  = editId === item.id
                  const isFlashing = flash === item.id
                  const ItemIcon   = ICON_MAP[item.icon] || Package

                  return (
                    <tr key={item.id} className={`${styles.row} ${isFlashing ? styles.rowFlash : ''}`}>
                      <td className={styles.nameCell}>
                        <span className={styles.itemIcon}><ItemIcon size={18} /></span>
                        <span>{item.name}</span>
                      </td>
                      <td><span className={styles.catBadge}>{item.category}</span></td>
                      <td className={styles.qtyCell}>
                        {isEditing ? (
                          <div className={styles.editRow}>
                            <input
                              className={styles.editInput}
                              type="number"
                              min="0"
                              value={editQty}
                              autoFocus
                              onChange={e => setEditQty(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter')  commitEdit(item.id)
                                if (e.key === 'Escape') setEditId(null)
                              }}
                            />
                            <span className={styles.unit}>{item.unit}</span>
                            <button className={styles.editSave} onClick={() => commitEdit(item.id)}><Check size={13} /></button>
                            <button className={styles.editCancel} onClick={() => setEditId(null)}><X size={13} /></button>
                          </div>
                        ) : (
                          <span
                            className={styles.qtyValue}
                            onClick={() => { setEditId(item.id); setEditQty(String(item.qty)) }}
                            title="Click to edit"
                          >
                            {item.qty.toLocaleString()} <span className={styles.unit}>{item.unit}</span>
                          </span>
                        )}
                      </td>
                      <td className={styles.barCell}>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{
                              width: `${bar}%`,
                              background: meta.color,
                            }}
                          />
                          <div className={styles.barMin}  style={{ left: `${(item.min / (item.max * 1.2)) * 100}%`  }} title={`Min: ${item.min}`} />
                          <div className={styles.barMax}  style={{ left: `${(item.max / (item.max * 1.2)) * 100}%`  }} title={`Max: ${item.max}`} />
                        </div>
                        <div className={styles.barLabels}>
                          <span>0</span>
                          <span>Min {item.min}</span>
                          <span>Max {item.max}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button className={styles.btnPlus}  onClick={() => adjustQty(item.id, 10)}  title="Add 10">+10</button>
                        <button className={styles.btnMinus} onClick={() => adjustQty(item.id, -10)} title="Remove 10">−10</button>
                        <button
                          className={styles.btnEdit}
                          onClick={() => { setEditId(item.id); setEditQty(String(item.qty)) }}
                          title="Set exact quantity"
                        >
                          <Pencil size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right: alerts + suggestions ── */}
        <div className={styles.sidePanel}>

          {/* Alert summary */}
          {(alertCount > 0 || surplusCount > 0) && (
            <div className={styles.alertBanner}>
              <span className={styles.alertBannerIcon}><Bell size={20} /></span>
              <div>
                <strong>{alertCount + surplusCount} item{alertCount + surplusCount !== 1 ? 's' : ''} need attention</strong>
                <p>
                  {alertCount > 0 && `${alertCount} shortage${alertCount !== 1 ? 's' : ''}`}
                  {alertCount > 0 && surplusCount > 0 && ' · '}
                  {surplusCount > 0 && `${surplusCount} oversupply`}
                </p>
              </div>
            </div>
          )}

          {/* Active alerts list */}
          <div className={styles.sectionHead}>Active Alerts</div>
          <div className={styles.alertList}>
            {withStatus.filter(i => i.status !== 'normal').length === 0 ? (
              <div className={styles.noAlerts} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={16} /> No active alerts — all items in range</div>
            ) : (
              withStatus
                .filter(i => i.status !== 'normal')
                .sort((a, b) => {
                  const order = { critical: 0, low: 1, oversupply: 2 }
                  return order[a.status] - order[b.status]
                })
                .map(item => {
                  const meta = STATUS_META[item.status]
                  return (
                    <div
                      key={item.id}
                      className={styles.alertItem}
                      style={{ borderLeft: `3px solid ${meta.color}` }}
                    >
                      <div className={styles.alertItemTop}>
                        <span className={styles.alertItemIcon}>{(() => { const I = ICON_MAP[item.icon] || Package; return <I size={16} /> })()}</span>
                        <span className={styles.alertItemName}>{item.name}</span>
                        <span
                          className={styles.statusBadge}
                          style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <div className={styles.alertItemDetail}>
                        {item.status === 'oversupply'
                          ? `${item.qty} ${item.unit} — ${item.qty - item.max} above max`
                          : `${item.qty} ${item.unit} — needs ${item.min - item.qty} more to reach minimum`
                        }
                      </div>
                    </div>
                  )
                })
            )}
          </div>

          {/* Suggestions */}
          <div className={styles.sectionHead} style={{ marginTop: '1.5rem' }}>
            Distribution Suggestions
          </div>
          <div className={styles.suggestionList}>
            {suggestions.map((s, i) => {
              const colors = {
                critical:   { border: '#dc2626', bg: '#fef2f2' },
                low:        { border: '#d97706', bg: '#fffbeb' },
                oversupply: { border: '#7c3aed', bg: '#f5f3ff' },
                info:       { border: '#0284c7', bg: '#f0f9ff' },
                normal:     { border: '#16a34a', bg: '#f0fdf4' },
              }[s.severity]

              return (
                <div
                  key={i}
                  className={styles.suggestion}
                  style={{ borderLeft: `3px solid ${colors.border}`, background: colors.bg }}
                >
                  <div className={styles.suggestionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <s.Icon size={15} /> {s.title}
                  </div>
                  <p className={styles.suggestionBody}>{s.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
