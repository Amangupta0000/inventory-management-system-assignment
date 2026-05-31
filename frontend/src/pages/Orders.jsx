import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import OrderForm from '../components/OrderForm'
import { getOrders, createOrder, getProducts, getCustomers } from '../api/client'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    try {
      const [o, p, c] = await Promise.all([getOrders(), getProducts(), getCustomers()])
      setOrders(o.data)
      setProducts(p.data)
      setCustomers(c.data)
    } catch {
      toast.error('Failed to load data')
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (form) => {
    setLoading(true)
    try {
      await createOrder(form)
      toast.success('Order placed! Stock updated.')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error placing order')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Orders</h1>
      <OrderForm products={products} customers={customers} onSubmit={handleCreate} loading={loading} />
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm bg-white">
          <thead className="bg-indigo-50 text-gray-600">
            <tr>
              {['ID', 'Customer', 'Product', 'Qty', 'Total', 'Status', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{o.id}</td>
                <td className="px-4 py-3">{o.customer?.name || o.customer_id}</td>
                <td className="px-4 py-3">{o.product?.name || o.product_id}</td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3 font-medium">₹{o.total_price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[o.status] || 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
