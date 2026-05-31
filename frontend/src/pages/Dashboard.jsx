import { useEffect, useState } from 'react'
import { getProducts, getCustomers, getOrders } from '../api/client'

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 flex items-center gap-4 border-l-4 ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, lowStock: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, c, o] = await Promise.all([getProducts(), getCustomers(), getOrders()])
        setStats({
          products: p.data.length,
          customers: c.data.length,
          orders: o.data.length,
          lowStock: p.data.filter(prod => prod.stock < 5),
          totalRevenue: o.data.reduce((sum, ord) => sum + parseFloat(ord.total_price), 0),
        })
      } catch {
        console.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-lg">Loading dashboard...</div>
  )

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={stats.products} icon="📦" color="border-indigo-500" />
        <StatCard label="Total Customers" value={stats.customers} icon="👥" color="border-green-500" />
        <StatCard label="Total Orders" value={stats.orders} icon="🛒" color="border-yellow-500" />
        <StatCard label="Revenue" value={`₹${stats.totalRevenue?.toFixed(2) || '0.00'}`} icon="💰" color="border-purple-500" />
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚠️</span> Low Stock Products
          <span className="ml-auto text-xs text-gray-400">(stock &lt; 5)</span>
        </h2>
        {stats.lowStock.length === 0 ? (
          <p className="text-sm text-green-600 font-medium">✅ All products are well stocked</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="pb-2 text-left">Product</th>
                  <th className="pb-2 text-left">SKU</th>
                  <th className="pb-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStock.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="py-2">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                        {p.stock} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
