import { useEffect, useState } from "react";
import AvatarContextMenu from "../components/AvatarContextMenu";
import CallOverlay from "../components/CallOverlay";
import ChatArea from "../components/ChatArea";
import CurrentUserProfile from "../components/CurrentUserProfile";
import EmptyState from "../components/EmptyState";
import LanguagePicker from "../components/LanguagePicker";
import NewChat from "../components/NewChat";
import PhotoViewer from "../components/PhotoViewer";
import PublicProfile from "../components/PublicProfile";
import Sidebar from "../components/Sidebar";
import { INITIAL_CALLS, INITIAL_CONTACTS, INITIAL_MESSAGES, MOCK_USER } from "../data/mock";
import socket from "../config/socket.io";
import { useAuth } from "../context/AuthContext";
import CropImage from "../components/CropImage";
import SettingsView from "../components/Settings";

const ChatPage = () => {
    const { user, getUser } = useAuth();

    const [contacts, setContacts] = useState(INITIAL_CONTACTS);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [callHistory, setCallHistory] = useState(INITIAL_CALLS);
    const [activeContactId, setActiveContactId] = useState(null);

    const [appSettings, setAppSettings] = useState({
        notifications: true,
        sound: true,
        darkMode: false,
        readReceipts: true,
        onlineStatus: true,
        language: "English",
    });

    // Modals Visibility States
    const [activeTab, setActiveTab] = useState("chats"); // 'chats' | 'calls'
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [viewedProfile, setViewedProfile] = useState(null);
    const [avatarMenu, setAvatarMenu] = useState(null);
    const [viewedAvatar, setViewedAvatar] = useState(null);

    // Global Features States
    const [callState, setCallState] = useState(null);
    const [currentUser, setCurrentUser] = useState(MOCK_USER);
    const [cropImageSrc, setCropImageSrc] = useState(null);

    const activeContact = contacts.find((c) => c.id === activeContactId);
    const activeMessages = activeContactId ? messages[activeContactId] || [] : [];

    const handleSendMessage = (text, media, mediaType, replyTo) => {
        const newMsgObj = {
            id: Date.now(),
            sender: "me",
            text,
            media,
            mediaType,
            reactions: [],
            replyTo,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), newMsgObj] }));
        setContacts((prev) => {
            const updated = prev.map((c) => {
                if (c.id === activeContactId) {
                    let lastMsgText = text.trim();
                    if (!lastMsgText && media) lastMsgText = mediaType === "video" ? "🎥 Video" : "📸 Photo";
                    return { ...c, lastMessage: lastMsgText, time: "Just now", unread: 0 };
                }
                return c;
            });
            return updated.sort((a, b) => (a.id === activeContactId ? -1 : b.id === activeContactId ? 1 : 0));
        });

        console.log(socket);

        socket.emit("send_message", { to: activeContactId, message: newMsgObj });
    };

    const toggleReaction = (msgId, emoji) => {
        setMessages((prev) => {
            const updatedChat = (prev[activeContactId] || []).map((msg) => {
                if (msg.id === msgId) {
                    const curr = msg.reactions || [];
                    return { ...msg, reactions: curr.includes(emoji) ? curr.filter((e) => e !== emoji) : [...curr, emoji] };
                }
                return msg;
            });
            return { ...prev, [activeContactId]: updatedChat };
        });
    };

    const handleClearChat = () => {
        setMessages((prev) => ({ ...prev, [activeContactId]: [] }));
        setContacts((prev) => prev.map((c) => (c.id === activeContactId ? { ...c, lastMessage: "Chat cleared", unread: 0 } : c)));
    };

    const handleCreateNewChat = (name, identifier) => {
        const newId = Date.now();

        const newConversation = {
            members: [user._id, newId],
            lastMessage: "",
        };

        const newContact = {
            id: newId,
            name,
            avatar: `https://i.pravatar.cc/150?u=${newId}`,
            lastMessage: "",
            time: "Just now",
            unread: 0,
            online: true,
            email: identifier.includes("@") ? identifier : "",
            phone: !identifier.includes("@") ? identifier : "",
            about: "Hey there! I am using ChatApp.",
            location: "Unknown",
            joined: "Today",
        };
        setContacts((prev) => [newContact, ...prev]);
        setMessages((prev) => ({ ...prev, [newId]: [] }));
        setActiveContactId(newId);
        setActiveTab("chats");
        setShowNewChatModal(false);
    };

    const handleEndCall = (duration, status) => {
        if (callState) {
            const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            // 1. Add Call Log to Chat
            const newMsgObj = {
                id: Date.now(),
                sender: "me",
                type: "call",
                callType: callState.type,
                duration: duration,
                time: timeStr,
            };

            setMessages((prev) => ({
                ...prev,
                [callState.contact.id]: [...(prev[callState.contact.id] || []), newMsgObj],
            }));

            // 2. Add to Call History Array
            const newCallLog = {
                id: Date.now(),
                contact: callState.contact,
                type: callState.type,
                direction: "outgoing",
                duration: duration,
                status: duration > 0 ? "completed" : "missed",
                time: timeStr,
            };

            setCallHistory((prev) => [newCallLog, ...prev]);

            // 3. Update Contact Last Message Status
            setContacts((prev) => {
                const updated = prev.map((c) => {
                    if (c.id === callState.contact.id) {
                        return {
                            ...c,
                            lastMessage: callState.type === "video" ? "📹 Video Call" : "📞 Audio Call",
                            time: "Just now",
                            unread: 0,
                        };
                    }
                    return c;
                });
                return updated.sort((a, b) => (a.id === callState.contact.id ? -1 : b.id === callState.contact.id ? 1 : 0));
            });
        }
        setCallState(null);
    };

    // useEffect(() => {

    // }, []);

    return (
        <div className={appSettings.darkMode ? "dark" : ""}>
            <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-200">
                <Sidebar
                    currentUser={currentUser}
                    contacts={contacts}
                    activeContactId={activeContactId}
                    appSettings={appSettings}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    callHistory={callHistory}
                    onSelectContact={(id) => {
                        setActiveContactId(id);
                        setActiveTab("chats");
                    }}
                    onShowProfile={() => setShowProfile(true)}
                    onNewChat={() => setShowNewChatModal(true)}
                    onShowSettings={() => setShowSettings(true)}
                    onAvatarClick={(e, contact) => setAvatarMenu({ x: e.clientX, y: e.clientY, contact })}
                    onStartCall={(type, contact) => setCallState({ type, contact })}
                />

                {activeContact ? (
                    <ChatArea
                        activeContact={activeContact}
                        messages={activeMessages}
                        appSettings={appSettings}
                        onSendMessage={handleSendMessage}
                        onToggleReaction={toggleReaction}
                        onClearChat={handleClearChat}
                        onStartCall={(type) => setCallState({ type, contact: activeContact })}
                        onViewProfile={() => setViewedProfile(activeContact)}
                        onViewAvatar={setViewedAvatar}
                        onCloseChat={() => setActiveContactId(null)}
                    />
                ) : (
                    <EmptyState />
                )}

                <CurrentUserProfile
                    show={showProfile}
                    onClose={() => setShowProfile(false)}
                    currentUser={currentUser}
                    onSaveAbout={(about) => setCurrentUser((prev) => ({ ...prev, about }))}
                    onSetCropImageSrc={setCropImageSrc}
                    onViewAvatar={setViewedAvatar}
                />

                <PublicProfile
                    profile={viewedProfile}
                    onClose={() => setViewedProfile(null)}
                    onViewAvatar={setViewedAvatar}
                    onStartChat={() => {
                        setActiveContactId(viewedProfile.id);
                        setViewedProfile(null);
                    }}
                    onStartCall={(type) => {
                        setCallState({ type, contact: viewedProfile });
                        setViewedProfile(null);
                    }}
                />

                <SettingsView
                    show={showSettings}
                    onClose={() => setShowSettings(false)}
                    appSettings={appSettings}
                    toggleSetting={(key) => setAppSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                    onShowProfile={() => setShowProfile(true)}
                    onShowLanguage={() => setShowLanguagePicker(true)}
                />

                <LanguagePicker
                    show={showLanguagePicker}
                    onClose={() => setShowLanguagePicker(false)}
                    appSettings={appSettings}
                    setAppSettings={setAppSettings}
                />
                <AvatarContextMenu
                    menuData={avatarMenu}
                    onClose={() => setAvatarMenu(null)}
                    onViewAvatar={setViewedAvatar}
                    onViewProfile={setViewedProfile}
                />
                <PhotoViewer photoUrl={viewedAvatar} onClose={() => setViewedAvatar(null)} />
                <CallOverlay callState={callState} onEndCall={handleEndCall} currentUser={currentUser} />
                <NewChat show={showNewChatModal} onClose={() => setShowNewChatModal(false)} onCreate={handleCreateNewChat} />
                <CropImage
                    cropImageSrc={cropImageSrc}
                    onClose={() => setCropImageSrc(null)}
                    onSave={(url) => {
                        setCurrentUser((prev) => ({ ...prev, avatar: url }));
                        setCropImageSrc(null);
                    }}
                />
            </div>
        </div>
    );
};

export default ChatPage;
