import { useEffect, useState } from "react";
import AvatarContextMenu from "../components/AvatarContextMenu";
import ChatArea from "../components/ChatArea";
import CurrentUserProfile from "../components/CurrentUserProfile";
import EmptyState from "../components/EmptyState";
import LanguagePicker from "../components/LanguagePicker";
import NewChat from "../components/NewChat";
import PhotoViewer from "../components/PhotoViewer";
import PublicProfile from "../components/PublicProfile";
import Sidebar from "../components/Sidebar";
import { INITIAL_CONTACTS, INITIAL_MESSAGES, MOCK_USER } from "../data/mock";
import socket from "../config/socket.io";
import { useAuth } from "../context/AuthContext";
import CropImage from "../components/CropImage";
import SettingsView from "../components/Settings";
import { getConversations, updateAvatarService, deleteAvatarService } from "../services/user.services";
import { getMessages, uploadAttachmentService, deleteMessageService, deleteMultipleMessagesService, clearChatService } from "../services/chat.services";

const ChatPage = () => {
    const { user, getUser } = useAuth();

    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState({});
    const [activeContactId, setActiveContactId] = useState(null);
    const [activeConversationId, setActiveConversationId] = useState(null);

    const [appSettings, setAppSettings] = useState(() => {
        const saved = localStorage.getItem("appSettings");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse appSettings", e);
            }
        }
        return {
            notifications: true,
            sound: true,
            darkMode: false,
            readReceipts: true,
            onlineStatus: true,
            language: "English",
        };
    });

    // Modals Visibility States
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [viewedProfile, setViewedProfile] = useState(null);
    const [avatarMenu, setAvatarMenu] = useState(null);
    const [viewedAvatar, setViewedAvatar] = useState(null);
    const [currentUser, setCurrentUser] = useState(user); // MOCK_USER
    const [cropImageSrc, setCropImageSrc] = useState(null);

    const activeContact = contacts.find((c) => c.id === activeContactId);
    const activeMessages = activeContactId ? messages[activeContactId] || [] : [];

    const handleSendMessage = async (text, files = [], replyTo) => {
        const tempId = Date.now();
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Construct optimistic attachments using local blob URLs for instant rendering
        const localAttachments = files.map((file) => {
            const isVideo = file.type.startsWith("video/");
            return {
                url: URL.createObjectURL(file),
                type: isVideo ? "video" : "image",
                isLocal: true,
            };
        });

        const optimisticMsg = {
            id: tempId,
            conversationId: activeConversationId,
            sender: "me",
            text,
            attachments: localAttachments,
            // Fallback properties for older components
            media: localAttachments[0]?.url || null,
            mediaType: localAttachments[0]?.type || null,
            reactions: [],
            replyTo,
            status: "sending", // Set status to sending
            time: timeStr,
        };

        // Instantly append optimistic message to the chat area
        setMessages((prev) => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), optimisticMsg] }));

        // Instantly update sidebar contacts list
        setContacts((prev) => {
            const updated = prev.map((c) => {
                if (c.id === activeContactId) {
                    let lastMsgText = text.trim();
                    if (!lastMsgText && localAttachments.length > 0) {
                        if (localAttachments.length === 1) {
                            lastMsgText = localAttachments[0].type === "video" ? "🎥 Video" : "📸 Photo";
                        } else {
                            lastMsgText = `📎 ${localAttachments.length} attachments`;
                        }
                    }
                    return { ...c, lastMessage: lastMsgText, time: "Just now", unread: 0, updatedAt: new Date().toISOString() };
                }
                return c;
            });
            return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });

        // Asynchronously perform file uploads & emit message over socket
        let uploadedAttachments = [];
        try {
            if (files && files.length > 0) {
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append("files", file);
                });
                // Upload files to Cloudinary via server API
                const uploadResult = await uploadAttachmentService(formData);
                uploadedAttachments = uploadResult.attachments || [];
            }

            const formattedAttachments = uploadedAttachments.map((att) => {
                const isVideo = att.url.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(att.url);
                return {
                    url: att.url,
                    publicId: att.publicId,
                    type: isVideo ? "video" : "image",
                };
            });

            // Update the optimistic message's state with real Cloudinary URLs and mark as sent
            setMessages((prev) => {
                const currentChat = prev[activeContactId] || [];
                return {
                    ...prev,
                    [activeContactId]: currentChat.map((m) =>
                        String(m.id) === String(tempId)
                            ? {
                                ...m,
                                attachments: formattedAttachments,
                                media: formattedAttachments[0]?.url || null,
                                mediaType: formattedAttachments[0]?.type || null,
                                publicId: formattedAttachments[0]?.publicId || null,
                                status: "sent",
                            }
                            : m
                    ),
                };
            });

            const newMsgObj = {
                id: tempId,
                conversationId: activeConversationId,
                sender: "me",
                text,
                attachments: formattedAttachments,
                media: formattedAttachments[0]?.url || null,
                mediaType: formattedAttachments[0]?.type || null,
                publicId: formattedAttachments[0]?.publicId || null,
                reactions: [],
                replyTo,
                time: timeStr,
            };

            socket.emit("send_message", { to: activeContactId, message: newMsgObj });

        } catch (error) {
            console.error("Failed to upload files or send message:", error);
            // Mark the message as failed
            setMessages((prev) => {
                const currentChat = prev[activeContactId] || [];
                return {
                    ...prev,
                    [activeContactId]: currentChat.map((m) =>
                        String(m.id) === String(tempId) ? { ...m, status: "error" } : m
                    ),
                };
            });
            alert("Attachment upload failed. Please try again.");
        }
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

    const updateLastMessageAfterDeletion = (contactId, remainingMsgs) => {
        setContacts((prev) => {
            const updated = prev.map((c) => {
                if (c.id === contactId) {
                    const lastMsg = remainingMsgs[remainingMsgs.length - 1];
                    let lastMsgText = "";
                    let lastTime = "Just now";
                    if (lastMsg) {
                        lastMsgText = lastMsg.text?.trim() || "";
                        if (!lastMsgText && lastMsg.media) {
                            lastMsgText = lastMsg.mediaType === "video" ? "🎥 Video" : "📸 Photo";
                        }
                        lastTime = lastMsg.time;
                    }
                    return { ...c, lastMessage: lastMsgText, time: lastTime, updatedAt: new Date().toISOString() };
                }
                return c;
            });
            return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessageService(messageId);
            setMessages((prev) => {
                const currentChat = prev[activeContactId] || [];
                const updatedChat = currentChat.filter((m) => m.id !== messageId);
                updateLastMessageAfterDeletion(activeContactId, updatedChat);
                return {
                    ...prev,
                    [activeContactId]: updatedChat,
                };
            });
            socket.emit("delete_message", { to: activeContactId, messageId });
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    const handleDeleteMultipleMessages = async (messageIds) => {
        try {
            await deleteMultipleMessagesService(messageIds);
            setMessages((prev) => {
                const currentChat = prev[activeContactId] || [];
                const updatedChat = currentChat.filter((m) => !messageIds.includes(m.id));
                updateLastMessageAfterDeletion(activeContactId, updatedChat);
                return {
                    ...prev,
                    [activeContactId]: updatedChat,
                };
            });
            socket.emit("delete_multiple_messages", { to: activeContactId, messageIds });
        } catch (error) {
            console.error("Failed to delete multiple messages:", error);
        }
    };

    const handleClearChat = async () => {
        try {
            if (!activeConversationId) return;
            await clearChatService(activeConversationId);
            setMessages((prev) => ({ ...prev, [activeContactId]: [] }));
            setContacts((prev) => {
                const updated = prev.map((c) =>
                    c.id === activeContactId ? { ...c, lastMessage: "Chat cleared", time: "Just now", updatedAt: new Date().toISOString() } : c
                );
                return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });
            socket.emit("clear_chat", { to: activeContactId, conversationId: activeConversationId });
        } catch (error) {
            console.error("Failed to clear chat:", error);
        }
    };

    const handleCreateNewChat = (name, email, id) => {
        const newContact = {
            id,
            name,
            avatar: "",
            lastMessage: "",
            time: "Just now",
            unread: 0,
            online: true,
            email: email.includes("@") ? email : "",
            phone: !email.includes("@") ? email : "",
            about: "Hey there! I am using ChatApp.",
            location: "Unknown",
            joined: "Today",
            updatedAt: new Date().toISOString(),
        };
        setContacts((prev) => {
            const updated = [newContact, ...prev];
            return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
        setMessages((prev) => ({ ...prev, [id]: [] }));
        setActiveContactId(id);
        setShowNewChatModal(false);
    };



    // Sync dark mode setting with document element and save settings to localStorage
    useEffect(() => {
        if (appSettings.darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("appSettings", JSON.stringify(appSettings));
    }, [appSettings]);

    // Sync current user state with auth context user
    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // 1. Fetch conversations & map to contacts list
                const convData = await getConversations();
                const mappedContacts = convData.conversations.map((conv) => {
                    const otherMember = conv.members.find((m) => m._id !== user._id) || {};
                    return {
                        id: otherMember._id || conv._id,
                        conversationId: conv._id,
                        name: otherMember.name || "Unknown User",
                        avatar: otherMember.avatar?.url || "",
                        lastMessage: conv.lastMessage?.message || "",
                        time: conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
                        unread: 0,
                        online: otherMember.status === "online",
                        email: otherMember.email || "",
                        phone: otherMember.phoneNumber || "",
                        about: "Hey there! I am using ChatApp.",
                        location: "Unknown",
                        joined: otherMember.createdAt ? new Date(otherMember.createdAt).toLocaleDateString() : "Today",
                        updatedAt: conv.updatedAt || new Date().toISOString(),
                    };
                });
                const sortedContacts = mappedContacts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setContacts(sortedContacts);

                // 2. Fetch messages and group them by contactId
                const msgData = await getMessages();
                const grouped = {};
                msgData.messages.forEach((msg) => {
                    const contact = mappedContacts.find((c) => c.conversationId === msg.conversationId);
                    if (!contact) return;

                    const isMe = msg.sender === user._id;
                    const hasAttachment = msg.attachments && msg.attachments[0];
                    const isVideo = hasAttachment && (
                        msg.attachments[0].url.includes("/video/upload/") ||
                        /\.(mp4|webm|ogg|mov|avi)$/i.test(msg.attachments[0].url)
                    );
                    const formattedMsg = {
                        id: msg._id,
                        conversationId: msg.conversationId,
                        sender: isMe ? "me" : "them",
                        text: msg.text,
                        attachments: msg.attachments ? msg.attachments.map(att => {
                            const isVid = att.url.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(att.url);
                            return {
                                url: att.url,
                                publicId: att.publicId,
                                type: isVid ? "video" : "image"
                            };
                        }) : [],
                        media: hasAttachment ? msg.attachments[0].url : null,
                        mediaType: hasAttachment ? (isVideo ? "video" : "image") : null,
                        reactions: [],
                        replyTo: null,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    };

                    if (!grouped[contact.id]) {
                        grouped[contact.id] = [];
                    }
                    grouped[contact.id].push(formattedMsg);
                });

                setMessages(grouped);
            } catch (error) {
                console.error("Error fetching conversations or messages:", error);
            }
        };

        fetchData();
    }, [user]);

    // Handle real-time incoming/outgoing messages from socket
    useEffect(() => {
        if (!user) return;

        const handleReceiveMessage = (payload) => {
            const { from, to, data } = payload;

            // Determine the contact ID (the other participant)
            const contactId = from === user._id ? to : from;
            const isMe = from === user._id;

            const newMsg = {
                id: data.id || Date.now(),
                conversationId: data.conversationId,
                sender: isMe ? "me" : "them",
                text: data.text,
                attachments: data.attachments ? data.attachments.map(att => {
                    const isVid = att.url.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(att.url);
                    return {
                        url: att.url,
                        publicId: att.publicId,
                        type: isVid ? "video" : "image"
                    };
                }) : [],
                media: data.media,
                mediaType: data.mediaType,
                reactions: data.reactions || [],
                replyTo: data.replyTo || null,
                time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => {
                const currentChat = prev[contactId] || [];
                // If it is from me and has a tempId, update the existing message's id to the database id
                if (isMe && data.tempId) {
                    const exists = currentChat.some((m) => String(m.id) === String(data.tempId));
                    if (exists) {
                        return {
                            ...prev,
                            [contactId]: currentChat.map((m) =>
                                String(m.id) === String(data.tempId) ? { ...m, id: data.id } : m
                            ),
                        };
                    }
                }
                // Prevent duplicate entries from HMR or socket echoes
                if (currentChat.some((m) => m.id === newMsg.id)) {
                    return prev;
                }
                return {
                    ...prev,
                    [contactId]: [...currentChat, newMsg],
                };
            });

            // Update contacts preview & order
            setContacts((prev) => {
                const updated = prev.map((c) => {
                    if (c.id === contactId) {
                        let lastMsgText = data.text?.trim() || "";
                        if (!lastMsgText && data.media) {
                            lastMsgText = data.mediaType === "video" ? "🎥 Video" : "📸 Photo";
                        }
                        return { ...c, lastMessage: lastMsgText, time: "Just now", unread: isMe ? 0 : (c.unread || 0) + 1, updatedAt: new Date().toISOString() };
                    }
                    return c;
                });
                return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });
        };

        const handleMessageDeleted = (payload) => {
            const { from, messageId } = payload;
            setMessages((prev) => {
                const currentChat = prev[from] || [];
                const updatedChat = currentChat.filter((m) => m.id !== messageId);
                updateLastMessageAfterDeletion(from, updatedChat);
                return {
                    ...prev,
                    [from]: updatedChat,
                };
            });
        };

        const handleMultipleMessagesDeleted = (payload) => {
            const { from, messageIds } = payload;
            setMessages((prev) => {
                const currentChat = prev[from] || [];
                const updatedChat = currentChat.filter((m) => !messageIds.includes(m.id));
                updateLastMessageAfterDeletion(from, updatedChat);
                return {
                    ...prev,
                    [from]: updatedChat,
                };
            });
        };

        const handleChatCleared = (payload) => {
            const { from } = payload;
            setMessages((prev) => ({ ...prev, [from]: [] }));
            setContacts((prev) =>
                prev.map((c) =>
                    c.id === from ? { ...c, lastMessage: "Chat cleared", time: "Just now" } : c
                )
            );
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_deleted", handleMessageDeleted);
        socket.on("multiple_messages_deleted", handleMultipleMessagesDeleted);
        socket.on("chat_cleared", handleChatCleared);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_deleted", handleMessageDeleted);
            socket.off("multiple_messages_deleted", handleMultipleMessagesDeleted);
            socket.off("chat_cleared", handleChatCleared);
        };
    }, [user]);

    const base64ToBlob = (base64, mimeType = "image/jpeg") => {
        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeType });
    };

    const handleUpdateAvatar = async (croppedBase64) => {
        try {
            const blob = base64ToBlob(croppedBase64, "image/jpeg");
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("avatar", file);

            const result = await updateAvatarService(formData);
            
            // Update local state
            setCurrentUser((prev) => ({ ...prev, avatar: result.avatar }));
            await getUser();
            setCropImageSrc(null);
        } catch (error) {
            console.error("Failed to update avatar:", error);
            alert("Failed to upload avatar. Please try again.");
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            const result = await deleteAvatarService();
            setCurrentUser((prev) => ({ ...prev, avatar: result.avatar }));
            await getUser();
        } catch (error) {
            console.error("Failed to delete avatar:", error);
            alert("Failed to delete avatar. Please try again.");
        }
    };

    return (
        <div className={appSettings.darkMode ? "dark" : ""}>
            <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-200">
                <Sidebar
                    currentUser={currentUser}
                    contacts={contacts}
                    activeContactId={activeContactId}
                    appSettings={appSettings}
                    onSelectContact={(id, conversationId) => {
                        setActiveContactId(id);
                        setActiveConversationId(conversationId);
                    }}
                    onShowProfile={() => setShowProfile(true)}
                    onNewChat={() => setShowNewChatModal(true)}
                    onShowSettings={() => setShowSettings(true)}
                    onAvatarClick={(e, contact) => setAvatarMenu({ x: e.clientX, y: e.clientY, contact })}
                />

                {activeContact ? (
                    <ChatArea
                        activeContact={activeContact}
                        messages={activeMessages}
                        appSettings={appSettings}
                        onSendMessage={handleSendMessage}
                        onToggleReaction={toggleReaction}
                        onClearChat={handleClearChat}
                        onDeleteMessage={handleDeleteMessage}
                        onDeleteMultiple={handleDeleteMultipleMessages}
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
                    onDeleteAvatar={handleDeleteAvatar}
                />

                <PublicProfile
                    profile={viewedProfile}
                    onClose={() => setViewedProfile(null)}
                    onViewAvatar={setViewedAvatar}
                    onStartChat={() => {
                        setActiveContactId(viewedProfile.id);
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
                <NewChat show={showNewChatModal} onClose={() => setShowNewChatModal(false)} onCreate={handleCreateNewChat} />
                <CropImage
                    cropImageSrc={cropImageSrc}
                    onClose={() => setCropImageSrc(null)}
                    onSave={handleUpdateAvatar}
                />
            </div>
        </div>
    );
};

export default ChatPage;
