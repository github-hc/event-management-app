# Event Management API — Backend

A REST API for managing events and attendee registrations, built with **Python 3.10** and **FastAPI**. All data is stored in-memory (no database required).

---

## Requirements

- Python **3.10+**
- `pip` (comes with Python)
- A virtual environment tool (`venv` built-in)

---

## Python Version

This project was developed and tested on:

```
Python 3.10.13
```

To check your version:

```bash
python3 --version
```

---

## Install Dependencies

### 1. Create and activate a virtual environment

```bash
# From the backend/ directory
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows
```

### 2. Install required packages

```bash
pip install -r requirements.txt
```

---

## Run Server

Make sure the virtual environment is activated, then run:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

| URL | Description |
|---|---|
| `http://localhost:8000` | Base URL / Health check |
| `http://localhost:8000/docs` | Interactive Swagger UI |
| `http://localhost:8000/redoc` | ReDoc documentation |

To run on a custom port:

```bash
uvicorn app.main:app --reload --port 8080
```

---

## Run Tests

```bash
pytest tests/ -v
```

Expected output:

```
31 passed in 0.05s
```

To run a specific test file:

```bash
pytest tests/test_event_service.py -v
pytest tests/test_registration_service.py -v
```

---

## API Endpoints

### Events

| Method | Endpoint | Description | Success Code |
|---|---|---|---|
| `GET` | `/events` | List all events (with registration stats) | `200 OK` |
| `GET` | `/events/{id}` | Get a single event by ID | `200 OK` |
| `POST` | `/events` | Create a new event | `201 Created` |
| `PUT` | `/events/{id}` | Update an event (partial update supported) | `200 OK` |
| `DELETE` | `/events/{id}` | Delete an event (cascades registrations) | `204 No Content` |

### Registrations

| Method | Endpoint | Description | Success Code |
|---|---|---|---|
| `GET` | `/events/{id}/registrations` | List all registrations for an event | `200 OK` |
| `POST` | `/events/{id}/register` | Register a user for an event | `201 Created` |
| `DELETE` | `/events/{id}/unregister` | Unregister a user from an event | `200 OK` |

### Request / Response Examples

**Create Event** — `POST /events`
```json
{
  "title": "Tech Conference 2027",
  "description": "An annual tech conference.",
  "date": "2027-06-15T09:00:00Z",
  "max_capacity": 200
}
```

**Register User** — `POST /events/1/register`
```json
{
  "user_email": "alice@example.com"
}
```

### Error Response Format

All errors follow a consistent JSON envelope:

```json
{
  "success": false,
  "error": "DUPLICATE_REGISTRATION",
  "message": "User 'alice@example.com' is already registered for event 1."
}
```

### Business Rule Error Codes

| Error Code | HTTP Status | Trigger |
|---|---|---|
| `EVENT_NOT_FOUND` | `404` | Event ID does not exist |
| `PAST_EVENT` | `400` | Registering for an event in the past |
| `CAPACITY_EXCEEDED` | `409` | Event has reached max_capacity |
| `DUPLICATE_REGISTRATION` | `409` | Same user registered twice for same event |
| `REGISTRATION_NOT_FOUND` | `404` | Unregistering a user not registered |
| `INVALID_EVENT_DATE` | `422` | Creating/updating an event with a past date |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app entry point, CORS, exception handlers
│   ├── api/
│   │   ├── events.py            # Event CRUD router (/events)
│   │   └── registrations.py     # Registration router (/events/{id}/register)
│   ├── services/
│   │   ├── event_service.py     # Event business logic + validation
│   │   └── registration_service.py  # Registration business rules (3 rules)
│   ├── repositories/
│   │   ├── memory_db.py         # In-memory data store singleton
│   │   ├── event_repository.py  # Event CRUD against MemoryDB
│   │   └── registration_repository.py  # Registration data access
│   ├── models/
│   │   ├── event.py             # Event dataclass
│   │   └── registration.py      # Registration dataclass
│   ├── schemas/
│   │   ├── event.py             # Pydantic request/response schemas for events
│   │   └── registration.py      # Pydantic request/response schemas for registrations
│   └── core/
│       ├── exceptions.py        # Custom exception hierarchy
│       ├── exception_handlers.py # FastAPI exception → HTTP response mapping
│       └── responses.py         # Standard API response envelope models
├── tests/
│   ├── conftest.py              # Shared pytest fixtures + DB reset
│   ├── test_event_service.py    # Unit tests for EventService (16 tests)
│   └── test_registration_service.py  # Unit tests for RegistrationService (15 tests)
├── requirements.txt
├── pytest.ini
└── README.md
```

---

## Design Decisions

### Layered Architecture
The codebase follows a strict **4-layer architecture**: API → Service → Repository → Model. Each layer has one responsibility:
- **API layer** handles HTTP concerns (routing, status codes, request parsing)
- **Service layer** owns all business logic and validation — nothing else does
- **Repository layer** abstracts data access, making it trivial to swap in-memory storage for a real database later
- **Model layer** defines pure data structures with no logic

### Repository Pattern over Direct DB Access
Even though data is stored in-memory, the repository pattern is used deliberately. This means business logic never touches the raw `dict`/`list` store directly — a swap to PostgreSQL or MongoDB only requires changing the repository implementations, not the services or API.

### Dependency Injection in Services
Services receive their repositories via constructor injection (`__init__`). This makes unit testing clean and fast — no mocks needed, just swap in a fresh `MemoryDB` instance before each test.

### In-Memory Store with Singleton
`MemoryDB` is a module-level singleton (`db = MemoryDB()`). All repositories share the same instance across requests, simulating a shared database. Tests reset it via `autouse` fixture before each run to ensure full isolation.

### Timezone-Aware Datetimes
All datetime values use `datetime.now(timezone.utc)` (not `datetime.utcnow()`) to produce timezone-aware objects. This ensures safe comparison with timezone-aware datetimes parsed by Pydantic from ISO 8601 strings with `Z` or `+HH:MM` offsets.

### Consistent Error Responses
A custom exception hierarchy (`AppError` → domain-specific subclasses) is registered with FastAPI's exception handler system. Every error returns the same JSON shape `{ success, error, message }` regardless of where it originates.

### EmailStr Validation
User identification uses `user_email` (no auth required per spec). Pydantic's built-in `EmailStr` type automatically validates email format on every registration request, rejecting malformed addresses before they reach the service layer.

### Cascade Delete
Deleting an event automatically removes all associated registrations. This prevents orphaned data in the in-memory store and mirrors expected relational database behavior.
