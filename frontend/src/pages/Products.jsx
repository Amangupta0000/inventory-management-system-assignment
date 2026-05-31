import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ProductForm from '../components/ProductForm'
import { getProducts, createProduct, deleteProduct } from '../api/client'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts()
      setProducts(data)
    } catch {
      toast.error('Failed to load products')
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleCreate = async (form) => {
    setLoading(true)
    try {
      await createProduct(form)
      toast.success('Product added!')
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error adding product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Cannot delete — may have linked orders')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Products</h1>
      <ProductForm onSubmit={handleCreate} loading={loading} />
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm bg-white">
          <thead className="bg-indigo-50 text-gray-600">
            <tr>
              {['ID', 'Name', 'SKU', 'Price', 'Stock', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs bg-gray-50">{p.sku}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${p.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
