# 💬 Instagram-style Comments API

A production-ready nested comments API built with **Node.js**, **Express**, and **MongoDB** — replicating Instagram's 2-level flat comment threading model with `@mention` support, paginated replies, and denormalized counters for performance.

---

## ✨ Features

- 📝 Create top-level comments and replies via a **single unified endpoint**
- 🧵 **2-level flat threading** — same pattern used by Instagram, YouTube, and Threads
- @ **@mention support** via `replyTo` and `replyToUserName` fields
- 📄 **Paginated comments** with a preview of the first 2 replies
- 🔁 **Load more replies** with cursor-based pagination
- ⚡ **Denormalized `replyCount`** — no expensive `countDocuments` on every request
- 🗑️ **Soft delete** support via `isDeleted` flag
- 🔍 **Optimized indexes** for fast queries at scale

---

## 🧠 Design Philosophy

Most comment systems use **true recursive nesting** — this becomes a performance and pagination nightmare at scale.

This API uses the **flat threading pattern** — the same approach used by Instagram, YouTube, and Threads (Meta):

```
DB stores everything flat:

Ankita  → parentId: null            ← top-level comment
John    → parentId: Ankita._id      ← reply
Jane    → parentId: Ankita._id      ← reply to John's reply (still flat in DB)
Raj     → parentId: Ankita._id      ← reply
```

```
UI renders it as nested:

Ankita: "Beautiful!"
  └── John:  "@Ankita totally agree!"
  └── Jane:  "@John me too!"         ← @mention fakes the threading
  └── Raj:   "@Jane exactly!"
```

The `@mention` via `replyToUserName` creates the illusion of deep nesting — without the DB complexity.

| | True Nesting | Flat + @mention |
|---|---|---|
| DB query | Recursive / complex | Simple `find({ parentId })` |
| Pagination | Very hard | Trivial |
| UI feel | Same | Same |
| Performance at scale | Poor | Excellent |

---

## 🗂️ Schema Design

```js
{
  postId,           // String — external post reference
  parentId,         // ObjectId — always points to top-level comment (null if top-level)
  replyTo,          // ObjectId — the specific reply being responded to
  replyToUserName,  // String — denormalized for @mention rendering
  userName,         // String — unique user identifier (no User table needed)
  content,          // String — max 2200 chars
  likeCount,        // Number — denormalized counter
  replyCount,       // Number — denormalized counter (only meaningful on top-level)
  isDeleted,        // Boolean — soft delete
  createdAt,
  updatedAt
}
```

**Key indexes:**
```js
{ postId: 1, parentId: 1, createdAt: -1 }   // fetch top-level comments for a post
{ parentId: 1, createdAt: 1 }                // fetch replies for a comment
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/instagram-comments-api.git
cd instagram-comments-api
npm install
```

### Environment Variables

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/comments-db
PORT=3000
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📡 API Reference

### Base URL
```
/api/comments
```

---

### 1. Create Comment or Reply
```
POST /api/comments
```

**Top-level comment** — send `postId`, no `parentId`:
```json
{
  "postId": "post_123",
  "userName": "Ankita",
  "content": "Beautiful!"
}
```

**Direct reply to a comment** — send `parentId`:
```json
{
  "parentId": "664abc123...",
  "userName": "John",
  "content": "Totally agree!"
}
```

**Reply tagging someone inside a thread** — send `parentId` + `replyTo`:
```json
{
  "parentId": "664abc123...",
  "replyTo": "664def456...",
  "replyToUserName": "Ankita",
  "userName": "John",
  "content": "@Ankita totally agree!"
}
```

> `parentId` is **always** the top-level comment `_id` — never a nested reply's `_id`. This enforces the 2-level flat structure.

---

### 2. Get Paginated Comments with Reply Preview
```
GET /api/comments/paginated/:postId?page=1&limit=10
```

Returns top-level comments with first 2 replies previewed and a `hasMoreReplies` flag.

**Response:**
```json
[
  {
    "_id": "664abc...",
    "userName": "Ankita",
    "content": "Beautiful!",
    "likeCount": 0,
    "replyCount": 5,
    "hasMoreReplies": true,
    "repliesPreview": [
      {
        "_id": "664def...",
        "userName": "John",
        "replyToUserName": "Ankita",
        "content": "@Ankita totally agree!",
        "createdAt": "..."
      },
      {
        "_id": "664ghi...",
        "userName": "Jane",
        "replyToUserName": "John",
        "content": "@John me too!",
        "createdAt": "..."
      }
    ],
    "createdAt": "..."
  }
]
```

---

### 3. Load More Replies
```
GET /api/comments/replies/:parentId?page=1&limit=10
```

Use when the user taps **"View more replies"**. `parentId` is the top-level comment `_id`.

---

### 4. Get All Comments — Tree (small datasets only)
```
GET /api/comments/:postId
```

Returns full nested tree structure. Not recommended for large datasets.

---

## 🔄 Full Usage Flow

```
User opens a post
  → GET /api/comments/paginated/post_123

User taps "View X more replies"
  → GET /api/comments/replies/664abc123?page=2

User posts a comment
  → POST /api/comments  { postId, userName, content }

User replies to a comment
  → POST /api/comments  { parentId, userName, content }

User replies to a reply (tagging someone)
  → POST /api/comments  { parentId, replyTo, replyToUserName, userName, content }
```

---

## 📁 Project Structure

```
instagram-comments-api/
├── models/
│   └── Comment.js
├── services/
│   └── commentService.js
├── controllers/
│   └── commentController.js
├── routes/
│   └── commentRoutes.js
├── utils/
│   ├── ApiResponse.js
│   └── ApiError.js
├── .env.example
├── .gitignore
├── app.js
└── README.md
```

---

## 🔮 Roadmap

- [ ] Like a comment
- [ ] Edit a comment
- [ ] Delete a comment (soft)
- [ ] Pin a comment
- [ ] Notification hooks via `replyToUserName`
- [ ] Frontend demo (React + Tailwind)

---

## 🤝 What Makes This Different

This isn't a tutorial CRUD API. The schema and service layer make deliberate design decisions:

- **Why `replyCount` is denormalized** — avoids `countDocuments` on every paginated request
- **Why `parentId` always points to top-level** — enforces flat structure, makes pagination trivial
- **Why `replyTo` and `parentId` are separate fields** — `parentId` groups replies, `replyTo` handles @mention threading
- **Why `userName` is snapshotted** — no User table join needed at read time

These are the same tradeoffs Instagram, YouTube, and Threads make in production.

---

## 📄 License

MIT