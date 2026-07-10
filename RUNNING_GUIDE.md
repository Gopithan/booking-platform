# Running Guide
## Project: EN2H Booking Platform REST API

---

## 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18.x or higher)
- **npm** (v10.x or higher)

---

## 2. Installation Steps

1. Open your terminal and navigate to the project root directory:
   ```bash
   cd E:\booking-platform
   ```
2. Install all project dependencies:
   ```bash
   npm install
   ```

---

## 3. Configuration Setup
1. Create a `.env` file in the root directory:
   ```bash
   copy .env.example .env
   ```
2. Open the `.env` file and configure the variables:
   - `PORT`: The port on which the server will run (default: `3000`).
   - `JWT_SECRET`: A secure key used to sign JWT tokens.
   - `JWT_EXPIRES_IN`: Token expiration duration (default: `1h`).

---

## 4. Running the Application

### 4.1 Development Mode
To run the server with hot-reloading enabled (auto-restarts on code changes):
```bash
npm run start:dev
```

### 4.2 Production Mode
To build the TypeScript files and run the compiled production build:
```bash
npm run build
npm run start:prod
```

Once started, the console will output:
```
Application is running on: http://localhost:3000/api
Swagger documentation is available at: http://localhost:3000/api/docs
```

---

## 5. Testing the API

### 5.1 Automated Integration Test
We have provided a test script `test-api.js` that automatically tests the entire API flow (registration, login, service creation, booking creation, duplicate prevention, past date blocking, status updates, and cancellation).
1. Ensure the server is running (`npm run start`).
2. Open a new terminal window and run:
   ```bash
   node test-api.js
   ```

### 5.2 Unit Tests
To run the Jest unit tests for the business logic:
```bash
npm run test
```

---

## 6. Accessing API Documentation (Swagger)
1. Open your web browser.
2. Navigate to: **`http://localhost:3000/api/docs`**
3. You can interact with all endpoints directly from the browser. To test protected endpoints, use the `/api/auth/login` endpoint to get a token, click the **Authorize** button at the top right, and paste the token.

---

## 7. Database Inspection
The application uses a local SQLite database file named `database.sqlite` in the root directory.
To inspect the database tables (`users`, `services`, `bookings`):
- Use a tool like [DB Browser for SQLite](https://sqlitebrowser.org/).
- Or install the **SQLite Viewer** extension in VS Code and open the `database.sqlite` file directly.
