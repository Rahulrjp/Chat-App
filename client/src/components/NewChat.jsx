import { UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createConversation, searchUser } from "../services/user.services";

const NewChat = ({ show, onClose, onCreate }) => {
    const [userQuery, setUserQuery] = useState("");
    const [id, setId] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchError, setSearchError] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Reset state when modal visibility changes
    useEffect(() => {
        if (show) {
            setUserQuery("");
            setId("");
            setSearchResult(null);
            setSelectedUser(null);
            setSearchError("");
        }
    }, [show]);

    const performSearch = async () => {
        if (!userQuery) {
            setSearchError("Please enter a username or email to search");
            return;
        }
        setIsSearching(true);
        setSearchError("");
        setSearchResult(null);
        setId("");
        setSelectedUser(null);
        try {
            const data = await searchUser(userQuery);
            if (data && data.user) {
                const users = Array.isArray(data.user)
                    ? data.user.filter((u) => u !== null && u !== undefined)
                    : data.user
                        ? [data.user]
                        : [];

                if (users.length > 0) {
                    setSearchResult(users);
                    // If only one user is found, auto-select them
                    if (users.length === 1) {
                        setId(users[0]._id);
                        setSelectedUser(users[0]);
                    }
                } else {
                    setSearchError("No user found");
                }
            } else {
                setSearchError("No user found");
            }
        } catch (error) {
            setSearchError("No user found with this query");
            console.log(error);
        } finally {
            setIsSearching(false);
        }
    };

    // Search user debounced when userQuery changes
    useEffect(() => {
        if (!userQuery) {
            setSearchResult(null);
            setSearchError("");
            setId("");
            setSelectedUser(null);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            performSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [userQuery]);

    if (!show) return null;

    const handleStartChat = async (userObj) => {
        try {
            const data = await createConversation({ id: userObj._id });
            onCreate(userObj.name, userObj.email, userObj._id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedUser);
        if (id && selectedUser) {
            await handleStartChat(selectedUser);
        } else {
            // Search first
            await performSearch();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm z-80 flex items-center justify-center p-4 transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                        <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Start New Chat
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username or Email</label>
                        <input
                            type="text"
                            required
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors outline-none text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder=""
                            autoFocus
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSearching}
                            className={`w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white transition-colors shadow-md active:scale-[0.98] ${isSearching
                                ? "bg-indigo-400 cursor-not-allowed"
                                : id
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-slate-600 hover:bg-slate-700"
                                }`}>
                            {isSearching ? "Searching..." : id ? "Start Chat" : "Search User"}
                        </button>
                    </div>

                    {/* Search Result Section */}
                    {(isSearching || searchResult || searchError) && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                Search Result
                            </h3>

                            {isSearching && (
                                <div className="flex items-center justify-center py-4 space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Searching for user...</span>
                                </div>
                            )}

                            {!isSearching && searchError && (
                                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center justify-center font-medium border border-red-100/50 dark:border-red-900/30">
                                    {searchError}
                                </div>
                            )}

                            {!isSearching && searchResult && searchResult.length > 0 && (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {searchResult.map((u) => {
                                        const isSelected = id === u._id;
                                        return (
                                            <div
                                                key={u._id}
                                                onClick={() => {
                                                    setId(u._id);
                                                    setSelectedUser(u);
                                                }}
                                                onDoubleClick={() => handleStartChat(u)}
                                                className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isSelected
                                                    ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-500 shadow-sm"
                                                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    }`}
                                                title="Double-click to start chat immediately">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={u.avatar?.url || `https://i.pravatar.cc/150?u=${u._id}`}
                                                        alt={u.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {u.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    {isSelected ? (
                                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-2xs font-bold shadow-sm">
                                                            ✓
                                                        </span>
                                                    ) : (
                                                        <span className="text-2xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                                                            Select
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NewChat;
