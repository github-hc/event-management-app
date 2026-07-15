# EventFlow — Event Management System

EventFlow is a fullstack web application for organizing events and managing attendee registrations. It provides a real-time responsive dashboard, future-event validations, capacity constraints, duplicate checks, and dynamic slot calculation.

This project is structured following enterprise best practices—focusing on **separation of concerns**, **strict business rule isolation**, **robust API error mapping**, and a **premium, interactive user interface**.

---

## Tech Stack

| Domain | Technology | Key Libraries / Modules |
|---|---|---|
| **Backend** | **Python 3.10+** | FastAPI, Uvicorn, Pydantic v2, Pytest |
| **Frontend** | **Next.js 16 (App Router)** | React 19, TypeScript, Axios, Tailwind CSS v4 |
| **Data Storage** | **In-Memory Store** | Thread-safe in-memory singleton (No DB required) |

---

## Architecture

The project is designed with a decoupled architecture. The frontend application communicates with the backend REST API over HTTP, enabling independent scaling and clean decoupling of visual and data-access layers.

```
                  ┌──────────────────────┐
                  │      HTTP Client     │
                  │   (Next.js App /     │
                  │    Postman / Docs)   │
                  └──────────┬───────────┘
                             │
                      JSON / HTTP APIs
                             │
  ┌──────────────────────────▼──────────────────────────┐
  │                    FastAPI Backend                  │
  │  ┌──────────────────────────────────────────────┐   │
  │  │                  API Routers                 │   │
  │  │     app/api/events  &  app/api/registrations │   │
  │  └───────────────────────┬──────────────────────┘   │
  │  ┌───────────────────────▼──────────────────────┐   │
  │  │                 Service Layer                │   │
  │  │   (Enforces business rules & date validation)│   │
  │  └───────────────────────┬──────────────────────┘   │
  │  ┌───────────────────────▼──────────────────────┐   │
  │  │               Repository Layer               │   │
  │  │        (Data access & query wrappers)        │   │
  │  └───────────────────────┬──────────────────────┘   │
  │  ┌───────────────────────▼──────────────────────┐   │
  │  │               In-Memory Store                │   │
  │  │           (MemoryDB Singleton State)         │   │
  │  └──────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────┘
```

### Backend Layer Decoupling
1. **API Layer (`app/api`)**: Handles request routing, serialization (Pydantic), and wraps responses in custom HTTP code responses.
2. **Service Layer (`app/services`)**: The single source of truth for business decisions. All logic constraints reside here.
3. **Repository Layer (`app/repositories`)**: Decouples services from data access. Swapping memory databases for SQLAlchemy or MongoDB only requires updates here, without affecting service layer code.
4. **Model Layer (`app/models`)**: Declares pure schema structures using Python `@dataclass`.

---

## Folder Structure

```
event-management-app/
├── backend/                       # FastAPI Server Project
│   ├── app/
│   │   ├── api/                   # Router endpoints
│   │   ├── core/                  # Error middleware and standard envelopes
│   │   ├── models/                # Python `@dataclass` entities
│   │   ├── repositories/          # In-memory storage & query wrappers
│   │   ├── schemas/               # Request & response Pydantic DTOs
│   │   └── services/              # Pure business logic implementation
│   ├── tests/                     # 31 Pytest validation test suite
│   ├── pytest.ini
│   ├── requirements.txt
│   └── README.md                  # Backend specific docs
│
├── frontend/                      # Next.js Web App
│   ├── app/                       # Routing layout & globals
│   ├── components/                # Atomic UI blocks (event & register widgets)
│   ├── hooks/                     # Custom hooks for state queries & mutations
│   ├── lib/                       # App navigation & formatting constants
│   ├── services/                  # Axios HTTP client requests mapping
│   ├── types/                     # TypeScript type contracts
│   └── README.md                  # Frontend specific docs
│
└── README.md                      # This root workspace document
```

---

## Running the Application

### 1. Run the Backend API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend API server will run at `http://localhost:8000`. You can test it by visiting `http://localhost:8000/docs` to see the Interactive Swagger UI.

### 2. Run the Frontend Dashboard

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will run at `http://localhost:3000`.

---

## Business Rules Enforced

The system strictly enforces the following core business logic rules inside the **Service Layer** on registration events:

1. **Past Events Guard**: Users cannot register for events that have already occurred.
   - *Logic:* `if event.date <= datetime.now(timezone.utc): raise PastEventError`
   - *Error Code:* `PAST_EVENT` (HTTP 400)
2. **Capacity Check**: Total registrations cannot exceed an event's `max_capacity`.
   - *Logic:* `if current_registrations >= event.max_capacity: raise CapacityExceededError`
   - *Error Code:* `CAPACITY_EXCEEDED` (HTTP 409)
3. **Double Registration Check**: The same email cannot be registered for the same event more than once.
   - *Logic:* Checks existing state entries for matching `(user_email, event_id)` pairs.
   - *Error Code:* `DUPLICATE_REGISTRATION` (HTTP 409)
4. **Future Event Date Requirement**: Setting an event date in the past during creation or updates is rejected.
   - *Error Code:* `INVALID_EVENT_DATE` (HTTP 422)

---

## API Documentation

The backend exposes these standard REST endpoints:

### Events Endpoint (`/events`)
- `GET /events` — Lists all events sorted by date, enriched with registration counts & remaining spots.
- `GET /events/{id}` — Fetches details for a specific event.
- `POST /events` — Creates a new event (requires a future date).
- `PUT /events/{id}` — Updates an event.
- `DELETE /events/{id}` — Deletes an event, automatically cleaning up all associated registrations.

### Registration Endpoint (`/events/{id}/register`)
- `GET /events/{id}/registrations` — Lists all registered email addresses for an event.
- `POST /events/{id}/register` — Registers an email address (validates email syntax & enforces rules).
- `DELETE /events/{id}/unregister` — Unregisters an email address from an event.

---

## Assumptions Made

- **Authentication Out of Scope**: Per project requirements, authentication is omitted. Identification is tracked via unique, user-submitted email addresses (`user_email`).
- **Cascade Deletion**: Deleting an event deletes all associated registrations to prevent orphaned registration data.
- **Timezone Standardization**: All datetimes are parsed as timezone-aware UTC objects (`datetime.now(timezone.utc)`). Naive datetime objects are converted to prevent timezone conversion discrepancies between client and server systems.

---

## Future Improvements

If extending this application for production use:
1. **Persistent Database**: Swap the repository implementation to use an SQL database (e.g. Postgres with SQLAlchemy) or Document Store (e.g. MongoDB).
2. **Transactional Lock boundaries**: Introduce lock primitives on the service layer to prevent race conditions during peak concurrent registration requests.
3. **Search & Pagination**: Add server-side offset/cursor pagination and search filtering to `/events` list queries.
4. **User Auth**: Protect registration pathways using standard JWT OAuth2 authentication.
