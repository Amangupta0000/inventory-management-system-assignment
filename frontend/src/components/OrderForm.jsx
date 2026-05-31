import { useState } from 'react'

export default function OrderForm({ products, customers, onSubmit, loading }) {
  const [form, setForm] = useState({ customer_id: '', product_id: '', quantity: 1 })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      customer_id: parseInt(form.customer_id),
      product_id: parseInt(form.product_id),
      quantity: parseInt(form.quantity),
    })
    setForm({ customer_id: '', product_id: '', quantity: 1 })
  }

  const selectedProduct = products.find(p => p.id === parseInt(form.product_id))

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="col-span-2 font-semibold text-gray-700">Place Order</h2>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Customer</label>
        <select required name="customer_id" value={form.customer_id} onChange={handle}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="">Select customer...</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Product</label>
        <select required name="product_id" value={form.product_id} onChange={handle}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="">Select product...</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} — Stock: {p.stock}</option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="col-span-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Price: ₹{selectedProduct.price} | Available stock: <span className={selectedProduct.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{selectedProduct.stock}</span>
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1">Quantity</label>
        <input required name="quantity" type="number" min={1}
          value={form.quantity} onChange={handle}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="col-span-2">
        <button disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </div>
    </form>
  )
}
