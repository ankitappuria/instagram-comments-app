# 📱 Instagram Comments - Frontend

React-based frontend for the Instagram-style nested comments system. Provides an interactive UI for creating, viewing, and replying to comments with pagination support.

---

## ✨ Features

- 🎨 Modern React UI with responsive design
- 📝 Create top-level comments and replies
- 💬 Interactive comment threads with @mention support
- 📄 Pagination with "Load more" functionality
- 🔄 Real-time state management with custom hooks
- 🎯 Avatar display and user information
- ⚡ Optimized performance with memoization

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.x ([download](https://nodejs.org/))
- **npm** >= 9.x or **yarn** (comes with Node.js)
- **React** 19.2.4
- **Backend server** running on `http://localhost:5000`

---

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Frontend Directory

```bash
cd Frontend
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

This installs all required packages including:
- React 19.2.4
- React DOM
- Craco (Create React App Configuration Override)
- Testing libraries
- Web Vitals

### Step 3: Verify Backend Connection

Make sure the backend server is running:

```bash
# In another terminal, from Backend folder
cd Backend
npm start
```

Backend should be accessible at `http://localhost:5000`

### Step 4: Start the Development Server

From the Frontend directory:

```bash
npm start
```

This will:
- Start the development server on `http://localhost:3000`
- Open your default browser automatically
- Enable hot-reload on file changes
- Display any lint errors in the console

### Step 5: Verify Setup

1. Open `http://localhost:3000` in your browser
2. You should see the comment section
3. Try creating a comment
4. Check browser console for any errors

---

## 🗂️ Project Structure

```
src/
├── index.js                    # React entry point
├── App.jsx                     # Main App component
├── App.css                     # Main styles
├── index.css                   # Global styles
├── components/
│   ├── CommentList.jsx         # Renders list of comments
│   ├── CommentItem.jsx         # Individual comment display
│   ├── CommentInput.jsx        # Input form for new comments
│   ├── ReplyList.jsx          # Renders list of replies
│   ├── ReplyItem.jsx          # Individual reply display
│   ├── Avatar.jsx             # User avatar component
│   ├── UserModal.jsx          # User information modal
│   └── PostCard.js            # Post container component
├── hooks/
│   ├── useComments.js         # Comment state management hook
│   ├── useReplies.js          # Reply state management hook
│   └── useUser.jsx            # User context hook
├── services/
│   └── commentService.js      # API communication layer
├── styles/
│   └── components.css         # Component-specific CSS
└── utils/
    └── helper.js              # Utility functions
```

---

## 📦 Key Components

### CommentList.jsx
Displays all top-level comments with pagination support.
- Props: `comments`, `loading`, `loadingMore`, `hasMore`, `onLoadMore`, `currentUser`
- Shows "Load more comments" button when more exist

### CommentInput.jsx
Form for creating new top-level comments.
- Props: `onSubmit`, `loading`
- Handles user name and content input

### ReplyItem.jsx
Displays individual replies with @mention support.
- Props: `reply`, `onReplyTo`, `currentUser`
- Shows user avatar, name, and content

### UserModal.jsx
Modal popup showing user profile information.
- Props: `user`, `isOpen`, `onClose`
- Displays user details and interaction options

---

## 🔌 API Integration

The frontend communicates with the backend via `/services/commentService.js`:

```javascript
// Get paginated comments
fetchCommentsPaginated(postId, page, limit)

// Get paginated replies
fetchReplies(parentId, page, limit)

// Post a new comment
postComment({ postId, userName, content })

// Post a reply
postReply({ parentId, replyTo, replyToUserName, userName, content })
```

**Important:** Update `API_BASE` in `commentService.js` if backend runs on a different URL:

```javascript
const API_BASE = "http://localhost:5000/comments";  // Change this if needed
```

---

## 🧪 Available Scripts

### `npm start`

Starts the development server on `http://localhost:3000`

- Hot-reload enabled
- Displays lint errors in console
- Press `q` to quit

### `npm run build`

Builds the app for production in the `build/` folder

- Optimizes and minifies code
- Generates hashed filenames for caching
- Ready for deployment
- Output is in `./build` directory

### `npm test`

Launches the test runner in interactive watch mode

- Run all tests with `a`
- Run specific test with filename
- Press `q` to quit

### `npm run eject`

⚠️ **Warning:** This is a one-way operation. Once ejected, you cannot go back.

Exposes all build configuration files (webpack, Babel, ESLint, etc.)

---

## 🔧 Custom Hooks

### useComments(postId)

Manages comment state and pagination:

```javascript
const { comments, loading, loadingMore, hasMore, error, loadMore, addComment } 
  = useComments(postId);
```

**Features:**
- Automatic initial load
- Lazy pagination with `loadMore()`
- Error handling
- Append new comments seamlessly

### useReplies(parentId)

Manages reply state for a specific comment:

```javascript
const { replies, loading, error, loadMore } = useReplies(parentId);
```

---

## 🎨 Styling

Styles are organized in two locations:

- **`src/styles/components.css`** - Reusable component styles
- **`src/App.css`** - Application-level styles
- **`src/index.css`** - Global styles

To customize:
1. Edit CSS files directly
2. Changes auto-reload with hot-reload
3. Import CSS in components as needed

---

## 🐛 Troubleshooting

### Issue: Cannot connect to backend

**Solution:**
- Ensure backend is running: `cd Backend && npm start`
- Check backend is on `http://localhost:5000`
- Verify `API_BASE` in `services/commentService.js`
- Check browser console for CORS errors

### Issue: Comments not loading

**Solution:**
- Check Network tab in DevTools (F12)
- Verify `postId` is being passed to `useComments()`
- Check backend logs for errors
- Ensure MongoDB is running

### Issue: npm start fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or specify different port
PORT=3001 npm start
```

---

## 📱 Browser Support

This app works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🚢 Deployment

To deploy the frontend to production:

### Build the app
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the 'build' folder on Netlify
```

### Deploy to GitHub Pages
1. Update `"homepage"` in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/repo-name"
   ```
2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add deploy scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

---

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Create React App Docs](https://create-react-app.dev)
- [React Hooks Guide](https://react.dev/reference/react)
- [Craco Documentation](https://github.com/dilanx/craco)

---

## 🤝 Contributing

Found a bug? Have a feature request?

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

---

**Built with React 19 ❤️**
