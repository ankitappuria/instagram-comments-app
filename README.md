# 💬 Instagram-style Comments System

A full-stack nested comments system built with **React**, **Node.js**, **Express**, and **MongoDB** — replicating Instagram's 2-level flat comment threading model with pagination, @mention support, and optimized performance.

---

## ✨ Features

### Frontend
- 🎨 **React UI** with real-time comment display
- 📝 Create top-level comments and replies
- 💬 Interactive comment and reply interface
- ⚡ Paginated comment loading with "Load more" button
- 📱 Responsive design with custom CSS styling
- 🔄 Real-time state management with custom hooks

### Backend
- 📝 Create top-level comments and replies via **single unified endpoint**
- 🧵 **2-level flat threading** — Instagram, YouTube, and Threads pattern
- @ **@mention support** via `replyTo` and `replyToUserName` fields
- 📄 **Paginated comments** with preview of first 2 replies
- 🔁 **Load more replies** with cursor-based pagination
- ⚡ **Denormalized `replyCount`** — optimized queries at scale
- 🗑️ **Soft delete** support via `isDeleted` flag
- 🔍 **Optimized indexes** for fast queries

---

## 🧠 Design Philosophy

### Flat Threading Pattern

Instead of true recursive nesting (performance nightmare at scale), this system uses the **flat threading pattern** used by Instagram, YouTube, and Threads:

```
DB stores everything flat:

Ankita  → parentId: null            ← top-level comment
John    → parentId: Ankita._id      ← reply
Jane    → parentId: Ankita._id      ← reply
Raj     → parentId: Ankita._id      ← reply
```

```
UI renders as nested:

Ankita: "Beautiful!"
  └── John:  "@Ankita totally agree!"
  └── Jane:  "@John me too!"         ← @mention creates threading illusion
  └── Raj:   "@Jane exactly!"
```

| Aspect | True Nesting | Flat + @mention |
|--------|-------------|-----------------|
| DB query | Recursive/complex | Simple `find({ parentId })` |
| Pagination | Very hard | Trivial |
| UI feel | Same | Same |
| Performance at scale | Poor | Excellent |

---

## 🏗️ Architecture

```
InstagrampostComments/
├── Backend/                 (Node.js + Express API)
│   ├── config.js
│   ├── server.js
│   ├── package.json
│   ├── controllers/
│   │   └── commentController.js
│   ├── services/
│   │   └── commentServices.js
│   ├── models/
│   │   └── Comment.js
│   ├── routes/
│   │   └── commentRoutes.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   └── utils/
│       ├── apiError.js
│       └── apiResponse.js
│
└── Frontend/                (React SPA)
    ├── package.json
    ├── public/
    ├── src/
    │   ├── index.js
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── CommentList.jsx
    │   │   ├── CommentItem.jsx
    │   │   ├── CommentInput.jsx
    │   │   ├── ReplyList.jsx
    │   │   ├── ReplyItem.jsx
    │   │   ├── Avatar.jsx
    │   │   ├── UserModal.jsx
    │   │   └── PostCard.js
    │   ├── hooks/
    │   │   ├── useComments.js      (Manages comment state & pagination)
    │   │   ├── useReplies.js       (Manages reply state)
    │   │   └── useUser.jsx         (User context)
    │   ├── services/
    │   │   └── commentService.js   (API calls)
    │   ├── styles/
    │   │   ├── components.css
    │   │   └── App.css
    │   └── utils/
    │       └── helper.js
    └── build/               (Production build)
```

---

## 🗂️ Schema Design

```javascript
{
  postId,           // String — external post reference
  parentId,         // ObjectId — points to top-level comment (null if top-level)
  replyTo,          // ObjectId — the specific reply being responded to
  replyToUserName,  // String — denormalized for @mention rendering
  userName,         // String — unique user identifier
  content,          // String — max 2200 chars
  likeCount,        // Number — denormalized counter
  replyCount,       // Number — denormalized counter (top-level only)
  isDeleted,        // Boolean — soft delete
  createdAt,
  updatedAt
}
```

**Key Indexes:**
```javascript
{ postId: 1, parentId: 1, createdAt: -1 }   // fetch top-level comments
{ parentId: 1, createdAt: 1 }                // fetch replies
```

---

## 🔌 API Endpoints

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments/:postId` | Get all comments (non-paginated) |
| `GET` | `/comments/paginated/:postId?page=1&limit=2` | Get paginated comments with reply preview |
| `POST` | `/comments` | Create top-level comment or reply |

### Replies

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments/replies/:parentId?page=1&limit=10` | Get paginated replies for a comment |

### Request/Response Examples

