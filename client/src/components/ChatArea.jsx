import { ArrowLeft, Check, CheckCheck, MoreVertical, Paperclip, Phone, Reply, Send, Smile, Video, X } from "lucide-react";
import { COMMON_EMOJIS } from "../data/mock";
import { useEffect, useRef, useState } from "react";
import formatDuration from "../utils/formatDuration";

const ChatArea = ({
    activeContact,
    messages,
    appSettings,
    onSendMessage,
    onToggleReaction,
    onClearChat,
    onStartCall,
    onViewProfile,
    onViewAvatar,
    onCloseChat,
}) => {
    const [newMessage, setNewMessage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [reactionMsgId, setReactionMsgId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const mediaInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleMediaChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");
            if (isImage || isVideo) {
                setSelectedMedia(URL.createObjectURL(file));
                setSelectedMediaType(isImage ? "image" : "video");
            }
        }
        if (e.target) e.target.value = null;
    };

    const submitMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedMedia) return;
        onSendMessage(newMessage, selectedMedia, selectedMediaType, replyingTo);
        setNewMessage("");
        setSelectedMedia(null);
        setSelectedMediaType(null);
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
                            <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" />
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
                    <button
                        onClick={() => onStartCall("audio")}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors hidden sm:block">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onStartCall("video")}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors">
                        <Video className="w-5 h-5" />
                    </button>
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
                                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                    <button
                                        onClick={() => {
                                            onClearChat();
                                            setShowChatMenu(false);
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

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
                {messages.map((msg, index) => {
                    const isMe = msg.sender === "me";
                    const showAvatar = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;

                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group mb-4`}>
                            <div className={`flex max-w-[85%] sm:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                                {!isMe && (
                                    <div className="w-8 h-8 shrink-0">
                                        {showAvatar && <img src={activeContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />}
                                    </div>
                                )}

                                {/* Check if standard message or call log */}
                                {msg.type === "call" ? (
                                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} relative`}>
                                        <div
                                            className={`flex items-center gap-3 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 w-52 sm:w-56 ${isMe ? "rounded-br-sm flex-row-reverse" : "rounded-bl-sm"}`}>
                                            <div
                                                className={`p-2.5 rounded-full shrink-0 ${isMe ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                                                {msg.callType === "video" ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                                            </div>
                                            <div
                                                className={`flex flex-col overflow-hidden ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
                                                    {msg.duration > 0
                                                        ? msg.callType === "video"
                                                            ? "Video Call"
                                                            : "Audio Call"
                                                        : isMe
                                                          ? "Canceled Call"
                                                          : "Missed Call"}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate w-full">
                                                    {msg.duration > 0 ? formatDuration(msg.duration) : "Missed"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-1 space-x-1">
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{msg.time}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} relative`}>
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl shadow-sm relative ${isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm"}`}>
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
                                            {msg.media && msg.mediaType === "video" ? (
                                                <video
                                                    src={msg.media}
                                                    controls
                                                    className={`max-w-full rounded-xl ${msg.text ? "mb-2" : ""}`}
                                                    style={{ maxHeight: "250px" }}
                                                />
                                            ) : (
                                                msg.media && (
                                                    <img
                                                        src={msg.media}
                                                        alt="Attached"
                                                        className={`max-w-full rounded-xl ${msg.text ? "mb-2" : ""} object-cover cursor-pointer hover:opacity-95 transition-opacity`}
                                                        style={{ maxHeight: "250px" }}
                                                        onClick={() => onViewAvatar(msg.media)}
                                                    />
                                                )
                                            )}
                                            {msg.text && <p className="text-[15px] leading-relaxed">{msg.text}</p>}
                                        </div>
                                        <div className="flex items-center mt-1 space-x-1">
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{msg.time}</span>
                                            {isMe && appSettings.readReceipts && (
                                                <CheckCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                            )}
                                            {isMe && !appSettings.readReceipts && (
                                                <Check className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
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
                                )}

                                {/* Standard Message Hover Actions */}
                                {msg.type !== "call" && (
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
                {selectedMedia && (
                    <div className="max-w-5xl mx-auto w-full mb-3 pl-12 sm:pl-14">
                        <div className="relative inline-block">
                            {selectedMediaType === "video" ? (
                                <video
                                    src={selectedMedia}
                                    className="h-20 w-20 object-cover rounded-xl border-2 border-indigo-100 dark:border-indigo-900 shadow-sm"
                                />
                            ) : (
                                <img
                                    src={selectedMedia}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded-xl border-2 border-indigo-100 dark:border-indigo-900 shadow-sm"
                                />
                            )}
                            <button
                                onClick={() => {
                                    setSelectedMedia(null);
                                    setSelectedMediaType(null);
                                }}
                                className="absolute -top-2 -right-2 bg-slate-800 dark:bg-slate-700 text-white rounded-full p-1 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-sm">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
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
                        <input type="file" ref={mediaInputRef} onChange={handleMediaChange} accept="image/*,video/*" className="hidden" />
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
                        disabled={!newMessage.trim() && !selectedMedia}
                        className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 shrink-0 border border-transparent dark:border-indigo-500">
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;
