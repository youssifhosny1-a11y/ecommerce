# E-Commerce REST API

A backend API for a small e-commerce app with two roles: **customers** (browse, cart, checkout) and **merchants** (manage products). Built with Node.js, Express and Zod validation, with JWT cookie authentication and role-based access control. The repo also includes the provided static frontend pages.

## Features

- Register and login with hashed passwords (bcrypt)
- JWT stored in an httpOnly cookie (1 hour expiry), plus logout
- Role-based access control: `customer` and `merchant`
- Request validation with Zod (register, login, products, cart)
- Products: list with search, get one, create, update and delete (merchant only)
- Cart: view, add, update quantity, remove item (customer only)
- Orders: checkout from the cart and list the user's orders (customer only)
- Simple file-based JSON storage (`data.json`) through a small DB helper (`db.js`)

## Tech stack

Node.js (ES modules), Express 5, jsonwebtoken, bcrypt, cookie-parser, Zod

## Project structure

```
index.js          Express app entry (port 3000)
db.js             file-based JSON DB helper
data.json         data store
middleware/       checkauth (JWT), checkrole, validate body (Zod)
routes/           auth, products, cart, orders, pages
schema/           Zod schemas
pages/            frontend pages
ROUTES.md         API route reference
```

## API overview

| Method | Route | Access |
| --- | --- | --- |
| POST | `/auth/register` | public |
| POST | `/auth/login` | public |
| POST | `/auth/logout` | public |
| GET | `/api/products` (`?search=`) | public |
| GET | `/api/products/:product_id` | public |
| POST | `/api/products` | merchant |
| PATCH | `/api/products/:product_id` | merchant |
| DELETE | `/api/products/:product_id` | merchant |
| GET | `/api/cart` | customer |
| POST | `/api/cart` | customer |
| PATCH | `/api/cart/:productId` | customer |
| DELETE | `/api/cart/:productId` | customer |
| GET | `/api/orders` | customer |
| POST | `/api/orders/checkout` | customer |

See [ROUTES.md](ROUTES.md) for request and response details.

## Getting started

Requires a recent Node.js version (the app uses `process.loadEnvFile`).

```bash
git clone https://github.com/youssifhosny1-a11y/ecommerce.git
cd ecommerce
npm install
echo "JWT_SECRET=change-me" > .env
npm run dev
```

The server runs on http://localhost:3000.

## Author

Youssef Hosny, Node.js backend developer. [LinkedIn](https://www.linkedin.com/in/youssef-hosny-270170248/)
