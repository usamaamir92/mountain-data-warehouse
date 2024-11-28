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


## Testing

To run the tests for this project, follow the steps below:

1. **Navigate to the `server` directory**:
   ```bash
   cd server
   ```

2. **Restore dependencies (if not done already)**:
   ```bash
   dotnet restore
   ```

3. **Run the tests:**:
   ```bash
   dotnet test
   ```

## Architecture, Design Decisions and Limitations

### Backend Design Decisions

#### Framework Choice
- **ASP.NET Core Web API** was chosen over MVC as it is more lightweight, has less overhead, and focused on returning data to the frontend, making it ideal for RESTful APIs without server-side rendering.

#### API Design
- **RESTful Architecture** was adopted with controller and service layer architecture to promote separation of concerns, maintainability, and scalability.

#### Database interaction
- **Entity Framework Core**  was chosen for its ease of use, automatic object-relational mapping, and support for database migrations making it ideal for simple CRUD operations, over a lower-level solution like Dapper.

#### Controllers and Services
- **Controllers** handle model/request validation and routing, while **services** contain the business logic and database interaction. This design offers:
  - **Testability**: Easy to unit test individual components.
  - **Scalability**: Future enhancements or validations can be added to the controller without complicating the service layer.
  - **Robustness**: Early error handling reduces unnecessary database queries and ensures clearer API responses.

#### GUID for IDs
- **GUID** is used for `orderID` and `productID` to ensure unique keys for each item, ensuring no identification conflicts.

#### Database Design
- **Normalization**: The `Orders` table doesn't fully match the requested schema (no Product column). Instead, a join table has been used to link Products and Orders via a many-to-many relationship. This was done to provide better flexibility, scalability, and to allow more efficient joins/queries (e.g. preventing product duplication in the orders table, verifying that a given product in an order actually exists in the products table).
- **Price at Time of Sale**: The product price is stored separately in the order (i.e. not linked directly to Product.Price) to maintain the price at the time of sale, preventing price changes from altering historical order data.

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
- **React** was chosen over Vue for the frontend as it is what I am more familiar with. However, both frameworks use many of the same principles such as state management and component-based architecture.

#### State Management
- **Global State Management** is handled using **Zustand**, a lightweight state management library. This was chosen over a more comprehensive React library like Redux due to being lightweight, low overhead and more applicable to the scale of this app. Global state management allows consistent handling of application state (product and order lists) with actions and dispatchers, minimising unnecessary API calls.

#### Form Validation
- **Basic Frontend Form Validation** has been implemented for product and order creation, and price and stock input fields, with error messages for invalid inputs (e.g., price < 0 or missing required fields).

#### UI/UX Framework
- The app uses **Material UI** for ready made responsive design components and provides a modern and consistent UI.
  
#### User Feedback
- **Snackbar Notifications (MUI version of Toast)** are used to display success and error messages to users, ensuring clear feedback for actions with API interactions.

### Testing

#### Backend Tests

The backend is unit tested using **xUnit** and EF's **in-memory database** for mocking dependencies. The tests focus on basic functionality such as:

- **Product Service**: Ensures the ability to create, update, and fetch products.
- **Order Service**: Verifies order creation and handling.

The tests focus on isolated business logic in the service layer without needing to interact with the full database or external dependencies. The **in-memory database** is used for simulating database interactions, allowing the tests to run quickly and independently.

#### Frontend Tests

In the interest of time and being able to be tested in real-time, **frontend testing** was not implemented. However, it is recognised as an important part of ensuring the stability of the user interface and application behavior.


## Improvements
Given more time or if this was an actual production environment, the below additions would be considered.

### Backend

#### More Test Coverage:
The test coverage on the backend could be vastly increased, ensuring a more reliable service. This would cover things such as handling invalid input errors, network errors and tests for each of the expected exceptions in error cases.

Integration testing combining multiple services and complex requests would be added to test the interactions and data flow between functions.

#### More Specific Error Handling in Case of 500 Internal Server Error:
Capturing and and logging of more database interaction errors would provide more detail and catch more Internal Server Errors, providing more detailed feedback.

#### Data logging and analytics:
Logging API response times, error rates and page visits could provide insights to help identify performance bottlenecks, areas for optimisation and improve reliability, especially important as the data grows.

### Frontend

#### Testing
There are currently no frontend tests. These would be added to test the robustness of the user experience and would include:

- **Unit tests for components**: To verify individual component logic and rendering.
- **Integration tests**: To ensure that components relate to each other correctly.
= **Error testing**: Ensuring that the frontend correctly handles and displays backend errors like validation failures or network issues.
- **End-to-end tests**: To simulate the full user flow and validate the overall functionality of the app across various scenarios.

#### More thorough handling of errors:
Currently, all errors from the backend are caught in a single catch block, but more granular error handling could improve user feedback.

#### Home Page + App Logo for Better User Flow and User-Friendly Interface:
Adding a landing page, app logo and branding would enhance the user experience. A clean, intuitive landing page would improve the overall flow and helps users navigate the app, especially as it grows.

#### Clean Up Front-End Code for improved readability:
There is scope to re-factor some functions and components on the frontend to improve modularity. Currently there are some components/functions that don't strictly adhere to single responsibility and atomicity principles, e.g. handleFieldChange functions could be separated out into a function for each change. This would become more necessary as the app grows. There is also some repetition of blocks of code across components doing the same thing which could be re-factored into app level functions or hooks.

#### Sort Frontend Data Display for More Clarity:
Products and Orders are currently not displayed in any particular order. Sorting and filtering functionality would enhance the user experience, especially as the amount of data grows.

#### Charts/Graphs/Analytics:
Adding an analytics/dashboard page would provide helpful visualisations of data to assist in spotting trends and patterns. This could be added using any of the various charts libraries with little overhead.

#### Set Loading States for Cleaner User Flow:
There are no "loading" states or useful feedback displayed when data is loading or processing. Given the size of the data this isn't currently an issue, but will become a key part of the user experience as the dataset grows.

### General

#### Authentication:
In a production environment, authentication and user management would be required to restrict certain actions to specified users only to enhance security.

#### Pagination:
Implementing pagination on the product/order lists (backend and frontend) would improve performance for larger datasets. Loading data in chunks would improve both response times and overall user experience.


### Deployment/Environments
In a production scenario, separate environments for production, development and testing would be set up. Automated testing would be set up to enable CI/CD and ensure seamless updates without disruption to the services.

## License
This project is licensed under the MIT License (LICENSE).
