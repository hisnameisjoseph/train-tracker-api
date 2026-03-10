# 🚆 Train Tracker API

A NestJS-based backend service that fetches, stores, and serves real-time train departure information using the Public Transport Victoria (PTV) API.

---

## 📦 System Architecture

This project uses a modular architecture with the following core components:

### 🔌 PTV Module
Interfaces with the external PTV API.
- **Service**: Authenticates and sends API requests, parses response
- **Controller**: Provides endpoints for live train data

### 🏙️ Station Module
Manages train station records.
- **Entity**: Station ID, name, and associated PTV ID
- **Service**: Add, update, retrieve stations
- **Controller**: Endpoints to manage stations

### 🕒 Departure Module
Handles storage and retrieval of train departure information.
- **Entity**: Direction, platform, scheduled/estimated times, delays
- **Service**: Save incoming data, query stored departures
- **Controller**: Read-only endpoints for historical data

---

## 🔄 Data Flow

1. **Station Setup**: Add stations with their PTV IDs
2. **Fetch Live Data**: Use `/ptv/...` endpoints to retrieve departures
3. **Store Departures**: Data is stored in PostgreSQL via TypeORM
4. **Query History**: Use `/departure/...` endpoints to retrieve stored records

---

## 🔗 API Endpoints

### ✅ PTV Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ptv/departures/:stopId` | Get live departures for a stop |
| GET | `/ptv/departures/route/:routeId/stop/:stopId` | Filter by route |
| GET | `/ptv/search/:searchTerm` | Search for stations in PTV system |

### 📄 Departure Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departure` | All stored departures |
| GET | `/departure/ptv/:ptvStationId` | By PTV station |
| GET | `/departure/station/:stationId` | By internal station ID |

### 🏙️ Station Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/station` | List all stations |
| GET | `/station/:id` | Get station details |

---

## ⚙️ Technologies Used

- **[NestJS](https://nestjs.com/)** – Modular backend framework for Node.js
- **TypeORM** – ORM for database interactions
- **PostgreSQL** – Relational database
- **PTV API** – External source for real-time transport data

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   Create a .env file with:
   ```
   PTV_USER_ID=your_user_id
   PTV_API_KEY=your_api_key
   ```
3. **Run the database (Docker)**
   ```bash
   docker compose up -d
   ```
4. **Run migrations**
   ```bash
   npm run migration:run
   ```
5. **Start the server**
   ```bash
   npm run start:dev
   ```      
To test the API, you can use tools like Postman or cURL to hit the endpoints defined above.

## 🧪 Testing
Run tests using:
```bash
npm run test
```
To retrive the table of contents by using psql, you can first run the server using:
```bash
docker exec -it your_container_name psql -U postgres -d traindb
```
Replace `your_container_name` with the name of your Docker container running PostgreSQL.
Replace `traindb` with the name of your database if it's different.

Then, you can run the following command to get the table of contents:
```sql
\dt
```

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

