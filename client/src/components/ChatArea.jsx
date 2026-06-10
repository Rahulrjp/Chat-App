import { ArrowLeft, Check, CheckCheck, MoreVertical, Paperclip, Reply, Send, Smile, Trash2, X, Play, Clock, AlertCircle, User } from "lucide-react";
import { COMMON_EMOJIS } from "../data/mock";
import { useEffect, useRef, useState } from "react";

const ChatArea = ({
    activeContact,
    messages,
    appSettings,
    onSendMessage,
    onToggleReaction,
    onClearChat,
    onDeleteMessage,
    onDeleteMultiple,
    onViewProfile,
    onViewAvatar,
    onCloseChat,
}) => {
    const [newMessage, setNewMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); // array of { file, url, type }
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [reactionMsgId, setReactionMsgId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedMsgIds, setSelectedMsgIds] = useState([]);
    const [deleteConfirmData, setDeleteConfirmData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const mediaInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (selectedFiles.length + files.length > 5) {
            alert("You can select up to 5 files at a time.");
            if (e.target) e.target.value = null;
            return;
        }

        const newFiles = files.map(file => {
            const isVideo = file.type.startsWith("video/");
            return {
                file,
                url: URL.createObjectURL(file),
                type: isVideo ? "video" : "image"
            };
        });

        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (e.target) e.target.value = null;
    };

    const submitMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() && selectedFiles.length === 0) return;
        onSendMessage(newMessage, selectedFiles.map(f => f.file), replyingTo);
        setNewMessage("");
        setSelectedFiles([]);
        setShowEmojiPicker(false);
        setReplyingTo(null);
    };



    return (
        <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
            <div className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-colors duration-200">
                <div className="flex items-center">
                    <button
                        onClick={onCloseChat}
                        className="md:hidden mr-3 p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div
                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={onViewProfile}
                        title="View Profile">
                        <div className="relative mr-3">
                            {activeContact.avatar ? (
                                <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    <User className="w-6 h-6" />
                                </div>
                            )}
                            {activeContact.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">{activeContact.name}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{activeContact.online ? "Active now" : "Offline"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-slate-500 dark:text-slate-400">
                    <div className="relative">
                        <button
                            onClick={() => setShowChatMenu(!showChatMenu)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {showChatMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowChatMenu(false)}></div>
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        onClick={() => {
                                            setShowChatMenu(false);
                                            onViewProfile();
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        View Contact Info
                                    </button>
                                    <button
                                        onClick={() => setShowChatMenu(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        Mute Notifications
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowChatMenu(false);
                                            setIsSelectMode(true);
                                            setSelectedMsgIds([]);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        Delete Messages
                                    </button>
                                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                    <button
                                        onClick={() => {
                                            setShowChatMenu(false);
                                            setDeleteConfirmData({ isClear: true });
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                                        Clear Chat
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none bg-slate-100/70 dark:bg-slate-950 transition-colors duration-200">
                {messages.map((msg, index) => {
                    const isMe = msg.sender === "me";
                    const showAvatar = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
                    const hasAttachments = (msg.attachments && msg.attachments.length > 0) || !!msg.media;

                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group ${hasAttachments ? "mb-1.5" : "mb-4"}`}>
                            <div className={`flex max-w-[85%] sm:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 min-w-0`}>
                                {isSelectMode && (
                                    <input
                                        type="checkbox"
                                        checked={selectedMsgIds.includes(msg.id)}
                                        onChange={() => {
                                            setSelectedMsgIds((prev) =>
                                                prev.includes(msg.id)
                                                    ? prev.filter((id) => id !== msg.id)
                                                    : [...prev, msg.id]
                                            );
                                        }}
                                        className="w-4 h-4 mx-1 cursor-pointer self-center accent-indigo-600 rounded border-slate-300 dark:border-slate-700 shrink-0"
                                    />
                                )}
                                {!isMe && (
                                    <div className="w-8 h-8 shrink-0">
                                        {showAvatar && (
                                            activeContact.avatar ? (
                                                <img src={activeContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Check if standard message or call log */}
                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} relative max-w-full min-w-0`}>
                                    <div
                                        className={`${hasAttachments ? (msg.text ? "p-1.5 pb-2.5" : "p-1") : "px-4 py-2.5"} rounded-2xl shadow-sm relative max-w-full min-w-0 ${isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm"}`}>
                                        {msg.replyTo && (
                                            <div
                                                className={`mb-2.5 p-2 rounded-lg text-[13px] border-l-4 opacity-90 ${isMe ? "bg-indigo-700/50 border-indigo-300 text-indigo-50" : "bg-slate-100 dark:bg-slate-700 border-indigo-500 text-slate-600 dark:text-slate-300"}`}>
                                                <div className="font-semibold text-xs mb-0.5">
                                                    {msg.replyTo.sender === "me" ? "You" : activeContact.name}
                                                </div>
                                                <div className="truncate max-w-50 sm:max-w-70">
                                                    {msg.replyTo.media
                                                        ? msg.replyTo.mediaType === "video"
                                                            ? "🎥 Video attached"
                                                            : "📸 Photo attached"
                                                        : msg.replyTo.text}
                                                </div>
                                            </div>
                                        )}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className={msg.text ? "mb-2" : "mb-0"}>
                                                {msg.attachments.length === 1 ? (
                                                    // Single attachment: fixed width (w-72) and aspect ratio
                                                    (() => {
                                                        const att = msg.attachments[0];
                                                        const isVideo = att.type === "video" || att.url.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(att.url);
                                                        if (isVideo) {
                                                            return (
                                                                <div className="relative w-72 max-w-full aspect-3/2 rounded-xl overflow-hidden cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800 bg-slate-900" onClick={() => onViewAvatar(att.url)}>
                                                                    <video src={att.url} className="w-full h-full object-cover" preload="metadata" muted />
                                                                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center hover:bg-black/45 transition-colors">
                                                                        <div className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-md">
                                                                            <Play className="w-6 h-6 fill-current ml-0.5" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="w-72 max-w-full aspect-3/2 rounded-xl overflow-hidden cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800 bg-slate-100" onClick={() => onViewAvatar(att.url)}>
                                                                    <img src={att.url} alt="Attachment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                                </div>
                                                            );
                                                        }
                                                    })()
                                                ) : (
                                                    // Multiple attachments: Collage with same fixed width (w-72)
                                                    (() => {
                                                        const renderCollageItem = (att, idx) => {
                                                            const isVideo = att.type === "video" || att.url.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(att.url);
                                                            if (isVideo) {
                                                                return (
                                                                    <div key={idx} className="w-full h-full relative cursor-pointer overflow-hidden bg-slate-900" onClick={() => onViewAvatar(att.url)}>
                                                                        <video src={att.url} className="w-full h-full object-cover" preload="metadata" muted />
                                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors">
                                                                            <div className="p-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-sm">
                                                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div key={idx} className="w-full h-full relative cursor-pointer overflow-hidden bg-slate-100" onClick={() => onViewAvatar(att.url)}>
                                                                        <img src={att.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                                    </div>
                                                                );
                                                            }
                                                        };

                                                        if (msg.attachments.length === 2) {
                                                            return (
                                                                <div className="w-72 max-w-full aspect-3/2 grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                                                                    {msg.attachments.map((att, idx) => renderCollageItem(att, idx))}
                                                                </div>
                                                            );
                                                        } else if (msg.attachments.length === 3) {
                                                            return (
                                                                <div className="w-72 max-w-full aspect-3/2 grid grid-cols-3 grid-rows-2 gap-0.5 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                                                                    <div className="col-span-2 row-span-2 h-full">
                                                                        {renderCollageItem(msg.attachments[0], 0)}
                                                                    </div>
                                                                    <div className="col-span-1 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[1], 1)}
                                                                    </div>
                                                                    <div className="col-span-1 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[2], 2)}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else if (msg.attachments.length === 4) {
                                                            return (
                                                                <div className="w-72 max-w-full aspect-3/2 grid grid-cols-2 grid-rows-2 gap-0.5 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                                                                    {msg.attachments.map((att, idx) => renderCollageItem(att, idx))}
                                                                </div>
                                                            );
                                                        } else {
                                                            // 5 attachments
                                                            return (
                                                                <div className="w-72 max-w-full aspect-3/2 grid grid-cols-6 grid-rows-2 gap-0.5 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                                                                    <div className="col-span-3 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[0], 0)}
                                                                    </div>
                                                                    <div className="col-span-3 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[1], 1)}
                                                                    </div>
                                                                    <div className="col-span-2 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[2], 2)}
                                                                    </div>
                                                                    <div className="col-span-2 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[3], 3)}
                                                                    </div>
                                                                    <div className="col-span-2 row-span-1 h-full">
                                                                        {renderCollageItem(msg.attachments[4], 4)}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    })()
                                                )}
                                            </div>
                                        )}
                                        {(!msg.attachments || msg.attachments.length === 0) && msg.media && (
                                            (() => {
                                                const isVideo = msg.mediaType === "video" || msg.media.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(msg.media);
                                                if (isVideo) {
                                                    return (
                                                        <div className={`relative w-72 max-w-full aspect-3/2 rounded-xl overflow-hidden cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800 bg-slate-900 ${msg.text ? "mb-2" : "mb-0"}`} onClick={() => onViewAvatar(msg.media)}>
                                                            <video src={msg.media} className="w-full h-full object-cover" preload="metadata" muted />
                                                            <div className="absolute inset-0 bg-black/35 flex items-center justify-center hover:bg-black/45 transition-colors">
                                                                <div className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-md">
                                                                    <Play className="w-6 h-6 fill-current ml-0.5" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className={`w-72 max-w-full aspect-3/2 rounded-xl overflow-hidden cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800 bg-slate-100 ${msg.text ? "mb-2" : "mb-0"}`} onClick={() => onViewAvatar(msg.media)}>
                                                            <img src={msg.media} alt="Attached" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                        </div>
                                                    );
                                                }
                                            })()
                                        )}
                                        {msg.text && <p className="text-[15px] leading-relaxed">{msg.text}</p>}
                                    </div>
                                    <div className="flex items-center mt-1 space-x-1">
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{msg.time}</span>
                                        {isMe && (
                                            msg.status === "sending" ? (
                                                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 animate-pulse" title="Sending..." />
                                            ) : msg.status === "error" ? (
                                                <AlertCircle className="w-3.5 h-3.5 text-red-500" title="Failed to send" />
                                            ) : appSettings.readReceipts ? (
                                                <CheckCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                            ) : (
                                                <Check className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                                            )
                                        )}
                                    </div>
                                    {msg.reactions && msg.reactions.length > 0 && (
                                        <div
                                            className={`absolute -bottom-4 ${isMe ? "right-2" : "left-2"} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-0.5 shadow-sm text-xs flex gap-0.5 z-10`}>
                                            {msg.reactions.map((emoji, i) => (
                                                <span
                                                    key={i}
                                                    onClick={() => onToggleReaction(msg.id, emoji)}
                                                    className="cursor-pointer hover:scale-125 transition-transform inline-block">
                                                    {emoji}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Standard Message Hover Actions */}
                                {!isSelectMode && (
                                    <div
                                        className={`opacity-0 group-hover:opacity-100 transition-opacity relative self-center flex gap-1 ${isMe ? "mr-1" : "ml-1"}`}>
                                        <button
                                            onClick={() => setReplyingTo(msg)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                                            title="Reply">
                                            <Reply className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setReactionMsgId(reactionMsgId === msg.id ? null : msg.id)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                                            title="React">
                                            <Smile className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmData({ id: msg.id, isMultiple: false })}
                                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                                            title="Delete Message">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {reactionMsgId === msg.id && (
                                            <div
                                                className={`absolute top-1/2 -translate-y-1/2 ${isMe ? "right-full mr-2" : "left-full ml-2"} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-xl p-1 flex gap-1 z-50 animate-in zoom-in duration-150`}>
                                                {["❤️", "😂", "😮", "😢", "😡", "👍"].map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => onToggleReaction(msg.id, emoji)}
                                                        className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-lg w-8 h-8 flex items-center justify-center transition-transform hover:scale-125 focus:outline-none">
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col relative z-20 transition-colors duration-200">
                {isSelectMode ? (
                    <div className="max-w-5xl mx-auto w-full flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner animate-in slide-in-from-bottom-2 duration-200">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 pl-4">
                            Selected: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedMsgIds.length}</span> message(s)
                        </div>
                        <div className="flex gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSelectMode(false);
                                    setSelectedMsgIds([]);
                                }}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-700">
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={selectedMsgIds.length === 0}
                                onClick={() => {
                                    setDeleteConfirmData({ ids: selectedMsgIds, isMultiple: true });
                                }}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-red-500/10 active:scale-95">
                                Delete Selected
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {replyingTo && (
                            <div className="max-w-5xl mx-auto w-full mb-3 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                                <div className="flex-1 overflow-hidden border-l-4 border-indigo-500 pl-3">
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">
                                        Replying to {replyingTo.sender === "me" ? "yourself" : activeContact.name}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                        {replyingTo.media ? (replyingTo.mediaType === "video" ? "🎥 Video" : "📸 Photo") : replyingTo.text}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setReplyingTo(null)}
                                    className="ml-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {selectedFiles.length > 0 && (
                            <div className="max-w-5xl mx-auto w-full mb-3 pl-12 sm:pl-14 flex flex-wrap gap-3">
                                {selectedFiles.map((fileObj, i) => (
                                    <div key={i} className="relative inline-block">
                                        {fileObj.type === "video" ? (
                                            <video
                                                src={fileObj.url}
                                                className="h-20 w-20 object-cover rounded-xl border-2 border-indigo-100 dark:border-indigo-900 shadow-sm"
                                            />
                                        ) : (
                                            <img
                                                src={fileObj.url}
                                                alt="Preview"
                                                className="h-20 w-20 object-cover rounded-xl border-2 border-indigo-100 dark:border-indigo-900 shadow-sm"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
                                            }}
                                            className="absolute -top-2 -right-2 bg-slate-800 dark:bg-slate-700 text-white rounded-full p-1 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-sm">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={submitMessage} className="flex items-end gap-2 sm:gap-3 max-w-5xl mx-auto w-full">
                            <div className="flex items-center space-x-1 sm:space-x-2 text-slate-400 pb-2">
                                <button
                                    type="button"
                                    onClick={() => mediaInputRef.current?.click()}
                                    className="p-2 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input type="file" ref={mediaInputRef} onChange={handleMediaChange} accept="image/*,video/*" multiple className="hidden" />
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-transparent dark:border-slate-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full right-0 mb-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 w-72 z-50 animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Emojis</span>
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(false)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                                            {COMMON_EMOJIS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => setNewMessage((prev) => prev + emoji)}
                                                    className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1 text-xl transition-transform hover:scale-125 flex items-center justify-center">
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!newMessage.trim() && selectedFiles.length === 0}
                                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 shrink-0 border border-transparent dark:border-indigo-500">
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        </form>
                    </>
                )}
            </div>

            {deleteConfirmData && (
                <div className="fixed inset-0 bg-black/55 z-100 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {deleteConfirmData.isClear
                                ? "Clear Chat?"
                                : (deleteConfirmData.isMultiple ? "Delete Selected Messages?" : "Delete Message?")}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            {deleteConfirmData.isClear
                                ? "Are you sure you want to clear all messages in this chat? This action cannot be undone."
                                : (deleteConfirmData.isMultiple
                                    ? `Are you sure you want to delete the ${deleteConfirmData.ids.length} selected messages? This action cannot be undone.`
                                    : "Are you sure you want to delete this message? This action cannot be undone.")}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeleteConfirmData(null)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={async () => {
                                    setIsDeleting(true);
                                    try {
                                        if (deleteConfirmData.isClear) {
                                            await onClearChat();
                                        } else if (deleteConfirmData.isMultiple) {
                                            await onDeleteMultiple(deleteConfirmData.ids);
                                            setIsSelectMode(false);
                                            setSelectedMsgIds([]);
                                        } else {
                                            await onDeleteMessage(deleteConfirmData.id);
                                        }
                                    } catch (err) {
                                        console.error("Failed to delete/clear:", err);
                                    } finally {
                                        setIsDeleting(false);
                                        setDeleteConfirmData(null);
                                    }
                                }}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-500/10 active:scale-95 disabled:opacity-50 flex items-center gap-2">
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {deleteConfirmData.isClear ? "Clearing..." : "Deleting..."}
                                    </>
                                ) : (
                                    deleteConfirmData.isClear ? "Clear" : "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatArea;
