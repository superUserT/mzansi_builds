# Mzansi Builds - Backend Documentation

The Mzansi Builds backend is a robust, modular REST API and real-time WebSocket server built with **NestJS**, **TypeScript**, and **PostgreSQL**.

## 🏗 System Architecture

The backend strictly follows NestJS's modular architecture, utilizing Dependency Injection and Object-Oriented principles.

- **Controllers (`*.controller.ts`)**: Handle incoming HTTP requests, route parameters, and return responses.
- **Services (`*.service.ts`)**: Contain the core business logic. They interact with the database via TypeORM repositories.
- **Modules (`*.module.ts`)**: Encapsulate related components (e.g., `UsersModule`, `ProjectsModule`). Dependencies between modules are resolved using Nest's IoC container (handling circular dependencies via `forwardRef`).
- **Entities (`*.entity.ts`)**: TypeORM classes that map directly to PostgreSQL database tables.

### Design Patterns Used

1. **Adapter Pattern (Storage)**: File uploads are handled by the `IStorageProvider` interface. Currently implemented by `MinioStorageService`, making it easy to swap MinIO for AWS S3 without changing business logic.
2. **Observer Pattern (Events)**: Decoupled actions are handled via `@nestjs/event-emitter`. For example, completing a project emits a `project.completed` event, which the `FeedGateway` catches to broadcast via WebSockets.
3. **Queue Worker (Background Jobs)**: Heavy tasks, like sending direct message email notifications via Brevo, are offloaded to a Redis-backed **BullMQ** queue to prevent blocking the main HTTP thread.

---

## 🔐 Authentication Flow

We use stateless **JSON Web Tokens (JWT)**.

1. User logs in -> `AuthService` verifies against the DB using `bcrypt.compare`.
2. Backend signs a JWT containing the `sub` (userId) and `username`.
3. Protected routes use the `@UseGuards(JwtAuthGuard)` decorator. This guard invokes the `JwtStrategy`, which automatically extracts and verifies the `Bearer` token from the request headers.

---

## 🔌 API Routes Reference

### Authentication (`/api/auth`)

- `POST /register`: Creates a new user. Hashes password using bcrypt.
- `POST /login`: Authenticates user and returns `{ user, accessToken }`.

### Users & Profiles (`/api/users/profile`)

_(All routes below require `Bearer Token`)_

- `GET /`: Returns the current user's profile.
- `PATCH /`: Updates bio, skills, GitHub, and LinkedIn URLs.
- `POST /image`: Expects `multipart/form-data`. Uploads avatar to MinIO and saves the generated public URL.
- `GET /directory`: Returns a list of all developers (omitting sensitive data) for the networking page.
- `POST /:id/follow`: Toggles following/unfollowing a specific user.

### Direct Messaging (`/api/users/profile/messages`)

_(All routes below require `Bearer Token`)_

- `GET /`: Fetches all messages where the user is either the sender or receiver.
- `POST /`: Sends a message to `receiverId`. Triggers a background email notification to the receiver.

### Projects & Milestones (`/api/projects`)

- `GET /`: Fetches all active projects (Public).
- `GET /celebration-wall`: Fetches all completed projects (Public). Note: Must be routed _before_ `/:id`.
- `GET /:id`: Fetches a specific project and its milestones (Public).
- `POST /`: Creates a new project (Protected).
- `DELETE /:id`: Deletes a project (Protected).
- `POST /:id/milestones`: Adds a milestone to a project and emits a feed event (Protected).
- `PATCH /:id/complete`: Marks a project as completed, setting `completedAt` and moving it to the Celebration Wall (Protected).

---

## 📡 Real-time Feed (WebSockets)

Handled by the `FeedGateway` (`@WebSocketGateway`).

- **Connection**: Clients connect to `http://localhost:3000` passing the JWT in the connection `auth` object.
- **Broadcasting**: The gateway listens to internal Node.js events (e.g., `project.created`, `project.milestone.added`). When fired, the gateway structures a `FeedEvent` payload and emits it to all connected sockets via `server.emit('feed:update', payload)`.
