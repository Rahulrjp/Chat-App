import { Search, Settings, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = ({
    currentUser,
    contacts,
    activeContactId,
    appSettings,
    onSelectContact,
    onShowProfile,
    onNewChat,
    onShowSettings,
    onAvatarClick,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const filteredContacts = contacts.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div
            className={`${activeContactId ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 transition-colors duration-200`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors duration-200">
                <div
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onShowProfile}
                    title="View Profile">
                    <div className="relative">
                        <img src={currentUser?.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        <div
                            className={`absolute bottom-0 right-0 w-3 h-3 ${appSettings.onlineStatus ? "bg-green-500" : "bg-slate-400 dark:bg-slate-500"} rounded-full border-2 border-white dark:border-slate-900 transition-colors duration-200`}></div>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold">{currentUser?.name}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{appSettings.onlineStatus ? "Online" : "Invisible"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onNewChat}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                        title="New Chat">
                        <UserPlus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onShowSettings}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                        title="Settings">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredContacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => onSelectContact(contact.id, contact.conversationId)}
                        className={`flex items-center p-4 cursor-pointer transition-colors border-b border-slate-200/40 dark:border-slate-800/50 last:border-none ${activeContactId === contact.id ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600" : "hover:bg-slate-200/40 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent"}`}>
                        <div
                            className="relative z-20 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => onAvatarClick(e, contact)}>
                            <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                            {contact.online && (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                            )}
                        </div>
                        <div className="ml-4 flex-1 overflow-hidden">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-sm font-semibold truncate pr-2">{contact.name}</h3>
                                <span
                                    className={`text-xs whitespace-nowrap ${contact.unread > 0 ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-400 dark:text-slate-500"}`}>
                                    {contact.time}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p
                                    className={`text-sm truncate pr-2 ${contact.unread > 0 ? "font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                                    {contact.lastMessage}
                                </p>
                                {contact.unread > 0 && (
                                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{contact.unread}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredContacts.length === 0 && (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No contacts found matching "{searchQuery}"</div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
