# Mountain DataWarehouse Web App

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


## Basic Features

- **Product Management**: Add, update, delete and fetch product details.
- **Order Management**: Create and view orders with associated products, quantities and costs.


## Intructions to run locally
### Prerequisites

   - [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
   - [SQL Server](https://www.microsoft.com/en-us/sql-server)
   - [Node.js](https://nodejs.org/)
   - [npm](https://www.npmjs.com/)


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
   - Create a `.env` file in the `server` directory:
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
   - Create a `.env` file in the `client` directory:
```bash
     VITE_BACKEND_URL=http://localhost:5130
```

#### Run the Application:
```bash
   npm run dev
```
   The frontend will be available at http://localhost:5173.



### Troubleshooting

- SQL Server Connection Issues: Ensure SQL Server is running and accessible. Use .\SQLEXPRESS if you are using the default local instance.
- Port Conflicts: Verify that no other applications are running on http://localhost:5130 or http://localhost:5173.


## License

This project is licensed under the MIT License (LICENSE).

## Architecture and Design Decisions

### Backend Design Decisions

#### Framework Choice
- **ASP.NET Core Web API** was chosen over MVC as it is more lightweight, has less overhead, and focused on returning data to the frontend, making it ideal for RESTful APIs without server-side rendering.

#### API Design
- **RESTful Architecture** was adopted with controller and service layer architecture to promote separation of concerns, maintainability, and scalability.

#### Controllers and Services
- **Controllers** handle model/request validation and routing, while **services** contain the business logic and database interaction. This design offers:
  - **Testability**: Easy to unit test individual components.
  - **Scalability**: Future enhancements or validations can be added to the controller without complicating the service layer.
  - **Robustness**: Early error handling reduces unnecessary database queries and ensures clearer API responses.

#### GUID for IDs
- **GUID** is used for `orderID` and `productID` to ensure unique keys for each item, ensuring no identification conflicts.

#### Database Design
- **Normalization**: The `Orders` table doesn't fully match the requested schema (no Product column). Instead, a join table has been used to link Products and Orders via a many-to-many relationship. This was done to provide better flexibility, scalability, and to allow more efficient joins/queries (e.g. preventing product duplication in the orders table, verifying that a given product in an order actually exists in the products table).
- **Price at Time of Sale**: The product price is stored separately in the order to maintain the price at the time of sale, preventing price changes from altering historical order data.

#### Input Validation
- **Minimal Input Validation**: Validation of request data to endpoints has minimal error handling, in the interest of time. Assumed that frontend validation would catch most issues but given more time, methods could be added to validate request data and return more specific errors, handle edge cases or malicious input that might not be caught on the frontend.

#### DTOs (Data Transfer Objects)
- **DTOs** are used to control which data is returned in the API responses, preventing the exposure of sensitive or unnecessary details (e.g. product stock levels don't need to be provided in the order response object).

#### Database Seeding
- **Database Seeding** is performed at startup for testing and demonstration purposes. In a production environment, database migrations would be used instead to manage schema updates and ensure consistency across different environments.

### Frontend Design Decisions

#### TypeScript for Type Safety
- **TypeScript** was used to enforce type validation, helping prevent runtime errors and making the codebase easier to maintain and scale.

#### React Framework
- **React** was chosen over Vue for the frontedn as it is what I am more familiar with. However, both frameworks use many of the same principles such as state management component-based architecture.

#### State Management
- **Global State Management** is handled using **Zustand**, a lightweight state management library. This was chosen over a more comprehensive React library like Redux due to being lightweight, low overhead and more applicable to the scale of this app. Global state management allows consistent handling of application state (product and order lists) with actions and dispatchers, minimising unnecessary API calls.

#### Form Validation
- **Basic Frontend Form Validation** has been implemented for product and order creation, price, and stock input fields, with error messages for invalid inputs (e.g., price < 0 or missing required fields).

#### UI/UX Framework
- The app uses **Material UI** for ready made responsive design components and provide a modern, consistent UI.
  
#### User Feedback
- **Snackbar Notifications (MUI version of Toast)** are used to display success and error messages to users, ensuring clear feedback for actions with API interactions.
- 

## Limitations and Known Issues



