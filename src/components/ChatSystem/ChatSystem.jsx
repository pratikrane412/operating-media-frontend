import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // Added for path tracking
import { db } from "../../firebase";
import { ref, push, onValue } from "firebase/database";
import {
  MessageSquare,
  X,
  Send,
  Search,
  ChevronLeft,
  MoreVertical,
} from "lucide-react";
import axios from "axios";
import "./ChatSystem.css";

const ChatSystem = () => {
  const location = useLocation(); // Track current URL
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  // 1. Move currentUser into state to handle Login/Logout without refresh
  const [currentUser, setCurrentUser] = useState(null);
  const chatEndRef = useRef(null);

  // 2. Logic to detect page changes and user session
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      setCurrentUser(JSON.parse(adminData));
    } else {
      setCurrentUser(null);
    }
  }, [location]); // re-runs when user navigates (e.g. from Login to Dashboard)

  // 3. Define Public Pages where chat should NOT appear
  const publicPaths = [
    "/",
    "/login",
    "/admission",
    "/counsellor-form",
    "/course-form",
    "/trainer-form",
  ];

  const isPublicPage =
    publicPaths.includes(location.pathname) ||
    location.pathname.startsWith("/certificate");

  // 4. Fetch Staff List
  useEffect(() => {
    if (!currentUser?.name) return;

    axios
      .get("https://operating-media-backend.onrender.com/api/leads/create/")
      .then((res) => {
        if (res.data && res.data.counsellors) {
          const otherStaff = res.data.counsellors.filter(
            (name) => name !== currentUser.name,
          );
          setUsers(otherStaff);
        }
      });
  }, [currentUser?.name]);

  const getChatRoomId = (userB) => {
    if (!currentUser?.name) return "";
    const ids = [currentUser.name, userB].sort();
    return `chat_${ids[0]}_${ids[1]}`.replace(/\s+/g, "_");
  };

  // 5. Listen for Messages
  useEffect(() => {
    if (!selectedUser || !currentUser?.name) return;

    const roomID = getChatRoomId(selectedUser);
    const chatRef = ref(db, `chats/${roomID}/messages`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedMsgs = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp,
        );
        setMessages(sortedMsgs);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser?.name]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !currentUser?.name) return;

    const roomID = getChatRoomId(selectedUser);
    push(ref(db, `chats/${roomID}/messages`), {
      sender: currentUser.name,
      text: msgInput,
      timestamp: Date.now(),
    });

    setMsgInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // --- FINAL GUARD ---
  // If no one is logged in OR if we are on a public page, show nothing
  if (!currentUser || isPublicPage) {
    return null;
  }

  const filteredUsers = users.filter((u) =>
    u.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="chat-premium-root">
      <button
        className={`chat-fab-main ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageSquare size={24} />
            <span className="notif-dot"></span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="chat-panel-container">
          {!selectedUser ? (
            <div className="chat-view fade-in">
              <div className="chat-view-header">
                <h3>Messages</h3>
                <p>Team communication</p>
              </div>

              <div className="chat-search-box">
                <Search size={16} />
                <input
                  placeholder="Search counsellor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="chat-user-list custom-scroll">
                {filteredUsers.map((user) => (
                  <div
                    key={user}
                    className="chat-user-card"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="chat-avatar-ring">
                      <div className="chat-avatar-inner">{user.charAt(0)}</div>
                      <span className="online-indicator"></span>
                    </div>
                    <div className="chat-user-details">
                      <div className="name-row">
                        <strong>{user}</strong>
                        <span className="time-stamp">Counsellor</span>
                      </div>
                      <p className="last-msg">Click to start conversation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-view fade-in">
              <div className="chat-view-header messaging">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="icon-btn-back"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="active-user-info">
                  <h4>{selectedUser}</h4>
                  <span>Active Now</span>
                </div>
                <MoreVertical size={18} className="header-icon-muted" />
              </div>

              <div className="chat-messages-area custom-scroll">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`msg-row ${m.sender === currentUser.name ? "me" : "them"}`}
                  >
                    <div className="msg-content">
                      <div className="msg-bubble">{m.text}</div>
                      <span className="msg-time">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-input-row" onSubmit={sendMessage}>
                <div className="input-pill">
                  <input
                    placeholder="Write something..."
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="send-btn">
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSystem;
