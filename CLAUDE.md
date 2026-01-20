# VigilanceFrance - Project Documentation

> Une France Vigilante, des habitants en sécurité
> A Vigilant France, Safe Residents

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Services](#backend-services)
4. [Frontend Application](#frontend-application)
5. [Database Schemas](#database-schemas)
6. [Authentication Flow](#authentication-flow)
7. [API Reference](#api-reference)
8. [Key Features](#key-features)
9. [Configuration](#configuration)
10. [Development Workflow](#development-workflow)

---

## Project Overview

**VigilanceFrance** is a collaborative incident reporting and monitoring platform for France. It enables citizens to report, track, and discuss various types of incidents (accidents, floods, fires, thefts, assaults, etc.) in real-time on an interactive map.

### Tech Stack Summary

**Backend:**
- Node.js + TypeScript
- Express.js 5.1.0
- MongoDB (Mongoose)
- Redis (caching, sessions, pub/sub, job queue)
- Socket.IO (WebSocket)
- Bull (job queue)
- JWT authentication
- Docker + Docker Compose

**Frontend:**
- React 19.0.0 + TypeScript
- Vite 6.2.0
- React Router 7.5.0
- Tailwind CSS 4.1.3
- Google Maps API + Cesium 3D
- Socket.IO Client
- Zustand (state management)
- Shadcn/UI + Radix UI
- React Hook Form + Zod

---

## Architecture

### Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (React)                       │
│                    Port: 3000 (dev)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                    Port: 8000 (host)                        │
│    Rate Limiting • Session Management • Request Routing     │
└──────┬────────┬─────────┬─────────┬─────────┬──────────────┘
       │        │         │         │         │
       ▼        ▼         ▼         ▼         ▼
   ┌──────┐ ┌──────┐ ┌───────┐ ┌──────┐ ┌─────────┐
   │ Auth │ │ Maps │ │ Mess  │ │Notifs│ │  Redis  │
   │Service│ │Service│ │Service│ │Service│ │  Cache  │
   └───┬──┘ └───┬──┘ └───┬───┘ └───┬──┘ └────┬────┘
       │        │         │         │         │
       └────────┴─────────┴─────────┴─────────┘
                          │
                          ▼
                    ┌──────────┐
                    │ MongoDB  │
                    │          │
                    └──────────┘
```

### Services Overview

| Service | Port | Purpose | Rate Limit |
|---------|------|---------|------------|
| API Gateway | 8000 | Request routing, rate limiting, session management | - |
| Auth Service | Internal | Authentication, user management, OAuth | 4 req/sec |
| Maps Service | Internal | Incident CRUD, voting, solved status | 6 req/sec |
| Messages Service | Internal | Real-time comments via WebSocket | 10 req/sec |
| Notifications Service | Internal | Email notifications, job queue | 5 req/sec |
| Redis | 6379 | Cache, sessions, pub/sub, job queue | - |
| MongoDB | 27017 | Primary database | - |

---

## Backend Services

### 1. API Gateway

**Location:** `/backend/api-gateway`

**Responsibilities:**
- Central entry point for all client requests
- Route requests to appropriate microservices
- Rate limiting per service
- Session management with Redis
- Health check monitoring
- CORS handling

**Key Configuration:**
```typescript
// Service Routing
/v1/auth/* → auth-service:3001 (4 req/sec)
/v1/maps/* → maps-service:3002 (6 req/sec)
/v1/mess/* → messages-service:3003 (10 req/sec, WebSocket)
/v1/notifs/* → notifs-service:3004 (5 req/sec)
/v1/user-status/* → Custom endpoint (3 req/15sec)
```

**Session Configuration:**
- Store: Redis
- Cookie: SID (httpOnly, secure in production)
- Max Age: 5 minutes (configurable)
- Rolling: false

**Health Monitoring:**
- Polls all services every 60 seconds
- Reports: version, uptime, memory, CPU, network
- Timeout: 30 seconds

---

### 2. Auth Service

**Location:** `/backend/microservices/auth-service`
**Port:** 3001 (internal)

**Responsibilities:**
- User registration and login
- JWT access/refresh token management
- OAuth integration (Google, GitHub)
- Password hashing (bcrypt)
- Session management
- User profile management

**Key Endpoints:**
```typescript
POST   /auth/register      // Register new user
POST   /auth/login         // Login with email/password
POST   /auth/logout        // Logout and clear tokens
POST   /auth/refresh       // Refresh access token
POST   /auth/google        // Google OAuth login
POST   /auth/github        // GitHub OAuth login
GET    /account/profile    // Get authenticated user profile
```

**Security Features:**
- Access tokens: 1 hour expiry, httpOnly cookies
- Refresh tokens: Cached in Redis, returned to client
- Password hashing: bcrypt with salt rounds
- OAuth2: Google and GitHub integration
- Session management: Redis-backed sessions

**Redis Pub/Sub Events:**
- `new_user` - Published on registration
- `new_connection_to_account` - Published on login

**Database:** MongoDB `accounts` collection

---

### 3. Maps Service

**Location:** `/backend/microservices/maps-service`
**Port:** 3002 (internal)

**Responsibilities:**
- Incident CRUD operations
- Voting system (upvote/downvote)
- Solved status voting
- Issue filtering by type
- Comment management
- Geolocation handling

**Key Endpoints:**
```typescript
GET    /interactions/issues/show          // Get all incidents (filter: ?type=)
GET    /interactions/issues/:id           // Get incident by ID
POST   /interactions/issues/create        // Create incident (auth required)
PUT    /interactions/issues/:id           // Update incident
DELETE /interactions/issues/:id           // Delete incident

POST   /interactions/issues/:id/comments                    // Add comment
POST   /interactions/issues/:incidentId/comments/:id/like   // Like comment
POST   /interactions/issues/:incidentId/comments/:id/report // Report comment

GET    /interactions/votes/upvotes?issue_id=    // Get vote count
POST   /interactions/votes/vote?issue_id=       // Vote on incident
DELETE /interactions/votes/vote?issue_id=       // Remove vote

GET    /interactions/solved/upvote?issue_id=    // Get solved votes
POST   /interactions/solved/vote?issue_id=      // Mark as solved
DELETE /interactions/solved/vote?issue_id=      // Unmark as solved
```

**Incident Types:**
- `accident` - Auto crash
- `inondation` - Flood
- `incendie` - Fire
- `vol` - Robbery/Theft
- `agression` - Assault
- `manifestation` - Demonstration/Movement
- `panne` - Breakdown
- `pollution` - Air pollution
- `autre` - Other/Unknown

**Severity Levels:**
- `mineur` - Minor
- `moyen` - Medium
- `majeur` - Major
- `critique` - Critical

**Redis Pub/Sub Events:**
- `create_issue` - Published on incident creation

**Database:** MongoDB `issues` collection

---

### 4. Messages Service

**Location:** `/backend/microservices/messages-service`
**Port:** 3003 (internal)

**Responsibilities:**
- Real-time commenting system via WebSocket (Socket.IO)
- Room-based messaging per incident
- User authentication for WebSocket connections
- Message persistence
- Active user tracking

**WebSocket Events:**
```typescript
// Client → Server
connection(issue_id)  // Join incident chat room
message(data)        // Send comment to room

// Server → Client
message(data)        // Broadcast comment to room
error(message)       // Validation or auth error
```

**Authentication:**
- JWT from httpOnly cookies
- Verified on WebSocket connection
- User data attached to socket session

**Redis Pub/Sub Events:**
- `new_message` - Published on message creation

**Database:** MongoDB `messages` collection (one document per incident)

---

### 5. Notifications Service

**Location:** `/backend/microservices/notifs-service`
**Port:** 3004 (internal)

**Responsibilities:**
- Email notifications via Nodemailer
- Background job processing with Bull
- Event-driven notifications (subscribes to Redis pub/sub)
- Job retry logic and error handling

**Job Queue:**
- Engine: Bull (Redis-based)
- Retry: 3 attempts with exponential backoff
- Email templates for different event types

**Event Subscriptions:**
- `new_user` → Send welcome email
- `new_connection_to_account` → Login notification
- `create_issue` → Alert nearby users
- `new_message` → Comment notification

**Key Endpoints:**
```typescript
GET  /user            // Get user notifications
GET  /unread-count    // Get unread count
PUT  /:id/read        // Mark as read
PUT  /read-all        // Mark all as read
PUT  /preferences     // Update notification preferences
```

**Email Provider:** Configurable via Nodemailer (SMTP)

---

## Frontend Application

### Project Structure

```
client/
├── public/
│   ├── icons/                    # SVG icons for incident types
│   └── images/                   # Images and assets
├── src/
│   ├── components/
│   │   ├── callback/            # OAuth callback handlers
│   │   ├── form/                # Auth forms, OAuth buttons
│   │   ├── layout/              # Navbar, Footer
│   │   ├── map/                 # Map components
│   │   │   ├── IncidentMap.tsx
│   │   │   ├── IncidentForm.tsx
│   │   │   ├── IncidentSidebar.tsx
│   │   │   ├── IncidentFilters.tsx
│   │   │   ├── MapSidebarMenu.tsx
│   │   │   └── MapViewToogle.tsx
│   │   ├── monitoring/          # Dashboard components
│   │   └── ui/                  # Shadcn/UI components
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication state
│   ├── hooks/                   # Custom React hooks
│   ├── pages/
│   │   ├── Auth.tsx             # Login/Register
│   │   ├── Home.tsx             # Landing page
│   │   ├── Map.tsx              # Interactive map (protected)
│   │   ├── Monitoring.tsx       # User dashboard (protected)
│   │   ├── more/                # Static pages (About, FAQ, etc.)
│   │   └── user/                # User profile pages
│   ├── routes/                  # Protected route wrapper
│   ├── services/
│   │   ├── api.ts               # Axios client with interceptors
│   │   └── tokenService.ts      # Token management
│   ├── types/                   # TypeScript interfaces
│   ├── schemas/                 # Zod validation schemas
│   ├── constants/               # App constants
│   └── App.tsx                  # Main routing
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
└── package.json
```

---

### Key Pages

#### 1. Home Page (`/`)
**File:** `client/src/pages/Home.tsx`

- Landing page with hero section
- Feature showcase
- Call-to-action buttons
- Public access
- French Government Design System styling

#### 2. Auth Page (`/auth`)
**File:** `client/src/pages/Auth.tsx`

- Login/Register toggle
- Email/password authentication
- OAuth buttons (Google, GitHub)
- Form validation with Zod
- Redirects to `/map` on success

#### 3. Map Page (`/map`) - PROTECTED
**File:** `client/src/pages/Map.tsx`

**Features:**
- Interactive Google Maps with incident markers
- 3D globe toggle (Cesium)
- Left sidebar: Incident type filters with real-time counts
- Right sidebar: Incident details panel with comments
- Create incident form with map click to select coordinates
- Vote on incidents (upvote)
- Mark incidents as solved
- Real-time comment system via Socket.IO
- User location detection
- Nearby incident counter (5km radius)
- Custom SVG markers per incident type

**Components:**
- `IncidentMap` - Main map component with markers
- `IncidentSidebar` - Right panel with incident details
- `MapSidebarMenu` - Left panel with filters
- `IncidentForm` - Create/edit incident form
- `IncidentFilters` - Type filter buttons
- `MapViewToogle` - 2D/3D view switcher

#### 4. Monitoring Page (`/monitoring`) - PROTECTED
**File:** `client/src/pages/Monitoring.tsx`

**Features:**
- User dashboard with 3 tabs:
  1. **My Incidents** - Incidents reported by user
     - View, edit, delete own incidents
     - See vote counts and solved status
  2. **My Comments** - User's comment activity
     - View all comments across incidents
     - Like/unlike comments
     - Report inappropriate comments
  3. **Analytics** - Statistics and charts
     - Total incidents by type (pie chart)
     - Severity distribution (bar chart)
     - Timeline of incidents (area chart)
     - Monthly activity (line chart)

**Technologies:**
- Recharts for data visualization
- Framer Motion for animations
- Zustand for local state

---

### Routing Configuration

**Public Routes:**
```typescript
/                  // Home page
/auth              // Login/Register
/auth/callback     // OAuth callback
/about             // About page
/faq               // FAQ
/terms             // Terms of Service
/privacy           // Privacy Policy
/legal             // Legal Notice
/cookies           // Cookie Policy
/support           // Support
/partners          // Partners
/press             // Press
/contact           // Contact
```

**Protected Routes** (require authentication):
```typescript
/map               // Interactive incident map
/monitoring        // User dashboard
```

**Route Protection:**
- `ProtectedRoute` component wraps protected routes
- Checks authentication state from `AuthContext`
- Redirects to `/auth` if unauthenticated
- Attempts token refresh if access token expired

---

### State Management

#### AuthContext
**File:** `client/src/context/AuthContext.tsx`

**Responsibilities:**
- Global authentication state
- User data management
- Token refresh logic
- Login/logout/register methods
- Protected route validation

**State:**
```typescript
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email, password) => Promise<void>
  register: (data) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}
```

#### Zustand Stores
Used for local component state (map filters, sidebar state, form state)

---

### API Client

**File:** `client/src/services/api.ts`

**Configuration:**
```typescript
Base URL: /v1 (proxied to http://localhost:8000 in dev)
Credentials: include (sends httpOnly cookies)
Timeout: 30 seconds
```

**Interceptors:**
- **Request:** Attaches refresh token from localStorage (if needed)
- **Response Success:** Returns data directly
- **Response Error:**
  - On 401: Attempts token refresh
  - Retries original request with new access token
  - On refresh failure: Clears tokens and redirects to `/auth`
  - Returns error for other status codes

---

## Database Schemas

### MongoDB Collections

#### 1. accounts (Users)
**Collection:** `vigi_france_DB.accounts`

```typescript
{
  _id: ObjectId
  firstName: string                 // User's first name
  lastName: string                  // User's last name
  email: string                     // Email (unique index)
  password?: string                 // Bcrypt hash (optional for OAuth)
  profileImage: string              // Profile image URL
  authProvider: 'local' | 'google' | 'github'  // Auth provider
  created_at: Date                  // Registration timestamp
}
```

**Indexes:**
- `email` (unique)

**Sample Data:**
6 test accounts pre-populated in `mongo-init.js`

---

#### 2. issues (Incidents)
**Collection:** `vigi_france_DB.issues`

```typescript
{
  _id: ObjectId
  reporter_id: string               // User ID who created incident
  type: string                      // Incident type (see below)
  title: string                     // Brief title
  description: string               // Detailed description
  severity: string                  // Severity level (see below)
  location: string                  // Address or location name
  coordinates: {
    lat: number                     // Latitude
    lng: number                     // Longitude
  }
  votes: [{
    user_id: string                 // User who voted
    created_at: Date                // Vote timestamp
  }]
  solved: [{
    user_id: string                 // User who marked as solved
    created_at: Date                // Solve timestamp
  }]
  solved_at: Date | null            // When incident was marked solved
  created_at: Date                  // Creation timestamp
}
```

**Types:**
- `accident` - Auto crash
- `inondation` - Flood
- `incendie` - Fire
- `vol` - Robbery/Theft
- `agression` - Assault
- `manifestation` - Demonstration/Movement
- `panne` - Breakdown
- `pollution` - Air pollution
- `autre` - Other/Unknown

**Severity Levels:**
- `mineur` - Minor
- `moyen` - Medium
- `majeur` - Major
- `critique` - Critical

---

#### 3. messages (Comments)
**Collection:** `vigi_france_DB.messages`

```typescript
{
  _id: ObjectId
  issue_id: string                  // Incident ID (unique index)
  messages: [{
    user_id: string                 // Commenter user ID
    firstName: string               // Commenter first name
    lastName: string                // Commenter last name
    message: string                 // Comment text
    created_at: Date                // Comment timestamp
    likes: number                   // Like count
    reported: boolean               // Reported flag
  }]
}
```

**Indexes:**
- `issue_id` (unique)

**Notes:**
- One document per incident
- All comments for an incident stored in `messages` array
- Uses Socket.IO for real-time updates

---

### Redis Data Structures

#### 1. Sessions
**Key Pattern:** `sess:{sessionId}`

```typescript
{
  connected: boolean
  user_id: string
  firstName: string
  lastName: string
  last_pos_updated: Date
  last_lat: number
  last_lng: number
}
```

**TTL:** 5 minutes (configurable via `SESSION_MAX_AGE`)

---

#### 2. Refresh Tokens
**Storage:** Custom implementation in auth-service

**Structure:**
- Maps refresh token → user_id and access_token
- Used for token validation and refresh
- Deleted on logout

---

#### 3. Pub/Sub Channels

| Channel | Publisher | Subscribers | Payload |
|---------|-----------|-------------|---------|
| `new_user` | auth-service | notifs-service | User registration data |
| `new_connection_to_account` | auth-service | notifs-service | Login event data |
| `create_issue` | maps-service | notifs-service | New incident data |
| `new_message` | mess-service | notifs-service | New comment data |

---

## Authentication Flow

### 1. Registration Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │   Auth   │                  │ MongoDB  │
│          │                  │ Service  │                  │          │
└─────┬────┘                  └─────┬────┘                  └─────┬────┘
      │                             │                              │
      │ POST /v1/auth/auth/register │                              │
      │────────────────────────────>│                              │
      │ {firstName, lastName,       │                              │
      │  email, password}           │                              │
      │                             │                              │
      │                             │ Hash password (bcrypt)       │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │                             │ Create user                  │
      │                             │─────────────────────────────>│
      │                             │                              │
      │                             │<─────────────────────────────│
      │                             │                              │
      │                             │ Publish "new_user" to Redis  │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │                             │ Generate JWT (1h)            │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │                             │ Store refresh token in Redis │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │ {created: true,             │                              │
      │  user: userId,              │                              │
      │  _rft: refreshToken}        │                              │
      │<────────────────────────────│                              │
      │ Set-Cookie: Atk=accessToken │                              │
      │            (httpOnly)       │                              │
      │                             │                              │
      │ Store refresh token         │                              │
      │ in localStorage             │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
      │                             │                              │
      │ Redirect to /map            │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
```

---

### 2. Login Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │   Auth   │                  │ MongoDB  │
│          │                  │ Service  │                  │          │
└─────┬────┘                  └─────┬────┘                  └─────┬────┘
      │                             │                              │
      │ POST /v1/auth/auth/login    │                              │
      │────────────────────────────>│                              │
      │ {email, password}           │                              │
      │                             │                              │
      │                             │ Find user by email           │
      │                             │─────────────────────────────>│
      │                             │                              │
      │                             │<─────────────────────────────│
      │                             │                              │
      │                             │ Verify password (bcrypt)     │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │                             │ Publish "new_connection"     │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │                             │ Generate tokens              │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │ {user: {...},               │                              │
      │  _rft: refreshToken}        │                              │
      │<────────────────────────────│                              │
      │ Set-Cookie: Atk=accessToken │                              │
      │                             │                              │
      │ Store refresh token         │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
```

---

### 3. OAuth Flow (Google/GitHub)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │   Auth   │     │  OAuth   │     │ MongoDB  │
│          │     │ Service  │     │ Provider │     │          │
└─────┬────┘     └─────┬────┘     └─────┬────┘     └─────┬────┘
      │                │                 │                 │
      │ Click OAuth    │                 │                 │
      │ button         │                 │                 │
      │──────┐         │                 │                 │
      │      │         │                 │                 │
      │<─────┘         │                 │                 │
      │                │                 │                 │
      │ Redirect to    │                 │                 │
      │ OAuth provider │                 │                 │
      │────────────────────────────────> │                 │
      │                │                 │                 │
      │                │                 │ User authorizes │
      │                │                 │──────┐          │
      │                │                 │      │          │
      │                │                 │<─────┘          │
      │                │                 │                 │
      │ Redirect to    │                 │                 │
      │ /auth/callback │                 │                 │
      │ ?code=...      │                 │                 │
      │<────────────────────────────────│                 │
      │                │                 │                 │
      │ POST /v1/auth/ │                 │                 │
      │ auth/google    │                 │                 │
      │───────────────>│                 │                 │
      │ {code}         │                 │                 │
      │                │                 │                 │
      │                │ Exchange code   │                 │
      │                │ for token       │                 │
      │                │────────────────>│                 │
      │                │                 │                 │
      │                │<────────────────│                 │
      │                │                 │                 │
      │                │ Fetch user info │                 │
      │                │────────────────>│                 │
      │                │                 │                 │
      │                │<────────────────│                 │
      │                │                 │                 │
      │                │ Find/create user                  │
      │                │─────────────────────────────────> │
      │                │                                   │
      │                │<──────────────────────────────────│
      │                │                 │                 │
      │                │ Generate tokens │                 │
      │                │──────┐          │                 │
      │                │      │          │                 │
      │                │<─────┘          │                 │
      │                │                 │                 │
      │ {user: {...},  │                 │                 │
      │  _rft: token}  │                 │                 │
      │<───────────────│                 │                 │
      │                │                 │                 │
      │ Store token &  │                 │                 │
      │ redirect       │                 │                 │
      │──────┐         │                 │                 │
      │      │         │                 │                 │
      │<─────┘         │                 │                 │
```

---

### 4. Token Refresh Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │   Auth   │                  │  Redis   │
│          │                  │ Service  │                  │          │
└─────┬────┘                  └─────┬────┘                  └─────┬────┘
      │                             │                              │
      │ API Request                 │                              │
      │────────────────────────────>│                              │
      │ Cookie: Atk=expired_token   │                              │
      │                             │                              │
      │ 401 Unauthorized            │                              │
      │<────────────────────────────│                              │
      │                             │                              │
      │ Axios interceptor           │                              │
      │ catches 401                 │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
      │                             │                              │
      │ POST /v1/auth/auth/refresh  │                              │
      │────────────────────────────>│                              │
      │ Authorization: Bearer       │                              │
      │ {refreshToken}              │                              │
      │                             │                              │
      │                             │ Validate refresh token       │
      │                             │─────────────────────────────>│
      │                             │                              │
      │                             │<─────────────────────────────│
      │                             │                              │
      │                             │ Generate new access token    │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │ 200 OK                      │                              │
      │<────────────────────────────│                              │
      │ Set-Cookie: Atk=new_token   │                              │
      │                             │                              │
      │ Retry original request      │                              │
      │────────────────────────────>│                              │
      │ Cookie: Atk=new_token       │                              │
      │                             │                              │
      │ 200 OK                      │                              │
      │<────────────────────────────│                              │
```

**Notes:**
- Access tokens expire after 1 hour
- Refresh tokens cached in Redis (no expiry, manual deletion)
- If refresh fails, user redirected to `/auth`
- Axios interceptor handles refresh automatically

---

### 5. Logout Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │   Auth   │                  │  Redis   │
│          │                  │ Service  │                  │          │
└─────┬────┘                  └─────┬────┘                  └─────┬────┘
      │                             │                              │
      │ POST /v1/auth/auth/logout   │                              │
      │────────────────────────────>│                              │
      │ Cookie: Atk=access_token    │                              │
      │                             │                              │
      │                             │ Clear "Atk" cookie           │
      │                             │──────┐                       │
      │                             │      │                       │
      │                             │<─────┘                       │
      │                             │                              │
      │                             │ Delete refresh token         │
      │                             │─────────────────────────────>│
      │                             │                              │
      │                             │<─────────────────────────────│
      │                             │                              │
      │                             │ Destroy session              │
      │                             │─────────────────────────────>│
      │                             │                              │
      │                             │<─────────────────────────────│
      │                             │                              │
      │ 204 No Content              │                              │
      │<────────────────────────────│                              │
      │ Set-Cookie: Atk=; expires=0 │                              │
      │                             │                              │
      │ Clear localStorage          │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
      │                             │                              │
      │ Set user = null             │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
      │                             │                              │
      │ Redirect to /auth           │                              │
      │──────┐                      │                              │
      │      │                      │                              │
      │<─────┘                      │                              │
```

---

## API Reference

### Base URL
**Development:** `http://localhost:8000`
**Production:** TBD

### Authentication
All authenticated endpoints require:
- `Cookie: Atk={access_token}` (httpOnly, set by server)
- OR `Authorization: Bearer {refresh_token}` (for refresh endpoint)

---

### Auth Service (`/v1/auth`)

#### Register
```http
POST /v1/auth/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "created": true,
  "user": "userId",
  "_rft": "refreshToken"
}
Set-Cookie: Atk=accessToken; HttpOnly; Path=/; Max-Age=3600
```

#### Login
```http
POST /v1/auth/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profileImage": "url",
    "authProvider": "local"
  },
  "_rft": "refreshToken"
}
Set-Cookie: Atk=accessToken; HttpOnly; Path=/; Max-Age=3600
```

#### Logout
```http
POST /v1/auth/auth/logout
Cookie: Atk=accessToken

Response: 204 No Content
Set-Cookie: Atk=; Max-Age=0
```

#### Refresh Token
```http
POST /v1/auth/auth/refresh
Authorization: Bearer refreshToken

Response: 200 OK
{
  "message": "Token refreshed successfully"
}
Set-Cookie: Atk=newAccessToken; HttpOnly; Path=/; Max-Age=3600
```

#### Google OAuth
```http
POST /v1/auth/auth/google
Content-Type: application/json

{
  "code": "authorizationCode"
}

Response: 200 OK
{
  "user": {...},
  "_rft": "refreshToken"
}
Set-Cookie: Atk=accessToken; HttpOnly
```

#### GitHub OAuth
```http
POST /v1/auth/auth/github
Content-Type: application/json

{
  "code": "authorizationCode"
}

Response: 200 OK
{
  "user": {...},
  "_rft": "refreshToken"
}
Set-Cookie: Atk=accessToken; HttpOnly
```

#### Get Profile
```http
GET /v1/auth/account/profile
Cookie: Atk=accessToken

Response: 200 OK
{
  "_id": "userId",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "profileImage": "url",
  "authProvider": "local",
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

### Maps Service (`/v1/maps`)

#### Get All Incidents
```http
GET /v1/maps/interactions/issues/show
GET /v1/maps/interactions/issues/show?type=accident

Response: 200 OK
[
  {
    "_id": "issueId",
    "reporter_id": "userId",
    "type": "accident",
    "title": "Car crash on A1",
    "description": "Multi-vehicle collision",
    "severity": "majeur",
    "location": "Paris, France",
    "coordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "votes": [],
    "solved": [],
    "solved_at": null,
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

#### Get Incident by ID
```http
GET /v1/maps/interactions/issues/:id

Response: 200 OK
{
  "_id": "issueId",
  ...
}
```

#### Create Incident
```http
POST /v1/maps/interactions/issues/create
Cookie: Atk=accessToken
Content-Type: application/json

{
  "type": "incendie",
  "title": "Building fire",
  "description": "Large fire in residential building",
  "severity": "critique",
  "location": "Lyon, France",
  "coordinates": {
    "lat": 45.764043,
    "lng": 4.835659
  }
}

Response: 201 Created
{
  "_id": "newIssueId",
  ...
}
```

#### Vote on Incident
```http
POST /v1/maps/interactions/votes/vote?issue_id=issueId
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Vote added",
  "voteCount": 5
}
```

#### Remove Vote
```http
DELETE /v1/maps/interactions/votes/vote?issue_id=issueId
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Vote removed",
  "voteCount": 4
}
```

#### Mark as Solved
```http
POST /v1/maps/interactions/solved/vote?issue_id=issueId
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Marked as solved",
  "solvedCount": 3
}
```

#### Unmark as Solved
```http
DELETE /v1/maps/interactions/solved/vote?issue_id=issueId
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Unmarked as solved",
  "solvedCount": 2
}
```

#### Add Comment
```http
POST /v1/maps/interactions/issues/:id/comments
Cookie: Atk=accessToken
Content-Type: application/json

{
  "message": "I saw this too!"
}

Response: 201 Created
{
  "message": "Comment added"
}
```

#### Like Comment
```http
POST /v1/maps/interactions/issues/:incidentId/comments/:commentId/like
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Comment liked"
}
```

#### Report Comment
```http
POST /v1/maps/interactions/issues/:incidentId/comments/:commentId/report
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Comment reported"
}
```

---

### Messages Service (`/v1/mess`)

#### WebSocket Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8000/v1/mess', {
  withCredentials: true,  // Send httpOnly cookies
  query: { issue_id: 'issueId' }
});

// Send message
socket.emit('message', {
  message: 'Hello from the chat!'
});

// Receive messages
socket.on('message', (data) => {
  console.log('New comment:', data);
});

// Handle errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

---

### Notifications Service (`/v1/notifs`)

#### Get User Notifications
```http
GET /v1/notifs/user
Cookie: Atk=accessToken

Response: 200 OK
[
  {
    "_id": "notifId",
    "user_id": "userId",
    "type": "new_comment",
    "title": "New comment on your incident",
    "message": "John Doe commented on 'Car crash on A1'",
    "read": false,
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

#### Get Unread Count
```http
GET /v1/notifs/unread-count
Cookie: Atk=accessToken

Response: 200 OK
{
  "count": 3
}
```

#### Mark as Read
```http
PUT /v1/notifs/:id/read
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "Notification marked as read"
}
```

#### Mark All as Read
```http
PUT /v1/notifs/read-all
Cookie: Atk=accessToken

Response: 200 OK
{
  "message": "All notifications marked as read"
}
```

#### Update Preferences
```http
PUT /v1/notifs/preferences
Cookie: Atk=accessToken
Content-Type: application/json

{
  "email_notifications": true,
  "new_comments": true,
  "incident_updates": false
}

Response: 200 OK
{
  "message": "Preferences updated"
}
```

---

## Key Features

### 1. Incident Reporting System
- **Create incidents** with type, title, description, severity, location, coordinates
- **9 incident types** with custom SVG icons
- **4 severity levels** with color coding
- **Geolocation support** for auto-detecting user location
- **Map-based coordinate selection** (click map to set coordinates)
- **Image upload** capability (planned)

### 2. Interactive Mapping
- **Google Maps** integration with custom markers
- **3D globe view** powered by Cesium
- **Cluster markers** for dense areas (planned)
- **Custom SVG markers** per incident type
- **User location marker** with "You are here" label
- **Nearby incident counter** (5km radius)
- **Map center**: France (46.603354, 1.888334)
- **Zoom controls** and street view

### 3. Voting System
- **Upvote/downvote** incidents
- **Vote tracking** per user (prevent duplicate votes)
- **Vote count** display on markers and sidebar
- **Remove vote** functionality
- **Embedded votes array** in incident document
- **Real-time updates** via WebSocket

### 4. Solved Status System
- **Community-driven** solved marking
- **Solved vote threshold** (configurable)
- **"Solved" marker style** (green checkmark overlay)
- **Solved timestamp** (`solved_at`)
- **Unmark as solved** functionality
- **Filter by solved status** (planned)

### 5. Real-time Comment System
- **WebSocket-based** (Socket.IO)
- **Room-based chat** per incident
- **User authentication** required
- **Comment likes**
- **Comment reporting**
- **Display user name** with each comment
- **Persistent storage** in MongoDB
- **Live updates** to all users in room
- **Typing indicators** (planned)

### 6. User Dashboard (Monitoring)
- **Tab 1: My Incidents**
  - View all incidents reported by user
  - Edit incident details
  - Delete incidents
  - See vote counts and solved status
- **Tab 2: My Comments**
  - View all comments across incidents
  - Like/unlike comments
  - Report inappropriate comments
  - Navigate to incident from comment
- **Tab 3: Analytics**
  - Total incidents by type (pie chart)
  - Severity distribution (bar chart)
  - Timeline of incidents (area chart)
  - Monthly activity (line chart)
  - Statistics cards (total votes, comments, solved)

### 7. Multi-provider Authentication
- **Local authentication** (email/password)
- **Google OAuth 2.0**
- **GitHub OAuth**
- **JWT-based access tokens** (1 hour expiry)
- **Refresh token rotation**
- **Session management** with Redis
- **Password hashing** (bcrypt with salt)
- **Remember me** functionality (refresh token in localStorage)
- **Protected routes** with auto-redirect
- **Token refresh** on 401 errors

### 8. Rate Limiting
- **Per-service rate limits** in API Gateway
- **Redis-based rate limiter**
- **Custom limits:**
  - Auth: 4 req/sec
  - Maps: 6 req/sec
  - Messages: 10 req/sec
  - Notifs: 5 req/sec
  - User status: 3 req/15sec
- **429 Too Many Requests** on limit exceeded
- **Sliding window** algorithm

### 9. Event-Driven Architecture
- **Redis Pub/Sub** for cross-service communication
- **Events:**
  - `new_user` - Registration
  - `new_connection_to_account` - Login
  - `create_issue` - New incident
  - `new_message` - New comment
- **Notifications service** subscribes to all events
- **Email notifications** via Nodemailer
- **Job queue** with Bull for async processing
- **Retry logic** for failed jobs

### 10. Search and Filtering
- **Filter incidents by type** in sidebar
- **Real-time filter updates** (query on change)
- **Count display** per type (dynamic)
- **"All" option** to show everything
- **Query parameter support** (`?type=accident`)
- **Keyword search** (planned)
- **Date range filter** (planned)
- **Severity filter** (planned)

### 11. Responsive Design
- **Mobile-first approach**
- **Tailwind CSS utilities**
- **Glass morphism effects** (`glass-card-dark`)
- **Dark mode theme** (blue-gray palette)
- **Sidebar slide-in animations** (Framer Motion)
- **Touch-friendly UI** (large tap targets)
- **Adaptive layouts** (md:, lg: breakpoints)
- **Collapsible sidebars** on mobile

### 12. French Government Design System
- **@gouvfr/dsfr integration**
- **Accessibility compliance** (RGAA - French accessibility standard)
- **Official color schemes** (Marianne blue, RF red)
- **Typography standards** (Marianne font)
- **Component library** (buttons, forms, nav)
- **Logo and branding**

### 13. Error Handling & Validation
- **Zod schemas** for all inputs
- **Client-side validation** before API calls
- **Server-side validation** with Zod
- **Axios interceptors** for token refresh on 401
- **Error toasts** (react-hot-toast)
- **Graceful degradation** (fallback values)
- **Coordinates validation** (lat: -90 to 90, lng: -180 to 180)
- **Email validation** (RFC 5322)
- **Password strength** requirements (planned)

### 14. Health Monitoring
- **Health check endpoint** on each service (`/health`)
- **API Gateway polls** services every 60s
- **Reports:**
  - Version
  - Uptime
  - Memory usage
  - CPU usage
  - Network stats
- **30s timeout threshold**
- **Docker health checks** for Redis and MongoDB
- **Service status dashboard** (planned)

### 15. Static Pages
- **About** - Platform mission and team
- **FAQ** - Frequently asked questions
- **Terms of Service** - Legal terms
- **Privacy Policy** - Data handling and GDPR
- **Legal Notice** - Company information
- **Cookie Policy** - Cookie usage
- **Support** - Contact and help
- **Partners** - Partner organizations
- **Press** - Media resources
- **Contact** - Contact form

---

## Configuration

### Environment Variables

#### Frontend (`.env`)
```bash
# API Gateway URL
VITE_API_GATEWAY_URL=http://localhost:8000

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# OAuth Client IDs
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

#### Backend (`.env` for each service)

**API Gateway:**
```bash
PORT=80
REDIS_HOST=redis-cache
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_SESSION_SECRET=your_session_secret
SESSION_MAX_AGE=300000  # 5 minutes in milliseconds

# Service URLs
AUTH_SERVICE_URL=http://auth-service:3001
MAPS_SERVICE_URL=http://maps-service:3002
MESS_SERVICE_URL=http://mess-service:3003
NOTIFS_SERVICE_URL=http://notifs-service:3004

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Auth Service:**
```bash
SERVER_PORT=3001
REDIS_HOST=redis-cache
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_SESSION_SECRET=your_session_secret

# MongoDB
MONGO_DB_HOST=mongodb
MONGO_DB_PORT=27017
MONGO_DB_USERNAME=admin
MONGO_DB_PSWD=your_mongo_password
MONGO_DB_DATABASE=vigi_france_DB

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_TOKEN_EXPIRY=1h
JWT_REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
```

**Maps Service:**
```bash
SERVER_PORT=3002
REDIS_HOST=redis-cache
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# MongoDB
MONGO_DB_HOST=mongodb
MONGO_DB_PORT=27017
MONGO_DB_USERNAME=issue_admin
MONGO_DB_PSWD=your_mongo_password
MONGO_DB_DATABASE=vigi_france_DB

# JWT
JWT_SECRET=your_jwt_secret
```

**Messages Service:**
```bash
SERVER_PORT=3003
REDIS_HOST=redis-cache
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# MongoDB
MONGO_DB_HOST=mongodb
MONGO_DB_PORT=27017
MONGO_DB_USERNAME=mess_admin
MONGO_DB_PSWD=your_mongo_password
MONGO_DB_DATABASE=vigi_france_DB

# JWT
JWT_SECRET=your_jwt_secret
```

**Notifications Service:**
```bash
SERVER_PORT=3004
REDIS_HOST=redis-cache
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Job Queue
BULL_REDIS_HOST=redis-cache
BULL_REDIS_PORT=6379
BULL_REDIS_PASSWORD=your_redis_password
```

---

### Vite Configuration

**File:** `client/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  appType: 'spa',
});
```

---

### Docker Compose Configuration

**File:** `backend/docker-compose.yaml`

```yaml
version: '3.8'

services:
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
      args:
        SERVER_PORT: 80
    ports:
      - "8000:80"
    depends_on:
      redis-cache:
        condition: service_healthy
      mongodb:
        condition: service_healthy
    env_file:
      - ./api-gateway/.env
    networks:
      - custom-networks

  auth-service:
    build:
      context: ./microservices/auth-service
      dockerfile: Dockerfile
      args:
        SERVER_PORT: 3001
    depends_on:
      - redis-cache
      - mongodb
      - api-gateway
    env_file:
      - ./microservices/auth-service/.env
    networks:
      - custom-networks

  maps-service:
    build:
      context: ./microservices/maps-service
      dockerfile: Dockerfile
      args:
        SERVER_PORT: 3002
    depends_on:
      - redis-cache
      - mongodb
      - api-gateway
    env_file:
      - ./microservices/maps-service/.env
    networks:
      - custom-networks

  mess-service:
    build:
      context: ./microservices/messages-service
      dockerfile: Dockerfile
      args:
        SERVER_PORT: 3003
    depends_on:
      - redis-cache
      - mongodb
      - api-gateway
    env_file:
      - ./microservices/messages-service/.env
    networks:
      - custom-networks

  notifs-service:
    build:
      context: ./microservices/notifs-service
      dockerfile: Dockerfile
      args:
        SERVER_PORT: 3004
    depends_on:
      - redis-cache
      - api-gateway
    env_file:
      - ./microservices/notifs-service/.env
    networks:
      - custom-networks

  redis-cache:
    image: redis:alpine
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --appendonly yes
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis-cache:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - custom-networks

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: vigi_france_DB
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('serverStatus')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - custom-networks

volumes:
  redis-cache:
    driver: local
  mongo-data:
    driver: local

networks:
  custom-networks:
    driver: bridge
```

---

## Development Workflow

### Prerequisites
- Node.js 18+ (with pnpm)
- Docker and Docker Compose
- Google Maps API key
- OAuth credentials (Google, GitHub)

### Setup Instructions

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/VigilanceFrance.git
cd VigilanceFrance
```

#### 2. Setup Backend
```bash
cd backend

# Create .env files from examples
cp api-gateway/.env.example api-gateway/.env
cp microservices/auth-service/.env.example microservices/auth-service/.env
cp microservices/maps-service/.env.example microservices/maps-service/.env
cp microservices/messages-service/.env.example microservices/messages-service/.env
cp microservices/notifs-service/.env.example microservices/notifs-service/.env

# Edit .env files with your credentials
nano api-gateway/.env
# ... (edit other .env files)

# Start Docker services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

#### 3. Setup Frontend
```bash
cd ../client

# Install dependencies
yarn install
# or
npm install

# Create .env file
cat > .env << EOF
VITE_API_GATEWAY_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
EOF

# Start development server
yarn dev
# or
npm run dev
```

#### 4. Access Application
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- MongoDB: mongodb://localhost:27017
- Redis: redis://localhost:6379

---

### Development Commands

#### Backend (Docker)
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild all services
docker-compose up -d --build

# View logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec [service-name] sh

# Restart a service
docker-compose restart [service-name]
```

#### Frontend (Vite)
```bash
# Development server with hot reload
yarn dev

# Type check
yarn build

# Lint
yarn lint

# Preview production build
yarn preview
```

#### Database Management
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh -u root -p your_password

# Use database
use vigi_france_DB

# View collections
show collections

# Query incidents
db.issues.find().pretty()

# Query users
db.accounts.find().pretty()

# Connect to Redis
docker-compose exec redis-cache redis-cli -a your_password

# View all keys
KEYS *

# Get session
GET sess:your_session_id
```

---

### Testing

#### Backend Tests (to be implemented)
```bash
cd backend/microservices/[service-name]
pnpm test
```

#### Frontend Tests (to be implemented)
```bash
cd client
yarn test
```

---

### Deployment

#### Production Build

**Backend:**
```bash
cd backend
docker-compose -f docker-compose.prod.yaml up -d --build
```

**Frontend:**
```bash
cd client
yarn build
# Output in dist/
```

#### Environment Variables for Production
- Update all `.env` files with production URLs and secrets
- Use secure passwords and JWT secrets
- Enable HTTPS and secure cookies
- Configure CORS for production domain
- Set `NODE_ENV=production`

---

### Code Quality

#### TypeScript
- All code is strictly typed
- No `any` types
- Interfaces for all data structures

#### Linting
```bash
# Backend
cd backend/microservices/[service-name]
pnpm lint

# Frontend
cd client
yarn lint
```

#### Formatting
- Prettier configured (if applicable)
- Consistent code style across all services

---

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `viewport-ui` - Current feature branch
- Feature branches: `feature/feature-name`
- Bugfix branches: `fix/bug-name`

**Commit Message Format:**
```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Test additions or changes
- `chore` - Build process or auxiliary tool changes

---

## Next Steps & Roadmap

### Immediate Priorities
1. Complete notification system implementation
2. Add image upload for incidents
3. Implement search functionality
4. Add more filters (severity, date range, solved status)
5. Create admin dashboard for moderation
6. Add unit and integration tests
7. Implement CI/CD pipeline

### Feature Enhancements
- Real-time incident updates on map (WebSocket)
- Push notifications (web push)
- User reputation system
- Incident clustering on map
- Heatmap view
- Export data (CSV, JSON)
- Mobile app (React Native)
- Multilingual support (i18n)

### Performance Optimizations
- Redis caching for frequently accessed data
- Database indexing optimization
- Frontend code splitting
- Image optimization (CDN)
- Service worker for offline support

### Security Enhancements
- Rate limiting per user (not just per IP)
- CAPTCHA on registration/login
- Content Security Policy (CSP)
- Input sanitization
- XSS protection
- CSRF protection
- SQL/NoSQL injection prevention

---

## Troubleshooting

### Common Issues

#### 1. Docker services not starting
```bash
# Check logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild
docker-compose up -d --build [service-name]
```

#### 2. MongoDB connection errors
- Ensure MongoDB is healthy: `docker-compose ps`
- Check credentials in `.env` files
- Verify `mongo-init.js` executed successfully

#### 3. Redis connection errors
- Check Redis is running: `docker-compose ps redis-cache`
- Verify password in `.env` files
- Test connection: `docker-compose exec redis-cache redis-cli -a your_password ping`

#### 4. Frontend proxy errors
- Ensure API Gateway is running on port 8000
- Check `vite.config.ts` proxy configuration
- Verify CORS settings in API Gateway

#### 5. Authentication issues
- Clear browser cookies and localStorage
- Check JWT_SECRET is consistent across services
- Verify refresh token exists in localStorage
- Check API Gateway session configuration

#### 6. WebSocket connection failures
- Ensure `withCredentials: true` in Socket.IO client
- Check CORS settings for WebSocket upgrade
- Verify JWT in httpOnly cookies

---

## Contributing

### Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Process
- All PRs require approval from at least one maintainer
- CI/CD checks must pass
- Code must follow TypeScript and ESLint rules
- Add tests for new features

---

## License
[Specify License]

---

## Contact & Support
- **GitHub Issues:** https://github.com/yourusername/VigilanceFrance/issues
- **Email:** support@vigilancefrance.fr
- **Documentation:** https://docs.vigilancefrance.fr

---

## Acknowledgments
- French Government Design System (@gouvfr/dsfr)
- Google Maps API
- Cesium for 3D globe visualization
- All contributors and open-source projects

---

**Last Updated:** 2026-01-19
**Version:** 1.0.0
**Maintained by:** VigilanceFrance Team
