import { UserPlus, X } from "lucide-react";
import { useState } from "react";

const NewChat = ({ show, onClose, onCreate }) => {
    const [newContactName, setNewContactName] = useState("");
    const [newContactIdentifier, setNewContactIdentifier] = useState("");

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newContactName.trim()) {
            onCreate(newContactName, newContactIdentifier);
            setNewContactName("");
            setNewContactIdentifier("");
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Name</label>
                        <input
                            type="text"
                            required
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors outline-none text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="E.g. John Smith"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email or Phone Number (Optional)</label>
                        <input
                            type="text"
                            value={newContactIdentifier}
                            onChange={(e) => setNewContactIdentifier(e.target.value)}
                            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors outline-none text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="john@example.com or +1 234 567 8900"
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md active:scale-[0.98]">
                            Start Chat
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewChat;
