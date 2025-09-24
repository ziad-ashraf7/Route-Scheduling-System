# Route Scheduling System

A route scheduling system built with Node.js, Express, MongoDB, and Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js and npm (for local development without Docker)

## Getting Started

### With Docker (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Start the application and MongoDB using Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. The application will be available at `http://localhost:3000`

### Without Docker

1. Make sure you have MongoDB installed and running locally
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The application will be available at `http://localhost:3000`

## Environment Variables

- `PORT`: The port the application will run on (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Application environment (development/production)

## Development

- The application uses nodemon for automatic restart on file changes
- MongoDB data is persisted in a Docker volume named `mongodb_data`

## API Reference

Base URL: `http://localhost:3000`

Headers:
- `Content-Type: application/json`

### Routes

- POST `/routes/` — Create a new route
  - Request body:
    ```json
    {
      "startLocation": "Cairo",
      "endLocation": "Giza",
      "distance": 12.5,
      "estimatedTime": 30
    }
    ```
  - Responses:
    - 201 Created: returns the created route (possibly with `assignedDriver` populated)
    - 400 Bad Request: missing fields
    - 500 Server Error
  - Example:
    ```bash
    curl -X POST http://localhost:3000/routes \
      -H "Content-Type: application/json" \
      -d '{
        "startLocation":"Cairo",
        "endLocation":"Giza",
        "distance":12.5,
        "estimatedTime":30
      }'
    ```

- GET `/routes/` — List routes with pagination
  - Query params: `page` (default 1), `limit` (default 10)
  - Response 200:
    ```json
    {
      "routes": [ /* array of routes with assignedDriver populated */ ],
      "totalPages": 1,
      "currentPage": 1,
      "totalRoutes": 3
    }
    ```
  - Example:
    ```bash
    curl "http://localhost:3000/routes?page=1&limit=10"
    ```

- GET `/routes/:id` — Get a route by MongoDB ID
  - Responses:
    - 200 OK: returns route document (with `assignedDriver` populated)
    - 404 Not Found
    - 500 Server Error
  - Example:
    ```bash
    curl http://localhost:3000/routes/66f2d8f3c1a2b3c4d5e6f7a8
    ```

### Drivers

- POST `/driver/` — Create a new driver
  - Request body:
    ```json
    {
      "id": "DRV-001",
      "name": "John Doe",
      "licenseType": "B",
      "availability": true
    }
    ```
    - Notes: `availability` is optional (defaults to `true`). `id` must be unique.
  - Responses:
    - 201 Created: returns created driver (possibly with `activeRoute` populated)
    - 400 Bad Request: driver already exists
    - 500 Server Error
  - Example:
    ```bash
    curl -X POST http://localhost:3000/driver \
      -H "Content-Type: application/json" \
      -d '{
        "id":"DRV-001",
        "name":"John Doe",
        "licenseType":"B",
        "availability":true
      }'
    ```

- GET `/driver/` — List all drivers
  - Response 200: array of driver documents
  - Example:
    ```bash
    curl http://localhost:3000/driver
    ```

- GET `/driver/:id` — Get driver by business ID (the `id` field, not Mongo `_id`)
  - Responses:
    - 200 OK: returns driver (with `activeRoute` populated)
    - 404 Not Found
    - 500 Server Error
  - Example:
    ```bash
    curl http://localhost:3000/driver/DRV-001
    ```

### Scheduler

- GET `/schedule/` — Get current schedule for all drivers
  - Response 200: array of objects like:
    ```json
    [
      {
        "driverId": "DRV-001",
        "driverName": "John Doe",
        "availability": true,
        "route": {
          "routeId": "<MongoId>",
          "startLocation": "...",
          "endLocation": "...",
          "distance": 12.5,
          "estimatedTime": 30
        }
      }
    ]
    ```
  - Example:
    ```bash
    curl http://localhost:3000/schedule
    ```

- GET `/schedule/drivers/:id/history` — Get all routes ever assigned to a driver
  - Path param: `id` is the driver business ID (e.g., `DRV-001`)
  - Response 200:
    ```json
    {
      "driverId": "DRV-001",
      "driverName": "John Doe",
      "routeHistory": [
        {
          "routeId": "<MongoId>",
          "startLocation": "...",
          "endLocation": "...",
          "distance": 12.5,
          "estimatedTime": 30,
          "status": "assigned"
        }
      ]
    }
    ```
  - Example:
    ```bash
    curl http://localhost:3000/schedule/drivers/DRV-001/history
    ```
## Assumptions Made

- MongoDB is installed and running on default port 27017
- Node.js and npm are installed on the system
- Routes and drivers are managed through a RESTful API
- Each driver can be assigned to only one active route at a time
- Route scheduling follows a first-available-driver approach
- Driver scheduling follows a first-Free-Route approach



