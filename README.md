# Authentication & Authorization

Authentication system for applications. Built with React 19, React Router 7 (data APIs), and Axios.

## Folder Structure

```
src/auth/
├── index.ts                 # Public auth module exports (barrel)
├── Call/
│   └── index.ts              # Axios instance + request cancellation controller
├── Components/
│   ├── CanView.tsx           # Declarative permission component
│   └── index.ts
├── Config/
│   └── index.ts               # API endpoints, OAuth client IDs/URLs
├── Guards/
│   ├── Guard.tsx              # HOC: require authentication
│   ├── GuardAuth.tsx          # HOC: redirect away if already authenticated
│   ├── GuardPermissions.tsx   # HOC: require a specific permission
│   └── index.ts
├── Idle/
│   └── index.ts                # useIdleTimeout hook (auto-logout on inactivity)
├── Layers/
│   ├── Idle.tsx                # Wires useIdleTimeout into the provider tree
│   ├── Interceptor.tsx         # Axios request/response interceptors + token refresh
│   ├── SyncTabs.tsx            # Reacts to cross-tab logout events
│   └── index.ts
├── OAuth/
│   └── index.ts                # Google/GitHub OAuth login flow + state verification
├── Permissions/
│   └── index.ts                # $checkPermissions and permission matching helpers
├── Provider/
│   ├── AuthProvider.tsx        # Composes state/actions contexts + Layers
│   ├── createContext.ts        # AuthStateContext / AuthActionsContext
│   ├── useAuthContext.tsx      # useAuthState, useAuthActions hooks
│   └── index.ts
├── Service/
│   └── index.ts                 # useAuthService: login/logout/refresh/restore session
├── Sync/
│   └── index.ts                 # BroadcastChannel wrapper for multi-tab auth events
├── Types/
│   └── index.ts                 # Shared auth types + PERMISSIONS constants
└── utils/
    └── index.ts                 # Redirect helpers, Axios error normalization
```

## Features

- **JWT Authentication** with access/refresh token strategy
- **Secure Token Storage**: access token in memory, refresh token in httpOnly cookie
- **OAuth Login** via Google and GitHub, with CSRF-style state verification
- **Automatic Token Refresh** with race-condition handling (singleton in-flight promise)
- **Request Retry** on transient failures via Axios response interceptor
- **In-Flight Request Cancellation** on route navigation, via a shared `AbortController` subscribed to router state changes
- **Role-Based Access Control (RBAC)** with type-safe permissions
- **HOC-Based Route Protection** (`Guard`, `GuardAuth`, `GuardPermissions`) wrapping layouts
- **Permission Guards** at both UI level (`<CanView>`) and route level (`GuardPermissions`)
- **Idle Session Timeout** with auto-logout after inactivity
- **Multi-Tab Synchronization** using the BroadcastChannel API
- **Hard Reload on Logout** for complete memory cleanup
- **Optimized Re-renders** via split contexts (state vs actions)
- **Session Restore Caching** to minimize API calls on navigation

## Getting Started

```bash
npm install
npm run dev
```

Configure API and OAuth endpoints via environment variables (`.env`):

```
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_GITHUB_CLIENT_ID=
```
