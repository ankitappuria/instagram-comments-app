const AVATAR_COLORS = [
  "#E8D5FF", "#FFD5E8", "#D5E8FF", "#D5FFE8",
  "#FFE8D5", "#E8FFD5", "#F5D5FF", "#D5F5FF"
];

export const getAvatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

export const stripMention = (content, replyToUserName) => {
  if (!replyToUserName) return content;
  return content.replace(`@${replyToUserName} `, "");
};