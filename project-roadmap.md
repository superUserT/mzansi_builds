# Mzansi Builds: Feature Roadmap & Step-by-Step Execution Plan

This document outlines the remaining features required to complete the Mzansi Builds platform, structured in a sequential, step-by-step execution order. 

---

## Phase 1: Backend Core Domain (REST APIs)
*Status: Authentication Complete. Moving to core entities.*

### 1. Users & Profiles Module
- [ ] **DTOs:** Create `UpdateProfileDto` (bio, portfolio links, GitHub links).
- [ ] **Controllers/Services:** Implement `GET /api/users/profile` and `PATCH /api/users/profile`.
- [ ] **Integration:** Map the User entity to handle optional profile fields.

### 2. Projects & Milestones Module
- [ ] **Entities:** Create `Project` and `Milestone` entities with a One-to-Many relationship.
- [ ] **DTOs:** Create `CreateProjectDto` and `AddMilestoneDto`.
- [ ] **Controllers/Services:** - `POST /api/projects` (Create a new project entry).
  - `GET /api/projects` (Fetch all projects, support pagination/filtering).
  - `GET /api/projects/:id` (Fetch single project with its milestones).
  - `POST /api/projects/:id/milestones` (Add a milestone to a project).
  - `PATCH /api/projects/:id/complete` (Mark project complete, adding it to the Celebration Wall).

---

## Phase 2: Backend High-Level Infrastructure
*Status: Database & Docker configured. Moving to external services.*

### 3. File Storage Service (Adapter Pattern)
- [ ] **MinIO Implementation:** Complete the `MinioStorageService` logic using the `minio` npm package.
- [ ] **Profile Picture Upload:** - Implement a File Interceptor (Multer) on a new `POST /api/users/profile/image` route.
  - Upload the buffer to MinIO and save the generated URL to the User entity.

### 4. Background Queues & Email (Observer Pattern)
- [ ] **Direct Message Entity:** Create the `DirectMessage` entity mapping sender to receiver.
- [ ] **Message Route:** Create `POST /api/messages` to save a message to the database.
- [ ] **BullMQ Setup:** Configure a Redis-backed queue in NestJS.
- [ ] **Event Emission:** Emit a `MessageReceived` event when a message is saved.
- [ ] **Worker Logic:** Implement a queue processor that uses Nodemailer to send a notification to the receiver's email (using a test SMTP service).

### 5. Real-Time Community Feed (WebSockets)
- [ ] **WebSocket Gateway:** Create `FeedGateway` using Socket.io.
- [ ] **Event Listeners:** Subscribe to project creations, milestone updates, and project completions.
- [ ] **Broadcasting:** When a user updates a project, broadcast a `feed_update` event to all connected clients.

---

## Phase 3: Frontend Foundation
*Status: Pending Initialization.*

### 6. Scaffolding & State Management
- [ ] **Initialize Vite/React:** Clean up the boilerplate and install dependencies (MUI, Redux Toolkit, Axios, Socket.io-client, React Router).
- [ ] **Theme Configuration:** Implement the global Green, White, and Black theme using Material UI's `createTheme`.
- [ ] **Redux Store:** Set up the global store with an `authSlice` to manage JWT tokens and user session state.
- [ ] **Axios Interceptors:** Configure an API client that automatically attaches the JWT Bearer token to outgoing requests.

### 7. Routing & Layouts
- [ ] **Router Setup:** Configure `react-router-dom` with public and protected routes.
- [ ] **App Shell:** Build the persistent navigation bar/sidebar (Home, Community Feed, My Profile).

---

## Phase 4: Frontend Feature Implementation
*Status: Pending Foundation.*

### 8. Authentication UI
- [ ] **Pages:** Build `/login` and `/register` views.
- [ ] **Integration:** Connect forms to the backend Auth module and update Redux state on success.

### 9. Profile & Project Management UI
- [ ] **Profile Page:** Build the `/profile` view allowing users to upload a profile picture (hitting the MinIO endpoint) and update their links.
- [ ] **Project Creation:** Build a multi-step form or modal to create a new project.
- [ ] **Project Dashboard:** Build a view for the user to see their own active projects and add milestones.

### 10. The Community Feed & Celebration Wall
- [ ] **WebSocket Client:** Connect the React app to the NestJS WebSocket Gateway.
- [ ] **Live Feed View:** Build the `/community` page that renders incoming WebSocket events as feed cards (similar to a Twitter/LinkedIn feed).
- [ ] **Celebration Wall:** Build a dedicated view or filtered feed that only shows projects marked as `isCompleted`.

---

## Phase 5: Testing & Polish (The "Test Later" Phase)
*Status: Deferred to the end.*

### 11. Testing Implementations
- [ ] **Unit Tests:** Write Jest tests for the core business logic (e.g., ensuring a milestone cannot be added to a completed project).
- [ ] **E2E Tests:** Use Supertest to verify the Auth flow and Project CRUD endpoints.

### 12. Final Review
- [ ] **Linting:** Run ESLint and Prettier across the entire mono-repo.
- [ ] **Documentation:** Update the `README.md` with exact screenshots of the final UI.
- [ ] **Docker Verification:** Run `docker-compose up --build` from a fresh state to ensure the entire system spins up flawlessly for the reviewer.