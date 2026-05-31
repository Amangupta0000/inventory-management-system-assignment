import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomerForm from '../components/CustomerForm'
import { getCustomers, createCustomer, deleteCustomer } from '../api/client'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCustomers = async () => {
    try {
      const { data } = await getCustomers()
      setCustomers(data)
    } catch {
      toast.error('Failed to load customers')
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  const handleCreate = async (form) => {
    setLoading(true)
    try {
      await createCustomer(form)
      toast.success('Customer added!')
      fetchCustomers()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error adding customer')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return
    try {
      await deleteCustomer(id)
      toast.success('Customer deleted')
      fetchCustomers()
    } catch {
      toast.error('Cannot delete — may have linked orders')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Customers</h1>
      <CustomerForm onSubmit={handleCreate} loading={loading} />
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm bg-white">
          <thead className="bg-indigo-50 text-gray-600">
            <tr>
              {['ID', 'Name', 'Email', 'Phone', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3 text-gray-500">{c.phone || '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
