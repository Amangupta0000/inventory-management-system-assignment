import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Products
export const getProducts = () => client.get('/api/products/')
export const createProduct = (data) => client.post('/api/products/', data)
export const updateProduct = (id, data) => client.put(`/api/products/${id}`, data)
export const deleteProduct = (id) => client.delete(`/api/products/${id}`)

// Customers
export const getCustomers = () => client.get('/api/customers/')
export const createCustomer = (data) => client.post('/api/customers/', data)
export const updateCustomer = (id, data) => client.put(`/api/customers/${id}`, data)
export const deleteCustomer = (id) => client.delete(`/api/customers/${id}`)

// Orders
export const getOrders = () => client.get('/api/orders/')
export const createOrder = (data) => client.post('/api/orders/', data)

export default client
