const API_BASE = "http://localhost:5000/comments";

export const fetchCommentsPaginated = async (postId, page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/paginated/${postId}?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const fetchReplies = async (parentId, page = 1, limit = 5) => {
  const res = await fetch(`${API_BASE}/replies/${parentId}?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const postComment = async ({ postId, userName, content }) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, userName, content }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const postReply = async ({ parentId, replyTo, replyToUserName, userName, content }) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parentId, replyTo, replyToUserName, userName, content }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};