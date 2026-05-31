# Inventory & Order Management System

A full-stack application for managing products, customers, and orders with real-time inventory tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python 3.11) |
| Frontend | React 18 + Vite + Tailwind CSS |
| Database | PostgreSQL 15 |
| Containerization | Docker + Docker Compose |

## Features

- **Products** — CRUD with unique SKU enforcement
- **Customers** — CRUD with unique email validation
- **Orders** — Auto stock deduction on placement; rejected if stock is insufficient
- **Inventory tracking** — Live stock counts, low-stock highlighting

---

## Running Locally with Docker

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd inventory-system

# 2. Copy and fill environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Start all services
docker compose up --build

# App:     http://localhost:3000
# API:     http://localhost:8000
# API docs: http://localhost:8000/docs
```

## Running Backend Locally (without Docker)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set DATABASE_URL in .env pointing to your local PostgreSQL
uvicorn main:app --reload
```

## Running Frontend Locally (without Docker)

```bash
cd frontend
npm install

# Create .env.local with:
# VITE_API_URL=http://localhost:8000

npm run dev
```

---

## API Endpoints

### Products
| Method | URL | Description |
|---|---|---|
| GET | /api/products/ | List all products |
| POST | /api/products/ | Create product (unique SKU) |
| GET | /api/products/{id} | Get single product |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |

### Customers
| Method | URL | Description |
|---|---|---|
| GET | /api/customers/ | List all customers |
| POST | /api/customers/ | Create customer (unique email) |
| GET | /api/customers/{id} | Get single customer |
| PUT | /api/customers/{id} | Update customer |
| DELETE | /api/customers/{id} | Delete customer |

### Orders
| Method | URL | Description |
|---|---|---|
| GET | /api/orders/ | List all orders |
| POST | /api/orders/ | Place order (stock checked + decremented) |
| GET | /api/orders/{id} | Get single order |

---

## Business Rules Implemented

1. Product SKU must be unique — 400 error on duplicate
2. Customer email must be unique — 400 error on duplicate
3. Order placement checks stock ≥ quantity requested
4. If stock is insufficient → 400 error, order rejected
5. On successful order → stock auto-decremented atomically

---

## Deployment

### Backend → Render (free tier)
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env variable: `DATABASE_URL` (from Render PostgreSQL or Supabase)

### Database → Supabase (free tier)
1. Create project at [supabase.com](https://supabase.com)
2. Copy the connection string and set as `DATABASE_URL`

### Frontend → Vercel (free tier)
1. Push `frontend/` to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`
4. Build command: `npm run build`, Output dir: `dist`

### Docker Hub
```bash
# Build and push backend
docker build -t yourdockerhub/inventory-backend:latest ./backend
docker push yourdockerhub/inventory-backend:latest

# Build and push frontend
docker build -t yourdockerhub/inventory-frontend:latest ./frontend
docker push yourdockerhub/inventory-frontend:latest
```

---

## Project Structure

```
inventory-system/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py             ← FastAPI app
│   ├── database.py         ← SQLAlchemy engine & session
│   ├── models/             ← ORM models (Product, Customer, Order)
│   ├── schemas/            ← Pydantic request/response schemas
│   ├── routers/            ← Route handlers per entity
│   └── crud/               ← DB logic per entity
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── src/
    │   ├── App.jsx
    │   ├── api/client.js   ← Axios API wrappers
    │   ├── pages/          ← Products, Customers, Orders pages
    │   └── components/     ← Forms, Navbar
```
