# Home Med+ Tracker - Complete Project Documentation

## Project Overview

**Home Med+ Tracker** is a comprehensive family health management application designed to help users track medicines, log health metrics, manage medication intake schedules, and maintain family wellness. The application provides a professional-grade solution for medication adherence and health monitoring.

### Project Information
- **Repository**: med-track
- **Owner**: vizal-s-l
- **Current Branch**: main
- **Project Type**: Monorepo (Full-stack Web Application)
- **Status**: Development
- **Last Updated**: October 16, 2025

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Backend Details](#backend-details)
5. [Frontend Details](#frontend-details)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [Core Features](#core-features)
9. [API Endpoints](#api-endpoints)
10. [Component Architecture](#component-architecture)
11. [State Management](#state-management)
12. [Security Features](#security-features)
13. [Deployment Configuration](#deployment-configuration)
14. [Firebase Web Notification Integration Requirements](#firebase-web-notification-integration-requirements)

---

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  (React + TypeScript + Vite + Tailwind CSS)            │
│  - Landing Page, Auth Pages, Dashboard                 │
│  - shadcn/ui Components                                 │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS/REST API
┌──────────────────────▼──────────────────────────────────┐
│                  Backend Layer                          │
│     (Node.js + Express + Supabase Client)              │
│  - Authentication Middleware                            │
│  - API Routes (Medicines, Metrics, Intakes)            │
│  - Business Logic                                       │
└──────────────────────┬──────────────────────────────────┘
                       │ Supabase Client SDK
┌──────────────────────▼──────────────────────────────────┐
│                Database Layer                           │
│              (Supabase/PostgreSQL)                      │
│  - User Profiles, Medicines, Health Metrics            │
│  - Intakes, Timing Settings                            │
│  - Row Level Security (RLS)                            │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns
- **MVC Pattern**: Separation of concerns with React components (View), API layer (Controller), and Supabase (Model)
- **Repository Pattern**: API abstraction layer for data access
- **Context Pattern**: React Context for global state (Auth)
- **Hook Pattern**: Custom hooks for API interactions and reusable logic
- **Component Composition**: Modular UI components with shadcn/ui

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.3.1 | Core UI library |
| **TypeScript** | ^5.8.3 | Type safety and development experience |
| **Vite** | ^5.4.19 | Build tool and dev server |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built accessible UI components |
| **Radix UI** | ^1.x | Headless UI primitives |
| **React Router** | ^6.30.1 | Client-side routing |
| **React Query** | ^5.83.0 | Server state management |
| **React Hook Form** | ^7.61.1 | Form management |
| **Zod** | ^3.25.76 | Schema validation |
| **Lucide React** | ^0.462.0 | Icon library |
| **date-fns** | ^3.6.0 | Date manipulation |
| **Recharts** | ^2.15.4 | Data visualization |
| **Sonner** | ^1.7.4 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v16+ | Runtime environment |
| **Express** | ^4.18.2 | Web framework |
| **Supabase JS** | ^2.39.0 | Database client and auth |
| **CORS** | ^2.8.5 | Cross-origin resource sharing |
| **dotenv** | ^16.3.1 | Environment variable management |
| **Nodemon** | ^3.0.1 | Development auto-reload |

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** for data isolation
- **UUID** for primary keys
- **Triggers** for automatic profile creation

### Development Tools
- **ESLint** ^9.32.0
- **PostCSS** ^8.5.6
- **Autoprefixer** ^10.4.21
- **Bun** (lockfile present)

---

## Project Structure

```
med-track/
├── package.json                    # Root workspace configuration
├── agent.md                        # This documentation file
│
├── backend/
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Express server entry point
│   ├── database-setup-with-auth.sql # Database schema
│   └── .env                       # Environment variables (not in repo)
│
└── frontend/
    ├── package.json               # Frontend dependencies
    ├── vite.config.ts            # Vite configuration
    ├── tsconfig.json             # TypeScript configuration
    ├── tailwind.config.ts        # Tailwind CSS configuration
    ├── components.json           # shadcn/ui configuration
    ├── index.html                # HTML entry point
    ├── README.md                 # Frontend documentation
    │
    ├── public/
    │   ├── favicon.ico
    │   ├── placeholder.svg
    │   └── robots.txt
    │
    └── src/
        ├── main.tsx              # Application entry point
        ├── App.tsx               # Root component with routing
        ├── index.css             # Global styles
        ├── App.css               # Component styles
        ├── vite-env.d.ts        # Vite type definitions
        │
        ├── components/           # Reusable UI components
        │   ├── AddMedicineModal.tsx
        │   ├── EmptyState.tsx
        │   ├── GlobalTimingSettings.tsx
        │   ├── HealthMetricCard.tsx
        │   ├── LogHealthMetricModal.tsx
        │   ├── MedicineCard.tsx
        │   ├── ProtectedRoute.tsx
        │   ├── TodaysIntakes.tsx
        │   └── ui/               # shadcn/ui components
        │       ├── accordion.tsx, alert-dialog.tsx
        │       ├── alert.tsx, avatar.tsx, badge.tsx
        │       ├── button.tsx, calendar.tsx, card.tsx
        │       ├── checkbox.tsx, dialog.tsx, drawer.tsx
        │       ├── dropdown-menu.tsx, form.tsx
        │       ├── input.tsx, label.tsx, popover.tsx
        │       ├── select.tsx, separator.tsx, sheet.tsx
        │       ├── switch.tsx, table.tsx, tabs.tsx
        │       ├── textarea.tsx, toast.tsx, toaster.tsx
        │       └── ... (30+ UI components)
        │
        ├── contexts/             # React Context providers
        │   └── AuthContext.tsx   # Authentication context
        │
        ├── hooks/                # Custom React hooks
        │   ├── use-mobile.tsx
        │   ├── use-toast.ts
        │   └── useApi.ts         # API integration hooks
        │
        ├── lib/                  # Utility libraries
        │   ├── api.ts           # API client functions
        │   ├── supabase.ts      # Supabase client initialization
        │   └── utils.ts         # Helper utilities
        │
        └── pages/                # Page components
            ├── AuthCallback.tsx  # OAuth callback handler
            ├── Dashboard.tsx     # Main application dashboard
            ├── Index.tsx        # Index page
            ├── LandingPage.tsx  # Marketing landing page
            ├── LoginPage.tsx    # Login page
            ├── SignupPage.tsx   # Registration page
            └── NotFound.tsx     # 404 page
```

---

## Backend Details

### Server Configuration (`server.js`)

**Port**: 5000 (default) or from environment variable
**CORS Configuration**:
- Production: `process.env.FRONTEND_URL` or `https://medtrack-frontend.onrender.com`
- Development: `http://localhost:8080`, `http://localhost:3000`
- Credentials: Enabled

### Environment Variables Required
```env
PORT=5000
NODE_ENV=development|production
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=https://your-frontend-url.com
```

### Authentication Middleware
```javascript
const authenticateUser = async (req, res, next)
```
- Validates JWT tokens from `Authorization: Bearer <token>` header
- Uses Supabase `auth.getUser()` to verify token
- Attaches `req.user` and `req.userToken` to request object
- Returns 401 for invalid/missing tokens

### Key Features
1. **User-specific Supabase Client**: Creates authenticated client per request
2. **Field Mapping**: Converts between camelCase (frontend) and snake_case (database)
3. **Row Level Security**: Enforces user-specific data access
4. **Health Check Endpoint**: `/health` for monitoring

---

## Frontend Details

### Build Configuration

**Vite Configuration**:
- React with SWC for fast refresh
- TypeScript support
- Path aliases: `@/` maps to `./src/`

**Development Server**: `http://localhost:8080`

### Environment Variables
```env
VITE_API_URL=http://localhost:5000/api (development)
VITE_API_URL=https://medtrack-wndy.onrender.com/api (production)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Routing Structure
```typescript
/ (root)           → LandingPage
/login             → LoginPage
/signup            → SignupPage
/auth/callback     → AuthCallback (OAuth)
/dashboard         → Dashboard (Protected)
* (404)            → NotFound
```

### State Management Approach
1. **Authentication State**: React Context (`AuthContext`)
2. **Server State**: React Query (TanStack Query)
3. **Local State**: useState for component-specific state
4. **Form State**: React Hook Form with Zod validation

---

## Database Schema

### Tables Overview

#### 1. **profiles**
Extends Supabase `auth.users` table
```sql
id                UUID (PK, FK to auth.users)
email             TEXT
full_name         TEXT
avatar_url        TEXT
created_at        TIMESTAMP WITH TIME ZONE
updated_at        TIMESTAMP WITH TIME ZONE
```

#### 2. **medicines**
Stores medicine information and dosage schedules
```sql
id                UUID (PK, DEFAULT gen_random_uuid())
user_id           UUID (FK to auth.users, ON DELETE CASCADE)
name              TEXT NOT NULL
total_quantity    INTEGER DEFAULT 0
current_stock     INTEGER DEFAULT 0
price             DECIMAL(10,2) DEFAULT 0
morning_qty       INTEGER DEFAULT 0
afternoon_qty     INTEGER DEFAULT 0
night_qty         INTEGER DEFAULT 0
threshold         INTEGER DEFAULT 5
next_due          TEXT
notes             TEXT
created_at        TIMESTAMP WITH TIME ZONE
updated_at        TIMESTAMP WITH TIME ZONE
```

#### 3. **user_timing_settings**
Global medication reminder times per user
```sql
id                UUID (PK)
user_id           UUID (FK to auth.users, UNIQUE)
morning_time      TIME DEFAULT '08:00:00'
afternoon_time    TIME DEFAULT '14:00:00'
night_time        TIME DEFAULT '20:00:00'
timezone          TEXT DEFAULT 'UTC'
created_at        TIMESTAMP WITH TIME ZONE
updated_at        TIMESTAMP WITH TIME ZONE
```

#### 4. **intakes**
Tracks scheduled and actual medicine consumption
```sql
id                UUID (PK)
user_id           UUID (FK to auth.users)
medicine_id       UUID (FK to medicines)
scheduled_time    TIMESTAMP WITH TIME ZONE NOT NULL
taken_time        TIMESTAMP WITH TIME ZONE
status            TEXT CHECK (scheduled|taken|missed|skipped)
quantity          INTEGER DEFAULT 1
notes             TEXT
created_at        TIMESTAMP WITH TIME ZONE
updated_at        TIMESTAMP WITH TIME ZONE
```

#### 5. **health_metrics**
Logs health measurements and vital signs
```sql
id                UUID (PK)
user_id           UUID (FK to auth.users)
type              TEXT NOT NULL
value             TEXT NOT NULL
unit              TEXT NOT NULL
date              TEXT NOT NULL
time              TEXT NOT NULL
trend             TEXT DEFAULT 'stable'
status            TEXT DEFAULT 'normal'
notes             TEXT
created_at        TIMESTAMP WITH TIME ZONE
```

### Row Level Security (RLS) Policies

All tables have RLS enabled with policies:
- **SELECT**: Users can view only their own data
- **INSERT**: Users can insert only with their own user_id
- **UPDATE**: Users can update only their own data
- **DELETE**: Users can delete only their own data

### Database Triggers

**on_auth_user_created**: Automatically creates profile entry when new user signs up

### Indexes
- `idx_medicines_user_id`, `idx_medicines_created_at`
- `idx_health_metrics_user_id`, `idx_health_metrics_created_at`, `idx_health_metrics_type`
- `idx_intakes_user_id`, `idx_intakes_medicine_id`, `idx_intakes_scheduled_time`, `idx_intakes_status`
- `idx_user_timing_settings_user_id`
- `idx_profiles_email`

---

## Authentication System

### Authentication Flow

1. **Sign Up**: 
   - Email/password registration via Supabase Auth
   - Automatic profile creation via database trigger
   - Optional user metadata (full_name)

2. **Sign In**:
   - Email/password authentication
   - JWT token generation by Supabase
   - Optional "Remember Me" functionality
   - Token stored in localStorage

3. **Google OAuth**:
   - OAuth flow with redirect to `/auth/callback`
   - Automatic profile creation

4. **Session Management**:
   - Supabase manages session tokens
   - Frontend checks session on load
   - Auth state listener for real-time updates

5. **Sign Out**:
   - Clears Supabase session
   - Redirects to landing page

### AuthContext Provider

**Provides**:
- `user`: Current authenticated user
- `profile`: User profile data
- `session`: Current session
- `loading`: Loading state
- `signUp()`: Registration function
- `signIn()`: Login function
- `signInWithGoogle()`: OAuth function
- `signOut()`: Logout function
- `updateProfile()`: Profile update function

### Protected Routes
- `ProtectedRoute` component wraps protected pages
- Checks authentication status
- Redirects to `/login` if not authenticated

---

## Core Features

### 1. Medicine Management
- **Add Medicine**: Track name, quantities, dosages, price, notes
- **Edit Medicine**: Update medicine details
- **Delete Medicine**: Remove medicine from tracking
- **Stock Monitoring**: Visual indicators for low stock and out-of-stock
- **Dosage Schedule**: Morning, afternoon, and night quantities
- **Threshold Alerts**: Configurable low-stock warnings

### 2. Health Metrics Tracking
- **Types**: Blood pressure, blood sugar, weight, custom metrics
- **Data Points**: Value, unit, date, time, notes
- **Trend Analysis**: Up, down, stable indicators
- **Status Monitoring**: Normal, warning, critical, high, low
- **Visualization**: Cards with trend indicators

### 3. Daily Intake Management
- **Schedule Generation**: Auto-generate daily intakes based on medicine schedules
- **Time Configuration**: Customizable morning, afternoon, night times
- **Intake Logging**: Mark as taken, missed, or skipped
- **Actual Time Tracking**: Records when medicine was actually taken
- **Status Indicators**: Visual status for each intake

### 4. Dashboard Features
- **Medicine Cards**: Grid display with stock levels and actions
- **Health Metric Cards**: Recent metrics with trends
- **Today's Intakes**: List of scheduled medicines for today
- **Low Stock Alerts**: Dedicated section for medicines needing reorder
- **Statistics Cards**: Total medicines, out of stock count, total value
- **Connection Status**: Online/offline indicator

### 5. User Profile Management
- **Profile Data**: Full name, email, avatar
- **Timing Settings**: Global medication reminder times
- **Timezone Support**: Configurable timezone

---

## API Endpoints

### Authentication Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Authenticate user |
| POST | `/api/auth/logout` | Yes | End user session |
| GET | `/api/auth/me` | Yes | Get current user profile |
| POST | `/api/auth/google` | No | Google OAuth initiation |

### Medicine Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/medicines` | Yes | Get all user medicines |
| POST | `/api/medicines` | Yes | Create new medicine |
| PUT | `/api/medicines/:id` | Yes | Update medicine |
| DELETE | `/api/medicines/:id` | Yes | Delete medicine |

### Health Metrics Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/health-metrics` | Yes | Get all user metrics |
| POST | `/api/health-metrics` | Yes | Log new health metric |

### Intake Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/intakes?date=YYYY-MM-DD` | Yes | Get intakes (optional date filter) |
| POST | `/api/intakes` | Yes | Create intake record |
| PUT | `/api/intakes/:id` | Yes | Update intake status |
| POST | `/api/intakes/generate-daily` | Yes | Generate daily intakes |

### Health Check

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/health` | No | Server health check |

---

## Component Architecture

### Page Components

#### **LandingPage**
- Hero section with value proposition
- Feature showcase cards
- Testimonials/social proof
- Call-to-action buttons
- Responsive design

#### **LoginPage**
- Email/password form
- Google OAuth button
- "Remember Me" checkbox
- Link to signup page
- Error handling

#### **SignupPage**
- Registration form (email, password, full name)
- Password validation
- Terms acceptance
- Google OAuth option
- Link to login page

#### **Dashboard**
- Header with user info and logout
- Connection status indicator
- Action buttons (Add Medicine, Log Metric, Settings)
- Medicine grid display
- Health metrics section
- Today's intakes component
- Low stock alerts
- Statistics cards
- Loading and error states

### Feature Components

#### **MedicineCard**
- Medicine name and dosage schedule
- Stock level progress bar
- Low stock/out of stock indicators
- Edit and delete actions
- Hover effects

#### **HealthMetricCard**
- Metric type icon
- Current value display
- Trend indicator
- Status badge
- Notes section

#### **TodaysIntakes**
- Daily intake list
- Schedule generation
- Action buttons (Take, Skip, Mark as Missed)
- Status indicators
- Time display

#### **AddMedicineModal**
- Form for medicine details
- Dosage quantity inputs
- Stock and price fields
- Threshold configuration
- Notes field
- Create/Edit modes

#### **LogHealthMetricModal**
- Metric type selection
- Value and unit inputs
- Date and time pickers
- Status selection
- Notes field

#### **GlobalTimingSettings**
- Time pickers for morning/afternoon/night
- Timezone selection
- Save functionality

### UI Components (shadcn/ui)
30+ pre-built accessible components including:
- Forms (Input, Textarea, Select, Checkbox, Switch)
- Feedback (Alert, Toast, Dialog, Popover)
- Layout (Card, Tabs, Accordion, Separator)
- Navigation (Button, Dropdown, Sheet)
- Data Display (Table, Badge, Avatar)

---

## State Management

### React Query Usage

**Query Keys**:
- `['medicines']`: All medicines
- `['health-metrics']`: All health metrics
- `['intakes', date]`: Intakes for specific date
- `['health-check']`: Server connection status

**Mutations**:
- `useCreateMedicine`: Add new medicine
- `useUpdateMedicine`: Update existing medicine
- `useDeleteMedicine`: Remove medicine
- `useCreateHealthMetric`: Log health metric
- `useCreateIntake`: Create intake record
- `useUpdateIntake`: Update intake status

**Features**:
- Automatic refetching on focus
- Cache management
- Optimistic updates
- Error handling
- Loading states

---

## Security Features

### Backend Security
1. **JWT Authentication**: Token-based authentication via Supabase
2. **Row Level Security**: Database-level data isolation
3. **CORS Configuration**: Restricted origins
4. **Input Validation**: Server-side validation
5. **User-specific Clients**: Each request uses authenticated client

### Frontend Security
1. **Protected Routes**: Authentication checks
2. **Token Storage**: Secure token management
3. **HTTPS Only**: Production enforces HTTPS
4. **XSS Prevention**: React's built-in protection
5. **CSRF Protection**: Token-based auth prevents CSRF

### Database Security
1. **RLS Policies**: User can only access own data
2. **Foreign Key Constraints**: Data integrity
3. **Cascading Deletes**: Clean data removal
4. **UUID Primary Keys**: Non-sequential IDs

---

## Deployment Configuration

### Backend Deployment (Render)
- **Service**: Web Service
- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check**: `/health` endpoint
- **Auto-deploy**: On push to main branch

### Frontend Deployment
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set in hosting platform

### Monorepo Scripts
```json
"dev:frontend": "npm run dev --workspace=frontend"
"dev:backend": "npm run dev --workspace=backend"
"build:frontend": "npm run build --workspace=frontend"
"build:backend": "npm run build --workspace=backend"
```

---

## Firebase Web Notification Integration Requirements

### Overview
Implement push notifications using Firebase Cloud Messaging (FCM) to remind users about scheduled medicine intakes and health metric logging. This will enhance medication adherence and user engagement.

### 1. Firebase Project Setup

#### Prerequisites
- Firebase project creation at [console.firebase.google.com](https://console.firebase.google.com)
- Firebase Cloud Messaging enabled
- Web app registered in Firebase project

#### Required Firebase Configuration
```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};
```

#### VAPID Key Generation
- Generate Web Push certificate (VAPID key) in Firebase Console
- Store in environment variables

### 2. Frontend Implementation Requirements

#### New Dependencies to Install
```json
{
  "firebase": "^10.x.x",
  "workbox-window": "^7.x.x" // For service worker management
}
```

#### Environment Variables to Add
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

#### Files to Create

**1. `frontend/public/firebase-messaging-sw.js`**
- Service worker for handling background notifications
- Intercepts and displays push notifications when app is closed
- Must be in `/public` directory for proper registration

**Features**:
```javascript
// Service Worker Requirements
- Import Firebase scripts (importScripts)
- Initialize Firebase with config
- Handle background messages
- Customize notification appearance
- Handle notification click actions
- Store notification data
```

**2. `frontend/src/lib/firebase.ts`**
- Firebase initialization
- FCM instance creation
- Token management functions
- Permission request handling
- Message handler registration

**Functions Required**:
```typescript
- initializeFirebase()
- getMessagingToken()
- requestNotificationPermission()
- onMessageListener()
- deleteToken()
```

**3. `frontend/src/hooks/useNotifications.ts`**
- Custom React hook for notification management
- Permission state management
- Token lifecycle handling
- Notification event handlers

**Hook Interface**:
```typescript
interface UseNotifications {
  notificationPermission: NotificationPermission;
  fcmToken: string | null;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  registerToken: (token: string) => Promise<void>;
  unregisterToken: () => Promise<void>;
}
```

**4. `frontend/src/components/NotificationPrompt.tsx`**
- UI component for requesting notification permission
- Displays when permission is "default"
- Explains benefits of notifications
- Allows user to enable or dismiss

**5. `frontend/src/components/NotificationSettings.tsx`**
- Settings panel for notification preferences
- Toggle notification types (medicine reminders, health metrics, low stock)
- Schedule customization
- Test notification button
- Disable notifications option

#### Integration Points

**In `App.tsx` or `Dashboard.tsx`**:
```typescript
// Initialize notifications on app load
useEffect(() => {
  if (user && notificationPermission === 'granted') {
    initializeNotifications();
  }
}, [user, notificationPermission]);

// Show notification prompt for new users
{notificationPermission === 'default' && <NotificationPrompt />}
```

**In `AuthContext.tsx`**:
```typescript
// Clean up FCM token on logout
const signOut = async () => {
  await deleteFirebaseToken();
  await supabase.auth.signOut();
};
```

### 3. Backend Implementation Requirements

#### New Dependencies to Install
```json
{
  "firebase-admin": "^12.x.x",
  "node-cron": "^3.x.x" // For scheduled notifications
}
```

#### Environment Variables to Add
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

#### Files to Create/Modify

**1. `backend/firebase-admin.js`**
- Firebase Admin SDK initialization
- Service account configuration
- Messaging service instance

**2. `backend/notification-service.js`**
- Core notification sending logic
- Notification template builder
- Batch notification handling
- Error handling and retry logic

**Functions Required**:
```javascript
- sendNotification(fcmToken, notification)
- sendBatchNotifications(tokens, notification)
- sendMedicineReminder(userId, medicine, timeSlot)
- sendLowStockAlert(userId, medicine)
- sendHealthMetricReminder(userId)
- buildNotificationPayload(type, data)
```

**3. `backend/notification-scheduler.js`**
- Cron job configuration
- Scheduled notification triggers
- User timezone handling
- Daily intake reminder scheduling

**Scheduler Requirements**:
```javascript
// Check every 5 minutes for upcoming intakes (within 15 mins)
// Send morning reminders at user's morning_time - 15 minutes
// Send afternoon reminders at user's afternoon_time - 15 minutes
// Send night reminders at user's night_time - 15 minutes
// Send low stock alerts daily at 9 AM user time
// Send missed intake reminders 30 minutes after scheduled time
```

**4. Database Schema Updates**

**New Table: `user_fcm_tokens`**
```sql
CREATE TABLE IF NOT EXISTS user_fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fcm_token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fcm_tokens_user_id ON user_fcm_tokens(user_id);
CREATE INDEX idx_fcm_tokens_active ON user_fcm_tokens(is_active);
```

**New Table: `notification_preferences`**
```sql
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  medicine_reminders BOOLEAN DEFAULT true,
  low_stock_alerts BOOLEAN DEFAULT true,
  health_metric_reminders BOOLEAN DEFAULT false,
  missed_intake_alerts BOOLEAN DEFAULT true,
  reminder_advance_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notification_prefs_user_id ON notification_preferences(user_id);
```

**New Table: `notification_log`** (Optional, for analytics)
```sql
CREATE TABLE IF NOT EXISTS notification_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT NOT NULL,
  fcm_token TEXT NOT NULL,
  payload JSONB,
  status TEXT CHECK (status IN ('sent', 'failed', 'clicked', 'dismissed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notification_log_user_id ON notification_log(user_id);
CREATE INDEX idx_notification_log_sent_at ON notification_log(sent_at DESC);
```

**5. New API Endpoints**

```javascript
// FCM Token Management
POST   /api/notifications/register-token
DELETE /api/notifications/unregister-token
GET    /api/notifications/preferences
PUT    /api/notifications/preferences

// Testing & Analytics
POST   /api/notifications/test
GET    /api/notifications/history
```

**Endpoint Details**:

**POST `/api/notifications/register-token`**
```json
// Request
{
  "fcmToken": "string",
  "deviceInfo": {
    "browser": "Chrome",
    "os": "Windows",
    "userAgent": "..."
  }
}

// Response
{
  "success": true,
  "message": "Token registered successfully"
}
```

**PUT `/api/notifications/preferences`**
```json
// Request
{
  "medicine_reminders": true,
  "low_stock_alerts": true,
  "health_metric_reminders": false,
  "reminder_advance_minutes": 15
}

// Response
{
  "success": true,
  "preferences": { ... }
}
```

**POST `/api/notifications/test`**
```json
// Request
{
  "type": "medicine_reminder"
}

// Response
{
  "success": true,
  "messageId": "projects/..."
}
```

**6. `backend/server.js` Modifications**

Add imports:
```javascript
const admin = require('./firebase-admin');
const notificationService = require('./notification-service');
const notificationScheduler = require('./notification-scheduler');
```

Initialize scheduler:
```javascript
// Start notification scheduler
notificationScheduler.start();

// Cleanup on server shutdown
process.on('SIGTERM', () => {
  notificationScheduler.stop();
});
```

### 4. Notification Types and Templates

#### Medicine Reminder
```javascript
{
  title: "Time for your medicine! 💊",
  body: `${medicineName} - ${quantity} ${timeSlot}`,
  icon: "/icons/medicine-icon.png",
  badge: "/icons/badge-icon.png",
  tag: `medicine-${medicineId}-${timeSlot}`,
  data: {
    type: "medicine_reminder",
    medicine_id: medicineId,
    intake_id: intakeId,
    scheduled_time: scheduledTime,
    url: "/dashboard"
  },
  actions: [
    { action: "taken", title: "Mark as Taken" },
    { action: "snooze", title: "Snooze 15 min" }
  ]
}
```

#### Low Stock Alert
```javascript
{
  title: "Low Stock Alert! ⚠️",
  body: `${medicineName} is running low (${currentStock} remaining)`,
  icon: "/icons/alert-icon.png",
  data: {
    type: "low_stock_alert",
    medicine_id: medicineId,
    current_stock: currentStock,
    threshold: threshold,
    url: "/dashboard"
  },
  actions: [
    { action: "view", title: "View Details" }
  ]
}
```

#### Missed Intake Alert
```javascript
{
  title: "Missed Medicine Alert ⏰",
  body: `You missed ${medicineName} at ${scheduledTime}`,
  icon: "/icons/missed-icon.png",
  data: {
    type: "missed_intake",
    medicine_id: medicineId,
    intake_id: intakeId,
    url: "/dashboard"
  }
}
```

#### Health Metric Reminder
```javascript
{
  title: "Time to log your health metrics 📊",
  body: "Track your blood pressure, weight, or blood sugar",
  icon: "/icons/health-icon.png",
  data: {
    type: "health_metric_reminder",
    url: "/dashboard"
  }
}
```

### 5. User Experience Flow

#### First-time User Flow
1. User signs up/logs in
2. After onboarding, show `NotificationPrompt` component
3. Explain benefits: "Never miss a dose! Get timely reminders"
4. User clicks "Enable Notifications"
5. Browser shows permission prompt
6. If granted:
   - Request FCM token
   - Register token with backend
   - Create default notification preferences
   - Show success toast
7. If denied:
   - Hide prompt
   - Show info in settings how to re-enable

#### Daily Usage Flow
1. User adds medicine with morning/afternoon/night schedule
2. Backend schedules notifications based on user_timing_settings
3. 15 minutes before scheduled time:
   - Backend sends push notification
   - If app is open: Show in-app toast
   - If app is closed: Show system notification
4. User clicks notification:
   - App opens to dashboard
   - Highlight the specific medicine intake
   - Quick action to mark as taken
5. User marks as taken:
   - Update intake status
   - Cancel scheduled notification
   - Update stock levels

#### Settings Management Flow
1. User goes to Dashboard Settings
2. Opens Notification Settings panel
3. Can toggle:
   - Medicine reminders ON/OFF
   - Low stock alerts ON/OFF
   - Health metric reminders ON/OFF
   - Missed intake alerts ON/OFF
4. Can set reminder advance time (5, 10, 15, 30 mins)
5. Can test notifications
6. Can disable all notifications (removes FCM token)

### 6. Testing Requirements

#### Manual Testing Checklist
- [ ] Permission request flow works
- [ ] Token registration succeeds
- [ ] Foreground notifications display
- [ ] Background notifications display
- [ ] Notification click opens correct page
- [ ] Notification actions work (Mark as Taken, Snooze)
- [ ] Multiple device support (same user, multiple tokens)
- [ ] Token refresh on page reload
- [ ] Notification preferences update correctly
- [ ] Low stock alerts trigger at correct threshold
- [ ] Timezone-aware scheduling works
- [ ] Missed intake alerts send after 30 mins
- [ ] Token cleanup on logout

#### Testing Tools
- Firebase Console > Cloud Messaging > Send test message
- Browser DevTools > Application > Service Workers
- Browser DevTools > Application > Notifications
- Chrome: chrome://flags/#enable-experimental-web-platform-features

### 7. Error Handling & Edge Cases

#### Permission Denied
- Gracefully handle denied permission
- Show instructions to re-enable in browser settings
- Don't repeatedly prompt

#### Unsupported Browser
- Check `Notification.permission` existence
- Check `firebase.messaging.isSupported()`
- Show message: "Notifications not supported in this browser"

#### Token Refresh
- FCM tokens can expire or be invalidated
- Listen for `onTokenRefresh` event
- Update backend with new token

#### Offline Handling
- Queue notifications if device is offline
- Retry failed notification sends
- Show cached data in service worker

#### Multiple Tabs/Devices
- Register unique tokens per device
- Send to all active tokens
- Track last_used_at to clean old tokens

#### Invalid Token
- Handle Firebase errors (invalid-registration-token)
- Delete token from database
- Re-request permission if needed

### 8. Performance & Optimization

#### Token Management
- Implement token cleanup job (remove tokens unused for 30+ days)
- Batch notification sends (max 500 per batch)
- Use Firebase multicast for same notification to multiple users

#### Scheduling Optimization
- Use cron jobs with efficient queries
- Index user_timing_settings by next_notification_time
- Cache frequently accessed data (user preferences, timezones)

#### Payload Size
- Keep notification payloads under 4KB
- Use data messages for large payloads
- Compress JSON data

### 9. Security & Privacy Considerations

#### Token Security
- Never expose FCM tokens in client-side code
- Store tokens server-side with encryption
- Implement rate limiting on token registration

#### Data Privacy
- Don't include sensitive health data in notifications
- Use generic messages: "Time for your medicine" vs "Time for Blood Pressure Medicine"
- Allow users to customize notification detail level

#### Permission Best Practices
- Don't request permission immediately on page load
- Explain why notifications are helpful
- Respect user's "Don't ask again" choice

### 10. Monitoring & Analytics (Optional)

#### Metrics to Track
- Notification delivery rate
- Click-through rate
- Permission grant/deny rate
- Most engaged notification types
- Time-to-action (notification sent → action taken)
- Device/browser distribution

#### Logging
- Log all notification sends to `notification_log` table
- Track errors and retry attempts
- Monitor Firebase quota usage

#### Dashboard Additions
- Admin panel showing notification statistics
- User notification history
- A/B testing different notification messages

### 11. Future Enhancements

#### Advanced Features (Phase 2)
- **Rich Notifications**: Images, videos, custom layouts
- **Notification Categories**: Group similar notifications
- **Smart Scheduling**: ML-based optimal reminder times
- **Family Sharing**: Notify caregivers about patient medications
- **Voice Responses**: "Hey Google, mark medicine as taken"
- **Wearable Integration**: Send to smartwatch
- **SMS Fallback**: SMS if push notification fails
- **Geofencing**: Remind when near pharmacy
- **Medication Interactions**: Warn about conflicting medicines
- **Refill Reminders**: Auto-remind to refill prescriptions

#### Internationalization
- Localized notification messages
- Timezone-aware scheduling across countries
- Cultural considerations for health reminders

### 12. Documentation Requirements

#### Developer Documentation
- Setup guide for Firebase project
- Environment variable configuration
- Service worker debugging guide
- API endpoint documentation
- Database schema documentation

#### User Documentation
- Help article: "How to enable notifications"
- FAQ: "Why am I not receiving notifications?"
- Troubleshooting guide
- Privacy policy update (notification data usage)

### 13. Dependencies Summary

#### New Frontend Dependencies
```bash
npm install firebase workbox-window
```

#### New Backend Dependencies
```bash
npm install firebase-admin node-cron
```

#### New Database Tables
- `user_fcm_tokens`
- `notification_preferences`
- `notification_log` (optional)

#### New API Endpoints
- 4 new notification endpoints

#### New Files (Frontend)
- `firebase-messaging-sw.js`
- `lib/firebase.ts`
- `hooks/useNotifications.ts`
- `components/NotificationPrompt.tsx`
- `components/NotificationSettings.tsx`

#### New Files (Backend)
- `firebase-admin.js`
- `notification-service.js`
- `notification-scheduler.js`

### 14. Implementation Timeline Estimate

**Phase 1: Foundation (Week 1)**
- Firebase project setup
- Frontend Firebase integration
- Service worker implementation
- Basic token registration

**Phase 2: Backend Integration (Week 2)**
- Firebase Admin SDK setup
- Database schema updates
- API endpoint creation
- Basic notification sending

**Phase 3: Scheduling (Week 3)**
- Cron job implementation
- Timezone handling
- Medicine reminder logic
- Low stock alerts

**Phase 4: UI/UX (Week 4)**
- NotificationPrompt component
- NotificationSettings component
- Permission flow refinement
- Testing and bug fixes

**Phase 5: Testing & Launch (Week 5)**
- Cross-browser testing
- Mobile testing
- Performance optimization
- Production deployment

---

## Additional Notes

### Known Limitations
- Service workers require HTTPS (except localhost)
- iOS Safari has limited notification support
- Notification persistence varies by browser
- FCM has quota limits (no cost but rate-limited)

### Best Practices
- Always check `Notification.permission` before requesting
- Handle all three states: default, granted, denied
- Provide clear value proposition before asking permission
- Test on multiple browsers and devices
- Monitor Firebase Console for errors

### Resources
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

## Project Health & Maintenance

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Consistent code formatting
- Component-based architecture
- Proper error handling

### Performance
- Vite for fast builds
- React Query for data caching
- Lazy loading for routes
- Image optimization
- Code splitting

### Accessibility
- Radix UI for accessible primitives
- Keyboard navigation support
- ARIA labels
- Semantic HTML
- Screen reader compatible

### Scalability
- Monorepo structure for easy scaling
- Modular component design
- Database indexing
- RLS for multi-tenancy
- Stateless backend for horizontal scaling

---

## Contact & Support

For questions or issues related to this project:
- **Repository**: github.com/vizal-s-l/med-track
- **Branch**: main
- **Last Updated**: October 16, 2025

---

**Document Version**: 1.0  
**Last Updated**: October 16, 2025  
**Maintained By**: Project Team
