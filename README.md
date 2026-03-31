# Career Pilot

Career Pilot is a modern job tracking application built with React and TypeScript.
It helps candidates manage opportunities from discovery to final outcome using a clean kanban-style dashboard.

## Live Demo

**[View the live app on Vercel](https://career-pilot-sand.vercel.app/)**

### Demo Credentials (Auto-filled for Easy Testing)
- **Email:** johndoe@gmail.com
- **Password:** 123456

Or create a new account directly from the login page.

## What The App Does

Career Pilot gives users a focused workspace to:

- track opportunities by status lane
- capture job-specific notes and links
- update stage/verdict quickly through modal interactions
- add, edit, and delete jobs with instant UI feedback
- filter and search jobs to stay organized

## Key Features

- Dashboard with four status lanes: Potential, Applied, Interview, Verdict
- Search and composable filters:
  - search by company and role (case-insensitive)
  - filter by status
  - optional interview stage filter
  - optional verdict filter
- Add Job page with validation and conditional form fields
- Edit Job flow using a reusable form component
- Job details modal:
  - update status/stage/verdict
  - navigate to full edit page
  - delete with confirmation
- Inline notes editing on job cards
- Toast notifications for:
  - job added
  - job updated
  - job deleted

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Firebase Authentication
- Cloud Firestore

## Architecture Overview

The app is organized by feature and responsibilities following clean architecture principles.

- **UI Layer:** Components focus on rendering and user interactions
- **Service Layer:** All operations routed through Firebase services (authentication and Firestore)
- **Data Layer:** Cloud Firestore for persistent storage
- **Type Safety:** Strong TypeScript contracts for all data models

### Backend Features

- **Firebase Authentication:** Email/password signup and login with secure session management
- **Cloud Firestore:** Real-time database for jobs and user data
- **Security Rules:** Row-level security ensuring users can only access their own data

### Service Layer

Job operations are abstracted in `firebaseJobService`:

- list jobs by user
- filter jobs by status
- lookup by id
- create/update/delete jobs
- update notes and status in real-time

Authentication is handled by `firebaseAuthService`:

- signup with email and password
- login/logout
- session management
- auth state listeners

## Folder Structure

```text
src/
  components/
    Modal.tsx
    toast/
      ToastContext.ts
      ToastProvider.tsx
      useToast.ts
  features/
    job-tracker/
      components/
        JobCard.tsx
        JobDetailsModal.tsx
        JobForm.tsx
        StatusColumn.tsx
      constants/
        job.constants.ts
      data/
        mockJobs.ts
      services/
        jobService.ts
      types/
        job.types.ts
  layouts/
    AppShell.tsx
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    AddJobPage.tsx
    EditJobPage.tsx
  router/
    index.tsx
  services/
    authService.ts
```

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Demo Instructions

1. Start the app with `npm run dev`
2. Open the login page
3. Use Demo Login flow:
   - email can be any valid format
   - password can be any non-empty value
4. After login, use the dashboard to:
   - open job details
   - edit status/stage/verdict
   - add new jobs
   - edit existing jobs
   - delete jobs with confirmation
   - filter/search jobs

## Screenshots

Add screenshots here:

- Login page
- Dashboard with filters
- Add Job page
- Edit Job page
- Job details modal

## Future Improvements

- Firebase Auth integration
- Firestore persistence and real-time syncing
- Protected routes and auth guards
- Drag-and-drop lane movement
- Advanced filtering and sorting (date range, location, tags)
- Pagination/virtualization for large datasets

## Engineering Notes

- Type-safe domain models and service contracts
- Reusable `JobForm` used in create and edit flows
- Derived filtering state (source list remains immutable in UI logic)
- Non-intrusive custom toast system for action feedback
