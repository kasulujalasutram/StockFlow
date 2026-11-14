# StockFlow – Inventory Management System

StockFlow is a full-stack inventory management application designed to help organizations manage products, monitor stock levels, and track inventory efficiently.

The application provides separate Admin and User dashboards with organization-based data management and secure authentication.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes

### Admin Dashboard
- View total products
- Monitor total stock quantity
- Track low-stock products
- View inventory value
- View recently added products
- Manage inventory

### Product Management
- Add new products
- View product lists
- Update product information
- Delete products
- Search products by name or SKU
- Filter products by category
- Monitor low-stock levels

### User Dashboard
- View inventory statistics
- View available products
- Monitor stock information
- Read-only product access

### Organization Management
- Organization-based data separation
- Admin and User roles
- Organization-specific inventory records

## Technology Stack

**Frontend**
- React.js
- JavaScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

**Development Tools**
- Visual Studio Code
- Git and GitHub
- Postman

## Project Structure

```text
StockFlow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── page/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └
