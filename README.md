# Mountain Data Warehouse Web App

This repository contains a full-stack web application for managing products and orders in a warehouse system. The backend is built with ASP.NET Core and Entity Framework Core, while the frontend is developed using React with TypeScript.

---

## Tech Stack

### Backend:
- **Framework**: ASP.NET Core
- **Database**: Microsoft SQL Server (Entity Framework Core for ORM)
- **Environment Configuration**: DotNetEnv
- **Dependency Injection**: Built-in .NET DI
- **API Documentation**: Swagger/OpenAPI

### Frontend:
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite

---

## Features

- **Product Management**: Add, update, and fetch product details.
- **Order Management**: Create and view orders with associated products.
- **Database**: SQL Server database with automatic migrations and seeding.
- **Cross-Origin Resource Sharing (CORS)**: Configured to allow requests from the frontend.

---

## Prerequisites

1. **Backend Requirements**:
   - [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
   - [SQL Server](https://www.microsoft.com/en-us/sql-server)

2. **Frontend Requirements**:
   - [Node.js](https://nodejs.org/) (v16 or higher)
   - [npm](https://www.npmjs.com/)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mountain-data-warehouse.git
cd mountain-data-warehouse
