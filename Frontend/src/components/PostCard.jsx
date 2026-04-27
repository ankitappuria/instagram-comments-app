import Avatar from "./Avatar";
import "../styles/components.css";

const POST = {
  userName: "travel.diaries",
  location: "Santorini, Greece",
  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  caption: "The kind of blue you only believe when you see it in person. 🌊",
  likes: 2847,
  time: "2 hours ago",
};

export default function PostCard() {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar-ring">
          <div className="post-avatar-ring-inner">
            <Avatar name={POST.userName} size={38} />
          </div>
        </div>
        <div className="post-info">
          <div className="post-username">{POST.userName}</div>
          <div className="post-location">{POST.location}</div>
        </div>
        <div className="post-menu">···</div>
      </div>

      <img
        src={POST.image}
        alt="post"
        className="post-image"
      />

      <div className="post-actions">
        <div className="post-icons">
          {["♡", "💬", "✈︎"].map((icon, i) => (
            <span key={i} className="post-icon">{icon}</span>
          ))}
          <span className="post-icon post-icon-bookmark">🔖</span>
        </div>
        <div className="post-likes">
          {POST.likes.toLocaleString()} likes
        </div>
        <div className="post-caption">
          <span className="post-caption-username">{POST.userName}</span>{" "}
          {POST.caption}
        </div>
        <div className="post-time">{POST.time}</div>
      </div>
    </div>
  );
}