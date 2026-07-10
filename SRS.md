# Software Requirements Specification (SRS)
## Project: EN2H Booking Platform REST API

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the EN2H Booking Platform REST API. It provides a detailed description of the functional and non-functional requirements, business rules, and system architecture.

### 1.2 Scope
The Booking Platform REST API is a backend system built using NestJS and TypeScript. It allows administrative users to manage services and view customer bookings, while allowing public customers to book services and cancel their bookings.

### 1.3 Definitions & Acronyms
- **API**: Application Programming Interface
- **JWT**: JSON Web Token (used for secure authentication)
- **REST**: Representational State Transfer
- **CRUD**: Create, Read, Update, Delete
- **DTO**: Data Transfer Object

---

## 2. Overall Description

### 2.1 Product Perspective
The system is a self-contained REST API backend that connects to a local SQLite database using TypeORM. It exposes endpoints for authentication, service management, and booking management.

### 2.2 Product Functions
- User registration and login with JWT.
- Service management (Create, Read, Update, Delete).
- Booking management (Create, Read, Update Status, Cancel).
- Automatic database schema synchronization.
- Interactive API documentation via Swagger.

### 2.3 User Classes and Characteristics
- **Administrator (Authenticated User)**: Can manage services (create, update, delete) and view/manage all bookings (update status).
- **Customer (Public User)**: Can view active services, create bookings, and cancel bookings without authentication.

### 2.4 Design and Implementation Constraints
- Built using **NestJS** framework and **TypeScript**.
- Uses **SQLite** for data storage.
- Strict validation on all incoming request payloads.

---

## 3. Functional Requirements

### 3.1 Module 1: Authentication
- **FR-1.1 (Register)**: The system shall allow new users to register with an email and password. Passwords must be hashed using bcrypt.
- **FR-1.2 (Login)**: The system shall authenticate users using email and password, returning a JWT token upon successful login.
- **FR-1.3 (Authorization)**: The system shall protect administrative endpoints using a JWT Auth Guard.

### 3.2 Module 2: Service Management
- **FR-2.1 (Create Service)**: Authenticated users shall be able to create a service with a title, description, duration (in minutes), price, and active status.
- **FR-2.2 (Update Service)**: Authenticated users shall be able to update service details.
- **FR-2.3 (Delete Service)**: Authenticated users shall be able to delete a service.
- **FR-2.4 (Get Services)**: Users (public or authenticated) shall be able to retrieve all services or a specific service by ID.

### 3.3 Module 3: Booking Management
- **FR-3.1 (Create Booking)**: Customers (public) shall be able to book a service by providing their name, email, phone, service ID, booking date, and booking time.
- **FR-3.2 (Get Bookings)**: Authenticated users shall be able to retrieve a paginated list of bookings, search bookings by customer name/email, and filter by status.
- **FR-3.3 (Update Booking Status)**: Authenticated users shall be able to update a booking's status (PENDING, CONFIRMED, CANCELLED, COMPLETED).
- **FR-3.4 (Cancel Booking)**: Customers or admins shall be able to cancel a booking.

---

## 4. Business Rules

- **BR-1 (Service Association)**: A booking must belong to an existing, active service.
- **BR-2 (Date Validation)**: Booking dates and times cannot be in the past.
- **BR-3 (Status Transition)**: Cancelled bookings cannot be marked as completed.
- **BR-4 (Duplicate Prevention)**: The system shall prevent duplicate bookings for the same service, date, and time.

---

## 5. Non-Functional Requirements

### 5.1 Security
- Passwords must be hashed using bcrypt with a salt round of 10.
- JWT tokens must expire after 1 hour.
- Sensitive endpoints must require a Bearer token in the Authorization header.

### 5.2 Reliability & Validation
- All inputs must be strictly validated using `class-validator` decorators.
- Global exception filter must handle all HTTP exceptions and return a structured JSON error response.
