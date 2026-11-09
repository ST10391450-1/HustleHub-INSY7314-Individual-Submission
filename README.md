# HustleHub+ – Freelance Marketplace Platform

## 1. Project Overview

**HustleHub+** is a web-based freelance marketplace application developed to connect freelancers with clients looking for services. The platform allows freelancers to advertise their skills and services through gigs, while clients can browse available opportunities and book services.

The application provides an integrated environment for managing freelance work, bookings, simulated transactions, freelancer income and estimated income tax.

HustleHub+ was developed with a focus on secure authentication, role-based access control, data management, containerisation, automated testing and deployment.

## 2. Key Features

### Authentication and User Management
- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- Role-based access control for clients and freelancers.
- Protected application routes.
- Input validation and sanitisation.
- Rate limiting to help prevent authentication abuse.

### Freelancer Management
- Create, view, update and delete personal gigs.
- Manage advertised freelance services.
- View incoming bookings.
- Monitor booking activity and earnings.
- Access income and estimated tax information.

### Client Functionality
- Browse available freelance gigs.
- View gig information and freelancer details.
- Book freelance services.
- View booking information.
- Access simulated transaction records.

### Booking and Transaction Management
- Clients can create bookings for available gigs.
- Bookings are associated with the relevant client, freelancer and gig.
- A simulated transaction is generated when a booking is created.
- Transaction records maintain relationships with their corresponding bookings.
- Freelancers can monitor their booking and income information.

### Income and Tax Dashboard
- Calculates estimated freelance income.
- Provides an estimated income tax calculation.
- Displays income and tax information in a structured dashboard.
- Helps freelancers understand their earnings and estimated tax obligations.

*Tax calculations are estimates intended for demonstration and educational purposes and should not be treated as professional tax advice.*

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend Language | JavaScript |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| Database ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |
| API Communication | REST API |
| Containerisation | Docker |
| Container Orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Logging and Monitoring | Axiom |
| Deployment | Ubuntu Home Server |
| External Access | DuckDNS and Port Forwarding |

## 4. Application Architecture

HustleHub+ follows a client-server architecture.

### Frontend
The React frontend provides the user interface and communicates with the backend through REST API requests. It handles user interaction, authentication state, navigation, form validation and the presentation of application data.

### Backend
The Node.js and Express.js backend handles application logic, authentication, authorisation, data validation and API requests. It processes requests from the frontend and communicates with MongoDB.

### Database
MongoDB stores application information, including:
- User accounts and authentication-related information.
- Freelancer gigs.
- Client bookings.
- Simulated transactions.

### Architecture Flow

User → React Frontend → Express REST API → MongoDB Database

The backend validates and processes requests before returning the appropriate responses to the frontend.

## 5. Security Implementation

Several security mechanisms have been implemented to protect the application and its data.

- **JWT Authentication:** Protected API endpoints require valid authentication tokens.
- **Password Hashing:** Passwords are securely hashed before being stored.
- **Role-Based Authorisation:** Clients and freelancers have access to functionality appropriate to their roles.
- **Input Validation:** Incoming data is validated to prevent invalid information from entering the application.
- **Input Sanitisation:** User input is sanitised to reduce the risk of malicious database queries and injection attacks.
- **Rate Limiting:** Limits repeated requests to help protect endpoints against abuse.
- **Protected Routes:** Unauthenticated users cannot access restricted application functionality.
- **Environment Variables:** Sensitive configuration and credentials are stored outside the source code.
- **Data Ownership:** Freelancers can only manage their own gigs, and access to booking and transaction information is controlled.

## 6. Docker and Containerisation

HustleHub+ uses Docker to containerise its application components.

Docker Compose manages the following services:

1. **Frontend Container:** Hosts the React application.
2. **Backend Container:** Runs the Node.js and Express API.
3. **MongoDB Container:** Provides the application's database.

Containerisation provides a consistent application environment and simplifies deployment, configuration and service management.

To start the application:

```bash
docker compose up -d --build
```

To view running containers:

```bash
docker compose ps
```

To view application logs:

```bash
docker compose logs -f
```

To stop the application:

```bash
docker compose down
```

## 7. CI/CD Pipeline

HustleHub+ uses GitHub Actions to automate software validation and testing.

The CI/CD pipeline is triggered by pushes and pull requests to the configured branches.

The pipeline includes:

- Installing backend dependencies.
- Installing frontend dependencies.
- Starting a MongoDB test service.
- Running backend tests.
- Running frontend tests.
- Performing static code analysis and linting.
- Building the frontend.
- Validating the backend.
- Reporting failed checks through GitHub Actions.

This automated workflow helps identify errors early and ensures that changes are validated before being integrated into the application.

## 8. Logging and Monitoring

Axiom is integrated into the application to provide centralised logging and monitoring.

Application events include:
- Successful login attempts.
- Authentication-related events.
- User activity.
- Booking activity.
- Transaction-related events.
- Application errors.

Structured logging provides information such as event type, severity level, timestamp, service and relevant user identifiers.

This improves application observability and assists with troubleshooting, monitoring and security investigations.

## 9. Deployment

HustleHub+ is deployed using a home server running Ubuntu.

Docker Compose manages the application containers, while DuckDNS provides a domain name that points to the server's public IP address.

External access is configured through router port forwarding to expose the required application services without directly exposing the entire home server.

This deployment demonstrates the ability to host and access a containerised web application outside a local development environment.

## 10. Installation and Setup

### Prerequisites

Ensure the following software is installed:

- Node.js and npm.
- Docker.
- Docker Compose.
- Git.

### Clone the Repository

```bash
git clone (https://github.com/ST10391450-1/HustleHub-INSY7314-Individual-Submission/)
cd HustleHub-INSY7314-Individual-Submission
```

### Configure Environment Variables

Create the required `.env` configuration files using the environment variable examples provided in the project.

Configure the necessary values for:

- MongoDB connection.
- JWT authentication secret.
- Backend configuration.
- Frontend API endpoint.
- Logging and monitoring integration.

**Important:** Never commit actual credentials, API keys, database passwords or JWT secrets to version control.

### Start the Application

Build and start the application using Docker Compose:

```bash
docker compose up -d --build
```

Check the container status:

```bash
docker compose ps
```

The application can then be accessed through the configured frontend address.

## 11. Testing

The project includes automated backend and frontend validation through the GitHub Actions pipeline.

Testing focuses on:
- Authentication and registration.
- API functionality.
- Application business logic.
- Input validation.
- Error handling.
- Frontend functionality.
- Application builds.


