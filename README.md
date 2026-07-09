# EN2H Booking Platform REST API

Welcome to the EN2H Booking Platform REST API. This backend application is built using **NestJS**, **TypeScript**, and **SQLite** (via TypeORM). It provides a secure, robust, and fully-validated API for managing services and customer bookings.

## Project Overview

The Booking Platform allows:
1. **Authentication**: JWT-based registration and login for administrative users.
2. **Service Management**: Full CRUD operations for services, restricted to authenticated users.
3. **Booking Management**: Public booking creation, authenticated booking management (retrieval, status updates), and public/authenticated booking cancellation.
4. **Business Rules Enforcement**:
   - Bookings must belong to an existing, active service.
   - Booking dates and times cannot be in the past.
   - Cancelled bookings cannot be marked as completed.
   - Duplicate bookings for the same service, date, and time are prevented.

---

## Features & Enhancements (Including Bonuses)

- **JWT Authentication**: Secure login and registration with bcrypt password hashing.
- **SQLite Database**: Self-contained SQLite database using TypeORM for zero-configuration local setup.
- **Validation**: Strict input validation using `class-validator` and `class-transformer` pipes.
- **Global Exception Handling**: Custom `HttpExceptionFilter` for clean, consistent JSON error responses.
- **Swagger Documentation**: Interactive API documentation available at `/api/docs`.
- **Pagination, Search, and Filtering**:
  - Paginated booking list (`page` and `limit` query parameters).
  - Search bookings by customer name or email.
  - Filter bookings by status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- **Duplicate Prevention**: Prevents booking conflicts for the same service, date, and time.
- **Unit Testing**: Jest unit tests for core business logic in `BookingsService`.

---

## Installation Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (v10 or higher)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd booking-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory. You can copy the example file:
```bash
cp .env.example .env
```

Default environment variables:
```env
PORT=3000
JWT_SECRET=en2h_booking_platform_secret_key_2026
JWT_EXPIRES_IN=1h
```

---

## Database Setup

The project uses **SQLite** with TypeORM.
- The database is stored in a local file named `database.sqlite` in the root directory.
- Schema synchronization is enabled (`synchronize: true`) for development, which automatically creates and updates tables based on TypeORM entities when the application starts. No manual migration runs are required.

---

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Build & Run
```bash
npm run build
npm run start:prod
```

Once started, the application will be running at:
- API Base URL: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/api/docs`

---

## Running Tests

### Unit Tests
Run the Jest unit tests:
```bash
npm run test
```

### End-to-End / API Integration Verification
We have provided an automated test script `test-api.js` that spins up requests to verify all endpoints, authentication, and business rules.
1. Start the server: `npm run start`
2. In a separate terminal, run: `node test-api.js`

---

## API Documentation

Interactive API documentation is generated using Swagger. Start the application and navigate to:
👉 **`http://localhost:3000/api/docs`**

### Summary of Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user (admin)
- `POST /api/auth/login` - Log in and receive JWT token

#### Services
- `POST /api/services` - Create a service (Authenticated)
- `GET /api/services` - Get all services (Public)
- `GET /api/services/:id` - Get service by ID (Public)
- `PUT /api/services/:id` - Update service by ID (Authenticated)
- `DELETE /api/services/:id` - Delete service by ID (Authenticated)

#### Bookings
- `POST /api/bookings` - Create a booking (Public)
- `GET /api/bookings` - Get all bookings (Authenticated - supports pagination, search, status filter)
- `GET /api/bookings/:id` - Get booking by ID (Authenticated)
- `PATCH /api/bookings/:id/status` - Update booking status (Authenticated)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (Public/Authenticated)

---

## Assumptions Made

1. **User Roles**: By default, all registered users are created with the role of `admin` to manage services and view bookings, as the prompt specifies "Only authenticated users can manage services" and "Customers can create bookings without authentication".
2. **Timezones**: Date and time validation uses the local system time of the server running the application.
3. **Booking Cancellation**: Anyone (public or admin) can cancel a booking via `PATCH /api/bookings/:id/cancel` since customers may need to cancel their own bookings without logging in, while status updates (e.g. `CONFIRMED`, `COMPLETED`) are restricted to authenticated admins.

---

## Future Improvements

1. **Role-Based Access Control (RBAC)**: Introduce different user roles (e.g., `SuperAdmin`, `Staff`, `Customer`) with fine-grained permissions.
2. **Refresh Tokens**: Implement a refresh token mechanism to securely renew expired access tokens.
3. **Email/SMS Notifications**: Send automated confirmation and reminder emails/SMS to customers when bookings are created, confirmed, or cancelled.
4. **Calendar Integration**: Integrate with Google Calendar or Outlook Calendar APIs to sync bookings.
5. **Database Migrations**: Transition from `synchronize: true` to TypeORM migrations for production environments to safely manage schema changes.
