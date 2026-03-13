import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { ref, push, onValue, update, increment } from "firebase/database";
import {
  MessageSquare,
  X,
  Send,
  Search,
  ChevronLeft,
  MoreVertical,
  Check
} from "lucide-react";
import axios from "axios";
import "./ChatSystem.css";

const ChatSystem = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({}); // Stores individual counts

  const [currentUser, setCurrentUser] = useState(null);
  const chatEndRef = useRef(null);

  // 1. Sync User Session & Listen for GLOBAL UNREAD COUNTS
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const user = JSON.parse(adminData);
      setCurrentUser(user);

      // Listen for all unread counts sent TO ME
      const myNameKey = user.name.replace(/\s+/g, '_');
      const countsRef = ref(db, `unread_counts/${myNameKey}`);
      const unsubscribe = onValue(countsRef, (snapshot) => {
        setUnreadCounts(snapshot.val() || {});
      });
      return () => unsubscribe();
    }
  }, [location]);

  // 2. Fetch User List
  useEffect(() => {
    if (!currentUser?.name) return;
    axios.get("https://operating-media-backend.onrender.com/api/leads/create/")
      .then((res) => {
        if (res.data?.counsellors) {
          const otherStaff = res.data.counsellors.filter(name => name !== currentUser.name);
          setUsers(otherStaff);
        }
      });
  }, [currentUser]);

  // 3. Clear unread count when I open a chat with someone
  useEffect(() => {
    if (selectedUser && currentUser) {
      const myNameKey = currentUser.name.replace(/\s+/g, '_');
      const senderKey = selectedUser.replace(/\s+/g, '_');
      const specificCountRef = ref(db, `unread_counts/${myNameKey}`);

      // Reset this person's unread count to 0 because I'm looking at it now
      update(specificCountRef, { [senderKey]: 0 });
    }
  }, [selectedUser, currentUser]);

  const getChatRoomId = (userB) => {
    if (!currentUser) return "";
    const ids = [currentUser.name, userB].sort();
    return `chat_${ids[0]}_${ids[1]}`.replace(/\s+/g, "_");
  };

  // 4. Listen for Messages in Active Room
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    const roomID = getChatRoomId(selectedUser);
    const chatRef = ref(db, `chats/${roomID}/messages`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp) : []);
    });
    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  // 5. Send Message + Increment COUNTER for the Receiver
  const sendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !currentUser) return;

    const roomID = getChatRoomId(selectedUser);
    const myNameKey = currentUser.name.replace(/\s+/g, '_');
    const receiverKey = selectedUser.replace(/\s+/g, '_');

    // Save message
    push(ref(db, `chats/${roomID}/messages`), {
      sender: currentUser.name,
      text: msgInput,
      timestamp: Date.now(),
    });

    // ALERT: Notify the receiver by incrementing their unread node for me
    const receiverCountRef = ref(db, `unread_counts/${receiverKey}`);
    update(receiverCountRef, {
      [myNameKey]: increment(1)
    });

    setMsgInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Logic to hide chat on public pages
  const publicPaths = ["/", "/login", "/admission", "/counsellor-form", "/course-form", "/trainer-form", "/counselling-scheduling"];
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname.startsWith("/certificate");

  if (!currentUser || isPublicPage) return null;

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const filteredUsers = users.filter((u) => u.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="chat-premium-root">
      <button className={`chat-fab-main ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : (
          <>
            <MessageSquare size={24} />
            {totalUnread > 0 && <span className="notif-badge-fab">{totalUnread}</span>}
          </>
        )}
      </button>

      {isOpen && (
        <div className="chat-panel-container">
          {!selectedUser ? (
            <div className="chat-view fade-in">
              <div className="chat-view-header">
                <h3>Messages</h3>
                <p>Internal Team Chat</p>
              </div>

              <div className="chat-search-box">
                <Search size={16} />
                <input placeholder="Search contact..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              <div className="chat-user-list custom-scroll">
                {filteredUsers.map((user) => {
                  const userKey = user.replace(/\s+/g, '_');
                  const count = unreadCounts[userKey] || 0;

                  return (
                    <div key={user} className={`chat-user-card ${count > 0 ? 'has-unread' : ''}`} onClick={() => setSelectedUser(user)}>
                      <div className="chat-avatar-ring">
                        <div className="chat-avatar-inner">{user.charAt(0)}</div>
                        <span className="online-indicator"></span>
                      </div>
                      <div className="chat-user-details">
                        <div className="name-row">
                          <strong>{user}</strong>
                          {count > 0 && <span className="user-unread-badge">{count}</span>}
                        </div>
                        <p className={`last-msg ${count > 0 ? 'is-unread' : ''}`}>
                          {count > 0 ? 'Sent you a message' : 'Click to chat'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="chat-view fade-in">
              <div className="chat-view-header messaging">
                <button onClick={() => setSelectedUser(null)} className="icon-btn-back">
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
                  <div key={i} className={`msg-row ${m.sender === currentUser.name ? "me" : "them"}`}>
                    <div className="msg-content">
                      <div className="msg-bubble">{m.text}</div>
                      <span className="msg-time">{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-input-row" onSubmit={sendMessage}>
                <div className="input-pill">
                  <input placeholder="Write something..." value={msgInput} onChange={(e) => setMsgInput(e.target.value)} autoFocus />
                  <button type="submit" className="send-btn"><Send size={18} /></button>
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