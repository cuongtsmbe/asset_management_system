# Asset Management API Documentation

## Setup & Installation

### Prerequisites
- Docker
- Docker Compose

### Getting Started

1. Clone the repository
2. Run the application using Docker:

```bash
sudo docker compose up -d --build
```
3. stop run docker-compose down
```bash
sudo docker compose down -v
```


The application will be available at `http://localhost:3000`

## API Endpoints

### 1. Get All Assets
Retrieves all assets with their related information (location, organization, type).

**Endpoint:**
```bash
GET /assets
```
### 2. Get Asset by Serial
Retrieves a specific asset by its serial number.

**Endpoint:**
```bash
GET /assets/:serial
```

### 3. Sync Assets
Synchronizes assets from the source to the database.

**Endpoint:**
```bash
POST /assets/sync
```

### 4. Get Sync History
Retrieves the history of asset synchronization.

**Endpoint:**
```bash
GET /assets/sync/history
```

## Automated Synchronization
The system automatically synchronizes assets with the external system every day at midnight(00:00 UTC).

## Development

### Local Development
1. Install dependencies:
```bash
npm install
```

2. Run migrations
```bash
npm run migration:run
```

3. Start the development server:
```bash
npm run start:dev
```

3. Access the API documentation at `http://localhost:3000`

### Database Management
- PHPMyAdmin is available at `http://localhost:8080`
  - Username: root
  - Password: root