# Event Management App — Frontend

A modern, responsive dashboard interface for managing events and attendee registrations, built with **Next.js** (App Router), **TypeScript**, **Tailwind CSS v4**, and **Axios**.

---

## Requirements

- Node.js **18.17.0+**
- npm, yarn, pnpm, or bun

---

## Install

First, navigate to the `frontend/` directory and install the project dependencies:

```bash
cd frontend
npm install
```

---

## Run

To start the local Next.js development server:

```bash
npm run dev
```

The application will be available at:
`http://localhost:3000`

---

## Build

To compile a production-ready build:

```bash
npm run build
```

This runs the TypeScript compiler and optimizes the application, outputting static HTML and JS bundle files under the `.next/` directory.

To test the production build locally:

```bash
npm run start
```

---

## Project Structure

The project has a modular organization grouped by function and routing:

```
frontend/
├── app/                         # Next.js App Router pages & global layout
│   ├── layout.tsx               # Base layout, navbar, footer, metadata
│   ├── page.tsx                 # Root dashboard (displays EventList directly)
│   ├── globals.css              # Custom Tailwind CSS v4 styling & design system
│   └── events/
│       ├── page.tsx             # Redirects back to homepage (/)
│       ├── create/
│       │   └── page.tsx         # Add Event page form
│       └── [id]/
│           ├── page.tsx         # Event details & registration panel
│           └── edit/
│               └── page.tsx     # Edit Event page form
│
├── components/                  # UI Components
│   ├── common/                  # Atomic inputs, buttons, modals, loaders
│   ├── event/                   # Event cards, form inputs, list wrappers
│   ├── registration/            # User register form, attendee table/lists
│   └── layout/                  # Page headers and outer containers
│
├── services/                    # Server communications
│   ├── api.ts                   # Axios configuration & interceptors
│   ├── event.service.ts         # Event endpoint callers (CRUD)
│   └── registration.service.ts  # Attendee registration endpoint callers
│
├── hooks/                       # Custom React hooks
│   ├── useEvents.ts             # Manage state, queries, and mutations for events
│   └── useRegistrations.ts      # Manage attendee registration/unregistration state
│
├── types/                       # Shared TypeScript interfaces
│   ├── event.ts                 # Event structures
│   └── registration.ts          # Registration structures
│
├── lib/                         # Constants & helper util functions
│   └── constants.ts             # Base API URLs, navigation lists, date configurations
│
├── package.json
└── tsconfig.json
```

---

## State Management

Instead of heavy external state engines (like Redux), this application leverages **Custom React Hooks** (`useEvents` and `useRegistrations`) combined with local React state (`useState`, `useEffect`, `useCallback`) to manage backend data:
- **Encapsulated logic:** Service interactions, loading flags, and error contexts are handled entirely inside the hooks.
- **Optimistic UI Updates:** Changes (such as registrations or deletion updates) update local states immediately upon API success, reducing page reload requirements and ensuring snappy transitions.
- **Auto-refetch hooks:** The `useEvent` hook exposes a `refetch` callback to reload the registration capacity and attendee lists on-demand when registrations mutate.

---

## API Configuration

API interactions are managed through an instance of **Axios** configured in `services/api.ts`:
- **Base URL:** Resolves to the environment variable `NEXT_PUBLIC_API_URL` if set, or defaults to the local backend address: `http://localhost:8000`.
- **Response Interceptor:** Standardizes error handling by mapping standard FastAPI exception schemas (e.g. `{ success: false, error: CODE, message: MSG }`) directly to native JS `Error` instances, allowing hooks to surface user-friendly server errors on the UI.