**POST /comments** (Create Comment)
```json
{
  "postId": "post123",
  "userName": "ankita",
  "content": "Amazing post!"
}
```

**POST /comments** (Create Reply)
```json
{
  "parentId": "comment_id",
  "replyTo": "john_comment_id",
  "replyToUserName": "john",
  "userName": "ankita",
  "content": "@john I totally agree!"
}
```

**GET /comments/paginated/:postId**
```json
{
  "success": true,
  "data": {
    "data": [...comments],
    "page": 1,
    "limit": 2,
    "totalCount": 10,
    "hasMore": true
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### 1️⃣ Clone & Install

```bash
git clone <repository-url>
cd InstagrampostComments
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

**Create `.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/comments-db
PORT=5000
NODE_ENV=development
```

**Start the server:**
```bash
npm start
```

Backend runs on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
```

**Start development server:**
```bash
npm start
```

Frontend runs on `http://localhost:3000`

---

## 📁 Project Structure

### Backend (`/Backend`)

- **`server.js`** — Express app initialization and server setup
- **`config.js`** — Database and environment configuration
- **`controllers/commentController.js`** — Route handlers for comments
- **`services/commentServices.js`** — Business logic and MongoDB queries
- **`models/Comment.js`** — MongoDB schema definition
- **`routes/commentRoutes.js`** — API route definitions
- **`middlewares/error.middleware.js`** — Error handling middleware
- **`utils/apiError.js`** — Custom error class
- **`utils/apiResponse.js`** — API response wrapper

### Frontend (`/Frontend`)

- **`src/App.jsx`** — Main application component
- **`components/CommentList.jsx`** — Renders list of comments
- **`components/CommentItem.jsx`** — Individual comment component
- **`components/CommentInput.jsx`** — Input for new comments
- **`components/ReplyList.jsx`** — Renders list of replies
- **`components/ReplyItem.jsx`** — Individual reply component
- **`hooks/useComments.js`** — Custom hook for comment state management
- **`hooks/useReplies.js`** — Custom hook for reply state management
- **`services/commentService.js`** — API client functions
- **`styles/components.css`** — Reusable component styles

---

## 🧪 Available Scripts

### Backend

```bash
cd Backend
npm start      # Start development server
npm run dev    # Start with nodemon (if configured)
```

### Frontend

```bash
cd Frontend
npm start      # Start development server (port 3000)
npm run build  # Create production build
npm test       # Run tests
```

---

## 🔑 Key Features Explained

### Pagination with hasMore

The frontend uses the backend's pagination metadata to determine whether to show a "Load more" button:

```javascript
// Frontend hook
const { comments, hasMore, loadMore } = useComments(postId);

// Backend returns
{
  data: [...comments],
  hasMore: true,
  totalCount: 100,
  page: 1
}
```

### Denormalized Counters

Instead of expensive `countDocuments()` on every request:
- `replyCount` is stored on the top-level comment document
- Atomically incremented when a new reply is created
- Prevents N+1 queries at scale

### @mention System

Replies store `replyTo` and `replyToUserName` to create mention links:
```javascript
{
  parentId: "top_level_id",
  replyTo: "john_comment_id",     // Links to specific reply
  replyToUserName: "john",         // For @mention display
  content: "@john I agree!"
}
```

---

## 🛠️ Development Workflow

1. **Make changes** in Backend or Frontend folders
2. **Backend changes** automatically reload (if nodemon is set up)
3. **Frontend changes** trigger hot-reload in browser
4. **MongoDB** should be running locally or accessible via connection string
5. **Test endpoints** with Postman, cURL, or the React UI

---

## 📊 Performance Considerations

✅ **Optimized for:**
- Large-scale comment systems
- Pagination without recursive queries
- Fast @mention resolution
- Minimal database round-trips

📈 **Design patterns used:**
- Denormalized counters (vs. costly aggregations)
- Flat threading (vs. true recursion)
- Aggregation pipeline with `$lookup` for efficient joins
- Soft deletes (vs. hard deletes)

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection: `MONGO_URI` in `.env`
- Ensure MongoDB is running: `mongosh` or check Atlas cluster
- Check port 5000 is available

### Frontend can't connect to Backend
- Backend must be running on `http://localhost:5000`
- Check CORS settings if deploying
- Verify `API_BASE` in `services/commentService.js`

### Comments not loading
- Check Network tab in browser DevTools
- Verify `postId` is being passed correctly
- Check MongoDB has data and correct indexes

---

## 📝 License

This project is part of interview preparation. Feel free to use and modify as needed.

---

## 👥 Contributing

For bug fixes or improvements:
1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

---

**Built with ❤️ for modern comment systems**
