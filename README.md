# Collab

## Project Description
Collab is a full stack, Trello/Notion-style real-time task collaboration platform built for a Full Stack Engineer interview assignment. The application enables teams to create boards, manage lists and tasks, assign ownership, and observe updates instantly through WebSockets.

It is designed with a modular backend and a component-driven frontend to support maintainability, clear API boundaries, and real-time collaboration workflows.

## Features
- User authentication with JWT (`signup`, `login`, protected routes)
- Board creation and board-level workspace organization
- List creation and retrieval within boards
- Task CRUD (create, update, delete)
- Drag-and-drop task movement across lists
- Task assignment/unassignment to users
- Real-time board updates with Socket.io events
- Real-time personal task refresh for assignees (`My Tasks` view)
- Real-time activity stream updates on board actions
- Professional SaaS-style UI with scalable component structure

## Tech Stack
### Frontend
- React (Vite)
- TailwindCSS v4
- shadcn/ui-inspired component system
- Socket.io Client
- dnd-kit
- Axios
- Zustand

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- bcrypt password hashing

## Architecture Overview
### Frontend
- Single-page React application (`client/`) with route-based pages and reusable UI components.
- API abstraction through Axios (`client/src/api/axios.js`) with JWT interceptor.
- Socket client (`client/src/socket/socket.js`) for board room subscriptions and real-time updates.

### Backend
- Express API (`server/src/index.js`) with modular route/controller separation:
  - `routes/` define HTTP contracts
  - `controllers/` implement business logic
  - `middleware/` handles auth
  - `models/` define MongoDB schemas
- Socket.io is attached to the same HTTP server as Express for low-latency event propagation.

### Database
- MongoDB stores users, boards, lists, tasks, and activity events.
- Mongoose models and references establish relationships across entities.

### Realtime
- Clients join board-specific Socket.io rooms via `joinBoard`.
- Server emits domain events (`taskCreated`, `taskUpdated`, `taskMoved`, `taskDeleted`, `taskAssigned`, `activityCreated`).
- User-scoped room events (`user:<id>`) trigger personal task refresh in real time.

## Database Schema Overview
### User
- `name: String` (required)
- `email: String` (required, unique, indexed)
- `password: String` (required, hashed)
- `timestamps`

### Board
- `title: String` (required, indexed)
- `createdBy: ObjectId -> User` (required)
- `members: ObjectId[] -> User`
- `timestamps`

### List
- `title: String` (required)
- `boardId: ObjectId -> Board` (required, indexed)
- `position: Number` (required)
- `timestamps`

### Task
- `title: String` (required, indexed)
- `description: String`
- `boardId: ObjectId -> Board` (required, indexed)
- `listId: ObjectId -> List` (required, indexed)
- `position: Number` (required)
- `assignedTo: ObjectId -> User`
- `createdBy: ObjectId -> User` (required)
- `timestamps`

## API Contract Design
Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/signup` - Register user
- `POST /auth/login` - Authenticate user
- `GET /auth/me` - Get current authenticated user
- `GET /auth/users` - Get assignable users

### Boards
- `POST /boards` - Create board
- `GET /boards` - Get boards for authenticated member
- `GET /boards/:id` - Get board details with members

### Lists
- `POST /lists` - Create list
- `GET /lists/:boardId` - Get board lists
- `DELETE /lists/:id` - Delete list

### Tasks
- `POST /tasks` - Create task
- `GET /tasks/:listId` - Get tasks in a list (paginated)
- `PUT /tasks/:id` - Update task content
- `DELETE /tasks/:id` - Delete task
- `PUT /tasks/move` - Move task across list/position
- `PUT /tasks/assign` - Assign or unassign task
- `GET /tasks/my-tasks` - Get tasks assigned to current user
- `GET /tasks/search?q=<query>&boardId=<id>` - Search tasks by title

### Activity
- `GET /activities/:boardId?page=1&limit=20` - Get board activity feed

Note: All non-auth endpoints require `Authorization: Bearer <JWT>`.

## Real-time Sync Strategy
- Socket authentication reads JWT from `socket.handshake.auth.token`.
- Each user joins a private room `user:<userId>` on connect for personalized updates.
- Board viewers call `joinBoard(boardId)` to subscribe to board-level events.
- On task mutations, backend persists data first, then emits relevant events:
  - `taskCreated`, `taskUpdated`, `taskMoved`, `taskDeleted`, `taskAssigned`
  - `activityCreated` for audit-style feed updates
- For assignment-sensitive updates, backend emits `myTasksRefresh` to impacted users, keeping `My Tasks` consistent without full board reload.

## Scalability Considerations
- Layered backend structure (`routes -> controllers -> models`) improves maintainability and team scaling.
- Indexed fields on high-frequency query paths (`email`, `boardId`, `listId`, `title`) reduce query latency.
- Socket rooms (`boardId`, `user:<id>`) limit event fan-out to relevant clients only.
- Stateless JWT auth supports horizontal API scaling behind a load balancer.
- Task retrieval uses pagination patterns to prevent unbounded payload growth.
- Architecture is ready for next-step optimizations such as Redis pub/sub for multi-instance Socket.io and background jobs for analytics/notifications.

## Local Setup Instructions
### 1. Clone and enter project
```bash
git clone <your-repo-url>
cd collab
```

### 2. Install dependencies
```bash
cd server
npm install
cd ../client
npm install
```

### 3. Configure environment variables
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=replace_with_secure_secret
```

### 4. Start backend
```bash
cd server
npm run dev
```

### 5. Start frontend
```bash
cd client
npm run dev
```

### 6. Open app
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Variables Required
### Server (`server/.env`)
- `PORT` - Express/Socket server port (default `5000`)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used to sign and verify JWTs

### Client
- Currently configured with static local URLs in source:
  - API base URL: `http://localhost:5000/api`
  - Socket URL: `http://localhost:5000`
- Optional improvement: move both to Vite env variables (`VITE_API_URL`, `VITE_SOCKET_URL`).

## Assumptions and Trade-offs
- MVP scope prioritizes core collaboration flows over enterprise controls.
- Board membership management is minimal (board creator added as first member; no advanced invite/role matrix yet).
- Real-time consistency relies on event-driven refresh for selected views instead of full CRDT/OT conflict resolution.
- Pagination is applied to task/list activity reads, but further query hardening and caching can be added for larger datasets.
- CORS is open in development (`origin: "*"`) and should be restricted in production.

## Demo Credentials
Use placeholder credentials below (replace before submission/demo):

- Email: `test2@gmail.com`
- Password: `123456`

## Screenshots
<!-- Add screenshots in this section before final submission.

Suggested captures:
- Login/Signup
- Boards dashboard
- Board detail with lists + drag-and-drop tasks
- Task assignment modal/dropdown
- My Tasks page
- Real-time activity panel -->

## Future Improvements
- Role-based access control (Admin/Member/Viewer) per board
- Board invites and email-based onboarding
- Due dates, priorities, labels, and checklists
- File attachments and comments on tasks
- Audit logs with richer filtering and export
- Redis adapter for Socket.io horizontal scaling
- Optimistic updates with rollback strategy on failed mutations
- Automated test coverage (unit, integration, e2e)
- CI/CD pipeline, containerization, and production observability
- Production-grade security hardening (rate limiting, helmet, stricter CORS, input validation)
