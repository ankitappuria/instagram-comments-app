
export const stripMention = (content, replyToUserName) => {
  if (!replyToUserName) return content;
  return content.replace(`@${replyToUserName} `, "");
};