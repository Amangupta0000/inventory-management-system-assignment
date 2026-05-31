import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600'
    }`

  return (
    <nav className="bg-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="text-white font-bold text-lg tracking-tight">📦 InventoryOS</span>
        <div className="flex gap-2">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/customers" className={linkClass}>Customers</NavLink>
          <NavLink to="/orders" className={linkClass}>Orders</NavLink>
        </div>
      </div>
    </nav>
  )
}
