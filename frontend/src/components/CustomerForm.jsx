import { useState } from 'react'

export default function CustomerForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit(form)
    setForm({ name: '', email: '', phone: '' })
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="col-span-2 font-semibold text-gray-700">Add Customer</h2>
      {[
        { label: 'Name', name: 'name', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Phone', name: 'phone', type: 'text' },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input
            required={name !== 'phone'} name={name} type={type} value={form[name]}
            onChange={handle}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      ))}
      <div className="col-span-2">
        <button disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Customer'}
        </button>
      </div>
    </form>
  )
}
