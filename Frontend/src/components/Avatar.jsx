import { getAvatarColor } from "../utils/helper";
import "../styles/components.css";

export default function Avatar({ name, size = 36 }) {
  const bg = getAvatarColor(name);
  let sizeClass = "avatar";
  if (size === 28) sizeClass = "avatar--small";
  else if (size === 38) sizeClass = "avatar--medium";
  else if (size === 42) sizeClass = "avatar--large";

  return (
    <div className={sizeClass} style={{ background: bg }}>
      {(name?.[0] || "?").toUpperCase()}
    </div>
  );
}