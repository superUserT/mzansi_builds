# Mzansi Builds - Frontend Documentation

The Mzansi Builds frontend is a Single Page Application (SPA) built with **React**, **TypeScript**, and **Vite**. It utilizes **Material UI (MUI)** for the component system and **Redux Toolkit** for global state management.

## 🏗 Architecture & Folder Structure

- `/src/api`: Contains the API adapter layer (`fetchClient.ts`). All external HTTP requests pass through this client, which automatically attaches the JWT `Bearer` token to headers and parses JSON.
- `/src/components`: Reusable UI elements (e.g., `Navbar`, `ProtectedRoute`).
- `/src/pages`: Route-level views (e.g., `Profile`, `Feed`, `People`, `Messages`).
- `/src/store`: Redux Toolkit configuration and state slices.
- `/src/hooks`: Custom React hooks (e.g., `useFeedSocket.ts`).

---

## 🚀 Core Features & Implementation

### 1. Authentication & Protected Routing

State is managed globally in Redux (`authSlice.ts`).

- Upon successful login, the `accessToken` is saved to `localStorage` and Redux.
- The `<ProtectedRoute />` wrapper checks `state.auth.isAuthenticated`. If false, it forcefully redirects users to `/login`.

### 2. The Live Feed (`Feed.tsx` & `useFeedSocket.ts`)

The Feed acts as the heartbeat of the platform, updating instantly without page reloads.

- **Hook Setup**: `useFeedSocket` initializes a `socket.io-client` connection on mount, passing the Redux auth token.
- **Event Handling**: It listens for the `feed:update` event from the backend, pushing new updates to the top of the local React state array.
- **UI**: Uses MUI's `<Fade>` component to smoothly animate new project/milestone cards into view.

### 3. Developer Directory & Social Graph (`People.tsx`)

A grid displaying all registered developers.

- Users can view skills, bios, and external links.
- Features a **Follow** button that toggles the social connection via `/api/users/profile/:id/follow`.
- Features a **Message** button that opens an MUI `<Dialog>` modal to quickly dispatch a Direct Message to that developer.

### 4. Inbox / Direct Messaging (`Messages.tsx`)

Implemented as a Master-Detail split-screen interface.

- **Data Processing**: Fetches a flat array of messages and uses a standard `Array.reduce` algorithm to group them into unique `Conversations` based on the `sender` and `receiver` IDs.
- **Auto-Scroll**: Utilizes a `useRef` attached to an empty `<div>` at the bottom of the chat container. A `useEffect` automatically triggers `.scrollIntoView()` whenever a new message is sent or the active contact changes.

### 5. Project Management (`Profile.tsx`)

The user's personal dashboard.

- **Profile Picture Upload**: Uses a hidden `<input type="file">` triggered by an MUI `<Badge>` button. Uploads directly to MinIO and immediately updates the Redux `user` state to reflect the new image globally (like in the Navbar).
- **Milestones & Completion**: Project cards feature actions to log milestones or "Complete" a project. Completing a project removes it from the active list and sends it to the `CelebrationWall.tsx` component.

---

## 🎨 Theming & Styling

The app relies heavily on **Material UI's `sx` prop** for rapid styling, maintaining a clean Dark Mode aesthetic.

- Primary Brand Color: Mzansi Green (`#00A344`).
- Cards and Modals are stripped of default shadows (`elevation={0}`) and given modern, subtle borders (`1px solid #27272A`) to mimic high-end developer tools.
- Form inputs are managed via native React state (controlled components) integrated closely with MUI's `<TextField>`.
