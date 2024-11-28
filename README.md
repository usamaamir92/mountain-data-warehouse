# Mountain Data Warehouse Web App

This repository contains a full-stack web application for a product and order management system.

## Tech Stack

### Backend:
- **Framework**: ASP.NET Core
- **Database**: Microsoft SQL Server
- **API Documentation**: Swagger/OpenAPI

### Frontend:
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite


## Features

- **Product Management**: Add, update, and fetch product details.
- **Order Management**: Create and view orders with associated products.
- **Database**: SQL Server database with automatic migrations and seeding.
- **Cross-Origin Resource Sharing (CORS)**: Configured to allow requests from the frontend.


## Prerequisites

1. **Backend Requirements**:
   - [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
   - [SQL Server](https://www.microsoft.com/en-us/sql-server)

2. **Frontend Requirements**:
   - [Node.js](https://nodejs.org/) (v16 or higher)
   - [npm](https://www.npmjs.com/)


## Intructions to run locally

### 1. Clone the Repository
```bash
git clone https://github.com/usamaamir92/mountain-data-warehouse
cd mountain-data-warehouse
```

### 2. Backend Setup
#### Navigate to the `server` directory:
```bash
   cd server
```
#### Install Dependencies:
```bash
   dotnet restore
```
#### Set Up Environment Variables:
   - Create a `.env` file in the `server` directory (already included in the repo for development):
```bash
     FRONTEND_URL=http://localhost:5173
     DATABASE_SERVER=.\SQLEXPRESS
     DATABASE_NAME=MountainDataWarehouse
```
#### Run the Application:
   - Apply migrations and seed the database automatically on startup.
```bash
   dotnet run
```
   The backend server will start at http://localhost:5130.
   Once the backend is running, you can access the Swagger UI for API documentation at:
   http://localhost:5130/swagger


### 3. Frontend Setup
#### Navigate to the `client` directory:
```bash
   cd client
```
#### Install Dependencies:
```bash
   npm install
```
#### Set Up Environment Variables:
```bash
   - Create a `.env` file in the `client` directory (already included in the repo for development):
     VITE_BACKEND_URL=http://localhost:5130
```
#### Run the Application:
```bash
   npm run dev
```
   The frontend will be available at http://localhost:5173.



Troubleshooting

- SQL Server Connection Issues: Ensure SQL Server is running and accessible. Use .\SQLEXPRESS if you are using the default local instance.
- Port Conflicts: Verify that no other applications are running on http://localhost:5130 or http://localhost:5173.


License

This project is licensed under the MIT License (LICENSE).


