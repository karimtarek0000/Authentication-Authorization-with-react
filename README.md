# Authentication & Authorization

Authentication system for applications. Built with React, React Router (data APIs), and Axios.

## Folder Structure

```
src/auth/
├── index.ts                     # Public auth module exports
├── tokenStore.ts                # In-memory token + session storage
├── refreshSession.ts            # Singleton refresh logic
├── authService.ts               # Login/logout/restore operations
├── authChannel.ts               # Multi-tab communication
├── APIclient.ts                 # Axios instance with interceptors
├── hooks/
│   ├── useAuth.ts               # useAuthState, useAuthActions
│   ├── useIdleTimeout.ts        # Auto-logout on inactivity
│   └── usePermission.ts         # Permission check hooks
├── component/
│   └── Can.tsx                  # Declarative permission component
├── loaders/
│   ├── protectedLoader.ts       # Auth guard for routes
│   ├── loginLoader.ts           # Redirect if already logged in
│   └── protectWithPermission.ts # Permission guard for routes
├── permissions/
│   └── index.ts                 # Permission constants and helpers
├── utils/
│   ├── checkPermissions.ts      # Permission evaluation utilities
│   └── redirect.ts              # Route redirect helpers
├── Types/
│   ├── provider.type.ts         # Provider/context type definitions
│   ├── permissions.type.ts      # Permission-related type definitions
│   ├── channel.type.ts          # Broadcast channel payload types
│   ├── component.type.ts        # Component prop type definitions
│   └── index.ts                 # Shared type exports
└── provider/
    ├── config.ts                # Types and React Context definitions
    └── AuthContext.tsx          # AuthProvider component
```

## Features

- **JWT Authentication** with access/refresh token strategy
- **Secure Token Storage**: access token in memory, refresh token in httpOnly cookie
- **Automatic Token Refresh** with race-condition handling (singleton pattern)
- **Role-Based Access Control (RBAC)** with type-safe permissions
- **Loader-Based Route Protection** using React Router data APIs
- **Permission Guards** at both UI level (`<Can>`) and route level (`requirePermission`)
- **Idle Session Timeout** with auto-logout after inactivity
- **Multi-Tab Synchronization** using BroadcastChannel API
- **Hard Reload on Logout** for complete memory cleanup
- **Optimized Re-renders** via split contexts (state vs actions)
- **Session Caching** to minimize API calls on navigation
