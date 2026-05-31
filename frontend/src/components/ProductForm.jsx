import { useState } from 'react'

export default function ProductForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '' })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
    setForm({ name: '', sku: '', price: '', stock: '' })
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="col-span-2 font-semibold text-gray-700">Add Product</h2>
      {[
        { label: 'Name', name: 'name', type: 'text' },
        { label: 'SKU', name: 'sku', type: 'text' },
        { label: 'Price (₹)', name: 'price', type: 'number' },
        { label: 'Stock', name: 'stock', type: 'number' },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input
            required name={name} type={type} value={form[name]}
            onChange={handle} min={type === 'number' ? 0 : undefined}
            step={name === 'price' ? '0.01' : undefined}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      ))}
      <div className="col-span-2">
        <button disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}
